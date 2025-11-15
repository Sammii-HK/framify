import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/components
 * List components with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const componentType = searchParams.get('type') || ''
    const style = searchParams.get('style') || ''
    const category = searchParams.get('category') || ''
    const isPublic = searchParams.get('public') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}

    if (isPublic) {
      where.isPublic = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    if (componentType) {
      where.componentType = componentType
    }

    if (style) {
      where.tags = { hasSome: [style.toLowerCase()] }
    }

    if (category) {
      where.category = category
    }

    if (featured) {
      where.featured = true
    }

    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.component.count({ where }),
    ])

    return NextResponse.json({
      components,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching components:', error)
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/components
 * Create a new component
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
    const {
      name,
      code,
      description,
      componentType,
      price,
      templateId,
      tags,
      category,
      licenseType,
      isPublic,
    } = body

    if (!name || !code || !componentType) {
      return NextResponse.json(
        { error: 'Name, code, and componentType are required' },
        { status: 400 }
      )
    }

    const component = await prisma.component.create({
      data: {
        userId,
        name,
        code,
        description,
        componentType,
        price: price || null,
        templateId: templateId || null,
        tags: tags || [],
        category: category || null,
        licenseType: licenseType || 'personal',
        isPublic: isPublic || false,
        marketplaceReady: !!(name && description && code && componentType),
      },
    })

    return NextResponse.json(component, { status: 201 })
  } catch (error) {
    console.error('Error creating component:', error)
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    )
  }
}

