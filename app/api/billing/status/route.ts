import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { prisma } from '@/lib/prisma'
import { findOrCreateUser } from '@/lib/users'

export async function GET() {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await findOrCreateUser(session.user)

    // Fetch domain renewal info for user's sites with custom domains
    const sitesWithDomains = await prisma.site.findMany({
      where: {
        userId: user.id,
        customDomain: { not: null },
      },
      select: {
        id: true,
        customDomain: true,
        domainExpiresAt: true,
        domainRenewalStatus: true,
        domainAutoRenew: true,
      },
    })

    const domainRenewals = sitesWithDomains.map(site => ({
      siteId: site.id,
      domain: site.customDomain!,
      expiresAt: site.domainExpiresAt?.toISOString() || null,
      renewalStatus: site.domainRenewalStatus,
      autoRenew: site.domainAutoRenew,
    }))

    return NextResponse.json({
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      stripeSubscriptionId: user.stripeSubscriptionId,
      domainRenewals,
    })
  } catch (error) {
    console.error('Billing status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing status' },
      { status: 500 }
    )
  }
}
