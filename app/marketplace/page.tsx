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
  price?: number
  isPublic: boolean
  description?: string
  tags?: string[]
  category?: string
  viewCount: number
}

export default function MarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStyle, setFilterStyle] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price'>('newest')

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('public', 'true') // Only show public templates
      if (search) params.set('search', search)
      if (filterStyle) params.set('style', filterStyle)
      if (filterCategory) params.set('category', filterCategory)
      params.set('sort', sortBy)

      const response = await fetch(`/api/templates/marketplace?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (err) {
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }, [search, filterStyle, filterCategory, sortBy])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Template Marketplace
          </h1>
          <p className="text-gray-600">
            Discover and purchase Framer-ready templates created with AI
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
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
              className="px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">All Styles</option>
              <option value="Minimal">Minimal</option>
              <option value="Bold">Bold</option>
              <option value="Soft">Soft</option>
              <option value="Dark">Dark</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-framer-lg border border-framer-border">
            <p className="text-gray-600 text-lg mb-4">No templates found</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all"
            >
              Create Your First Template
            </Link>
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
      </div>
    </main>
  )
}

