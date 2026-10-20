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
 * Sent right after a gallery template purchase. Always includes a link back to
 * the download (people close the tab), plus the hosted "deploy it for me" offer
 * for templates the site builder can actually deploy.
 */
export async function sendGalleryPurchaseNurture({
  to,
  templateType,
  templateName,
  sessionId,
  canDeploy = true,
}: {
  to: string
  templateType: string
  templateName: string
  sessionId?: string
  canDeploy?: boolean
}): Promise<{ sent: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'
  const deployUrl = `${appUrl}/generate?template=${templateType}`
  const downloadUrl = sessionId ? `${appUrl}/download?template=${templateType}&session_id=${sessionId}` : null

  return sendEmail({
    to,
    subject: `Your ${templateName} is ready to download`,
    html: `
      <p>Thanks for buying ${templateName}.</p>
      ${downloadUrl ? `<p><a href="${downloadUrl}">Download your template</a>. Keep this email: the link works whenever you need the files again.</p>` : ''}
      <p>Start with README.md in the zip. It walks you through editing, connecting the form and publishing for free.</p>
      ${canDeploy ? `<p>Rather not deal with hosting, DNS and SSL yourself? We can put it live for you in a few minutes. <a href="${deployUrl}">Deploy it for me</a>.</p>` : ''}
      <p>Questions or a bug? Just reply to this email.</p>
    `,
  })
}
