import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * GET /api/admin/verify-stripe
 * Verifies all required Stripe products and prices exist.
 * Creates them if missing. Returns a summary of what was found/created.
 *
 * Protected by ADMIN_SECRET header check.
 */

const EXPECTED_PRODUCTS = [
  {
    envKey: 'STRIPE_PRICE_STARTER_MONTHLY',
    name: 'CraftMyPage Starter',
    description: 'Single-page website builder with hosting',
    amount: 900, // £9/mo
    interval: 'month' as const,
  },
  {
    envKey: 'STRIPE_PRICE_STARTER_YEARLY',
    name: 'CraftMyPage Starter',
    description: 'Single-page website builder with hosting (annual)',
    amount: 8900, // £89/yr
    interval: 'year' as const,
  },
  {
    envKey: 'STRIPE_PRICE_PRO_MONTHLY',
    name: 'CraftMyPage Pro',
    description: 'Multi-page website builder with hosting',
    amount: 1900, // £19/mo
    interval: 'month' as const,
  },
  {
    envKey: 'STRIPE_PRICE_PRO_YEARLY',
    name: 'CraftMyPage Pro',
    description: 'Multi-page website builder with hosting (annual)',
    amount: 17900, // £179/yr
    interval: 'year' as const,
  },
  {
    envKey: 'STRIPE_PRICE_BRANDING_REMOVAL',
    name: 'CraftMyPage Branding Removal',
    description: 'Remove "Created with CraftMyPage" footer branding',
    amount: 300, // £3/mo
    interval: 'month' as const,
  },
]

export async function GET(request: Request) {
  const adminSecret = request.headers.get('x-admin-secret')
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Array<{
    envKey: string
    name: string
    amount: number
    interval: string
    status: 'found' | 'created' | 'missing_env'
    priceId?: string
    productId?: string
  }> = []

  for (const expected of EXPECTED_PRODUCTS) {
    const envValue = process.env[expected.envKey]

    // If env var is set, verify the price exists in Stripe
    if (envValue) {
      try {
        const price = await stripe.prices.retrieve(envValue, { expand: ['product'] })
        const product = price.product as { id: string; name: string }
        results.push({
          envKey: expected.envKey,
          name: product.name,
          amount: price.unit_amount ?? 0,
          interval: price.recurring?.interval ?? 'none',
          status: 'found',
          priceId: price.id,
          productId: product.id,
        })
      } catch {
        // Price ID in env doesn't exist in Stripe — create it
        const { product, price } = await createProductAndPrice(expected)
        results.push({
          envKey: expected.envKey,
          name: expected.name,
          amount: expected.amount,
          interval: expected.interval,
          status: 'created',
          priceId: price.id,
          productId: product.id,
        })
      }
    } else {
      // No env var set — create product+price and report the ID to set
      const { product, price } = await createProductAndPrice(expected)
      results.push({
        envKey: expected.envKey,
        name: expected.name,
        amount: expected.amount,
        interval: expected.interval,
        status: 'created',
        priceId: price.id,
        productId: product.id,
      })
    }
  }

  // Build env var snippet for any created prices
  const envSnippet = results
    .filter(r => r.status === 'created')
    .map(r => `${r.envKey}=${r.priceId}`)
    .join('\n')

  return NextResponse.json({
    summary: results,
    envSnippet: envSnippet || null,
    message: envSnippet
      ? 'Some prices were created. Set these env vars in Vercel and redeploy.'
      : 'All prices verified and exist in Stripe.',
  })
}

async function createProductAndPrice(config: {
  name: string
  description: string
  amount: number
  interval: 'month' | 'year'
}) {
  // Check if a product with this name already exists
  const existingProducts = await stripe.products.search({
    query: `name:"${config.name}"`,
  })

  let product = existingProducts.data[0]

  if (!product) {
    product = await stripe.products.create({
      name: config.name,
      description: config.description,
    })
  }

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: config.amount,
    currency: 'gbp',
    recurring: { interval: config.interval },
  })

  return { product, price }
}
