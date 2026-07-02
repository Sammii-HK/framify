import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

const ETSY_BASE = 'https://openapi.etsy.com/v3'

const SHOP_DESCRIPTION =
  'Studio Sammii: digital templates, artwork, prints and stickers. Website templates for small businesses, Notion productivity templates, and original digital art. Everything designed with care.'

const SECTIONS = [
  'Website Templates',
  'Notion Templates',
  'Artwork & Prints',
  'Stickers & Stationery',
]

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

// POST /api/etsy/setup-shop
// Updates the shop description and creates the 4 shop sections.
// Owner-only endpoint.
export async function POST() {
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

  const shopId = process.env.ETSY_SHOP_ID

  // Refresh token first
  let accessToken: string
  try {
    accessToken = await refreshAccessToken()
  } catch {
    accessToken = process.env.ETSY_ACCESS_TOKEN
  }

  const results: { step: string; ok: boolean; data?: unknown; error?: string }[] = []

  // Step 1: Update shop description
  const descRes = await fetch(`${ETSY_BASE}/application/shops/${shopId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ETSY_API_KEY!,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      announcement: SHOP_DESCRIPTION,
    }),
  })
  const descData = await descRes.json()
  results.push({
    step: 'update_shop_description',
    ok: descRes.ok,
    data: descRes.ok ? { updated: true } : undefined,
    error: descRes.ok ? undefined : JSON.stringify(descData),
  })

  // Step 2: Create each section
  for (const title of SECTIONS) {
    const secRes = await fetch(`${ETSY_BASE}/application/shops/${shopId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ETSY_API_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title }),
    })
    const secData = await secRes.json()
    results.push({
      step: `create_section_${title}`,
      ok: secRes.ok,
      data: secRes.ok ? { section_id: secData.shop_section_id, title: secData.title } : undefined,
      error: secRes.ok ? undefined : JSON.stringify(secData),
    })
    // Brief pause to respect rate limits
    await new Promise((r) => setTimeout(r, 200))
  }

  const succeeded = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length

  return NextResponse.json({
    succeeded,
    failed,
    results,
  })
}
