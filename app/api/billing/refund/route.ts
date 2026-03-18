import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { findOrCreateUser } from '@/lib/users'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const REFUND_WINDOW_DAYS = 30

export async function POST() {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    if (!user.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Retrieve the subscription to check its creation date
    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    )

    const createdAt = new Date(subscription.created * 1000)
    const now = new Date()
    const daysSinceCreation = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceCreation > REFUND_WINDOW_DAYS) {
      return NextResponse.json(
        {
          error: 'Past the 30-day money-back guarantee window',
          subscribedDaysAgo: daysSinceCreation,
          refundWindowDays: REFUND_WINDOW_DAYS,
        },
        { status: 400 }
      )
    }

    // Get the latest invoice to find the payment intent to refund
    const invoices = await stripe.invoices.list({
      subscription: user.stripeSubscriptionId,
      limit: 1,
      status: 'paid',
    })

    const latestInvoice = invoices.data[0]
    if (!latestInvoice) {
      return NextResponse.json(
        { error: 'No paid invoice found for this subscription' },
        { status: 400 }
      )
    }

    // Extract the payment intent from the invoice
    const defaultPayment = latestInvoice.payments?.data?.find(
      (p) => p.is_default
    )
    const piRef = defaultPayment?.payment?.payment_intent
    const paymentIntentId =
      typeof piRef === 'string' ? piRef : piRef?.id ?? null

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'No payment intent found on invoice — contact support' },
        { status: 400 }
      )
    }

    // Issue the refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    })

    console.log(
      `[Refund] Issued refund ${refund.id} for user ${user.id}, ` +
        `payment_intent ${paymentIntentId}, subscription ${user.stripeSubscriptionId}`
    )

    // Cancel the subscription immediately (don't wait for period end)
    await stripe.subscriptions.cancel(user.stripeSubscriptionId)

    console.log(
      `[Refund] Cancelled subscription ${user.stripeSubscriptionId} for user ${user.id}`
    )

    // Downgrade user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'free',
        subscriptionStatus: 'canceled',
        stripeSubscriptionId: null,
      },
    })

    // Suspend their paid sites
    await prisma.site.updateMany({
      where: {
        userId: user.id,
        tier: { in: ['starter', 'pro'] },
      },
      data: {
        status: 'SUSPENDED',
        tier: 'free',
      },
    })

    // Mark related orders as refunded
    await prisma.order.updateMany({
      where: {
        userId: user.id,
        stripeInvoiceId: latestInvoice.id,
        status: 'PAID',
      },
      data: { status: 'REFUNDED' },
    })

    console.log(
      `[Refund] User ${user.id} downgraded to free, sites suspended`
    )

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      message:
        'Your subscription has been refunded and cancelled. Your sites have been moved to the free tier.',
    })
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
