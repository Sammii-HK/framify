import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import { provisionDomain } from '@/lib/domain-automation'
import { flipAutoRenew } from '@/lib/domain-renewal'

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

        // ── Subscription checkout ──
        if (session.mode === 'subscription' && metadata.type === 'subscription') {
          const { tier, subdomain, siteId } = metadata
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : (session.subscription as Stripe.Subscription)?.id ?? null
          const customerId = typeof session.customer === 'string'
            ? session.customer
            : (session.customer as Stripe.Customer)?.id ?? null

          console.log(
            `[Subscription] Checkout completed: tier=${tier}, subdomain=${subdomain}, ` +
            `subscription=${subscriptionId}, customer=${customerId}`
          )

          if (!customerId || !subscriptionId) {
            console.error('[Subscription] Missing customer or subscription ID')
            break
          }

          // Find user by email from checkout session
          const customerEmail = session.customer_email || session.customer_details?.email
          if (!customerEmail) {
            console.error('[Subscription] No customer email in session')
            break
          }

          const user = await prisma.user.findFirst({
            where: { email: customerEmail },
          })

          if (!user) {
            console.error(`[Subscription] No user found for email ${customerEmail}`)
            break
          }

          // Update user with subscription info
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: tier || 'starter',
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'active',
            },
          })

          // Update site tier and publish
          if (siteId) {
            await prisma.site.update({
              where: { id: siteId },
              data: {
                tier: tier || 'starter',
                status: 'PUBLISHED',
              },
            })
          } else if (subdomain) {
            // Update by subdomain if no siteId
            const site = await prisma.site.findUnique({ where: { subdomain } })
            if (site && site.userId === user.id) {
              await prisma.site.update({
                where: { id: site.id },
                data: {
                  tier: tier || 'starter',
                  status: 'PUBLISHED',
                },
              })
            }
          }

          console.log(`[Subscription] Activated ${tier} for user ${user.id}`)
          break
        }

        // ── Domain purchase ──
        if (metadata.tier === 'domain' && metadata.customDomain && metadata.subdomain && metadata.siteId) {
          const result = await provisionDomain(metadata.subdomain, metadata.customDomain, metadata.siteId)
          console.log(
            `[Hosting] Domain provisioning ${result.success ? 'succeeded' : 'failed'}: ${result.domain}`,
            JSON.stringify(result.steps)
          )
          break
        }

        // ── Branding removal add-on ──
        if (session.mode === 'subscription' && metadata.type === 'branding_removal') {
          const { siteId, subdomain } = metadata

          console.log(`[Branding] Checkout completed: siteId=${siteId}, subdomain=${subdomain}`)

          // Find the site and enable hideBranding
          if (siteId) {
            await prisma.site.update({
              where: { id: siteId },
              data: { hideBranding: true },
            })
          } else if (subdomain) {
            const site = await prisma.site.findUnique({ where: { subdomain } })
            if (site) {
              await prisma.site.update({
                where: { id: site.id },
                data: { hideBranding: true },
              })
            }
          }

          console.log(`[Branding] Branding removal activated for site ${siteId || subdomain}`)
          break
        }

        // ── Legacy: one-time launch payment (grandfathered) ──
        if (metadata.tier === 'launch' && metadata.siteId) {
          const site = await prisma.site.update({
            where: { id: metadata.siteId },
            data: { status: 'PUBLISHED', tier: 'starter' }, // Map launch → starter
          })
          const currentUser = await prisma.user.findUnique({
            where: { id: site.userId },
            select: { plan: true },
          })
          if (currentUser?.plan === 'free') {
            await prisma.user.update({
              where: { id: site.userId },
              data: { plan: 'starter' },
            })
          }
          console.log(`[Hosting] Legacy launch tier activated (as starter) for site ${metadata.siteId}`)
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

      // ── Invoice payment succeeded ──
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] invoice.payment_succeeded: no customer ID')
          break
        }

        // ── Domain renewal invoice ──
        if (invoice.metadata?.type === 'domain_renewal') {
          const siteId = invoice.metadata.siteId
          if (siteId) {
            const site = await prisma.site.findUnique({
              where: { id: siteId },
              select: { id: true, customDomain: true, domainAutoRenew: true },
            })

            if (site) {
              // Reset renewal status for next year
              await prisma.site.update({
                where: { id: siteId },
                data: {
                  domainRenewalStatus: null,
                  domainRenewalInvoiceId: null,
                },
              })

              // Ensure auto_renew is on
              if (!site.domainAutoRenew && site.customDomain) {
                await flipAutoRenew(site.customDomain, true, siteId)
              }

              await prisma.domainRenewalLog.create({
                data: {
                  siteId,
                  action: 'payment_succeeded',
                  details: `Invoice ${invoice.id} paid — renewal status reset`,
                },
              })

              console.log(`[Webhook] Domain renewal paid for site ${siteId}`)
            }
          }
          break
        }

        // ── Subscription invoice ──
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

        // Unsuspend any suspended sites
        await prisma.site.updateMany({
          where: { userId: user.id, status: 'SUSPENDED' },
          data: { status: 'PUBLISHED' },
        })

        // Create an Order record for the renewal
        const subscriptionSite = await prisma.site.findFirst({
          where: { userId: user.id, tier: { in: ['starter', 'pro'] } },
        })

        if (subscriptionSite) {
          const defaultPayment = invoice.payments?.data?.find(p => p.is_default)
          const piRef = defaultPayment?.payment?.payment_intent
          const paymentIntentId = typeof piRef === 'string'
            ? piRef
            : piRef?.id ?? null

          await prisma.order.create({
            data: {
              userId: user.id,
              siteId: subscriptionSite.id,
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

      // ── Invoice payment failed ──
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id ?? null

        if (!customerId) {
          console.warn('[Webhook] invoice.payment_failed: no customer ID')
          break
        }

        // ── Domain renewal invoice failed ──
        if (invoice.metadata?.type === 'domain_renewal') {
          const siteId = invoice.metadata.siteId
          if (siteId) {
            await prisma.site.update({
              where: { id: siteId },
              data: { domainRenewalStatus: 'retry_pending' },
            })

            await prisma.domainRenewalLog.create({
              data: {
                siteId,
                action: 'payment_failed',
                details: `Invoice ${invoice.id} payment failed — retry pending`,
              },
            })

            console.error(`[Webhook] Domain renewal payment failed for site ${siteId}`)
          }
          break
        }

        // ── Subscription invoice failed ──
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.warn(`[Webhook] invoice.payment_failed: no user for customer ${customerId}`)
          break
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'past_due' },
        })

        // Suspend subscription-based sites
        await prisma.site.updateMany({
          where: { userId: user.id, tier: { in: ['starter', 'pro'] } },
          data: { status: 'SUSPENDED' },
        })

        console.error(
          `[Webhook] invoice.payment_failed: user ${user.id}, customer ${customerId}, ` +
          `invoice ${invoice.id} — subscription sites suspended`
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

        // Check if this is a branding removal subscription
        const brandingPriceId = process.env.STRIPE_PRICE_BRANDING_REMOVAL
        const isBrandingRemoval = brandingPriceId && subscription.items?.data?.some(
          item => item.price?.id === brandingPriceId
        )

        if (isBrandingRemoval) {
          // Re-enable branding on all sites owned by this customer
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          })
          if (user) {
            await prisma.site.updateMany({
              where: { userId: user.id, hideBranding: true },
              data: { hideBranding: false },
            })
            console.log(`[Webhook] Branding removal cancelled for user ${user.id} — branding restored`)
          }
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

        // Suspend all subscription sites
        await prisma.site.updateMany({
          where: { userId: user.id, tier: { in: ['starter', 'pro'] } },
          data: { status: 'SUSPENDED', tier: 'free' },
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
        const latestInvoice = subscription.latest_invoice
        const periodEndTs = typeof latestInvoice === 'object' && latestInvoice
          ? (latestInvoice as Stripe.Invoice).period_end
          : null

        // Detect tier changes from the subscription items
        const subItems = subscription.items?.data
        let newTier: string | null = null
        if (subItems?.length) {
          const priceId = subItems[0].price?.id
          if (priceId) {
            if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY || priceId === process.env.STRIPE_PRICE_PRO_YEARLY) {
              newTier = 'pro'
            } else if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY || priceId === process.env.STRIPE_PRICE_STARTER_YEARLY) {
              newTier = 'starter'
            }
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: subscription.status,
            ...(newTier ? { plan: newTier } : {}),
            ...(periodEndTs
              ? { subscriptionCurrentPeriodEnd: new Date(periodEndTs * 1000) }
              : {}),
          },
        })

        // If tier changed, update sites
        if (newTier) {
          await prisma.site.updateMany({
            where: { userId: user.id, tier: { in: ['starter', 'pro'] } },
            data: { tier: newTier },
          })
        }

        // If subscription is back to active, unsuspend suspended sites
        if (subscription.status === 'active') {
          await prisma.site.updateMany({
            where: { userId: user.id, status: 'SUSPENDED' },
            data: { status: 'PUBLISHED' },
          })
        }

        console.log(
          `[Webhook] customer.subscription.updated: user ${user.id}, status=${subscription.status}` +
          (newTier ? `, tier=${newTier}` : '')
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
