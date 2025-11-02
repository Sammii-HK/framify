'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import TemplateCard from '@/components/TemplateCard'

interface Template {
  id: string
  title: string
  prompt: string
  style: string
  framerUrl: string | null
  createdAt: string
}

export default function DashboardPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStyle, setFilterStyle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filterStyle) params.set('style', filterStyle)
      params.set('userId', 'anonymous') // TODO: Use actual user ID from auth

      const response = await fetch(`/api/templates?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }, [search, filterStyle])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and view all your generated templates
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all bg-white min-w-[150px]"
            >
              <option value="">All Styles</option>
              <option value="Minimal">Minimal</option>
              <option value="Bold">Bold</option>
              <option value="Soft">Soft</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600">Loading templates...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-framer text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Templates Grid */}
        {!loading && !error && (
          <>
            {templates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-framer-lg border border-framer-border">
                <p className="text-gray-600 text-lg mb-4">
                  {search || filterStyle
                    ? 'No templates found matching your search'
                    : 'No templates yet'}
                </p>
                {!search && !filterStyle && (
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all"
                  >
                    Create Your First Template
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

