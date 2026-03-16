import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { generateTemplateCode, type Style, extractMetadata } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { validateTemplateQuality } from '@/lib/template-quality'
import { suggestPricing } from '@/lib/pricing'
import { PREMIUM_PAGES } from '@/lib/design-system'

/**
 * Page definitions for multi-page template generation.
 * Each page has a specific purpose and section requirements.
 */
const PAGE_SPECS: Record<
  string,
  { sections: string; prompt: string }
> = {
  Home: {
    sections:
      'hero, social proof/logos bar, features grid (6 items), how it works (3 steps), testimonials (3 cards), pricing table (3 tiers with monthly/yearly toggle), FAQ accordion (5 items), CTA section, footer',
    prompt:
      'a complete homepage with all key conversion sections. This is the main landing page.',
  },
  About: {
    sections:
      'hero with founder/team photo area, origin story section, mission/values (3-4 values), team grid (4-6 members with photo/name/role), milestones timeline, CTA section, footer',
    prompt:
      'an About page telling the brand story with team section and values.',
  },
  'Services / Work': {
    sections:
      'hero, services/offerings grid (4-6 items with icon/title/description/price), process section (how it works), case study previews (3 cards linking to detail pages), testimonial, CTA section, footer',
    prompt:
      'a Services or Work listing page showcasing what the business offers.',
  },
  'Work Single / Case Study': {
    sections:
      'hero with project title and hero image, project overview (client/timeline/role), challenge section, solution section with images, results with metrics (3-4 stats), testimonial from client, next/prev project navigation, CTA section, footer',
    prompt:
      'a single case study or project detail page with challenge/solution/results format.',
  },
  'Blog Listing': {
    sections:
      'hero with page title, featured post (large card), blog grid (6+ cards with image/title/excerpt/date/category), category filter tabs, pagination or load more, newsletter signup, footer',
    prompt:
      'a blog listing page with featured post, category filters, and grid of article cards.',
  },
  'Blog Post': {
    sections:
      'article header (title/author/date/reading time/category), hero image, article body with rich typography (h2/h3/blockquote/lists/images), author bio card, related posts (3 cards), newsletter signup, comments section placeholder, footer',
    prompt:
      'a single blog post page with rich article typography and related posts.',
  },
  Contact: {
    sections:
      'hero with heading, contact form (name/email/subject/message with validation states), contact details sidebar (email/phone/address/social links), map placeholder, office hours, FAQ (3 items), footer',
    prompt:
      'a contact page with form, contact details, and location information.',
  },
  '404': {
    sections:
      'centered error message with large 404 text, friendly copy, search bar, navigation links (3-4 popular pages), home button CTA',
    prompt:
      'a 404 error page with friendly messaging and navigation back to key pages.',
  },
}

/**
 * POST /api/generate-multipage
 * Generate a complete multi-page template (8 pages sharing one design language).
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
    const { prompt, style, pages: requestedPages } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!style) {
      return NextResponse.json(
        { error: 'Style is required' },
        { status: 400 }
      )
    }

    // Allow selecting specific pages or default to all 8
    const selectedPages: string[] =
      requestedPages && Array.isArray(requestedPages) && requestedPages.length > 0
        ? requestedPages.filter((p: string) => p in PAGE_SPECS)
        : [...PREMIUM_PAGES]

    if (selectedPages.length === 0) {
      return NextResponse.json(
        {
          error: `No valid pages. Available: ${Object.keys(PAGE_SPECS).join(', ')}`,
        },
        { status: 400 }
      )
    }

    const metadata = extractMetadata(prompt, style as Style)
    const pricing = suggestPricing(style, metadata.category, metadata.tags)

    // Adjust price for multi-page (premium tier for full site templates)
    const multipagePrice =
      selectedPages.length >= 6 ? Math.max(pricing.price, 79) : Math.max(pricing.price, 49)

    // Create the parent template record first
    const parentTemplate = await prisma.template.create({
      data: {
        userId,
        title: `${extractTitle(prompt)} — Full Site Template`,
        prompt,
        style,
        code: '', // Will be updated with the homepage code
        isPublic: false,
        price: multipagePrice,
        description: `Complete ${selectedPages.length}-page website template. ${metadata.description}`,
        category: metadata.category,
        tags: [...metadata.tags, 'multipage', 'full-site'],
        licenseType: 'personal',
        viewCount: 0,
        downloadCount: 0,
        salesCount: 0,
      },
    })

    const generatedPages: Array<{
      page: string
      componentId: string
      qualityScore: number
      status: 'success' | 'failed'
    }> = []

    const errors: Array<{ page: string; error: string }> = []

    // Generate each page sequentially (shared design context in the prompt)
    for (const pageName of selectedPages) {
      const spec = PAGE_SPECS[pageName]
      if (!spec) continue

      try {
        const pagePrompt = `${prompt}

PAGE: ${pageName}
This is the ${pageName} page of a multi-page website template. It MUST use the exact same design language, colour palette, typography, spacing, and animation style as all other pages in this template.

REQUIRED SECTIONS for this page:
${spec.sections}

Generate ${spec.prompt}

CONSISTENCY RULES (CRITICAL):
- Use the EXACT same colour values as the design system specifies
- Use the EXACT same font sizes and weights across all pages
- Use the EXACT same spacing scale (section padding, element gaps)
- Use the EXACT same animation timing and easing
- Use the EXACT same border-radius values
- Use the EXACT same button styles and hover states
- Navigation bar must be identical across all pages (same links, same style)
- Footer must be identical across all pages`

        let code: string = ''
        let title: string = ''
        let qualityCheck: ReturnType<typeof validateTemplateQuality>
        let attempts = 0
        const maxAttempts = 3

        do {
          const result = await generateTemplateCode(pagePrompt, style as Style)
          code = result.code
          title = result.title
          qualityCheck = validateTemplateQuality(code)
          attempts++

          if (qualityCheck.score >= 75) break
        } while (attempts < maxAttempts)

        if (qualityCheck!.score < 60) {
          errors.push({
            page: pageName,
            error: `Quality ${qualityCheck!.score}/100 after ${attempts} attempts`,
          })
          continue
        }

        // Save as a component of the parent template
        const component = await prisma.component.create({
          data: {
            userId,
            name: `${pageName} Page`,
            code,
            description: `${pageName} page — ${spec.prompt}`,
            componentType: 'page',
            price: 0, // Individual pages aren't sold separately
            templateId: parentTemplate.id,
            tags: [pageName.toLowerCase().replace(/\s+/g, '-'), 'page'],
            category: metadata.category,
            licenseType: 'personal',
            isPublic: false,
            marketplaceReady: true,
          },
        })

        // If this is the homepage, update the parent template code
        if (pageName === 'Home') {
          await prisma.template.update({
            where: { id: parentTemplate.id },
            data: { code },
          })
        }

        generatedPages.push({
          page: pageName,
          componentId: component.id,
          qualityScore: qualityCheck!.score,
          status: 'success',
        })
      } catch (pageError) {
        errors.push({
          page: pageName,
          error:
            pageError instanceof Error ? pageError.message : 'Generation failed',
        })
      }
    }

    return NextResponse.json({
      template: {
        id: parentTemplate.id,
        title: parentTemplate.title,
        style,
        price: multipagePrice,
        totalPages: generatedPages.length,
        pages: generatedPages,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error in generate-multipage:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate multi-page template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function extractTitle(prompt: string): string {
  const words = prompt.split(' ').slice(0, 5).join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}
