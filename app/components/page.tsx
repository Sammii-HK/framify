'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ComponentCard from '@/components/ComponentCard'

interface Component {
  id: string
  name: string
  componentType: string
  description?: string
  price?: number
  thumbnailUrl?: string
  tags?: string[]
  viewCount?: number
  salesCount?: number
  featured?: boolean
}

const COMPONENT_TYPES = [
  'all',
  'button',
  'card',
  'hero',
  'nav',
  'footer',
  'section',
  'form',
  'testimonial',
  'feature',
  'pricing',
  'gallery',
]

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')

  useEffect(() => {
    fetchComponents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedStyle])

  const fetchComponents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        public: 'true',
        limit: '50',
      })

      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/components?${params}`)
      const data = await response.json()
      setComponents(data.components || [])
    } catch (error) {
      console.error('Error fetching components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchComponents()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Component Library
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Browse reusable components organized by style. Mix and match to build your perfect template.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 self-center">Type:</span>
              {COMPONENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Components Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading components...</p>
          </div>
        ) : components.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No components found.</p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}

