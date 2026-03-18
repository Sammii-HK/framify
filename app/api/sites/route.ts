import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'

/**
 * GET /api/sites — list the authenticated user's sites
 */
export async function GET() {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    const sites = await prisma.site.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        subdomain: true,
        customDomain: true,
        content: true,
        palette: true,
        cfDeploymentUrl: true,
        hideBranding: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error('List sites error:', error)
    return NextResponse.json({ error: 'Failed to load sites' }, { status: 500 })
  }
}

/**
 * POST /api/sites — save a new site for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)
    const body = await req.json()

    const { subdomain, content, palette, cfDeploymentUrl } = body

    if (!subdomain || !/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 400 })
    }

    // Check subdomain isn't taken by another user
    const existing = await prisma.site.findUnique({ where: { subdomain } })
    if (existing && existing.userId !== user.id) {
      return NextResponse.json({ error: 'Subdomain already taken' }, { status: 409 })
    }

    // Upsert — update if the user already owns this subdomain, create otherwise
    const site = await prisma.site.upsert({
      where: { subdomain },
      update: {
        content,
        palette: palette || 'dark-celestial',
        cfDeploymentUrl,
        status: cfDeploymentUrl ? 'PUBLISHED' : 'DRAFT',
        publishedAt: cfDeploymentUrl ? new Date() : undefined,
      },
      create: {
        userId: user.id,
        subdomain,
        content,
        palette: palette || 'dark-celestial',
        cfDeploymentUrl,
        status: cfDeploymentUrl ? 'PUBLISHED' : 'DRAFT',
        publishedAt: cfDeploymentUrl ? new Date() : undefined,
      },
    })

    return NextResponse.json({ site })
  } catch (error) {
    console.error('Save site error:', error)
    return NextResponse.json({ error: 'Failed to save site' }, { status: 500 })
  }
}
