import { NextRequest, NextResponse } from 'next/server'

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

/** Fallback wholesale prices in pence for common TLDs */
const FALLBACK_PRICES: Record<string, number> = {
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
function extractTld(domain: string): string {
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
async function getCloudflarePricing(domain: string): Promise<number | null> {
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

/**
 * Check domain availability using DNS resolution as a heuristic.
 * If the domain resolves to any address, it's likely taken.
 * Also tries Cloudflare's registrar API for status info.
 */
async function checkAvailability(domain: string): Promise<boolean> {
  // Strategy 1: Try Cloudflare registrar API — works for domains already on CF
  if (CF_ACCOUNT_ID && CF_API_TOKEN) {
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

      if (res.ok) {
        const data = await res.json()
        // If CF knows about it and it has a status, it's registered
        if (data?.result?.available === false) return false
        if (data?.result?.available === true) return true
      }
    } catch {
      // Fall through to DNS check
    }
  }

  // Strategy 2: RDAP lookup (IANA standard replacement for WHOIS)
  try {
    const tld = domain.split('.').pop()
    const rdapRes = await fetch(
      `https://rdap.org/domain/${domain}`,
      {
        headers: { Accept: 'application/rdap+json' },
        signal: AbortSignal.timeout(5000),
      }
    )

    // 404 = not found = available
    if (rdapRes.status === 404) return true
    // 200 = found = registered
    if (rdapRes.ok) return false
  } catch {
    // RDAP failed, fall through to DNS
  }

  // Strategy 3: DNS resolution check — quick heuristic
  try {
    const dnsRes = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
      {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(3000),
      }
    )

    if (dnsRes.ok) {
      const dnsData = await dnsRes.json()
      // If there are answer records, the domain is taken
      if (dnsData?.Answer && dnsData.Answer.length > 0) {
        return false
      }

      // NXDOMAIN (rcode 3) means the domain doesn't exist — likely available
      if (dnsData?.Status === 3) {
        return true
      }

      // NOERROR with no answers could mean the domain exists but has no A records
      // Check for NS records to be more certain
      const nsRes = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`,
        {
          headers: { Accept: 'application/dns-json' },
          signal: AbortSignal.timeout(3000),
        }
      )

      if (nsRes.ok) {
        const nsData = await nsRes.json()
        if (nsData?.Answer && nsData.Answer.length > 0) {
          return false // Has nameservers, so it's registered
        }
        if (nsData?.Status === 3) {
          return true // NXDOMAIN
        }
      }
    }
  } catch {
    // DNS check failed
  }

  // Default: assume unavailable if we couldn't determine
  return false
}

/**
 * GET /api/domain-check?domain=example.com
 * Check if a domain is available and return pricing
 */
export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain')

    if (!domain) {
      return NextResponse.json(
        { error: 'domain query parameter is required' },
        { status: 400 }
      )
    }

    // Basic validation
    const cleaned = domain.toLowerCase().trim()
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/.test(cleaned)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    const tld = extractTld(cleaned)

    // Check availability and pricing in parallel
    const [available, cfPrice] = await Promise.all([
      checkAvailability(cleaned),
      getCloudflarePricing(cleaned),
    ])

    // Use Cloudflare price if available, otherwise fall back to hardcoded
    const costPence = cfPrice ?? FALLBACK_PRICES[tld] ?? 899
    const pricePence = calculateDomainPrice(costPence)

    return NextResponse.json({
      available,
      domain: cleaned,
      costPence,
      pricePence,
      tld,
    })
  } catch (error) {
    console.error('Domain check error:', error)
    return NextResponse.json(
      { error: 'Failed to check domain availability' },
      { status: 500 }
    )
  }
}
