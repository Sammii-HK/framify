import { NextRequest, NextResponse } from 'next/server'
import { templates } from '@/lib/template-data'
import { auth0 } from '@/lib/auth0'

const ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'

function descriptionForTemplate(t: typeof templates[0]): string {
  return `${t.description}

Best for: ${t.bestFor}

---

WHAT YOU GET
✅ Complete HTML/CSS template (no frameworks, no dependencies)
✅ Mobile responsive — looks great on all devices
✅ 12 colour palette options included
✅ Light and dark mode ready
✅ README with setup instructions
${t.pages === 'multi' ? `✅ ${t.pageCount} fully designed pages\n` : ''}
---

HOW TO USE
1. Download the ZIP after purchase
2. Open index.html in any code editor
3. Replace placeholder text and images with your own content
4. Upload to any web host (Netlify, GitHub Pages, Cloudflare Pages — all free options)

---

WANT IT LIVE WITHOUT THE HASSLE?

Visit craftmypage.com — pick this template, answer a few questions, and we handle hosting, your domain, SSL, and deployment automatically. Live in minutes, zero technical setup.

---

LICENCE
Personal and commercial use on a single website. Redistribution or resale of the original files is not permitted. Your download is uniquely watermarked to your email address.`
}

async function createProduct(t: typeof templates[0]) {
  const params = new URLSearchParams({
    access_token: ACCESS_TOKEN,
    name: `${t.name} Website Template — HTML/CSS`,
    description: descriptionForTemplate(t),
    price: String(Math.round((t.price || 15) * 100)), // Gumroad uses cents
    url: `${APP_URL}/templates/${t.type}`,
    published: 'false', // draft — review before publishing
    tags: ['website template', 'html template', 'small business', t.category, t.pages === 'multi' ? 'multi-page' : 'single-page'].join(','),
  })

  const res = await fetch('https://api.gumroad.com/v2/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  const data = await res.json()
  return { ok: res.ok, product: data.product, error: data.message, type: t.type }
}

// POST /api/gumroad/bulk-list — creates draft listings for all templates
// Owner-only
export async function POST(request: NextRequest) {
  const session = await auth0.getSession()
  const ownerEmails = (process.env.OWNER_EMAILS || '').split(',').map(e => e.trim())

  if (!session?.user || !ownerEmails.includes(session.user.email || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const templateTypes: string[] | undefined = body.templates

  const toList = templateTypes
    ? templates.filter(t => templateTypes.includes(t.type))
    : templates

  const results = []
  for (const t of toList) {
    const result = await createProduct(t)
    results.push(result)
    await new Promise(r => setTimeout(r, 250))
  }

  const succeeded = results.filter(r => r.ok)
  const failed = results.filter(r => !r.ok)

  return NextResponse.json({
    created: succeeded.length,
    failed: failed.length,
    note: 'All listings created as drafts. Go to gumroad.com/products to review and publish.',
    results,
  })
}
