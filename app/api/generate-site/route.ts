import { NextRequest, NextResponse } from 'next/server'
import { generateStaticSite, VALID_PALETTES, type SiteContent } from '@/lib/site-generator'
import { getStockImages } from '@/lib/stock-images'

/**
 * Derive a search term from templateType and businessName so that
 * Unsplash returns something relevant to the business.
 */
function deriveSearchTerm(content: SiteContent): string {
  const typeMap: Record<string, string> = {
    trades: 'trades construction',
    salon: 'hair salon beauty',
    restaurant: 'restaurant food dining',
    portfolio: 'creative portfolio workspace',
    consultant: 'professional business consulting',
    standard: 'small business',
  }

  const base = typeMap[content.templateType || 'standard'] || 'small business'
  // Append businessName for more specific results (e.g. "plumber trades construction")
  return content.businessName ? `${content.businessName} ${base}` : base
}

export async function POST(request: NextRequest) {
  try {
    const content: SiteContent = await request.json()

    if (!VALID_PALETTES.includes(content.palette)) {
      content.palette = 'dark-celestial'
    }

    // Auto-fetch Unsplash images when none are provided
    const hasHero = content.images?.hero
    const hasGallery = content.images?.gallery && content.images.gallery.length > 0

    if (!hasHero || !hasGallery) {
      try {
        const searchTerm = deriveSearchTerm(content)
        const neededCount = (hasHero ? 0 : 1) + (hasGallery ? 0 : 3)
        const stockImages = await getStockImages(searchTerm, neededCount)

        if (!content.images) {
          content.images = {}
        }

        if (!hasHero && stockImages.length > 0) {
          content.images.hero = stockImages[0].url
        }

        if (!hasGallery) {
          const galleryStart = hasHero ? 0 : 1
          const galleryImages = stockImages.slice(galleryStart, galleryStart + 3)
          if (galleryImages.length > 0) {
            content.images.gallery = galleryImages.map(img => img.url)
          }
        }
      } catch (imgError) {
        // Stock image fetch failed — continue without images rather than blocking generation
        console.warn('Stock image fetch failed, continuing without:', imgError)
      }
    }

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
