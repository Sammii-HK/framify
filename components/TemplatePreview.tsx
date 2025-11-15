'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sandpack, useSandpack } from '@codesandbox/sandpack-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Component to capture Sandpack errors
function SandpackErrorCapture({ onError }: { onError: (error: string) => void }) {
  const { sandpack } = useSandpack()
  
  useEffect(() => {
    if (sandpack.error) {
      let errorMessage = ''
      
      // Try to get detailed error info
      if (sandpack.error.message) {
        errorMessage = sandpack.error.message
      } else if (typeof sandpack.error === 'string') {
        errorMessage = sandpack.error
      } else {
        errorMessage = JSON.stringify(sandpack.error, null, 2)
      }
      
      // Include file path if available
      if (sandpack.error.path) {
        errorMessage = `${sandpack.error.path}: ${errorMessage}`
      }
      
      // Include line number if available
      if (sandpack.error.line) {
        errorMessage = `${errorMessage}\nLine: ${sandpack.error.line}`
      }
      
      onError(errorMessage)
    } else {
      // Clear error when it's resolved
      onError('')
    }
  }, [sandpack.error, onError])
  
  return null
}

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
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [errorCopied, setErrorCopied] = useState(false)

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

  const copyErrorToClipboard = () => {
    if (runtimeError) {
      navigator.clipboard.writeText(runtimeError).then(() => {
        setErrorCopied(true)
        setTimeout(() => setErrorCopied(false), 2000)
      })
    }
  }

  // Listen for console errors from Sandpack
  useEffect(() => {
    if (!code) return

    const originalError = console.error
    const errorMessages: string[] = []

    console.error = (...args: any[]) => {
      const errorMsg = args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg?.message || arg?.toString() || JSON.stringify(arg)
      ).join(' ')
      
      if (errorMsg.includes('Cannot read') || errorMsg.includes('undefined') || errorMsg.includes('Error:')) {
        errorMessages.push(errorMsg)
        setRuntimeError(errorMessages.join('\n'))
      }
      
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [code])

  const handleExportToFramer = async () => {
    if (!code || !title) return

    // Framer doesn't have a public API - show helpful message
    setExportError(
      'Framer API is not publicly available. ' +
      'Download the .tsx file and paste it into Framer manually, or create a Framer plugin to automate this.'
    )
    setTimeout(() => setExportError(null), 10000)
    
    // Alternative: Copy code to clipboard with instructions
    try {
      await navigator.clipboard.writeText(code)
      setExportSuccess({
        url: 'https://framer.com',
      })
      setTimeout(() => setExportSuccess(null), 5000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
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
              title="Copy code to clipboard - Framer doesn't have a public API"
            >
              Copy for Framer
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
                  ✓ Code copied to clipboard!
                </p>
                <p className="text-xs text-green-700 mb-2">
                  Paste it into Framer as a code component, or download the .tsx file.
                </p>
                <a
                  href="https://framer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-900 underline font-medium"
                >
                  Open Framer →
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

      <div className="flex-1 overflow-hidden relative" style={{ minHeight: '600px' }}>
        <AnimatePresence mode="wait">
          {viewMode === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full relative"
            >
              <div style={{ height: '100%', width: '100%' }} className="relative">
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
                >
                  <SandpackErrorCapture onError={(error) => setRuntimeError(error)} />
                </Sandpack>
                {runtimeError && runtimeError.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-4 right-4 left-4 bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-lg z-50 max-w-2xl mx-auto"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-red-900">Something went wrong</h3>
                      <button
                        onClick={() => setRuntimeError('')}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Close error"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-white rounded border border-red-200 p-3 mb-3 font-mono text-xs text-red-800 overflow-x-auto max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">{runtimeError}</pre>
                    </div>
                    <button
                      onClick={copyErrorToClipboard}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-all"
                    >
                      {errorCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Error
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
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

