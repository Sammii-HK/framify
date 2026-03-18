import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { getWebAnalytics } from '@/lib/cloudflare'

/**
 * GET /api/sites/[id]/analytics
 * Returns basic analytics for a site (form submissions count).
 * Only accessible to the site owner on Launch plan.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: siteId } = await params

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, plan: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.plan !== 'launch') {
      return NextResponse.json(
        { error: 'Analytics is available on the Launch plan' },
        { status: 403 }
      )
    }

    // Verify ownership
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
      select: { id: true, subdomain: true, cfAnalyticsToken: true },
    })

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Count form submissions
    const formSubmissions = await prisma.formSubmission.count({
      where: { siteId },
    })

    // Query real page views from Cloudflare Web Analytics
    let pageViews = 0
    let visitors = 0
    if (site.cfAnalyticsToken) {
      const analytics = await getWebAnalytics(site.cfAnalyticsToken)
      pageViews = analytics.pageViews
      visitors = analytics.visitors
    }

    return NextResponse.json({
      siteId,
      subdomain: site.subdomain,
      pageViews,
      visitors,
      formSubmissions,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to load analytics' },
      { status: 500 }
    )
  }
}
