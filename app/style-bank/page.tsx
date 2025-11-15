'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PromptTemplate {
  id: string
  name: string
  prompt: string
  description: string | null
  category: string | null
  tags: string[]
  createdAt: string
}

export default function StyleBankPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null)
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<string>('')

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/prompt-templates')
      if (!response.ok) throw new Error('Failed to fetch prompts')
      const data = await response.json()
      setPrompts(data.prompts || [])
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const handleGenerateAllStyles = async (promptTemplate: PromptTemplate) => {
    setIsGeneratingAll(true)
    setGenerationProgress('Generating style variations...')
    
    const styles = [
      'Minimal Corporate',
      'Dark Tech / SaaS',
      'E-commerce Product Showcase',
      'Creative Portfolio / Designer',
      'Agency / Studio Bold',
      'Grid / Magazine Editorial',
      'Luxury / Premium Brand',
      'Retro / Y2K',
      'Pastel / Playful',
      'Single-Page App / Startup Landing'
    ]
    const results = []

    try {
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i]
        setGenerationProgress(`Generating ${style} style... (${i + 1}/${styles.length})`)

        const response = await fetch('/api/generate-template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptTemplate.prompt,
            style,
            baseTemplateId: null, // Will link after generation
          }),
        })

        if (response.ok) {
          const data = await response.json()
          results.push({ style, id: data.id })
        }
      }

      // Link variations together
      if (results.length > 0) {
        const baseId = results[0].id
        for (let i = 1; i < results.length; i++) {
          await fetch('/api/templates/link-variation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              templateId: results[i].id,
              baseTemplateId: baseId,
            }),
          })
        }
      }

      setGenerationProgress('All styles generated! Redirecting...')
      setTimeout(() => {
        window.location.href = `/dashboard`
      }, 1500)
    } catch (error) {
      console.error('Error generating styles:', error)
      setGenerationProgress('Error generating styles. Please try again.')
    } finally {
      setIsGeneratingAll(false)
      setTimeout(() => setGenerationProgress(''), 3000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Style Bank
          </h1>
          <p className="text-gray-600">
            Saved prompts to create templates in different styles
          </p>
        </div>

        {/* Generation Progress */}
        {isGeneratingAll && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-framer-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-blue-800 font-medium">{generationProgress}</p>
            </div>
          </motion.div>
        )}

        {/* Create New Prompt */}
        <div className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border mb-6">
          <Link
            href="/style-bank/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all"
          >
            + Save New Prompt Template
          </Link>
        </div>

        {/* Prompts List */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600">Loading prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-framer-lg border border-framer-border">
            <p className="text-gray-600 text-lg mb-4">No saved prompts yet</p>
            <Link
              href="/style-bank/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer-lg font-medium hover:shadow-md transition-all"
            >
              Create Your First Prompt Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-framer-lg p-6 shadow-sm border border-framer-border hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold mb-2 text-framer-text">
                  {prompt.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {prompt.description || prompt.prompt}
                </p>
                {prompt.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mb-3">
                    {prompt.category}
                  </span>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleGenerateAllStyles(prompt)}
                    disabled={isGeneratingAll}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-framer text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate All Styles
                  </button>
                  <Link
                    href={`/?prompt=${encodeURIComponent(prompt.prompt)}&style=${encodeURIComponent('Minimal Corporate')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-framer text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Use
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

