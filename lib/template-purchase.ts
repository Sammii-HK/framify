import JSZip from 'jszip'
import { auth0 } from '@/lib/auth0'
import { templateKitFiles } from '@/lib/template-kits.generated'

export type DownloadAccess =
  | { ok: true; email: string }
  | { ok: false; status: number; error: string }

function ownerEmails(): string[] {
  return (process.env.OWNER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Decide whether this request may download a paid product.
 *
 * Access is granted by a paid Stripe Checkout session for this exact product
 * (session_id comes back on the success URL), or to a signed-in owner so
 * Sammii can pull files for marketplace listings without buying them.
 */
export async function resolveDownloadAccess(sessionId: string | null, productId: string): Promise<DownloadAccess> {
  if (sessionId) {
    if (!sessionId.startsWith('cs_')) return { ok: false, status: 400, error: 'Invalid session' }
    try {
      const { stripe } = await import('@/lib/stripe')
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status !== 'paid') return { ok: false, status: 402, error: 'Payment not completed' }
      if (session.metadata?.productId !== productId) return { ok: false, status: 403, error: 'This purchase is for a different template' }
      const email = session.customer_details?.email || session.customer_email
      if (!email) return { ok: false, status: 400, error: 'No email on purchase' }
      return { ok: true, email }
    } catch {
      return { ok: false, status: 404, error: 'Purchase not found' }
    }
  }

  try {
    const session = await auth0.getSession()
    const email = session?.user?.email?.toLowerCase()
    if (email && ownerEmails().includes(email)) return { ok: true, email }
  } catch {
    // not signed in
  }

  return { ok: false, status: 402, error: 'Purchase required' }
}

/**
 * Invisible buyer watermark: zero-width characters after </html>.
 * U+200B = 0, U+200C = 1, U+200D = end of character.
 */
export function embedWatermark(html: string, buyerEmail: string): string {
  const encode = (char: string): string => {
    const byte = char.charCodeAt(0)
    let bits = ''
    for (let i = 7; i >= 0; i--) bits += (byte >> i) & 1 ? '‌' : '​'
    return bits + '‍'
  }
  const watermark = buyerEmail.split('').map(encode).join('')
  return html.replace(/<\/html>/i, `</html>${watermark}`)
}

/** Zip a finished kit from /template-kits, watermarking every HTML page. */
export async function buildKitZip(kit: string, buyerEmail: string | null): Promise<Buffer | null> {
  const files = templateKitFiles[kit]
  if (!files) return null
  const zip = new JSZip()
  const folder = zip.folder(kit)!
  for (const file of files) {
    const content = buyerEmail && file.path.endsWith('.html') ? embedWatermark(file.content, buyerEmail) : file.content
    folder.file(file.path, content)
  }
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}
