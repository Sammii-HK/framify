import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import { provisionDomain } from '@/lib/domain-automation'

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for checkout, invoices, and subscription lifecycle
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const event = constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata || {}

        // ── Hosting tier payment ──
        if (metadata.tier) {
          const { tier, subdomain, siteId, customDomain } = metadata
          console.log(
            `[Hosting] Payment completed: tier=${tier}, subdomain=${subdomain}, siteId=${siteId || 'n/a'}, ` +
            `amount=${session.amount_total}, currency=${session.currency}, ` +
            `customer=${session.customer_email || session.customer}, ` +
            `session=${session.id}, mode=${session.mode}`
          )

          if (tier === 'domain' && customDomain && subdomain && siteId) {
            // Domain purchase: register on Cloudflare, wire up DNS, update DB
            const result = await provisionDomain(subdomain, customDomain, siteId)
            console.log(
              `[Hosting] Domain provisioning ${result.success ? 'succeeded' : 'failed'}: ${result.domain}`,
              JSON.stringify(result.steps)
            )
          } else if (tier === 'launch' && siteId) {
            // One-time launch payment: mark site as published, upgrade site tier
            const site = await prisma.site.update({
              where: { id: siteId },
              data: { status: 'PUBLISHED', tier: 'launch' },
            })
            // Only upgrade user plan if currently free (don't downgrade from pro)
            const currentUser = await prisma.user.findUnique({
              where: { id: site.userId },
              select: { plan: true },
            })
            if (currentUser?.plan === 'free') {
              await prisma.user.update({
                where: { id: site.userId },
                data: { plan: 'launch' },
              })
            }
            console.log(`[Hosting] Launch tier activated for site ${siteId}`)
          } else if (tier === 'pro' && siteId) {
            // Pro subscription: mark site as published, store subscription, upgrade user
            const subscriptionId = typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription?.id ?? null

            const site = await prisma.site.update({
              where: { id: siteId },
              data: { status: 'PUBLISHED', tier: 'pro' },
            })
            await prisma.user.update({
              where: { id: site.userId },
              data: {
                plan: 'pro',
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: 'active',
              },
            })
            console.log(`[Hosting] Pro tier activated for site ${siteId}, subscription=${subscriptionId}`)
          }

          break
        }

        // ── Marketplace product payment (existing flow) ──
        const { productId, productType } = metadata

        if (!productId || !productType) {
          console.warn('Webhook missing product metadata:', session.id)
          break
        }

        if (productType === 'template') {
          await prisma.template.update({
            where: { id: productId },
            data: {
              salesCount: { increment: 1 },
              downloadCount: { increment: 1 },
            },
          })
        } else if (productType === 'component') {
          await prisma.component.update({
            where: { id: productId },
            data: {
              salesCount: { increment: 1 },
              downloadCount: { increment: 1 },
            },
          })
        }

        console.log(
          `[Marketplace] Payment completed: ${productType} ${productId}, session ${session.id}`
        )
        break
      }

      // ── Subscription renewal payment succeeded ──
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] invoice.payment_succeeded: no customer ID')
          break
        }

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.warn(`[Webhook] invoice.payment_succeeded: no user for customer ${customerId}`)
          break
        }

        // Update subscription status and period end
        const periodEnd = invoice.lines.data[0]?.period?.end
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'active',
            ...(periodEnd
              ? { subscriptionCurrentPeriodEnd: new Date(periodEnd * 1000) }
              : {}),
          },
        })

        // Create an Order record for the renewal if user has a pro site
        const proSite = await prisma.site.findFirst({
          where: { userId: user.id, tier: 'pro' },
        })

        if (proSite) {
          // In Stripe v20, payment_intent lives on the payments sub-resource
          const defaultPayment = invoice.payments?.data?.find(p => p.is_default)
          const piRef = defaultPayment?.payment?.payment_intent
          const paymentIntentId = typeof piRef === 'string'
            ? piRef
            : piRef?.id ?? null

          await prisma.order.create({
            data: {
              userId: user.id,
              siteId: proSite.id,
              type: 'subscription',
              amount: invoice.amount_paid ?? 0,
              currency: invoice.currency ?? 'gbp',
              stripePaymentId: paymentIntentId,
              stripeInvoiceId: invoice.id,
              status: 'PAID',
            },
          })
        }

        console.log(`[Webhook] invoice.payment_succeeded: user ${user.id}, customer ${customerId}`)
        break
      }

      // ── Subscription payment failed ──
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] invoice.payment_failed: no customer ID')
          break
        }

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.warn(`[Webhook] invoice.payment_failed: no user for customer ${customerId}`)
          break
        }

        // Mark user as past_due
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'past_due' },
        })

        // Suspend all pro sites
        await prisma.site.updateMany({
          where: { userId: user.id, tier: 'pro' },
          data: { status: 'SUSPENDED' },
        })

        console.error(
          `[Webhook] invoice.payment_failed: user ${user.id}, customer ${customerId}, ` +
          `invoice ${invoice.id} — pro sites suspended`
        )
        break
      }

      // ── Subscription cancelled ──
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] customer.subscription.deleted: no customer ID')
          break
        }

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.warn(`[Webhook] customer.subscription.deleted: no user for customer ${customerId}`)
          break
        }

        // Downgrade user to free, clear subscription
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'free',
            stripeSubscriptionId: null,
            subscriptionStatus: 'canceled',
          },
        })

        // Downgrade all pro sites to free (keep them published)
        await prisma.site.updateMany({
          where: { userId: user.id, tier: 'pro' },
          data: { tier: 'free' },
        })

        console.log(`[Webhook] customer.subscription.deleted: user ${user.id} downgraded to free`)
        break
      }

      // ── Subscription status changed ──
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] customer.subscription.updated: no customer ID')
          break
        }

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.warn(`[Webhook] customer.subscription.updated: no user for customer ${customerId}`)
          break
        }

        // Sync subscription status and period end
        // In Stripe v20, current_period_end is no longer on the Subscription object.
        // Extract it from the latest invoice's period_end if expanded, otherwise skip.
        const latestInvoice = subscription.latest_invoice
        const periodEndTs = typeof latestInvoice === 'object' && latestInvoice
          ? (latestInvoice as Stripe.Invoice).period_end
          : null

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: subscription.status,
            ...(periodEndTs
              ? { subscriptionCurrentPeriodEnd: new Date(periodEndTs * 1000) }
              : {}),
          },
        })

        // If subscription is back to active, unsuspend any suspended pro sites
        if (subscription.status === 'active') {
          await prisma.site.updateMany({
            where: { userId: user.id, tier: 'pro', status: 'SUSPENDED' },
            data: { status: 'PUBLISHED' },
          })
        }

        console.log(
          `[Webhook] customer.subscription.updated: user ${user.id}, status=${subscription.status}`
        )
        break
      }

      default:
        // Ignore other event types
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
