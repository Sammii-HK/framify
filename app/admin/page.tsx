'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Analytics {
  totalTemplates: number
  publicTemplates: number
  totalViews: number
  totalDownloads: number
  totalSales: number
  revenue: number
  templatesByStyle: Record<string, number>
  templatesByCategory: Record<string, number>
  recentTemplates: Array<{
    id: string
    title: string
    style: string
    viewCount: number
    salesCount: number
    createdAt: string
  }>
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  if (loading && !analytics) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!analytics) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load analytics</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Analytics and system status</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-framer font-medium hover:bg-gray-200 transition-all"
              >
                Create Template
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-framer font-medium hover:bg-gray-200 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
          >
            <div className="text-sm text-gray-600 mb-1">Total Templates</div>
            <div className="text-3xl font-bold text-framer-text">
              {analytics.totalTemplates}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.publicTemplates} public
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
          >
            <div className="text-sm text-gray-600 mb-1">Total Views</div>
            <div className="text-3xl font-bold text-framer-text">
              {analytics.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">All templates</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
          >
            <div className="text-sm text-gray-600 mb-1">Total Downloads</div>
            <div className="text-3xl font-bold text-framer-text">
              {analytics.totalDownloads.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Exports</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
          >
            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
            <div className="text-3xl font-bold text-green-600">
              {analytics.totalSales}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${analytics.revenue.toFixed(2)} revenue
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Templates by Style */}
          <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border">
            <h2 className="text-xl font-semibold mb-4 text-framer-text">
              Templates by Style
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.templatesByStyle).map(([style, count]) => (
                <div key={style} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{style}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gray-200 rounded-full flex-1 w-24">
                      <div
                        className="h-2 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                        style={{
                          width: `${(count / analytics.totalTemplates) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-framer-text w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Templates */}
          <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border">
            <h2 className="text-xl font-semibold mb-4 text-framer-text">
              Recent Templates
            </h2>
            <div className="space-y-3">
              {analytics.recentTemplates.slice(0, 5).map((template) => (
                <Link
                  key={template.id}
                  href={`/template/${template.id}`}
                  className="block p-3 rounded-framer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-framer-text">
                        {template.title}
                      </div>
                      <div className="text-xs text-gray-500">{template.style}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{template.viewCount} views</div>
                      {template.salesCount > 0 && (
                        <div className="text-xs text-green-600">{template.salesCount} sales</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border">
          <h2 className="text-xl font-semibold mb-4 text-framer-text">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <div className="text-sm font-medium">Database</div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <div className="text-sm font-medium">AI Generation</div>
                <div className="text-xs text-gray-500">Operational</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <div className="text-sm font-medium">Framer API</div>
                <div className="text-xs text-gray-500">
                  {process.env.NEXT_PUBLIC_FRAMER_ENABLED === 'true' ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

