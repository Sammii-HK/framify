'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export type Style = 'Minimal' | 'Bold' | 'Soft' | 'Dark'

interface PromptFormProps {
  onGenerate?: (data: { code: string; title: string; style: string }) => void
}

export default function PromptForm({ onGenerate }: PromptFormProps) {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<Style>('Minimal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate template')
      }

      const data = await response.json()
      
      if (onGenerate) {
        onGenerate({
          code: data.code,
          title: data.title,
          style: data.style,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border"
    >
      <h2 className="text-2xl font-semibold mb-6 text-framer-text">
        Describe Your Template
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What kind of template do you want?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A minimalist landing page for an astrology coach with clean typography and subtle animations"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all resize-none"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Design Style
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as Style)}
            className="w-full px-4 py-3 border border-gray-300 rounded-framer focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all bg-white"
            disabled={isGenerating}
          >
            <option value="Minimal">Minimal</option>
            <option value="Bold">Bold</option>
            <option value="Soft">Soft</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-framer text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-medium rounded-framer-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>Generating...</span>
            </>
          ) : (
            'Generate Template'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

