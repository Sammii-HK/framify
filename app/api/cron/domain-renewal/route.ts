import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  syncDomainExpiry,
  sendRenewalReminder,
  createRenewalInvoice,
  retryRenewalPayment,
  flipAutoRenew,
  alertOwner,
} from '@/lib/domain-renewal'

/**
 * GET /api/cron/domain-renewal
 * Daily cron job (06:00 UTC) for domain renewal management.
 * Secured with CRON_SECRET header.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const results = {
    synced: 0,
    reminders: 0,
    invoices: 0,
    retries: 0,
    killSwitches: 0,
    downgraded: 0,
    errors: [] as string[],
  }

  try {
    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

    // ── Step 1: Sync expiry dates for all sites with custom domains ──
    const sitesWithDomains = await prisma.site.findMany({
      where: { customDomain: { not: null } },
      select: { id: true, customDomain: true },
    })

    for (const site of sitesWithDomains) {
      try {
        await syncDomainExpiry(site)
        results.synced++
      } catch (err) {
        results.errors.push(`Sync failed for ${site.customDomain}: ${err}`)
      }
    }

    // ── Step 2: 30-day reminders ──
    const sitesForReminder = await prisma.site.findMany({
      where: {
        customDomain: { not: null },
        domainExpiresAt: { lte: in30Days, gt: now },
        domainRenewalStatus: null,
        user: { plan: 'pro' },
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    })

    for (const site of sitesForReminder) {
      try {
        await sendRenewalReminder(site, site.user)
        results.reminders++
      } catch (err) {
        results.errors.push(`Reminder failed for ${site.customDomain}: ${err}`)
      }
    }

    // ── Step 3: 7-day invoices ──
    const sitesForInvoice = await prisma.site.findMany({
      where: {
        customDomain: { not: null },
        domainExpiresAt: { lte: in7Days, gt: now },
        OR: [
          { domainRenewalStatus: null },
          { domainRenewalStatus: 'reminder_sent' },
        ],
        domainRenewalInvoiceId: null,
        user: { plan: 'pro' },
      },
      include: { user: { select: { id: true, stripeCustomerId: true } } },
    })

    for (const site of sitesForInvoice) {
      try {
        await createRenewalInvoice(site, site.user)
        results.invoices++
      } catch (err) {
        results.errors.push(`Invoice failed for ${site.customDomain}: ${err}`)
      }
    }

    // ── Step 4: 2-day retry + kill switch ──
    const sitesForRetry = await prisma.site.findMany({
      where: {
        customDomain: { not: null },
        domainExpiresAt: { lte: in2Days, gt: now },
        domainRenewalStatus: { in: ['retry_pending', 'invoice_created'] },
        user: { plan: 'pro' },
      },
      select: {
        id: true,
        customDomain: true,
        domainRenewalInvoiceId: true,
        domainRenewalStatus: true,
      },
    })

    for (const site of sitesForRetry) {
      try {
        const paid = await retryRenewalPayment(site)
        if (paid) {
          results.retries++
        } else {
          // Kill switch: flip auto_renew off
          if (site.customDomain) {
            await flipAutoRenew(site.customDomain, false, site.id)
            await alertOwner(
              `Domain renewal failed for ${site.customDomain}. auto_renew has been turned off. Domain expires soon.`,
              site
            )
            results.killSwitches++
          }
        }
      } catch (err) {
        results.errors.push(`Retry failed for ${site.customDomain}: ${err}`)
        // Still flip auto_renew off on error
        if (site.customDomain) {
          try {
            await flipAutoRenew(site.customDomain, false, site.id)
            await alertOwner(
              `Domain renewal retry errored for ${site.customDomain}. auto_renew turned off. Error: ${err}`,
              site
            )
            results.killSwitches++
          } catch {
            // Last resort logging
          }
        }
      }
    }

    // ── Step 5: Downgraded users — flip auto_renew off for non-Pro with custom domains ──
    const downgradeTargets = await prisma.site.findMany({
      where: {
        customDomain: { not: null },
        domainAutoRenew: true,
        user: { plan: { notIn: ['pro'] } },
        // Exclude grandfathered users (starter with no subscription = legacy launch)
        NOT: {
          user: {
            plan: 'starter',
            stripeSubscriptionId: null,
          },
        },
      },
      select: { id: true, customDomain: true },
    })

    for (const site of downgradeTargets) {
      if (site.customDomain) {
        try {
          await flipAutoRenew(site.customDomain, false, site.id)
          results.downgraded++
        } catch (err) {
          results.errors.push(`Downgrade flip failed for ${site.customDomain}: ${err}`)
        }
      }
    }

    // ── Step 6: Re-enable auto_renew for Pro users who re-subscribed ──
    const resubscribed = await prisma.site.findMany({
      where: {
        customDomain: { not: null },
        domainAutoRenew: false,
        domainRenewalStatus: 'auto_renew_off',
        user: { plan: 'pro', subscriptionStatus: 'active' },
      },
      select: { id: true, customDomain: true },
    })

    for (const site of resubscribed) {
      if (site.customDomain) {
        try {
          await flipAutoRenew(site.customDomain, true, site.id)
          await prisma.site.update({
            where: { id: site.id },
            data: { domainRenewalStatus: null },
          })
        } catch (err) {
          results.errors.push(`Re-enable failed for ${site.customDomain}: ${err}`)
        }
      }
    }

    console.log('[DomainRenewal Cron] Results:', JSON.stringify(results))

    return NextResponse.json({
      ok: true,
      results,
    })
  } catch (error) {
    console.error('[DomainRenewal Cron] Fatal error:', error)
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    )
  }
}
