'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { palettes, templates, getTemplateDetail, type Palette } from '@/lib/template-data'

function FullMockup({ palette, templateType }: { palette: Palette; templateType: string }) {
  const isDark = palette.darkBg !== palette.lightBg
  const bg = palette.darkBg
  const text = palette.darkText
  const accent = palette.accent

  const template = getTemplateDetail(templateType)
  const sections = template.layoutSections

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm"
      style={{ backgroundColor: bg }}
    >
      {/* Nav */}
      {(sections.includes('nav') || sections.includes('nav-minimal')) && (
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: `1px solid ${accent}25` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 rounded-full" style={{ backgroundColor: accent }} />
          </div>
          <div className="flex gap-2">
            {(sections.includes('nav-minimal') ? [1, 2] : [1, 2, 3, 4]).map((i) => (
              <div key={i} className="w-8 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
            ))}
          </div>
        </div>
      )}

      {/* Emergency banner (trades) */}
      {sections.includes('emergency-banner') && (
        <div className="px-5 py-2 flex items-center justify-between" style={{ backgroundColor: accent }}>
          <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: bg, opacity: 0.8 }} />
          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: bg, opacity: 0.6 }} />
        </div>
      )}

      {/* Specials banner (food) */}
      {sections.includes('specials-banner') && (
        <div className="px-5 py-2 text-center" style={{ backgroundColor: `${accent}20` }}>
          <div className="w-32 h-1.5 rounded-full mx-auto" style={{ backgroundColor: accent, opacity: 0.7 }} />
        </div>
      )}

      {/* Hero */}
      <div className={`px-5 ${sections.includes('hero-fullwidth') ? 'py-10' : 'py-6'}`}>
        <div className="w-2/3 h-3 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.9 }} />
        <div className="w-1/2 h-3 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.5 }} />
        <div className="w-5/12 h-2 rounded-full mb-4" style={{ backgroundColor: text, opacity: 0.3 }} />
        <div className="w-20 h-6 rounded-md" style={{ backgroundColor: accent }} />
      </div>

      {/* Content area */}
      <div className="px-5 pb-4 space-y-4">
        {(sections.includes('services-grid') || sections.includes('gallery-grid')) && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-md p-3" style={{ backgroundColor: `${text}08` }}>
                <div className="w-6 h-6 rounded-md mb-2 mx-auto" style={{ backgroundColor: accent, opacity: 0.4 }} />
                <div className="w-full h-1.5 rounded-full mb-1" style={{ backgroundColor: text, opacity: 0.3 }} />
                <div className="w-3/4 h-1.5 rounded-full mx-auto" style={{ backgroundColor: text, opacity: 0.15 }} />
              </div>
            ))}
          </div>
        )}

        {sections.includes('image-grid') && (
          <div className="grid grid-cols-3 gap-2">
            {[0.2, 0.3, 0.15, 0.25, 0.18, 0.22].map((opacity, i) => (
              <div key={i} className="aspect-square rounded-md" style={{ backgroundColor: accent, opacity: opacity + 0.15 }} />
            ))}
          </div>
        )}

        {sections.includes('portfolio-grid') && (
          <div className="grid grid-cols-4 gap-1.5">
            {[0.2, 0.35, 0.15, 0.3, 0.25, 0.18, 0.32, 0.22].map((opacity, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: opacity + 0.1 }} />
            ))}
          </div>
        )}

        {sections.includes('price-list') && (
          <div className="rounded-md p-3 space-y-2" style={{ backgroundColor: `${text}06` }}>
            <div className="w-20 h-1.5 rounded-full mb-2" style={{ backgroundColor: accent, opacity: 0.6 }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
                <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        )}

        {sections.includes('menu-list') && (
          <div className="space-y-3">
            {['Starters', 'Mains'].map((label) => (
              <div key={label} className="rounded-md p-3" style={{ backgroundColor: `${text}06` }}>
                <div className="w-16 h-1.5 rounded-full mb-2" style={{ backgroundColor: accent, opacity: 0.7 }} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between mb-1.5 last:mb-0">
                    <div>
                      <div className="w-24 h-1.5 rounded-full mb-0.5" style={{ backgroundColor: text, opacity: 0.4 }} />
                      <div className="w-32 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.15 }} />
                    </div>
                    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {sections.includes('hours-location') && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md p-3" style={{ backgroundColor: `${text}06` }}>
              <div className="w-16 h-1.5 rounded-full mb-2" style={{ backgroundColor: accent, opacity: 0.6 }} />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between mb-1">
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
                  <div className="w-14 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
                </div>
              ))}
            </div>
            <div className="rounded-md" style={{ backgroundColor: `${text}10` }} />
          </div>
        )}

        {sections.includes('accreditations') && (
          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: accent, opacity: 0.2 }} />
            ))}
          </div>
        )}

        {sections.includes('client-logos') && (
          <div className="flex items-center justify-center gap-4 py-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-4 rounded" style={{ backgroundColor: text, opacity: 0.1 }} />
            ))}
          </div>
        )}

        {sections.includes('credentials') && (
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-md p-2 text-center" style={{ backgroundColor: `${text}08` }}>
                <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: accent, opacity: 0.3 }} />
                <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )}

        {sections.includes('testimonials') && (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-md p-3" style={{ backgroundColor: `${text}06` }}>
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: text, opacity: 0.2 }} />
                <div className="w-3/4 h-1 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.15 }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.25 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {sections.includes('team') && (
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-1" style={{ backgroundColor: accent, opacity: 0.25 }} />
                <div className="w-8 h-1 rounded-full mx-auto" style={{ backgroundColor: text, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        )}

        {(sections.includes('contact') || sections.includes('quote-form') || sections.includes('lead-form') || sections.includes('contact-minimal')) && (
          <div className="rounded-md p-3" style={{ backgroundColor: `${text}06` }}>
            <div className="w-20 h-1.5 rounded-full mb-3" style={{ backgroundColor: accent, opacity: 0.5 }} />
            <div className="space-y-2">
              {(sections.includes('quote-form') ? [1, 2, 3, 4] : [1, 2, 3]).map((i) => (
                <div key={i} className="w-full h-5 rounded" style={{ backgroundColor: `${text}08` }} />
              ))}
            </div>
            <div className="w-16 h-5 rounded mt-2" style={{ backgroundColor: accent }} />
          </div>
        )}

        {sections.includes('booking-cta') && (
          <div className="text-center py-2">
            <div className="w-28 h-7 rounded-md mx-auto" style={{ backgroundColor: accent }} />
          </div>
        )}

        {sections.includes('reservation') && (
          <div className="text-center py-2">
            <div className="w-24 h-7 rounded-md mx-auto" style={{ backgroundColor: accent }} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: `${text}06` }}>
        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: text, opacity: 0.1 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TemplatePage() {
  const params = useParams()
  const type = params.type as string
  const galleryTemplate = templates.find((t) => t.type === type)
  const detail = getTemplateDetail(type)
  const [activePaletteIndex, setActivePaletteIndex] = useState(0)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  if (!galleryTemplate) {
    return (
      <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Template not found</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">That template type does not exist.</p>
          <Link href="/templates" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Back to templates
          </Link>
        </div>
      </main>
    )
  }

  const activePalette = palettes[activePaletteIndex]

  return (
    <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Back link */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <Link
            href="/templates"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            All templates
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
                {galleryTemplate.name} template
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                galleryTemplate.pages === 'multi'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
              }`}>
                {galleryTemplate.pages === 'multi' ? `${galleryTemplate.pageCount} pages` : '1 page'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
              {detail.description}
            </h1>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {detail.longDescription}
            </p>
            <p className="mt-3 text-sm text-neutral-400 dark:text-neutral-500">
              <span className="font-medium text-neutral-500 dark:text-neutral-400">Best for:</span> {detail.bestFor}
            </p>
            <Link
              href={`/generate?template=${type}&palette=${activePalette.id}`}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Use this template
            </Link>
          </div>
        </div>
      </section>

      {/* Full-page preview */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight text-center mb-3">
          Live preview
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-xl mx-auto mb-8">
          Switch palettes and viewports to see how this template looks with different styles.
        </p>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Palette:</span>
            <div className="flex items-center gap-2">
              {palettes.map((palette, index) => (
                <button
                  key={palette.id}
                  onClick={() => setActivePaletteIndex(index)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    index === activePaletteIndex
                      ? 'border-blue-600 scale-110 shadow-sm ring-2 ring-blue-600/20'
                      : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: palette.accent }}
                  title={palette.name}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-400 dark:text-neutral-500 hidden sm:inline">{activePalette.name}</span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'desktop'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
              Desktop
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'mobile'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              Mobile
            </button>
          </div>
        </div>

        {/* Preview container */}
        <div className="flex justify-center">
          <div className={`transition-all duration-300 ${viewport === 'mobile' ? 'w-[375px]' : 'w-full'}`}>
            <FullMockup palette={activePalette} templateType={type} />
          </div>
        </div>

        {/* Colour chips */}
        <div className="mt-6 flex items-center justify-center gap-6">
          {[
            { label: 'Background', colour: activePalette.darkBg },
            { label: 'Accent', colour: activePalette.accent },
            { label: 'Text', colour: activePalette.darkText },
          ].map((chip) => (
            <div key={chip.label} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-neutral-200 dark:border-neutral-700" style={{ backgroundColor: chip.colour }} />
              <div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 block leading-none">{chip.label}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{chip.colour}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/generate?template=${type}&palette=${activePalette.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Use this template
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight text-center mb-3">
            What makes this template special
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-xl mx-auto mb-12">
            Every feature has been chosen to help businesses like yours succeed online.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900 dark:bg-neutral-800">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-3 text-neutral-400 max-w-lg mx-auto">
            Fill in your details and have a live site using the {galleryTemplate.name} template in under five minutes.
          </p>
          <Link
            href={`/generate?template=${type}&palette=${activePalette.id}`}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Use this template
          </Link>
        </div>
      </section>
    </main>
  )
}
