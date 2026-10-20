import { NextRequest, NextResponse } from 'next/server'
import { extractTld, FALLBACK_PRICES, calculateDomainPrice, getCloudflarePricing } from '@/lib/domain-pricing'

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

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
