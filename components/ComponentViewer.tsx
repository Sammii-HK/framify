'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sandpack } from '@codesandbox/sandpack-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { formatPrice } from '@/lib/pricing'
import Link from 'next/link'

interface Component {
  id: string
  name: string
  code: string
  description?: string | null
  componentType: string
  price?: number | null
  tags?: string[] | null
  category?: string | null
  thumbnailUrl?: string | null
  framerUrl?: string | null
  previewUrl?: string | null
  viewCount?: number
  downloadCount?: number
  salesCount?: number
  template?: {
    id: string
    title: string
    style: string
  } | null
}

interface ComponentViewerProps {
  component: Component
}

export default function ComponentViewer({ component }: ComponentViewerProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    const blob = new Blob([component.code], { type: 'text/tsx' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.toLowerCase().replace(/\s+/g, '-')}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsDownloading(false)
  }

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${typeColor}`}>
                  {component.componentType}
                </span>
                {component.template && (
                  <Link
                    href={`/template/${component.template.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    From: {component.template.title}
                  </Link>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {component.name}
              </h1>
              {component.description && (
                <p className="text-lg text-gray-600 mb-4">{component.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(component.price)}
              </div>
              {component.price && component.price > 0 ? (
                <button className="px-6 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-all">
                  Purchase
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {component.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            {component.viewCount !== undefined && (
              <span>{component.viewCount} views</span>
            )}
            {component.downloadCount !== undefined && (
              <span>{component.downloadCount} downloads</span>
            )}
            {component.salesCount !== undefined && component.salesCount > 0 && (
              <span>{component.salesCount} sales</span>
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'code'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Code
          </button>
        </div>

        {/* Preview/Code */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {viewMode === 'preview' ? (
            <div style={{ height: '600px' }}>
              <Sandpack
                template="react-ts"
                files={{
                  '/App.tsx': component.code,
                }}
                customSetup={{
                  dependencies: {
                    'framer-motion': '^11.5.4',
                    react: '^18.3.1',
                    'react-dom': '^18.3.1',
                  },
                  entry: '/App.tsx',
                }}
                theme="light"
                options={{
                  showNavigator: true,
                  showTabs: true,
                  showLineNumbers: false,
                  showInlineErrors: true,
                  editorHeight: '100%',
                  editorWidthPercentage: 50,
                  showConsole: false,
                  showConsoleButton: true,
                  resizablePanels: true,
                }}
              />
            </div>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: '600px' }}>
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                }}
                showLineNumbers
              >
                {component.code}
              </SyntaxHighlighter>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}

