import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession } from '@/lib/stripe'

/**
 * POST /api/components/[id]/purchase
 * Handle component purchase via Stripe Checkout
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

    // Free component — grant access immediately
    if (!component.price || component.price === 0) {
      await prisma.component.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      })

      return NextResponse.json({
        success: true,
        component: { id: component.id, code: component.code },
        message: 'Component downloaded successfully',
      })
    }

    // Paid component — create Stripe Checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const checkoutSession = await createCheckoutSession({
      productName: component.name || 'CraftMyPage Component',
      productId: component.id,
      productType: 'component',
      priceInCents: Math.round(component.price * 100),
      customerEmail: session.user.email || undefined,
      successUrl: `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/marketplace`,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Error processing purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}

