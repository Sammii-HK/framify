'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import TemplatePreview from './TemplatePreview'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  title: string
  prompt: string
  style: string
  code: string
  framerUrl: string | null
  createdAt: Date | string
}

interface TemplateViewerProps {
  template: Template
}

export default function TemplateViewer({ template }: TemplateViewerProps) {
  const router = useRouter()
  const [isCreatingVariation, setIsCreatingVariation] = useState(false)
  const [variationStyle, setVariationStyle] = useState<string>('')

  const handleCreateVariation = async (style: string) => {
    if (!template.id) return

    setIsCreatingVariation(true)
    setVariationStyle(style)

    try {
      const response = await fetch('/api/generate-variation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          newStyle: style,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create variation')
      }

      const data = await response.json()
      // Redirect to the new variation
      router.push(`/template/${data.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating variation:', error)
      alert('Failed to create style variation. Please try again.')
    } finally {
      setIsCreatingVariation(false)
      setVariationStyle('')
    }
  }

  const availableStyles = ['Minimal', 'Bold', 'Soft', 'Dark'].filter(
    (s) => s !== template.style
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sky-600 hover:text-sky-700 font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border mb-6">
            <h1 className="text-3xl font-bold mb-2 text-framer-text">
              {template.title}
            </h1>
            <p className="text-gray-600 mb-3">{template.prompt}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  template.style === 'Minimal'
                    ? 'bg-gray-100 text-gray-700'
                    : template.style === 'Bold'
                    ? 'bg-red-100 text-red-700'
                    : template.style === 'Soft'
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                {template.style}
              </span>
              {template.framerUrl && (
                <a
                  href={template.framerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Open in Framer →
                </a>
              )}
              <Link
                href={`/template/${template.id}/extract`}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
              >
                Extract Components
              </Link>
            </div>

            {/* Create Style Variations */}
            {availableStyles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-framer-border">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Create in different style:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableStyles.map((style) => (
                    <motion.button
                      key={style}
                      onClick={() => handleCreateVariation(style)}
                      disabled={isCreatingVariation}
                      whileHover={{ scale: isCreatingVariation ? 1 : 1.05 }}
                      whileTap={{ scale: isCreatingVariation ? 1 : 0.95 }}
                      className={`px-3 py-1.5 rounded-framer text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        variationStyle === style
                          ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isCreatingVariation && variationStyle === style
                        ? 'Creating...'
                        : `${style}`}
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Generate the same template inspired by {template.style.toLowerCase()} design systems but in a different aesthetic
                </p>
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TemplatePreview
            code={template.code}
            title={template.title}
            style={template.style}
            templateId={template.id}
          />
        </motion.div>
      </div>
    </main>
  )
}

