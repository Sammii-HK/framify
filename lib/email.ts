const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_ADDRESS = process.env.EMAIL_FROM || 'CraftMyPage <hello@craftmypage.com>'

/**
 * Send a transactional email via Resend. Logs and no-ops if RESEND_API_KEY isn't
 * configured yet, so callers (webhooks, crons) never need to branch on whether
 * email sending is set up — same pattern as the existing domain-renewal TODO.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ sent: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.log(`[Email] RESEND_API_KEY not set — would have sent "${subject}" to ${to}`)
    return { sent: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const error = body?.message || `HTTP ${res.status}`
      console.error(`[Email] Send failed to ${to}: ${error}`)
      return { sent: false, error }
    }

    return { sent: true }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error(`[Email] Send error to ${to}: ${error}`)
    return { sent: false, error }
  }
}

/**
 * Follow-up sent right after a gallery template purchase — the download page
 * shows the same "deploy it for me" CTA, this just reaches people who close
 * the tab before clicking it.
 */
export async function sendGalleryPurchaseNurture({
  to,
  templateType,
  templateName,
}: {
  to: string
  templateType: string
  templateName: string
}): Promise<{ sent: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'
  const deployUrl = `${appUrl}/generate?template=${templateType}`

  return sendEmail({
    to,
    subject: `Your ${templateName} template is ready`,
    html: `
      <p>Thanks for buying the ${templateName} template.</p>
      <p>If you'd rather not deal with hosting, DNS, and SSL yourself, we can put it live on a working website in a few minutes — free subdomain to start, your own domain if you want one.</p>
      <p><a href="${deployUrl}">Deploy it for me →</a></p>
      <p>If you're all set with your own hosting, no action needed — just replying with any questions works too.</p>
    `,
  })
}
