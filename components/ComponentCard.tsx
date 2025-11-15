'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '@/lib/pricing'

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

interface ComponentCardProps {
  component: Component
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const typeColors: Record<string, string> = {
    button: 'bg-blue-100 text-blue-800',
    card: 'bg-purple-100 text-purple-800',
    hero: 'bg-pink-100 text-pink-800',
    nav: 'bg-green-100 text-green-800',
    footer: 'bg-gray-100 text-gray-800',
    section: 'bg-yellow-100 text-yellow-800',
    form: 'bg-indigo-100 text-indigo-800',
    testimonial: 'bg-orange-100 text-orange-800',
    feature: 'bg-teal-100 text-teal-800',
    pricing: 'bg-red-100 text-red-800',
    gallery: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800',
  }

  const typeColor = typeColors[component.componentType] || typeColors.other

  return (
    <Link href={`/components/${component.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
          {component.thumbnailUrl ? (
            <img
              src={component.thumbnailUrl}
              alt={component.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-sm">Preview</div>
          )}
          {component.featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
            {component.componentType}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {component.name}
          </h3>
          {component.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {component.description}
            </p>
          )}

          {/* Tags */}
          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {component.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(component.price)}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {component.viewCount !== undefined && component.viewCount > 0 && (
                <span>{component.viewCount} views</span>
              )}
              {component.salesCount !== undefined && component.salesCount > 0 && (
                <span>{component.salesCount} sales</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

