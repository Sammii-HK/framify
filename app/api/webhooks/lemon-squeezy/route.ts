import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

// This webhook exists solely to log orders for analytics.
// Delivery is handled entirely by Lemon Squeezy's built-in redirect URL:
//   https://craftmypage.com/api/template/{templateId}/download?buyer={email}
// LS substitutes {email} and {templateId} via its custom redirect URL template.
// No email infrastructure needed.

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('x-signature') ?? ''

  if (!verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(payload)
  const eventName = event.meta?.event_name

  if (eventName === 'order_created') {
    const order = event.data?.attributes
    console.log('[LS] New template sale', {
      buyer: order?.user_email,
      product: order?.first_order_item?.product_name,
      total: order?.total_formatted,
    })
  }

  return NextResponse.json({ received: true })
}
