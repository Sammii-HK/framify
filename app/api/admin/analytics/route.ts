import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Admin analytics endpoint
 * Returns comprehensive statistics about templates and system
 */
export async function GET(req: NextRequest) {
  try {
    // Use Promise.allSettled to handle potential errors gracefully
    const results = await Promise.allSettled([
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

    // Extract results, defaulting to safe values on error
    const totalTemplates = results[0].status === 'fulfilled' ? results[0].value : 0
    const publicTemplates = results[1].status === 'fulfilled' ? results[1].value : 0
    const templates = results[2].status === 'fulfilled' ? results[2].value : []
    const styleCounts = results[3].status === 'fulfilled' ? results[3].value : []
    const categoryCounts = results[4].status === 'fulfilled' ? results[4].value : []

    // Calculate totals (handle empty arrays and null values)
    const totalViews = templates.reduce((sum: number, t: any) => sum + (t.viewCount || 0), 0)
    const totalDownloads = templates.reduce((sum: number, t: any) => sum + (t.downloadCount || 0), 0)
    const totalSales = templates.reduce((sum: number, t: any) => sum + (t.salesCount || 0), 0)
    const revenue = templates.reduce(
      (sum: number, t: any) => sum + ((t.price || 0) * (t.salesCount || 0)),
      0
    )

    // Format style counts
    const templatesByStyle: Record<string, number> = {}
    if (Array.isArray(styleCounts)) {
      styleCounts.forEach((item: any) => {
        if (item?.style && typeof item._count === 'number') {
          templatesByStyle[item.style] = item._count
        }
      })
    }

    // Format category counts
    const templatesByCategory: Record<string, number> = {}
    if (Array.isArray(categoryCounts)) {
      categoryCounts.forEach((item: any) => {
        if (item?.category && typeof item._count === 'number') {
          templatesByCategory[item.category] = item._count
        }
      })
    }

    return NextResponse.json({
      totalTemplates,
      publicTemplates,
      totalViews,
      totalDownloads,
      totalSales,
      revenue,
      templatesByStyle,
      templatesByCategory,
      recentTemplates: templates.map((t: any) => ({
        id: t.id,
        title: t.title,
        style: t.style,
        viewCount: t.viewCount || 0,
        salesCount: t.salesCount || 0,
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
