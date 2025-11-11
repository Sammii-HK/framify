import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Get single public template by ID
 * For studio store product pages
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const template = await prisma.template.findFirst({
      where: {
        id,
        isPublic: true, // Only return public templates
      },
      select: {
        id: true,
        title: true,
        description: true,
        prompt: true,
        style: true,
        category: true,
        tags: true,
        price: true,
        licenseType: true,
        thumbnailUrl: true,
        framerUrl: true,
        viewCount: true,
        downloadCount: true,
        salesCount: true,
        featured: true,
        createdAt: true,
        // Code is not exposed - require purchase
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or not public' },
        { status: 404 }
      )
    }

    // Increment view count (async)
    prisma.template
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(console.error)

    return NextResponse.json({
      id: template.id,
      title: template.title,
      description: template.description || template.prompt,
      style: template.style,
      category: template.category,
      tags: template.tags || [],
      price: template.price || 0,
      licenseType: template.licenseType || 'personal',
      thumbnailUrl: template.thumbnailUrl,
      previewUrl: template.framerUrl,
      viewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/template/${template.id}`,
      purchaseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/template/${template.id}?purchase=true`,
      stats: {
        views: template.viewCount,
        downloads: template.downloadCount,
        sales: template.salesCount,
      },
      featured: template.featured,
      createdAt: template.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

