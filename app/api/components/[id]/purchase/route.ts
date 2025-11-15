import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/components/[id]/purchase
 * Handle component purchase
 * TODO: Integrate with Stripe for payment processing
 */
export async function POST(
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

    // Get component
    const component = await prisma.component.findUnique({
      where: { id },
    })

    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    if (!component.isPublic) {
      return NextResponse.json(
        { error: 'Component is not available for purchase' },
        { status: 403 }
      )
    }

    // Check if component is free
    if (!component.price || component.price === 0) {
      // Free component - grant access immediately
      await prisma.component.update({
        where: { id },
        data: {
          downloadCount: { increment: 1 },
        },
      })

      return NextResponse.json({
        success: true,
        component: {
          id: component.id,
          code: component.code,
        },
        message: 'Component downloaded successfully',
      })
    }

    // Paid component - TODO: Integrate Stripe
    // For now, return payment required
    return NextResponse.json(
      {
        error: 'Payment processing not yet implemented',
        message: 'Stripe integration required for paid components',
        componentId: component.id,
        price: component.price,
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error processing purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}

