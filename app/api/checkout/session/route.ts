import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// GET /api/checkout/session?id=cs_xxx
// Returns the buyer email from a completed Stripe checkout session.
// Used by the download page to get the buyer email for watermarking.
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id?.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const email = session.customer_details?.email || session.customer_email
    if (!email) {
      return NextResponse.json({ error: 'No email on session' }, { status: 400 })
    }

    return NextResponse.json({ email })
  } catch {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
}
