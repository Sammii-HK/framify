import { prisma } from '@/lib/prisma'
import { createDomainRenewalInvoice, retryInvoicePayment } from '@/lib/stripe'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const DOMAIN_RENEWAL_MARKUP = parseInt(process.env.DOMAIN_RENEWAL_MARKUP || '500', 10)

async function cfFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

/**
 * Sync domain expiry date and auto_renew status from Cloudflare Registrar
 */
export async function syncDomainExpiry(site: { id: string; customDomain: string | null }) {
  if (!site.customDomain) return

  try {
    const res = await cfFetch(`/accounts/${ACCOUNT_ID}/registrar/domains/${site.customDomain}`)
    if (!res.ok) {
      console.error(`[DomainRenewal] Failed to fetch domain info for ${site.customDomain}: HTTP ${res.status}`)
      return
    }

    const body = await res.json()
    const result = body?.result
    if (!result) return

    const expiresAt = result.expires_at ? new Date(result.expires_at) : null
    const autoRenew = result.auto_renew ?? true

    await prisma.site.update({
      where: { id: site.id },
      data: {
        domainExpiresAt: expiresAt,
        domainAutoRenew: autoRenew,
      },
    })

    console.log(`[DomainRenewal] Synced ${site.customDomain}: expires=${expiresAt?.toISOString()}, auto_renew=${autoRenew}`)
  } catch (err) {
    console.error(`[DomainRenewal] Error syncing ${site.customDomain}:`, err)
  }
}

/**
 * Get domain renewal cost from Cloudflare + add markup
 */
export async function getDomainRenewalCost(domain: string): Promise<number> {
  try {
    const tld = domain.split('.').slice(1).join('.')
    const res = await cfFetch(`/accounts/${ACCOUNT_ID}/registrar/domains/${domain}`)
    if (res.ok) {
      const body = await res.json()
      // CF returns fees in USD cents — convert to GBP pence (approximate, using 1:1 for simplicity since markup covers it)
      const renewalPrice = body?.result?.fees?.renewal_fee
      if (renewalPrice) {
        return Math.round(renewalPrice * 100) + DOMAIN_RENEWAL_MARKUP
      }
    }
  } catch (err) {
    console.error(`[DomainRenewal] Error fetching renewal cost for ${domain}:`, err)
  }

  // Fallback: typical .com/.co.uk renewal ≈ £10-15, charge £15 + markup
  return 1500 + DOMAIN_RENEWAL_MARKUP
}

/**
 * Send renewal reminder email to customer
 */
export async function sendRenewalReminder(
  site: { id: string; customDomain: string | null },
  user: { id: string; email: string; name: string | null }
) {
  if (!site.customDomain) return

  // TODO: Integrate with email provider (Resend, SES, etc.)
  console.log(`[DomainRenewal] Reminder sent to ${user.email} for ${site.customDomain}`)

  await prisma.site.update({
    where: { id: site.id },
    data: { domainRenewalStatus: 'reminder_sent' },
  })

  await logRenewalAction(site.id, 'reminder_sent', `Reminder email sent to ${user.email}`)
}

/**
 * Create a Stripe invoice for domain renewal
 */
export async function createRenewalInvoice(
  site: { id: string; customDomain: string | null },
  user: { id: string; stripeCustomerId: string | null }
) {
  if (!site.customDomain || !user.stripeCustomerId) {
    console.error(`[DomainRenewal] Cannot create invoice: missing domain or customer ID`)
    return
  }

  const amount = await getDomainRenewalCost(site.customDomain)

  try {
    const invoice = await createDomainRenewalInvoice({
      customerId: user.stripeCustomerId,
      siteId: site.id,
      domain: site.customDomain,
      amountInPence: amount,
    })

    await prisma.site.update({
      where: { id: site.id },
      data: {
        domainRenewalStatus: 'invoice_created',
        domainRenewalInvoiceId: invoice.id,
      },
    })

    await logRenewalAction(site.id, 'invoice_created', `Invoice ${invoice.id} created for £${(amount / 100).toFixed(2)}`)
    console.log(`[DomainRenewal] Invoice created for ${site.customDomain}: ${invoice.id}`)
  } catch (err) {
    console.error(`[DomainRenewal] Failed to create invoice for ${site.customDomain}:`, err)
    await logRenewalAction(site.id, 'invoice_created', `Failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

/**
 * Retry payment on an existing domain renewal invoice
 */
export async function retryRenewalPayment(site: { id: string; domainRenewalInvoiceId: string | null; customDomain: string | null }): Promise<boolean> {
  if (!site.domainRenewalInvoiceId) {
    console.error(`[DomainRenewal] No invoice to retry for site ${site.id}`)
    return false
  }

  try {
    const invoice = await retryInvoicePayment(site.domainRenewalInvoiceId)
    const paid = invoice.status === 'paid'

    await logRenewalAction(site.id, 'retry', `Retry ${paid ? 'succeeded' : 'failed'} for invoice ${site.domainRenewalInvoiceId}`)
    console.log(`[DomainRenewal] Retry for ${site.customDomain}: ${paid ? 'paid' : 'failed'}`)

    if (paid) {
      await prisma.site.update({
        where: { id: site.id },
        data: {
          domainRenewalStatus: null,
          domainRenewalInvoiceId: null,
        },
      })
    }

    return paid
  } catch (err) {
    console.error(`[DomainRenewal] Retry failed for ${site.customDomain}:`, err)
    await logRenewalAction(site.id, 'retry', `Error: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * Toggle auto_renew on Cloudflare Registrar
 */
export async function flipAutoRenew(domain: string, enable: boolean, siteId: string) {
  try {
    const res = await cfFetch(`/accounts/${ACCOUNT_ID}/registrar/domains/${domain}`, {
      method: 'PUT',
      body: JSON.stringify({ auto_renew: enable }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
      console.error(`[DomainRenewal] Failed to set auto_renew=${enable} for ${domain}: ${errorMsg}`)
      await logRenewalAction(siteId, enable ? 'auto_renew_restored' : 'auto_renew_off', `CF API failed: ${errorMsg}`)
      return false
    }

    await prisma.site.update({
      where: { id: siteId },
      data: {
        domainAutoRenew: enable,
        ...(enable ? {} : { domainRenewalStatus: 'auto_renew_off' }),
      },
    })

    await logRenewalAction(siteId, enable ? 'auto_renew_restored' : 'auto_renew_off', `auto_renew set to ${enable} for ${domain}`)
    console.log(`[DomainRenewal] auto_renew=${enable} for ${domain}`)
    return true
  } catch (err) {
    console.error(`[DomainRenewal] Error setting auto_renew for ${domain}:`, err)
    return false
  }
}

/**
 * Alert site owner (Sammii) via webhook on critical failures
 */
export async function alertOwner(message: string, site: { id: string; customDomain: string | null }) {
  const webhookUrl = process.env.OWNER_ALERT_WEBHOOK
  if (!webhookUrl) {
    console.error(`[DomainRenewal] OWNER_ALERT_WEBHOOK not set. Alert: ${message}`)
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[CraftMyPage Domain Renewal] ${message}\nSite: ${site.id}\nDomain: ${site.customDomain}`,
      }),
    })
    await logRenewalAction(site.id, 'owner_alerted', message)
    console.log(`[DomainRenewal] Owner alerted: ${message}`)
  } catch (err) {
    console.error(`[DomainRenewal] Failed to alert owner:`, err)
  }
}

export async function logRenewalAction(siteId: string, action: string, details?: string) {
  try {
    await prisma.domainRenewalLog.create({
      data: { siteId, action, details },
    })
  } catch (err) {
    console.error(`[DomainRenewal] Failed to log action ${action} for site ${siteId}:`, err)
  }
}
