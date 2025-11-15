/**
 * Pricing Tiers and Logic
 * Based on marketplace insights: Free, Standard ($49), Premium ($99+)
 */

export type PricingTier = 'free' | 'standard' | 'premium'

export interface PricingInfo {
  tier: PricingTier
  price: number
  label: string
  description: string
}

export const PRICING_TIERS: Record<PricingTier, PricingInfo> = {
  free: {
    tier: 'free',
    price: 0,
    label: 'Free',
    description: 'Perfect for getting started',
  },
  standard: {
    tier: 'standard',
    price: 49,
    label: '$49',
    description: 'Professional templates',
  },
  premium: {
    tier: 'premium',
    price: 99,
    label: '$99+',
    description: 'Premium, feature-rich templates',
  },
}

/**
 * Determine pricing tier based on template characteristics
 */
export function determinePricingTier(
  style: string,
  complexity: 'simple' | 'medium' | 'complex' = 'medium',
  niche?: string
): PricingTier {
  // Premium niches
  const premiumNiches = [
    'E-commerce Product Showcase',
    'Luxury / Premium Brand',
    'Agency / Studio Bold',
  ]

  // Complex templates or premium niches → Premium
  if (complexity === 'complex' || premiumNiches.includes(style)) {
    return 'premium'
  }

  // Standard niches → Standard
  const standardNiches = [
    'Minimal Corporate',
    'Dark Tech / SaaS',
    'Single-Page App / Startup Landing',
    'Creative Portfolio / Designer',
  ]

  if (standardNiches.includes(style) || complexity === 'medium') {
    return 'standard'
  }

  // Simple templates → Free (for lead-in)
  return 'free'
}

/**
 * Get pricing info for a tier
 */
export function getPricingInfo(tier: PricingTier): PricingInfo {
  return PRICING_TIERS[tier]
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return 'Free'
  }
  return `$${price.toFixed(0)}`
}

/**
 * Get pricing tier from price
 */
export function getTierFromPrice(price: number | null | undefined): PricingTier {
  if (price === null || price === undefined || price === 0) {
    return 'free'
  }
  if (price >= 99) {
    return 'premium'
  }
  if (price >= 49) {
    return 'standard'
  }
  return 'free'
}

/**
 * Suggest pricing based on template metadata
 */
export function suggestPricing(
  style: string,
  category?: string,
  tags?: string[]
): { tier: PricingTier; price: number } {
  const tier = determinePricingTier(style, 'medium', category)
  const pricingInfo = getPricingInfo(tier)
  
  return {
    tier,
    price: pricingInfo.price,
  }
}


