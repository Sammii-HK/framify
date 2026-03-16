import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

/**
 * Create a Stripe Checkout session for a template or component purchase
 */
export async function createCheckoutSession({
  productName,
  productId,
  productType,
  priceInCents,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  productName: string
  productId: string
  productType: 'template' | 'component'
  priceInCents: number
  customerEmail?: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: productName,
            metadata: {
              productId,
              productType,
            },
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId,
      productType,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

/**
 * Hosting tier definitions
 */
export type HostingTier = 'launch' | 'pro' | 'domain'

export const HOSTING_TIERS: Record<'launch' | 'pro', {
  name: string
  unitAmount: number
  mode: 'payment' | 'subscription'
  recurring?: { interval: 'year' }
}> = {
  launch: {
    name: 'CraftMyPage Launch - Website hosting',
    unitAmount: 14900,
    mode: 'payment',
  },
  pro: {
    name: 'CraftMyPage Pro - Custom domain + unlimited edits',
    unitAmount: 2900,
    mode: 'subscription',
    recurring: { interval: 'year' },
  },
}

/**
 * Create a Stripe Checkout session for a hosting tier or domain purchase
 */
export async function createHostingCheckoutSession({
  tier,
  subdomain,
  siteId,
  domainPrice,
  customDomain,
  customerEmail,
}: {
  tier: HostingTier
  subdomain: string
  siteId?: string
  domainPrice?: number
  customDomain?: string
  customerEmail?: string
}): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let mode: 'payment' | 'subscription'
  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]

  if (tier === 'domain') {
    if (!domainPrice || domainPrice <= 0) {
      throw new Error('domainPrice is required for domain tier')
    }
    mode = 'payment'
    lineItems = [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Custom domain registration',
            metadata: { tier, subdomain },
          },
          unit_amount: domainPrice,
        },
        quantity: 1,
      },
    ]
  } else {
    const tierConfig = HOSTING_TIERS[tier]
    mode = tierConfig.mode
    lineItems = [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: tierConfig.name,
            metadata: { tier, subdomain },
          },
          unit_amount: tierConfig.unitAmount,
          ...(tierConfig.recurring ? { recurring: tierConfig.recurring } : {}),
        },
        quantity: 1,
      },
    ]
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: lineItems,
    metadata: {
      tier,
      subdomain,
      ...(siteId ? { siteId } : {}),
      ...(customDomain ? { customDomain } : {}),
    },
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/dashboard?payment=cancelled`,
  })

  return session
}

/**
 * Create a Stripe Billing Portal session for subscription management
 */
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session
}

/**
 * Verify a Stripe webhook signature
 */
export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )
}
