'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sandpack } from '@sandpack/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TemplatePreviewProps {
  code?: string
  title?: string
  style?: string
}

export default function TemplatePreview({
  code,
  title,
  style,
}: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const handleDownload = () => {
    if (!code) return

    const blob = new Blob([code], { type: 'text/tsx' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title?.toLowerCase().replace(/\s+/g, '-') || 'template'}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportToFramer = async () => {
    if (!code || !title) return

    try {
      const response = await fetch('/api/framer-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, code }),
      })

      if (!response.ok) {
        throw new Error('Failed to export to Framer')
      }

      const data = await response.json()
      alert(`Framer integration coming in Phase 2! Mock URL: ${data.project?.url}`)
    } catch (error) {
      console.error('Error exporting to Framer:', error)
      alert('Failed to export to Framer. This feature is coming in Phase 2.')
    }
  }

  if (!code) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border h-full flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No template generated yet</p>
          <p className="text-sm">Describe your template and click Generate</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-framer-lg shadow-sm border border-framer-border overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 border-b border-framer-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-framer-text">{title}</h2>
            {style && (
              <p className="text-sm text-gray-600 mt-1">Style: {style}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-framer text-sm font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-4 py-2 rounded-framer text-sm font-medium transition-all ${
              viewMode === 'code'
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Code
          </button>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gray-900 text-white rounded-framer text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Download .tsx
          </motion.button>
          <motion.button
            onClick={handleExportToFramer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer text-sm font-medium hover:shadow-md transition-all"
          >
            Export to Framer
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" style={{ minHeight: '600px' }}>
        <AnimatePresence mode="wait">
          {viewMode === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <Sandpack
                template="react-ts"
                files={{
                  '/App.tsx': code,
                }}
                customSetup={{
                  dependencies: {
                    'framer-motion': '^11.5.4',
                    react: '^18.3.1',
                    'react-dom': '^18.3.1',
                  },
                }}
                theme="light"
                options={{
                  showNavigator: false,
                  showTabs: false,
                  showLineNumbers: false,
                  showInlineErrors: true,
                  editorHeight: '100%',
                  editorWidthPercentage: 50,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-auto"
            >
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  minHeight: '100%',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {code}
              </SyntaxHighlighter>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

