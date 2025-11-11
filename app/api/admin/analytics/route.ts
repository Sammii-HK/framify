import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Admin analytics endpoint
 * Returns comprehensive statistics about templates and system
 */
export async function GET(req: NextRequest) {
  try {
    // Get all templates for analytics
    const [
      totalTemplates,
      publicTemplates,
      templates,
      styleCounts,
      categoryCounts,
    ] = await Promise.all([
      prisma.template.count(),
      prisma.template.count({ where: { isPublic: true } }),
      prisma.template.findMany({
        select: {
          id: true,
          title: true,
          style: true,
          viewCount: true,
          downloadCount: true,
          salesCount: true,
          price: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.template.groupBy({
        by: ['style'],
        _count: true,
      }),
      prisma.template.groupBy({
        by: ['category'],
        _count: true,
        where: {
          category: { not: null },
        },
      }),
    ])

    // Calculate totals
    const totalViews = templates.reduce((sum, t) => sum + t.viewCount, 0)
    const totalDownloads = templates.reduce((sum, t) => sum + t.downloadCount, 0)
    const totalSales = templates.reduce((sum, t) => sum + t.salesCount, 0)
    const revenue = templates.reduce(
      (sum, t) => sum + (t.price || 0) * t.salesCount,
      0
    )

    // Format style counts
    const templatesByStyle: Record<string, number> = {}
    styleCounts.forEach((item) => {
      templatesByStyle[item.style] = item._count
    })

    // Format category counts
    const templatesByCategory: Record<string, number> = {}
    categoryCounts.forEach((item) => {
      if (item.category) {
        templatesByCategory[item.category] = item._count
      }
    })

    return NextResponse.json({
      totalTemplates,
      publicTemplates,
      totalViews,
      totalDownloads,
      totalSales,
      revenue,
      templatesByStyle,
      templatesByCategory,
      recentTemplates: templates.map((t) => ({
        id: t.id,
        title: t.title,
        style: t.style,
        viewCount: t.viewCount,
        salesCount: t.salesCount,
        createdAt: t.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

