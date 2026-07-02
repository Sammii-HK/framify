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
// Supported currencies — GBP is the base. Others are presented at Stripe's
// live exchange rate via Adaptive Pricing (enable in Stripe Dashboard).
const SUPPORTED_CURRENCIES = ['gbp', 'usd', 'eur', 'cad', 'aud', 'nzd'] as const
type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number]

export function detectCurrency(acceptLanguage?: string, cfCountry?: string): SupportedCurrency {
  const countryToCurrency: Record<string, SupportedCurrency> = {
    US: 'usd', CA: 'cad', AU: 'aud', NZ: 'nzd',
    DE: 'eur', FR: 'eur', ES: 'eur', IT: 'eur', NL: 'eur', BE: 'eur',
    AT: 'eur', PT: 'eur', IE: 'eur', FI: 'eur', GR: 'eur', LU: 'eur',
  }
  if (cfCountry && countryToCurrency[cfCountry]) return countryToCurrency[cfCountry]
  return 'gbp'
}

export async function createCheckoutSession({
  productName,
  productId,
  productType,
  priceInCents,
  customerEmail,
  successUrl,
  cancelUrl,
  currency = 'gbp',
  extraMetadata,
}: {
  productName: string
  productId: string
  productType: 'template' | 'component'
  priceInCents: number
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  currency?: SupportedCurrency
  extraMetadata?: Record<string, string>
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: productName,
            metadata: { productId, productType },
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: { productId, productType, ...extraMetadata },
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

/**
 * Subscription tier definitions
 */
export type SubscriptionTier = 'starter' | 'pro'
export type SubscriptionInterval = 'monthly' | 'yearly'

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, {
  name: string
  prices: Record<SubscriptionInterval, string | undefined>
}> = {
  starter: {
    name: 'CraftMyPage Starter',
    prices: {
      monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
      yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
    },
  },
  pro: {
    name: 'CraftMyPage Pro',
    prices: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
  },
}

/**
 * Create a Stripe Checkout session for a subscription (Starter or Pro)
 */
export async function createSubscriptionCheckoutSession({
  tier,
  interval,
  siteId,
  subdomain,
  customerEmail,
  customerId,
}: {
  tier: SubscriptionTier
  interval: SubscriptionInterval
  siteId?: string
  subdomain: string
  customerEmail?: string
  customerId?: string
}): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const tierConfig = SUBSCRIPTION_TIERS[tier]
  const priceId = tierConfig.prices[interval]

  if (!priceId) {
    throw new Error(`No Stripe price configured for ${tier} ${interval}. Set STRIPE_PRICE_${tier.toUpperCase()}_${interval.toUpperCase()} env var.`)
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      type: 'subscription',
      tier,
      interval,
      subdomain,
      ...(siteId ? { siteId } : {}),
    },
    success_url: `${appUrl}/generate?subscribed=true`,
    cancel_url: `${appUrl}/generate`,
  }

  // Attach to existing customer if we have one, otherwise pass email for new customer creation
  if (customerId) {
    sessionParams.customer = customerId
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}

/**
 * Create a Stripe Checkout session for a domain-only purchase (one-off payment)
 */
export async function createDomainCheckoutSession({
  subdomain,
  siteId,
  domainPrice,
  customDomain,
  customerEmail,
  customerId,
}: {
  subdomain: string
  siteId: string
  domainPrice: number
  customDomain: string
  customerEmail?: string
  customerId?: string
}): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!domainPrice || domainPrice <= 0) {
    throw new Error('domainPrice is required for domain purchase')
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: ['card'],
    // Collected as the registrant contact on the domain — see /api/webhooks/stripe
    // and lib/domain-automation.ts. Without this, Cloudflare falls back to the
    // account's own default registrant, making Sammii the legal WHOIS owner of
    // every customer domain instead of the customer.
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Custom domain registration',
            metadata: { subdomain, siteId },
          },
          unit_amount: domainPrice,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'domain',
      tier: 'domain',
      subdomain,
      siteId,
      customDomain,
    },
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/dashboard?payment=cancelled`,
  }

  if (customerId) {
    sessionParams.customer = customerId
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}

/**
 * Create and finalise a one-off invoice for domain renewal
 */
export async function createDomainRenewalInvoice({
  customerId,
  siteId,
  domain,
  amountInPence,
}: {
  customerId: string
  siteId: string
  domain: string
  amountInPence: number
}): Promise<Stripe.Invoice> {
  // Create an invoice item
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: amountInPence,
    currency: 'gbp',
    description: `Domain renewal: ${domain}`,
    metadata: {
      type: 'domain_renewal',
      siteId,
      domain,
    },
  })

  // Create and finalise the invoice
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'charge_automatically',
    auto_advance: true,
    metadata: {
      type: 'domain_renewal',
      siteId,
      domain,
    },
  })

  // Finalise it so Stripe attempts payment
  const finalised = await stripe.invoices.finalizeInvoice(invoice.id)
  return finalised
}

/**
 * Retry payment on an existing invoice
 */
export async function retryInvoicePayment(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.pay(invoiceId)
}

/**
 * Create a Stripe Checkout session for branding removal add-on (£3/mo)
 */
export async function createBrandingRemovalCheckoutSession({
  siteId,
  subdomain,
  customerEmail,
  customerId,
}: {
  siteId: string
  subdomain: string
  customerEmail?: string
  customerId?: string
}): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const priceId = process.env.STRIPE_PRICE_BRANDING_REMOVAL

  if (!priceId) {
    throw new Error('STRIPE_PRICE_BRANDING_REMOVAL env var is not set. Run /api/admin/verify-stripe to create it.')
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      type: 'branding_removal',
      siteId,
      subdomain,
    },
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/dashboard?payment=cancelled`,
  }

  if (customerId) {
    sessionParams.customer = customerId
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}

/**
 * Create a Stripe Billing Portal session for subscription management
 */
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    configuration: 'bpc_1TEDf1DKfOPoJ4ilQetvdYOD',
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
