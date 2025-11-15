'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PromptForm, { type Style } from '@/components/PromptForm'
import TemplatePreview from '@/components/TemplatePreview'

function HomeContent() {
  const searchParams = useSearchParams()
  const [generatedData, setGeneratedData] = useState<{
    id: string
    code: string
    title: string
    style: string
  } | null>(null)

  // Get initial values from URL params
  const initialPrompt = searchParams.get('prompt') || ''
  const initialStyle = searchParams.get('style') as Style | null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent animate-fade-in">
            Framify
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Generate Framer-ready website templates with AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <PromptForm 
              onGenerate={setGeneratedData}
              initialPrompt={initialPrompt}
              initialStyle={initialStyle || undefined}
            />
          </div>
          <div className="space-y-6">
            <TemplatePreview
              code={generatedData?.code}
              title={generatedData?.title}
              style={generatedData?.style}
              templateId={generatedData?.id}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}

