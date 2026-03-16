import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const PAGES_PROJECT = process.env.CLOUDFLARE_PAGES_PROJECT || 'framify'
const PAGES_TARGET = `${PAGES_PROJECT}.pages.dev`

async function cfFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

/**
 * Validate a domain string. Must be a valid domain and not a subdomain of craftmypage.com.
 */
function validateDomain(domain: string): { valid: boolean; error?: string } {
  const cleaned = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/.test(cleaned)) {
    return { valid: false, error: 'Invalid domain format' }
  }

  const customerDomain = process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN || 'craftmypage.com'
  if (cleaned === customerDomain || cleaned.endsWith(`.${customerDomain}`)) {
    return { valid: false, error: `Cannot use a subdomain of ${customerDomain}` }
  }

  return { valid: true }
}

/**
 * POST /api/custom-domain
 * Connect a customer-owned domain to their CraftMyPage site.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)
    const body = await req.json()
    const { domain, siteId } = body

    if (!domain || !siteId) {
      return NextResponse.json({ error: 'domain and siteId are required' }, { status: 400 })
    }

    // Validate domain format
    const cleaned = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
    const validation = validateDomain(cleaned)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Check the user owns this site
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found or you do not own it' }, { status: 404 })
    }

    // Add custom domain to CF Pages project
    const errors: string[] = []

    // Root domain
    const rootRes = await cfFetch(
      `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`,
      {
        method: 'POST',
        body: JSON.stringify({ name: cleaned }),
      }
    )

    if (!rootRes.ok) {
      const rootBody = await rootRes.json().catch(() => null)
      const msg = rootBody?.errors?.[0]?.message || `HTTP ${rootRes.status}`
      if (rootRes.status !== 409 && !msg.includes('already')) {
        errors.push(`Root domain: ${msg}`)
      }
    }

    // www variant
    const wwwRes = await cfFetch(
      `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`,
      {
        method: 'POST',
        body: JSON.stringify({ name: `www.${cleaned}` }),
      }
    )

    if (!wwwRes.ok) {
      const wwwBody = await wwwRes.json().catch(() => null)
      const msg = wwwBody?.errors?.[0]?.message || `HTTP ${wwwRes.status}`
      if (wwwRes.status !== 409 && !msg.includes('already')) {
        errors.push(`WWW domain: ${msg}`)
      }
    }

    if (errors.length > 0) {
      console.error('[CustomDomain] Cloudflare errors:', errors)
      return NextResponse.json(
        { error: 'Failed to add domain to Cloudflare', details: errors },
        { status: 502 }
      )
    }

    // Update the site record
    await prisma.site.update({
      where: { id: siteId },
      data: { customDomain: cleaned },
    })

    return NextResponse.json({
      success: true,
      domain: cleaned,
      instructions: {
        type: 'CNAME',
        name: '@',
        value: PAGES_TARGET,
        note: `Also add a CNAME for 'www' pointing to ${PAGES_TARGET}`,
      },
      verificationStatus: 'pending',
    })
  } catch (error) {
    console.error('Custom domain error:', error)
    return NextResponse.json({ error: 'Failed to connect domain' }, { status: 500 })
  }
}

/**
 * GET /api/custom-domain?domain=example.com&siteId=xxx
 * Check if a custom domain's DNS is correctly pointed.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const domain = req.nextUrl.searchParams.get('domain')
    const siteId = req.nextUrl.searchParams.get('siteId')

    if (!domain || !siteId) {
      return NextResponse.json({ error: 'domain and siteId query parameters are required' }, { status: 400 })
    }

    const cleaned = domain.toLowerCase().trim()

    // DNS lookup via Cloudflare DoH to check CNAME
    let verified = false

    try {
      const dnsRes = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleaned)}&type=CNAME`,
        {
          headers: { Accept: 'application/dns-json' },
          signal: AbortSignal.timeout(5000),
        }
      )

      if (dnsRes.ok) {
        const dnsData = await dnsRes.json()
        if (dnsData?.Answer && dnsData.Answer.length > 0) {
          // Check if any CNAME answer points to our Pages target
          verified = dnsData.Answer.some(
            (record: { data?: string }) =>
              record.data && record.data.replace(/\.$/, '').toLowerCase() === PAGES_TARGET.toLowerCase()
          )
        }
      }

      // If CNAME didn't match, also check if A/AAAA records resolve
      // (some registrars flatten CNAME at root to A records)
      if (!verified) {
        const aRes = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleaned)}&type=A`,
          {
            headers: { Accept: 'application/dns-json' },
            signal: AbortSignal.timeout(5000),
          }
        )

        if (aRes.ok) {
          const aData = await aRes.json()
          // If it resolves at all, check via the Pages domains API
          if (aData?.Answer && aData.Answer.length > 0) {
            const pagesRes = await cfFetch(
              `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`
            )

            if (pagesRes.ok) {
              const pagesData = await pagesRes.json()
              const domainEntry = pagesData?.result?.find(
                (d: { name?: string; status?: string }) =>
                  d.name?.toLowerCase() === cleaned
              )
              if (domainEntry?.status === 'active') {
                verified = true
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('[CustomDomain] DNS verification error:', err)
    }

    return NextResponse.json({
      verified,
      domain: cleaned,
    })
  } catch (error) {
    console.error('Custom domain verification error:', error)
    return NextResponse.json({ error: 'Failed to verify domain' }, { status: 500 })
  }
}
