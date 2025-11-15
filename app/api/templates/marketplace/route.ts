import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PRICING_TIERS } from '@/lib/pricing'

/**
 * Public marketplace endpoint - returns only public templates
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const style = searchParams.get('style') || ''
    const category = searchParams.get('category') || ''
    const priceFilter = searchParams.get('price') || ''
    const sortBy = searchParams.get('sort') || 'newest'

    // Build where clause - only public templates
    const where: {
      isPublic: boolean
      title?: { contains: string; mode?: 'insensitive' }
      style?: string
      category?: string
      price?: number | { gte?: number; lte?: number }
    } = {
      isPublic: true, // Only show public templates
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const validStyles = [
      'Minimal Corporate',
      'Dark Tech / SaaS',
      'E-commerce Product Showcase',
      'Creative Portfolio / Designer',
      'Agency / Studio Bold',
      'Grid / Magazine Editorial',
      'Luxury / Premium Brand',
      'Retro / Y2K',
      'Pastel / Playful',
      'Single-Page App / Startup Landing'
    ];
    
    if (style && validStyles.includes(style)) {
      where.style = style
    }

    if (category) {
      where.category = category
    }

    // Price filter
    if (priceFilter === 'free') {
      where.price = 0
    } else if (priceFilter === 'standard') {
      where.price = PRICING_TIERS.standard.price
    } else if (priceFilter === 'premium') {
      where.price = { gte: PRICING_TIERS.premium.price }
    }

    // Build orderBy based on sort parameter
    let orderBy: { createdAt?: 'desc' | 'asc'; viewCount?: 'desc' | 'asc'; price?: 'desc' | 'asc' } = {
      createdAt: 'desc',
    }

    if (sortBy === 'popular') {
      orderBy = { viewCount: 'desc' }
    } else if (sortBy === 'price') {
      orderBy = { price: 'asc' }
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        prompt: true,
        style: true,
        framerUrl: true,
        createdAt: true,
        price: true,
        description: true,
        tags: true,
        category: true,
        viewCount: true,
        downloadCount: true,
        salesCount: true,
        featured: true,
      },
    })

    // Increment view count for each template (async, don't wait)
    templates.forEach((template) => {
      prisma.template.update({
        where: { id: template.id },
        data: { viewCount: { increment: 1 } },
      }).catch(console.error)
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching marketplace templates:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

