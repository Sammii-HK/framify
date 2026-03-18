import { NextRequest, NextResponse } from 'next/server'
import { generateStaticSite, VALID_PALETTES, type SiteContent } from '@/lib/site-generator'

export async function POST(request: NextRequest) {
  try {
    const content: SiteContent = await request.json()

    if (!VALID_PALETTES.includes(content.palette)) {
      content.palette = 'dark-celestial'
    }

    // Preview images are for demo only — generated sites use placeholders until
    // users add their own photos. We do NOT inject Unsplash stock images here.
    // User-uploaded images (non-Unsplash) are preserved as-is; Unsplash URLs
    // are stripped in the site generator so the downloaded HTML has clean
    // placeholder boxes ready for the user's own content.

    const html = generateStaticSite(content)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${(content.businessName || 'my-site').toLowerCase().replace(/\s+/g, '-')}.html"`,
      },
    })
  } catch (error) {
    console.error('Generate site error:', error)
    return NextResponse.json({ error: 'Failed to generate site' }, { status: 500 })
  }
}
