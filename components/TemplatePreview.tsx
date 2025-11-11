'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sandpack } from '@codesandbox/sandpack-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface TemplatePreviewProps {
  code?: string
  title?: string
  style?: string
  templateId?: string
}

export default function TemplatePreview({
  code,
  title,
  style,
  templateId,
}: TemplatePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<{ url: string } | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

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

    setIsExporting(true)
    setExportError(null)
    setExportSuccess(null)

    try {
      const response = await fetch('/api/framer-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, code, templateId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to export to Framer')
      }

      if (data.project?.url) {
        setExportSuccess({ url: data.project.url })
        // Clear success message after 10 seconds
        setTimeout(() => setExportSuccess(null), 10000)
      }
    } catch (error) {
      console.error('Error exporting to Framer:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to export to Framer. Please try again.'
      setExportError(errorMessage)
      // Clear error after 8 seconds
      setTimeout(() => setExportError(null), 8000)
    } finally {
      setIsExporting(false)
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

        <div className="space-y-3">
          <div className="flex gap-2">
            <motion.button
              onClick={handleDownload}
              disabled={isExporting}
              whileHover={{ scale: isExporting ? 1 : 1.02 }}
              whileTap={{ scale: isExporting ? 1 : 0.98 }}
              className="px-4 py-2 bg-gray-900 text-white rounded-framer text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download .tsx
            </motion.button>
            <motion.button
              onClick={handleExportToFramer}
              disabled={isExporting}
              whileHover={{ scale: isExporting ? 1 : 1.02 }}
              whileTap={{ scale: isExporting ? 1 : 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Exporting...</span>
                </>
              ) : (
                'Export to Framer'
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {exportSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-green-50 border border-green-200 rounded-framer"
              >
                <p className="text-sm text-green-800 mb-2">
                  ✓ Successfully exported to Framer!
                </p>
                <a
                  href={exportSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-900 underline font-medium"
                >
                  Open in Framer →
                </a>
              </motion.div>
            )}

            {exportError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-50 border border-red-200 rounded-framer"
              >
                <p className="text-sm text-red-800 font-medium mb-1">
                  Export failed
                </p>
                <p className="text-xs text-red-700">{exportError}</p>
              </motion.div>
            )}
          </AnimatePresence>
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
              <div style={{ height: '100%', width: '100%' }}>
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
                />
              </div>
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

