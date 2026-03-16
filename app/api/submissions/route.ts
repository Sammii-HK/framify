import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'

/**
 * GET /api/submissions?siteId=xxx
 *
 * Returns form submissions for the authenticated user's sites.
 * Optionally filtered by siteId.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await findOrCreateUser(session.user)
    const siteId = req.nextUrl.searchParams.get('siteId')

    // Build the where clause: always scope to the user's sites
    const where: Record<string, unknown> = {
      site: { userId: user.id },
    }
    if (siteId) {
      where.siteId = siteId
    }

    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        site: {
          select: { subdomain: true },
        },
      },
      take: 100,
    })

    // Count unread
    const unreadCount = await prisma.formSubmission.count({
      where: { ...where, read: false },
    })

    return NextResponse.json({ submissions, unreadCount })
  } catch (error) {
    console.error('List submissions error:', error)
    return NextResponse.json(
      { error: 'Failed to load submissions' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/submissions
 *
 * Mark a submission as read/unread.
 * Body: { id: string, read: boolean }
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await findOrCreateUser(session.user)
    const body = await req.json()
    const { id, read } = body

    if (!id || typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'id and read (boolean) are required' },
        { status: 400 }
      )
    }

    // Verify the submission belongs to one of the user's sites
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: { site: { select: { userId: true } } },
    })

    if (!submission || submission.site.userId !== user.id) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.formSubmission.update({
      where: { id },
      data: { read },
    })

    return NextResponse.json({ submission: updated })
  } catch (error) {
    console.error('Update submission error:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
