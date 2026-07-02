import { NextRequest, NextResponse } from 'next/server'
import { generateStaticSite, generateMultiPageSite, VALID_PALETTES, type SiteContent } from '@/lib/site-generator'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'
import { createWebAnalyticsSite, deploySite } from '@/lib/cloudflare'

export async function POST(request: NextRequest) {
  try {
    // DEV BYPASS: skip auth in local development
    const isDev = process.env.NODE_ENV === 'development'

    // Require authentication
    const session = isDev ? null : await auth0.getSession()
    if (!isDev && !session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = isDev
      ? await prisma.user.upsert({
          where: { email: 'kellow.sammii@gmail.com' },
          update: {},
          create: { email: 'kellow.sammii@gmail.com', name: 'Sammii', plan: 'starter' },
        })
      : await findOrCreateUser(session!.user)

    const { content, subdomain } = await request.json() as {
      content: SiteContent
      subdomain: string
    }

    if (!subdomain || !/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: 'Invalid subdomain. Use lowercase letters, numbers, and hyphens only.' }, { status: 400 })
    }

    if (subdomain.length < 3 || subdomain.length > 40) {
      return NextResponse.json({ error: 'Subdomain must be 3-40 characters.' }, { status: 400 })
    }

    // Check subdomain ownership
    const existingSite = await prisma.site.findUnique({ where: { subdomain } })
    if (existingSite && existingSite.userId !== user.id) {
      return NextResponse.json({ error: 'This subdomain is already taken.' }, { status: 409 })
    }

    // Subscription gate: require active subscription to publish
    // Grandfathered users (starter/launch with no stripeSubscriptionId) are allowed
    // Owner email always bypasses subscription gate
    const ownerEmails = (process.env.OWNER_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
    const isOwner = isDev || ownerEmails.includes(session?.user?.email ?? '')
    const isGrandfathered = isOwner || ((user.plan === 'starter' || user.plan === 'launch') && !user.stripeSubscriptionId)
    if (!isGrandfathered) {
      if (user.plan === 'free' || !user.plan) {
        return NextResponse.json(
          { error: 'subscription_required', message: 'A subscription is required to publish your site.' },
          { status: 403 }
        )
      }
      if (user.subscriptionStatus === 'past_due' || user.subscriptionStatus === 'canceled') {
        return NextResponse.json(
          { error: 'subscription_inactive', message: 'Your subscription is inactive. Please update your payment method.' },
          { status: 403 }
        )
      }
    }

    if (!VALID_PALETTES.includes(content.palette)) {
      content.palette = 'dark-celestial'
    }

    // Get or create Cloudflare Web Analytics token
    let analyticsToken = existingSite?.cfAnalyticsToken ?? null
    if (!analyticsToken) {
      analyticsToken = await createWebAnalyticsSite(subdomain)
    }

    // Branding is shown by default — only hidden if user paid for removal
    const showBranding = !existingSite?.hideBranding

    // Build file map — multi-page generates multiple HTML files; single-page is just index.html
    let deployFiles: Map<string, string>
    if (content.pages && content.pages.length > 0) {
      deployFiles = generateMultiPageSite(content, subdomain, analyticsToken ?? undefined, showBranding)
    } else {
      const html = generateStaticSite(content, subdomain, analyticsToken ?? undefined, showBranding)
      deployFiles = new Map([['index.html', html]])
    }

    try {
      // Deploy via Cloudflare Pages Direct Upload API (no wrangler CLI needed)
      const { url: deploymentUrl } = await deploySite(deployFiles, subdomain)

      // Save to database
      await prisma.site.upsert({
        where: { subdomain },
        update: {
          content: content as any,
          palette: content.palette,
          cfDeploymentUrl: deploymentUrl,
          cfAnalyticsToken: analyticsToken,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        create: {
          userId: user.id,
          subdomain,
          content: content as any,
          palette: content.palette,
          cfDeploymentUrl: deploymentUrl,
          cfAnalyticsToken: analyticsToken,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })

      const customerDomain = process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN || 'craftmypage.com'
      const canonicalUrl = `https://${subdomain}.${customerDomain}`

      return NextResponse.json({
        url: canonicalUrl,
        cfDeploymentUrl: deploymentUrl,
        subdomain,
        projectUrl: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'craftmypage.com'}`,
      })
    } catch (deployError) {
      console.error('Cloudflare deploy failed:', deployError)
      return NextResponse.json({ error: 'Failed to deploy to Cloudflare' }, { status: 500 })
    }
  } catch (error) {
    console.error('Publish site error:', error)
    return NextResponse.json({ error: 'Failed to publish site' }, { status: 500 })
  }
}
