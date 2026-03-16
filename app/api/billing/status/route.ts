import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { findOrCreateUser } from '@/lib/users'

export async function GET() {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    return NextResponse.json({
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      stripeSubscriptionId: user.stripeSubscriptionId,
    })
  } catch (error) {
    console.error('Billing status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing status' },
      { status: 500 }
    )
  }
}
