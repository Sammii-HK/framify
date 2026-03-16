import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { findOrCreateUser } from '@/lib/users'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST() {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    const appUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
    const portalSession = await createBillingPortalSession(
      user.stripeCustomerId,
      `${appUrl}/dashboard`
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}
