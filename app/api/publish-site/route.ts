import { NextRequest, NextResponse } from 'next/server'
import { generateStaticSite, generateMultiPageSite, VALID_PALETTES, type SiteContent } from '@/lib/site-generator'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { execFileSync } from 'child_process'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

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

    if (!VALID_PALETTES.includes(content.palette)) {
      content.palette = 'dark-celestial'
    }

    // Write to temp directory and deploy via Wrangler
    const deployDir = join('/tmp', `framify-deploy-${subdomain}-${Date.now()}`)
    mkdirSync(deployDir, { recursive: true })

    // Multi-page: generate all HTML files; single-page: just index.html
    if (content.pages && content.pages.length > 0) {
      const files = generateMultiPageSite(content, subdomain)
      for (const [filename, html] of files) {
        writeFileSync(join(deployDir, filename), html)
      }
    } else {
      const html = generateStaticSite(content, subdomain)
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
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
        create: {
          userId: user.id,
          subdomain,
          content: content as any,
          palette: content.palette,
          cfDeploymentUrl: deploymentUrl,
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
