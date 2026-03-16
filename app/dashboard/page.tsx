'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CustomDomainSetup from '@/components/CustomDomainSetup'

interface BillingInfo {
  plan: string
  subscriptionStatus: string | null
  subscriptionCurrentPeriodEnd: string | null
}

interface SiteRecord {
  id: string
  subdomain: string
  customDomain: string | null
  content: {
    businessName: string
    tagline: string
    description: string
    palette: string
    services: { title: string; description: string; price: string; duration: string }[]
    testimonials: { quote: string; name: string; role: string }[]
    contact: { email: string; phone: string; location: string }
    social: { instagram: string; facebook: string; twitter: string }
  }
  palette: string
  cfDeploymentUrl: string | null
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

const paletteLabels: Record<string, string> = {
  'dark-celestial': 'Dark Celestial',
  'earthy-sage': 'Earthy Sage',
  'ethereal-light': 'Ethereal Light',
  'crystal-rose': 'Crystal Rose',
  'steel-blue': 'Steel Blue',
  'warm-amber': 'Warm Amber',
}

const paletteGradients: Record<string, string> = {
  'dark-celestial': 'linear-gradient(135deg, #0D0B1A 0%, #1E1A42 50%, #C4A265 100%)',
  'earthy-sage': 'linear-gradient(135deg, #1A1F1A 0%, #2C3E2D 50%, #8B9E7C 100%)',
  'ethereal-light': 'linear-gradient(135deg, #9B72CF 0%, #C9A8E8 50%, #F8F6FC 100%)',
  'crystal-rose': 'linear-gradient(135deg, #1A1517 0%, #3A2830 50%, #C4868B 100%)',
  'steel-blue': 'linear-gradient(135deg, #0F1923 0%, #1A2735 50%, #4A90D9 100%)',
  'warm-amber': 'linear-gradient(135deg, #1F1710 0%, #2A2018 50%, #D4943A 100%)',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(iso)
}

export default function DashboardPage() {
  const router = useRouter()
  const [sites, setSites] = useState<SiteRecord[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [domainSetupSiteId, setDomainSetupSiteId] = useState<string | null>(null)
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)

  useEffect(() => {
    async function loadSites() {
      try {
        const res = await fetch('/api/sites')
        if (res.status === 401) {
          window.location.href = '/auth/login?returnTo=/dashboard'
          return
        }
        if (!res.ok) throw new Error('Failed to load sites')
        const data = await res.json()
        setSites(data.sites || [])
      } catch {
        setError('Could not load your sites. Please try again.')
      }
      setLoaded(true)
    }

    async function loadBilling() {
      try {
        const res = await fetch('/api/billing/status')
        if (res.ok) {
          const data = await res.json()
          setBilling(data)
        }
      } catch {
        // Billing info is non-critical, fail silently
      }
    }

    loadSites()
    loadBilling()
  }, [])

  function handleEdit(site: SiteRecord) {
    localStorage.setItem('craftmypage_edit_site', JSON.stringify(site))
    router.push(`/generate?edit=${site.id}`)
  }

  async function handleManageBilling() {
    setBillingLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        window.location.href = data.url
      }
    } catch {
      setError('Could not open billing portal. Please try again.')
    }
    setBillingLoading(false)
  }

  async function handleCancelPlan() {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your plan? You will lose access to paid features at the end of your current billing period.'
    )
    if (!confirmed) return
    setBillingLoading(true)
    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setBilling(data)
      } else {
        setError('Could not cancel your plan. Please try again.')
      }
    } catch {
      setError('Could not cancel your plan. Please try again.')
    }
    setBillingLoading(false)
  }

  const isPaidPlan = billing && billing.plan !== 'free'
  const renewalDate = billing?.subscriptionCurrentPeriodEnd
    ? formatDate(billing.subscriptionCurrentPeriodEnd)
    : null

  const publishedCount = sites.filter(s => s.status === 'PUBLISHED').length
  const latestUpdate = sites.length > 0
    ? sites.reduce((latest, s) => {
        const sDate = new Date(s.updatedAt)
        return sDate > new Date(latest.updatedAt) ? s : latest
      })
    : null
  const customerDomain = process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN || 'craftmypage.com'

  // Loading state
  if (!loaded) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">Loading your sites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Welcome back
              </h1>
              {billing && (
                billing.plan === 'pro' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                    Pro
                  </span>
                ) : billing.plan === 'launch' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-100">
                    Launch
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-neutral-600 bg-neutral-200">
                    Free
                  </span>
                )
              )}
            </div>
            <p className="text-neutral-500 mt-1">
              Manage your CraftMyPage sites
            </p>
          </div>
          <Link
            href="/generate"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create new site
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats row — only if sites exist */}
        {sites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Total sites</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{sites.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Published</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{publishedCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Latest update</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {latestUpdate ? formatRelativeDate(latestUpdate.updatedAt) : '--'}
              </p>
            </div>
          </div>
        )}

        {/* Billing section — paid users */}
        {isPaidPlan && billing && (
          <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-neutral-900">
                    Your Plan: <span className="font-semibold capitalize">{billing.plan}</span>
                    {billing.subscriptionStatus && (
                      <span className={`ml-2 text-xs font-medium ${
                        billing.subscriptionStatus === 'active' ? 'text-green-600' :
                        billing.subscriptionStatus === 'past_due' ? 'text-amber-600' :
                        billing.subscriptionStatus === 'canceled' ? 'text-red-600' :
                        'text-neutral-500'
                      }`}>
                        ({billing.subscriptionStatus === 'active' ? 'Active' :
                          billing.subscriptionStatus === 'past_due' ? 'Past due' :
                          billing.subscriptionStatus === 'canceled' ? 'Cancelled' :
                          billing.subscriptionStatus})
                      </span>
                    )}
                  </p>
                </div>
                {billing.subscriptionStatus === 'past_due' && (
                  <p className="text-sm text-amber-600 font-medium">
                    Payment failed — please update your payment method
                  </p>
                )}
                {billing.subscriptionStatus === 'canceled' && renewalDate && (
                  <p className="text-sm text-red-600">
                    Your plan will end on {renewalDate}
                  </p>
                )}
                {billing.subscriptionStatus === 'active' && renewalDate && (
                  <p className="text-sm text-neutral-500">
                    Renews: {renewalDate}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleManageBilling}
                  disabled={billingLoading}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
                >
                  Manage Billing
                </button>
                {billing.subscriptionStatus !== 'canceled' && (
                  <button
                    onClick={handleCancelPlan}
                    disabled={billingLoading}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Cancel Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade prompt — free users with sites */}
        {billing && billing.plan === 'free' && sites.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-neutral-700">
                Upgrade to Pro for custom domains, analytics, and priority support — <span className="font-semibold">£29/year</span>
              </p>
              <Link
                href="/api/checkout?tier=pro"
                className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {sites.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-neutral-200 px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Create your first site
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
              Build a professional website for your business in minutes. Choose a design, add your details, and publish it live with your own subdomain.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Get started
            </Link>
          </div>
        )}

        {/* Site cards */}
        {sites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map(site => {
              const isPublished = site.status === 'PUBLISHED'
              const siteUrl = `${site.subdomain}.${customerDomain}`
              const gradient = paletteGradients[site.palette] || 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'

              return (
                <div
                  key={site.id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all"
                >
                  {/* Colour bar */}
                  <div
                    className="h-2"
                    style={{ background: gradient }}
                  />

                  <div className="p-5">
                    {/* Top row: name + status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 truncate">
                        {site.content.businessName || 'Untitled site'}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          isPublished
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPublished ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                        />
                        {isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    {/* URL */}
                    {isPublished ? (
                      <a
                        href={`https://${siteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block mb-3"
                      >
                        {siteUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-neutral-400 truncate mb-3">
                        {siteUrl}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mb-4">
                      <span>{paletteLabels[site.palette] || site.palette}</span>
                      {site.publishedAt && (
                        <>
                          <span className="text-neutral-300">|</span>
                          <span>Published {formatDate(site.publishedAt)}</span>
                        </>
                      )}
                    </div>

                    {/* Custom domain badge */}
                    {site.customDomain && (
                      <div className="flex items-center gap-1.5 mb-4 text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{site.customDomain}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(site)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        Edit
                      </button>
                      {!site.customDomain && (
                        <button
                          onClick={() => setDomainSetupSiteId(domainSetupSiteId === site.id ? null : site.id)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                          Add domain
                        </button>
                      )}
                      {site.cfDeploymentUrl && (
                        <a
                          href={site.cfDeploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View site
                        </a>
                      )}
                    </div>

                    {/* Inline domain setup */}
                    {domainSetupSiteId === site.id && (
                      <CustomDomainSetup
                        siteId={site.id}
                        onConnected={(newDomain) => {
                          setSites(prev =>
                            prev.map(s =>
                              s.id === site.id ? { ...s, customDomain: newDomain } : s
                            )
                          )
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
