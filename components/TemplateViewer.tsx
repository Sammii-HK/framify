'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import TemplatePreview from './TemplatePreview'

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
            <div className="flex items-center gap-4">
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
            </div>
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

