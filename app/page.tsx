'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PromptForm, { type Style } from '@/components/PromptForm'
import TemplatePreview from '@/components/TemplatePreview'
import { generateStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: "Lunar - Daily Horoscopes, Tarot Readings & Astrology Insights",
	description: "Get your daily horoscope, free tarot card readings, birth chart analysis, and personalized astrology guidance. Discover your zodiac sign compatibility and explore the mystical world of astrology.",
	keywords: [
		"daily horoscope",
		"free horoscope",
		"tarot reading",
		"birth chart",
		"astrology reading",
		"zodiac signs",
		"horoscope today",
		"astrology app",
	],
}

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Lunar
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-2 font-semibold">
            Your Complete Astrology & Horoscope Guide
          </p>
          <p className="text-gray-600 text-base md:text-lg">
            Discover daily horoscopes, tarot card readings, zodiac sign insights, and personalized astrology guidance
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/grimoire"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Explore The Grimoire
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all"
            >
              Browse Templates
            </Link>
          </div>
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

