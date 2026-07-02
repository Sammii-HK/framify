import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'
import {
  createCheckoutSession,
  createSubscriptionCheckoutSession,
  createDomainCheckoutSession,
  createBrandingRemovalCheckoutSession,
  detectCurrency,
} from '@/lib/stripe'
import type { SubscriptionTier, SubscriptionInterval } from '@/lib/stripe'

const VALID_SUBSCRIPTION_TIERS: SubscriptionTier[] = ['starter', 'pro']
const VALID_INTERVALS: SubscriptionInterval[] = ['monthly', 'yearly']

/**
 * POST /api/checkout
 * Create a Stripe Checkout session for:
 * - Subscriptions (starter, pro) — pass { tier, interval, subdomain, siteId? }
 * - Domain purchase — pass { tier: 'domain', subdomain, siteId, domainPrice, customDomain }
 * - Marketplace products (template, component) — pass { productId, productType }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    const body = await req.json()

    // Gallery template downloads don't require login
    if (body.productType !== 'gallery_template' && !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = session?.user ? await findOrCreateUser(session.user) : null

    // ── Subscription checkout ──
    if (body.tier && VALID_SUBSCRIPTION_TIERS.includes(body.tier)) {
      const { tier, interval, subdomain, siteId } = body as {
        tier: SubscriptionTier
        interval: SubscriptionInterval
        subdomain: string
        siteId?: string
      }

      if (!subdomain) {
        return NextResponse.json(
          { error: 'subdomain is required' },
          { status: 400 }
        )
      }

      if (!interval || !VALID_INTERVALS.includes(interval)) {
        return NextResponse.json(
          { error: 'interval must be "monthly" or "yearly"' },
          { status: 400 }
        )
      }

      const checkoutSession = await createSubscriptionCheckoutSession({
        tier,
        interval,
        siteId,
        subdomain,
        customerEmail: session?.user?.email || undefined,
        customerId: user?.stripeCustomerId || undefined,
      })

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
      })
    }

    // ── Domain purchase checkout (one-off) ──
    if (body.tier === 'domain') {
      const { subdomain, siteId, domainPrice, customDomain } = body as {
        subdomain: string
        siteId: string
        domainPrice: number
        customDomain: string
      }

      if (!subdomain || !siteId) {
        return NextResponse.json(
          { error: 'subdomain and siteId are required' },
          { status: 400 }
        )
      }

      if (!domainPrice || domainPrice <= 0) {
        return NextResponse.json(
          { error: 'domainPrice (in pence) is required for domain purchase' },
          { status: 400 }
        )
      }

      if (!customDomain) {
        return NextResponse.json(
          { error: 'customDomain is required' },
          { status: 400 }
        )
      }

      const checkoutSession = await createDomainCheckoutSession({
        subdomain,
        siteId,
        domainPrice,
        customDomain,
        customerEmail: session?.user?.email || undefined,
        customerId: user?.stripeCustomerId || undefined,
      })

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
      })
    }

    // ── Branding removal add-on checkout ──
    if (body.tier === 'branding_removal') {
      const { siteId, subdomain } = body as {
        siteId: string
        subdomain: string
      }

      if (!siteId || !subdomain) {
        return NextResponse.json(
          { error: 'siteId and subdomain are required for branding removal' },
          { status: 400 }
        )
      }

      const checkoutSession = await createBrandingRemovalCheckoutSession({
        siteId,
        subdomain,
        customerEmail: session?.user?.email || undefined,
        customerId: user?.stripeCustomerId || undefined,
      })

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
      })
    }

    // ── Gallery template download (no auth required, no DB lookup) ──
    if (body.productType === 'gallery_template') {
      const { templateType, templateName, priceGbp } = body as {
        templateType: string
        templateName: string
        priceGbp: number
      }

      if (!templateType || !priceGbp) {
        return NextResponse.json({ error: 'templateType and priceGbp required' }, { status: 400 })
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'
      const currency = detectCurrency(
        req.headers.get('accept-language') || undefined,
        req.headers.get('cf-ipcountry') || undefined,
      )
      const checkoutSession = await createCheckoutSession({
        productName: `${templateName} Template — CraftMyPage`,
        productId: templateType,
        productType: 'template',
        priceInCents: Math.round(priceGbp * 100),
        customerEmail: session?.user?.email || undefined,
        successUrl: `${appUrl}/download?template=${templateType}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${appUrl}/templates`,
        currency,
        // productType stays 'template' (shared with the generic marketplace webhook
        // path) — this source flag is what actually distinguishes a gallery purchase
        // so the webhook can capture the buyer's email, which is otherwise never
        // stored anywhere (gallery checkout has no auth, no User/Site record).
        extraMetadata: { source: 'gallery', templateName },
      })

      return NextResponse.json({ url: checkoutSession.url })
    }

    // ── Marketplace product checkout (existing flow) ──
    const { productId, productType } = body

    if (!productId || !productType) {
      return NextResponse.json(
        { error: 'productId and productType are required' },
        { status: 400 }
      )
    }

    if (productType !== 'template' && productType !== 'component') {
      return NextResponse.json(
        { error: 'productType must be "template" or "component"' },
        { status: 400 }
      )
    }

    // Look up the product
    let product: { id: string; title?: string; name?: string; price: number | null } | null = null

    if (productType === 'template') {
      product = await prisma.template.findUnique({
        where: { id: productId },
        select: { id: true, title: true, price: true },
      })
    } else {
      product = await prisma.component.findUnique({
        where: { id: productId },
        select: { id: true, name: true, price: true },
      })
    }

    if (!product) {
      return NextResponse.json(
        { error: `${productType} not found` },
        { status: 404 }
      )
    }

    if (!product.price || product.price === 0) {
      return NextResponse.json(
        { error: 'This product is free — no checkout needed' },
        { status: 400 }
      )
    }

    const productName =
      productType === 'template'
        ? (product as { title?: string }).title || 'CraftMyPage Template'
        : (product as { name?: string }).name || 'CraftMyPage Component'

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      productName,
      productId: product.id,
      productType,
      priceInCents: Math.round(product.price * 100),
      customerEmail: session?.user?.email || undefined,
      successUrl: `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/marketplace`,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
