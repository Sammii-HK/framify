'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { palettes, templates, categories, type Palette, type Template, type CategoryType } from '@/lib/template-data'
import TemplateMockup from '@/components/TemplateMockup'

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type FilterType = 'all' | 'single' | 'multi'

export default function TemplatesPage() {
  const [activePalettes, setActivePalettes] = useState<Record<string, number>>(
    Object.fromEntries(templates.map((t) => [t.type, 0]))
  )
  const [darkModes, setDarkModes] = useState<Record<string, boolean>>(
    Object.fromEntries(templates.map((t) => [t.type, true]))
  )
  const [pageFilter, setPageFilter] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all')

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (pageFilter !== 'all' && t.pages !== pageFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      return true
    })
  }, [pageFilter, categoryFilter])

  const pageCounts = useMemo(() => ({
    all: templates.length,
    single: templates.filter((t) => t.pages === 'single').length,
    multi: templates.filter((t) => t.pages === 'multi').length,
  }), [])

  // Only show categories that have templates matching the current page filter
  const visibleCategories = useMemo(() => {
    const baseTemplates = pageFilter === 'all' ? templates : templates.filter((t) => t.pages === pageFilter)
    const activeCats = new Set(baseTemplates.map((t) => t.category))
    return categories.filter((c) => c.key === 'all' || activeCats.has(c.key))
  }, [pageFilter])

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-4">
            Template gallery
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
            Pick the layout that fits your business
          </h1>
          <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            {templates.length} templates across {palettes.length} colour palettes. Single-page sites for quick launches, multi-page sites when you need room to grow.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-[65px] z-40">
        <div className="mx-auto max-w-6xl px-6 py-3 space-y-2">
          {/* Page type filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1 shrink-0">Site type</span>
            {([
              { key: 'all' as FilterType, label: 'All' },
              { key: 'single' as FilterType, label: 'Single page' },
              { key: 'multi' as FilterType, label: 'Multi-page' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPageFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pageFilter === key
                    ? 'bg-brand-600 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${pageFilter === key ? 'text-brand-200' : 'text-neutral-400 dark:text-neutral-500'}`}>
                  {pageCounts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Industry filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1 shrink-0">Industry</span>
            {visibleCategories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  categoryFilter === key
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">No templates match those filters.</p>
            <button
              onClick={() => { setPageFilter('all'); setCategoryFilter('all') }}
              className="mt-4 text-brand-600 hover:text-brand-700 font-medium text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
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
                  <TemplateMockup palette={activePalette} template={template} isDark={isDark} />
                </Link>

                {/* Controls row */}
                <div className="px-4 pt-3 flex items-center gap-1.5">
                  {palettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() => setActivePalettes((prev) => ({ ...prev, [template.type]: index }))}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        index === activeIndex
                          ? 'border-brand-600 scale-125 ring-2 ring-brand-600/20'
                          : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 hover:scale-110'
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
                          ? 'bg-neutral-700 dark:bg-neutral-600 text-brand-400 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-500'
                      }`}
                      title="Dark theme"
                    >
                      <MoonIcon />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/templates/${template.type}`}>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-brand-600 transition-colors">
                        {template.name}
                      </h2>
                    </Link>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      template.pages === 'multi'
                        ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {template.pages === 'multi' ? `${template.pageCount} pages` : '1 page'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
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
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Build your site now
          </Link>
        </div>
      </section>
    </main>
  )
}
