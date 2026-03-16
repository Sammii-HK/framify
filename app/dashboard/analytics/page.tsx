'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface SiteAnalytics {
  siteId: string
  subdomain: string
  businessName: string
  customDomain: string | null
  pageViews: number
  formSubmissions: number
  publishedAt: string | null
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const selectedSiteId = searchParams.get('site')
  const [analytics, setAnalytics] = useState<SiteAnalytics[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/sites')
        if (res.status === 401) {
          window.location.href = '/auth/login?returnTo=/dashboard/analytics'
          return
        }
        if (!res.ok) throw new Error('Failed to load sites')
        const data = await res.json()
        const sites = data.sites || []

        const analyticsData: SiteAnalytics[] = []
        for (const site of sites) {
          if (site.status !== 'PUBLISHED') continue
          try {
            const analyticsRes = await fetch(`/api/sites/${site.id}/analytics`)
            if (analyticsRes.ok) {
              const siteAnalytics = await analyticsRes.json()
              analyticsData.push({
                siteId: site.id,
                subdomain: site.subdomain,
                businessName: site.content?.businessName || site.subdomain,
                customDomain: site.customDomain,
                pageViews: siteAnalytics.pageViews ?? 0,
                formSubmissions: siteAnalytics.formSubmissions ?? 0,
                publishedAt: site.publishedAt,
              })
            }
          } catch {
            analyticsData.push({
              siteId: site.id,
              subdomain: site.subdomain,
              businessName: site.content?.businessName || site.subdomain,
              customDomain: site.customDomain,
              pageViews: 0,
              formSubmissions: 0,
              publishedAt: site.publishedAt,
            })
          }
        }

        setAnalytics(analyticsData)
      } catch {
        setError('Could not load analytics. Please try again.')
      }
      setLoaded(true)
    }

    loadAnalytics()
  }, [])

  const displaySites = selectedSiteId
    ? analytics.filter(a => a.siteId === selectedSiteId)
    : analytics

  const totalViews = analytics.reduce((sum, a) => sum + a.pageViews, 0)
  const totalSubmissions = analytics.reduce((sum, a) => sum + a.formSubmissions, 0)

  if (!loaded) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500 text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Analytics</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Summary stats */}
        {analytics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Total page views</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatNumber(totalViews)}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Form submissions</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatNumber(totalSubmissions)}</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-medium text-neutral-500">Published sites</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{analytics.length}</p>
            </div>
          </div>
        )}

        {/* Per-site analytics */}
        {displaySites.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 px-6 py-16 text-center">
            <p className="text-neutral-500">No published sites to show analytics for.</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-700 text-sm"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displaySites.map(site => (
              <div
                key={site.siteId}
                className="bg-white rounded-xl border border-neutral-200 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">{site.businessName}</h2>
                    <p className="text-sm text-neutral-400">
                      {site.customDomain || `${site.subdomain}.craftmypage.com`}
                    </p>
                  </div>
                  {site.publishedAt && (
                    <p className="text-xs text-neutral-400">
                      Published {new Date(site.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Page views</p>
                    <p className="text-xl font-bold text-neutral-900 mt-1">{formatNumber(site.pageViews)}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">Form submissions</p>
                    <p className="text-xl font-bold text-neutral-900 mt-1">{formatNumber(site.formSubmissions)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
