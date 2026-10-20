// Domain pricing lives on the server so checkout never trusts a price sent by the browser.

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

/** Fallback wholesale prices in pence for common TLDs */
export const FALLBACK_PRICES: Record<string, number> = {
  '.com': 899,
  '.co.uk': 550,
  '.uk': 550,
  '.io': 3500,
  '.dev': 1200,
  '.site': 299,
  '.net': 1099,
  '.org': 1099,
  '.app': 1400,
  '.xyz': 299,
  '.online': 299,
  '.store': 299,
  '.me': 899,
  '.info': 899,
  '.biz': 899,
  '.tech': 299,
  '.design': 2999,
}

const MINIMUM_PRICE_PENCE = 1999 // £19.99

/**
 * Extract the TLD from a domain name (handles multi-part TLDs like .co.uk)
 */
export function extractTld(domain: string): string {
  const parts = domain.split('.')
  if (parts.length < 2) return ''

  // Handle two-part TLDs like .co.uk, .org.uk, .com.au
  const secondLevel = ['co', 'org', 'com', 'net', 'ac', 'gov', 'me']
  if (parts.length >= 3 && secondLevel.includes(parts[parts.length - 2])) {
    return '.' + parts.slice(-2).join('.')
  }

  return '.' + parts[parts.length - 1]
}

/**
 * Calculate the retail price from wholesale cost.
 *
 * Strategy: 2x markup, round up to nearest £5, then subtract 1p
 * for .99 psychological pricing. Minimum £19.99.
 *
 * Examples (pence):
 *   858  → 2x = 1716 → ceil5 = 2000 → 1999 (£19.99, minimum)
 *  1000  → 2x = 2000 → ceil5 = 2000 → 1999 (£19.99)
 *  1200  → 2x = 2400 → ceil5 = 2500 → 2499 (£24.99)
 *  1500  → 2x = 3000 → ceil5 = 3000 → 2999 (£29.99)
 *  2500  → 2x = 5000 → ceil5 = 5000 → 4999 (£49.99)
 *  3500  → 2x = 7000 → ceil5 = 7000 → 6999 (£69.99)
 */
export function calculateDomainPrice(wholesaleCostPence: number): number {
  const doubled = wholesaleCostPence * 2
  // Round up to the nearest 500 pence (£5)
  const roundedUp = Math.ceil(doubled / 500) * 500
  // Subtract 1p for .99 ending
  const price = roundedUp - 1
  return Math.max(price, MINIMUM_PRICE_PENCE)
}

/**
 * Try to get domain pricing from Cloudflare Registrar API
 */
export async function getCloudflarePricing(domain: string): Promise<number | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/registrar/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) return null

    const data = await res.json()

    // Cloudflare returns pricing in USD — convert roughly to pence (GBP)
    // Using a rough 0.79 GBP/USD rate
    if (data?.result?.fees?.registration_fee) {
      const usdCents = Math.round(data.result.fees.registration_fee * 100)
      const gbpPence = Math.round(usdCents * 0.79)
      return gbpPence
    }

    return null
  } catch {
    return null
  }
}

/** Retail price in pence for a domain, the same figure the domain search shows. */
export async function quoteDomainPricePence(domain: string, cfPrice?: number | null): Promise<number> {
  const wholesale = cfPrice !== undefined ? cfPrice : await getCloudflarePricing(domain)
  const costPence = wholesale ?? FALLBACK_PRICES[extractTld(domain)] ?? 899
  return calculateDomainPrice(costPence)
}
