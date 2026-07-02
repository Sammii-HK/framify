import { NextRequest, NextResponse } from 'next/server'
import { templates } from '@/lib/template-data'
import { auth0 } from '@/lib/auth0'

const ETSY_BASE = 'https://openapi.etsy.com/v3'

// Tags shared across all templates
const BASE_TAGS = [
  'website template',
  'HTML template',
  'small business website',
  'local business',
  'web design',
]

function tagsForTemplate(category: string, pages: string): string[] {
  const categoryTags: Record<string, string[]> = {
    services: ['services website', 'trades website'],
    'food-hospitality': ['restaurant website', 'cafe website'],
    creative: ['portfolio website', 'creative website'],
    professional: ['professional website', 'consultant website'],
    'health-wellness': ['health website', 'wellness website'],
    retail: ['shop website', 'ecommerce template'],
    tech: ['startup website', 'tech website'],
  }
  const pageTags = pages === 'multi' ? ['multi page website', 'full website'] : ['one page website', 'landing page']
  return [...BASE_TAGS, ...(categoryTags[category] || []), ...pageTags].slice(0, 13)
}

function descriptionForTemplate(t: typeof templates[0]): string {
  const deployCta = `\n\n✨ Want it live without the hassle?\nVisit craftmypage.com — we handle hosting, your domain, SSL, and deployment. Your site goes live in minutes with zero technical setup.\n`

  return `${t.name} — Professional HTML Website Template

${t.description}

Best for: ${t.bestFor}

━━━━━━━━━━━━━━━━━━━━━━
WHAT YOU GET
━━━━━━━━━━━━━━━━━━━━━━
✅ Complete HTML/CSS template (single file, no dependencies)
✅ Mobile responsive — looks great on all devices
✅ 12 colour palette options included
✅ Light and dark mode ready
✅ Clean, commented code — easy to customise
✅ README with setup instructions
${t.pages === 'multi' ? `✅ ${t.pageCount} fully designed pages\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
HOW TO USE
━━━━━━━━━━━━━━━━━━━━━━
1. Download the ZIP after purchase
2. Open index.html in any code editor
3. Replace placeholder text and images
4. Upload to any web host (Netlify, Vercel, GitHub Pages — all free)
${deployCta}
━━━━━━━━━━━━━━━━━━━━━━
LICENCE
━━━━━━━━━━━━━━━━━━━━━━
Personal and commercial use on a single website. Redistribution or resale of the original files is not permitted.

This file is uniquely watermarked to your email address on purchase.`
}

async function refreshAccessToken(): Promise<string> {
  const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ETSY_API_KEY!,
      refresh_token: process.env.ETSY_REFRESH_TOKEN!,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`)
  return data.access_token
}

async function createListing(accessToken: string, shopId: string, t: typeof templates[0]) {
  const priceUsd = t.price || 15
  const body = {
    quantity: 999,
    title: `${t.name} Website Template — HTML CSS ${t.pages === 'multi' ? 'Multi-Page ' : ''}for ${t.bestFor.split(',')[0]}`,
    description: descriptionForTemplate(t),
    price: priceUsd,
    who_made: 'i_did',
    when_made: 'made_to_order',
    taxonomy_id: 2078, // Digital downloads > Web design
    tags: tagsForTemplate(t.category, t.pages),
    materials: ['HTML', 'CSS'],
    type: 'download',
    is_digital: true,
    file_data: '', // Digital listing — no physical file needed at creation
    should_auto_renew: true,
    is_taxable: false,
  }

  const res = await fetch(`${ETSY_BASE}/application/shops/${shopId}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ETSY_API_KEY!,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return { ok: res.ok, listing: data, templateType: t.type }
}

// POST /api/etsy/bulk-list — creates listings for all templates
// Owner-only endpoint
export async function POST(request: NextRequest) {
  const session = await auth0.getSession()
  const ownerEmails = (process.env.OWNER_EMAILS || '').split(',').map((e) => e.trim())

  if (!session?.user || !ownerEmails.includes(session.user.email || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!process.env.ETSY_ACCESS_TOKEN || !process.env.ETSY_REFRESH_TOKEN || !process.env.ETSY_SHOP_ID) {
    return NextResponse.json({
      error: 'Missing env vars',
      required: ['ETSY_ACCESS_TOKEN', 'ETSY_REFRESH_TOKEN', 'ETSY_SHOP_ID'],
      setup: 'Visit /api/etsy/auth to authenticate first',
    }, { status: 500 })
  }

  let accessToken = process.env.ETSY_ACCESS_TOKEN
  const shopId = process.env.ETSY_SHOP_ID

  // Try refreshing token first
  try {
    accessToken = await refreshAccessToken()
  } catch {
    // Use existing token
  }

  const body = await request.json().catch(() => ({}))
  const templateTypes: string[] | undefined = body.templates // optional filter

  const toList = templateTypes
    ? templates.filter((t) => templateTypes.includes(t.type))
    : templates

  const results = []
  for (const t of toList) {
    const result = await createListing(accessToken, shopId, t)
    results.push(result)
    // Rate limit — Etsy allows 10 req/sec
    await new Promise((r) => setTimeout(r, 200))
  }

  const succeeded = results.filter((r) => r.ok)
  const failed = results.filter((r) => !r.ok)

  return NextResponse.json({
    created: succeeded.length,
    failed: failed.length,
    results,
  })
}
