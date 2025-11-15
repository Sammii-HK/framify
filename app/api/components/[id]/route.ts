import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/components/[id]
 * Get component details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            style: true,
          },
        },
      },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.component.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(component)
  } catch (error) {
    console.error('Error fetching component:', error)
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/components/[id]
 * Update component
 */
export async function PATCH(
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

    const { id } = await params
    const userId = session.user.sub

    // Check ownership
    const component = await prisma.component.findUnique({
      where: { id },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    if (component.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const updated = await prisma.component.update({
      where: { id },
      data: {
        ...body,
        marketplaceReady: !!(body.name || component.name) && 
                         !!(body.description || component.description) && 
                         !!(body.code || component.code) && 
                         !!(body.componentType || component.componentType),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating component:', error)
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/components/[id]
 * Delete component
 */
export async function DELETE(
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

    const { id } = await params
    const userId = session.user.sub

    // Check ownership
    const component = await prisma.component.findUnique({
      where: { id },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    if (component.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.component.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting component:', error)
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}

