import { NextRequest, NextResponse } from 'next/server'
import { generateStaticSite, generateMultiPageSite, VALID_PALETTES, type SiteContent } from '@/lib/site-generator'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'
import { createWebAnalyticsSite } from '@/lib/cloudflare'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { join } from 'path'

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

    // Write to temp directory and deploy via Wrangler
    const deployDir = join('/tmp', `framify-deploy-${subdomain}-${Date.now()}`)
    mkdirSync(deployDir, { recursive: true })

    // Branding is shown by default — only hidden if user paid for removal
    const showBranding = !existingSite?.hideBranding

    // Multi-page: generate all HTML files; single-page: just index.html
    if (content.pages && content.pages.length > 0) {
      const files = generateMultiPageSite(content, subdomain, analyticsToken ?? undefined, showBranding)
      for (const [filename, html] of files) {
        writeFileSync(join(deployDir, filename), html)
      }
    } else {
      const html = generateStaticSite(content, subdomain, analyticsToken ?? undefined, showBranding)
      writeFileSync(join(deployDir, 'index.html'), html)
    }

    const projectName = process.env.CLOUDFLARE_PAGES_PROJECT || 'framify-sites'

    try {
      const result = execFileSync(
        'wrangler',
        ['pages', 'deploy', deployDir, '--project-name', projectName, '--commit-dirty=true'],
        { encoding: 'utf-8', timeout: 30000 }
      )

      // Extract deployment URL from wrangler output
      const urlMatch = result.match(/https:\/\/[^\s]+\.pages\.dev/)
      const deploymentUrl = urlMatch ? urlMatch[0] : null

      // Clean up temp directory
      rmSync(deployDir, { recursive: true, force: true })

      if (!deploymentUrl) {
        return NextResponse.json({ error: 'Deploy succeeded but could not extract URL' }, { status: 500 })
      }

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

      return NextResponse.json({
        url: deploymentUrl,
        subdomain,
        projectUrl: `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'craftmypage.com'}`,
      })
    } catch (deployError) {
      rmSync(deployDir, { recursive: true, force: true })
      console.error('Wrangler deploy failed:', deployError)
      return NextResponse.json({ error: 'Failed to deploy to Cloudflare' }, { status: 500 })
    }
  } catch (error) {
    console.error('Publish site error:', error)
    return NextResponse.json({ error: 'Failed to publish site' }, { status: 500 })
  }
}
