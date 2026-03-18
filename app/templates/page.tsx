'use client'

import { useState } from 'react'
import Link from 'next/link'

const palettes = [
  {
    id: 'dark-celestial',
    name: 'Dark Celestial',
    darkBg: '#0D0B1A',
    lightBg: '#F5F0E8',
    accent: '#C9A84C',
    darkText: '#F5F0E8',
    lightText: '#1a1a2e',
  },
  {
    id: 'earthy-sage',
    name: 'Earthy Sage',
    darkBg: '#1A1F1A',
    lightBg: '#F0EDE4',
    accent: '#8B9A6B',
    darkText: '#E8E0D4',
    lightText: '#1a1f1a',
  },
  {
    id: 'ethereal-light',
    name: 'Ethereal Light',
    darkBg: '#1B1833',
    lightBg: '#F8F6FC',
    accent: '#9B8EC4',
    darkText: '#E8E4F0',
    lightText: '#2D2B3D',
  },
  {
    id: 'crystal-rose',
    name: 'Crystal Rose',
    darkBg: '#1A1517',
    lightBg: '#FDF2F4',
    accent: '#D4A0A0',
    darkText: '#F0E6E8',
    lightText: '#2d1f23',
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    darkBg: '#0F1923',
    lightBg: '#EEF2F7',
    accent: '#4A90D9',
    darkText: '#E8EDF2',
    lightText: '#0f1923',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    darkBg: '#1F1710',
    lightBg: '#F5EDE0',
    accent: '#D4943A',
    darkText: '#F0E8DC',
    lightText: '#1f1710',
  },
]

const templates = [
  {
    type: 'standard',
    name: 'Standard',
    description: 'A clean, versatile layout that works for any business. Hero section, services grid, testimonials, and contact form.',
    bestFor: 'Any business',
  },
  {
    type: 'trades',
    name: 'Trades and Services',
    description: 'Built for businesses that work with their hands. Project gallery, service area map, and quote request form.',
    bestFor: 'Plumbers, builders, electricians, roofers',
  },
  {
    type: 'hair-beauty',
    name: 'Hair and Beauty',
    description: 'Designed to showcase your craft. Portfolio grid, price list, and booking integration ready.',
    bestFor: 'Salons, spas, barbers, nail techs',
  },
  {
    type: 'food-drink',
    name: 'Food and Drink',
    description: 'Put your menu front and centre. Opening hours, location map, and reservation links included.',
    bestFor: 'Restaurants, cafes, pubs, bakeries',
  },
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'Let your work do the talking. Full-width image grid, case studies, and a minimal aesthetic.',
    bestFor: 'Photographers, designers, artists, videographers',
  },
  {
    type: 'professional',
    name: 'Professional',
    description: 'Establish authority and trust. Credentials section, client logos, and a clean content-first layout.',
    bestFor: 'Consultants, coaches, accountants, solicitors',
  },
]

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function TemplateMockup({
  palette,
  templateType,
  isDark,
}: {
  palette: typeof palettes[0]
  templateType: string
  isDark: boolean
}) {
  const bg = isDark ? palette.darkBg : palette.lightBg
  const text = isDark ? palette.darkText : palette.lightText
  const accent = palette.accent

  return (
    <div
      className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-colors duration-300"
      style={{ backgroundColor: bg }}
    >
      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${accent}30` }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
        </div>
        <div className="flex gap-1">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
        </div>
      </div>

      {/* Hero section */}
      <div className="px-3 py-4">
        <div className="w-3/4 h-2 rounded-full mb-1.5" style={{ backgroundColor: text, opacity: 0.9 }} />
        <div className="w-1/2 h-2 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.5 }} />
        <div className="w-14 h-4 rounded" style={{ backgroundColor: accent }} />
      </div>

      {/* Content blocks - vary by template type */}
      <div className="px-3 pb-2">
        {templateType === 'portfolio' ? (
          <div className="grid grid-cols-3 gap-1">
            {[0.15, 0.2, 0.12, 0.18, 0.25, 0.14].map((opacity, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: accent, opacity: opacity + 0.15 }}
              />
            ))}
          </div>
        ) : templateType === 'food-drink' ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.4 }} />
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        ) : templateType === 'hair-beauty' ? (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/2] rounded-sm"
                style={{ backgroundColor: accent, opacity: 0.15 + i * 0.05 }}
              />
            ))}
          </div>
        ) : templateType === 'trades' ? (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.2 }} />
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.3 }} />
            </div>
            <div className="h-3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 }} />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-sm p-1.5"
                style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}
              >
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: accent, opacity: 0.5 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="mt-auto px-3 py-1.5"
        style={{ backgroundColor: isDark ? `${text}08` : `${text}05` }}
      >
        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [activePalettes, setActivePalettes] = useState<Record<string, number>>(
    Object.fromEntries(templates.map((t) => [t.type, 0]))
  )
  const [darkModes, setDarkModes] = useState<Record<string, boolean>>(
    Object.fromEntries(templates.map((t) => [t.type, true]))
  )

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-4">
            Template gallery
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
            Pick the layout that fits your business
          </h1>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Every template is mobile-ready, SEO-optimised, and works with all six colour palettes. Toggle light and dark to preview both themes.
          </p>
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => {
            const activeIndex = activePalettes[template.type]
            const activePalette = palettes[activeIndex]
            const isDark = darkModes[template.type]

            return (
              <div
                key={template.type}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md dark:hover:shadow-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
              >
                {/* Preview mockup */}
                <Link href={`/templates/${template.type}`} className="block p-4 pb-0">
                  <TemplateMockup palette={activePalette} templateType={template.type} isDark={isDark} />
                </Link>

                {/* Controls row: palette swatches + light/dark toggle */}
                <div className="px-4 pt-3 flex items-center gap-2">
                  {palettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() =>
                        setActivePalettes((prev) => ({ ...prev, [template.type]: index }))
                      }
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        index === activeIndex
                          ? 'border-blue-600 scale-110 ring-2 ring-blue-600/20'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: palette.accent }}
                      title={palette.name}
                    />
                  ))}

                  {/* Light/dark toggle */}
                  <div className="ml-auto flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full p-0.5">
                    <button
                      onClick={() => setDarkModes((prev) => ({ ...prev, [template.type]: false }))}
                      className={`p-1 rounded-full transition-all ${
                        !isDark
                          ? 'bg-white dark:bg-neutral-600 text-amber-500 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-500'
                      }`}
                      title="Light theme"
                    >
                      <SunIcon />
                    </button>
                    <button
                      onClick={() => setDarkModes((prev) => ({ ...prev, [template.type]: true }))}
                      className={`p-1 rounded-full transition-all ${
                        isDark
                          ? 'bg-neutral-700 dark:bg-neutral-600 text-blue-400 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-500'
                      }`}
                      title="Dark theme"
                    >
                      <MoonIcon />
                    </button>
                  </div>
                </div>

                {/* Palette name */}
                <div className="px-4 pt-1">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">{activePalette.name}</span>
                </div>

                {/* Info */}
                <div className="p-4 pt-2">
                  <Link href={`/templates/${template.type}`}>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                    <span className="font-medium text-neutral-500 dark:text-neutral-400">Best for:</span>{' '}
                    {template.bestFor}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Not sure which to pick?
          </h2>
          <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Every template is fully customisable. Start with any layout and make it yours.
          </p>
          <Link
            href="/generate"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Build your site now
          </Link>
        </div>
      </section>
    </main>
  )
}
