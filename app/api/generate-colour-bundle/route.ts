import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { generateTemplateCode, type Style, extractMetadata } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { validateTemplateQuality } from '@/lib/template-quality'
import { suggestPricing } from '@/lib/pricing'

const SPIRITUAL_STYLES: Style[] = [
  'Spiritual / Dark Celestial',
  'Spiritual / Earthy Sage',
  'Spiritual / Ethereal Light',
  'Spiritual / Crystal Rose',
]

/**
 * POST /api/generate-colour-bundle
 * Generate all 4 spiritual colour variants from a single prompt.
 * Same layout concept, 4 different palettes.
 * Returns the bundle for selling individually or as a pack.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.sub
    const body = await req.json()
    const { prompt, styles } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Allow custom style selection or default to all 4 spiritual palettes
    const selectedStyles: Style[] =
      styles && Array.isArray(styles) && styles.length > 0
        ? styles.filter((s: string) => SPIRITUAL_STYLES.includes(s as Style))
        : SPIRITUAL_STYLES

    if (selectedStyles.length === 0) {
      return NextResponse.json(
        {
          error: `No valid spiritual styles provided. Available: ${SPIRITUAL_STYLES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const results: Array<{
      id: string
      title: string
      style: string
      qualityScore: number
      pricing: { tier: string; price: number }
    }> = []

    const errors: Array<{ style: string; error: string }> = []

    // Generate each variant sequentially (to avoid rate limits)
    for (const style of selectedStyles) {
      try {
        const variationPrompt = `${prompt} — Apply the ${style} colour palette and aesthetic. Keep the same layout structure and sections but use the palette's specific colours, mood, and design language.`

        let code: string
        let title: string
        let qualityCheck: ReturnType<typeof validateTemplateQuality>
        let attempts = 0
        const maxAttempts = 3

        do {
          const result = await generateTemplateCode(variationPrompt, style)
          code = result.code
          title = result.title
          qualityCheck = validateTemplateQuality(code)
          attempts++

          if (qualityCheck.score >= 75) break
        } while (attempts < maxAttempts)

        if (qualityCheck!.score < 60) {
          errors.push({
            style,
            error: `Quality score ${qualityCheck!.score}/100 after ${attempts} attempts`,
          })
          continue
        }

        const metadata = extractMetadata(prompt, style)
        const pricing = suggestPricing(style, metadata.category, metadata.tags)

        const paletteName = style.split(' / ')[1] || style

        const template = await prisma.template.create({
          data: {
            userId,
            title: `${title} — ${paletteName}`,
            prompt,
            style,
            code: code!,
            isPublic: false,
            price: pricing.price,
            description: metadata.description,
            category: metadata.category,
            tags: [...metadata.tags, 'colour-bundle'],
            licenseType: 'personal',
            viewCount: 0,
            downloadCount: 0,
            salesCount: 0,
          },
        })

        results.push({
          id: template.id,
          title: template.title,
          style,
          qualityScore: qualityCheck!.score,
          pricing: { tier: pricing.tier, price: pricing.price },
        })
      } catch (styleError) {
        errors.push({
          style,
          error:
            styleError instanceof Error
              ? styleError.message
              : 'Generation failed',
        })
      }
    }

    return NextResponse.json({
      bundle: {
        prompt,
        totalVariants: results.length,
        templates: results,
        bundlePrice: results.reduce((sum, r) => sum + r.pricing.price, 0),
        suggestedBundlePrice: Math.round(
          results.reduce((sum, r) => sum + r.pricing.price, 0) * 0.7
        ),
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error in generate-colour-bundle:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate colour bundle',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
