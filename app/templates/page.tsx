'use client'

import { useState } from 'react'
import Link from 'next/link'

const palettes = [
  {
    id: 'dark-celestial',
    name: 'Dark Celestial',
    bg: '#0D0B1A',
    accent: '#C9A84C',
    text: '#F5F0E8',
  },
  {
    id: 'earthy-sage',
    name: 'Earthy Sage',
    bg: '#1A1F1A',
    accent: '#8B9A6B',
    text: '#E8E0D4',
  },
  {
    id: 'ethereal-light',
    name: 'Ethereal Light',
    bg: '#F8F6FC',
    accent: '#9B8EC4',
    text: '#2D2B3D',
  },
  {
    id: 'crystal-rose',
    name: 'Crystal Rose',
    bg: '#1A1517',
    accent: '#D4A0A0',
    text: '#F0E6E8',
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    bg: '#0F1923',
    accent: '#4A90D9',
    text: '#E8EDF2',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    bg: '#1F1710',
    accent: '#D4943A',
    text: '#F0E8DC',
  },
]

const templates = [
  {
    type: 'standard',
    name: 'Standard',
    description: 'A clean, versatile layout that works for any business. Hero section, services grid, testimonials, and contact form.',
    bestFor: 'Any business',
    features: ['Hero with call to action', 'Services grid', 'Testimonials', 'Contact form', 'About section'],
  },
  {
    type: 'trades',
    name: 'Trades and Services',
    description: 'Built for businesses that work with their hands. Project gallery, service area map, and quote request form.',
    bestFor: 'Plumbers, builders, electricians, roofers',
    features: ['Project gallery', 'Service area coverage', 'Quote request form', 'Accreditations bar', 'Emergency callout banner'],
  },
  {
    type: 'hair-beauty',
    name: 'Hair and Beauty',
    description: 'Designed to showcase your craft. Portfolio grid, price list, and booking integration ready.',
    bestFor: 'Salons, spas, barbers, nail techs',
    features: ['Portfolio gallery', 'Price list layout', 'Booking button', 'Team profiles', 'Instagram feed section'],
  },
  {
    type: 'food-drink',
    name: 'Food and Drink',
    description: 'Put your menu front and centre. Opening hours, location map, and reservation links included.',
    bestFor: 'Restaurants, cafes, pubs, bakeries',
    features: ['Menu display', 'Opening hours widget', 'Location map', 'Reservation link', 'Daily specials banner'],
  },
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'Let your work do the talking. Full-width image grid, case studies, and a minimal aesthetic.',
    bestFor: 'Photographers, designers, artists, videographers',
    features: ['Full-width image grid', 'Case study layout', 'Lightbox gallery', 'Client logos bar', 'Minimal navigation'],
  },
  {
    type: 'professional',
    name: 'Professional',
    description: 'Establish authority and trust. Credentials section, client logos, and a clean content-first layout.',
    bestFor: 'Consultants, coaches, accountants, solicitors',
    features: ['Credentials section', 'Client logos', 'Testimonial carousel', 'Blog-ready layout', 'Lead capture form'],
  },
]

function TemplateMockup({ palette, templateType }: { palette: typeof palettes[0]; templateType: string }) {
  const isDark = palette.id !== 'ethereal-light'

  return (
    <div
      className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200"
      style={{ backgroundColor: palette.bg }}
    >
      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${palette.accent}30` }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: palette.accent }} />
          <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.4 }} />
        </div>
        <div className="flex gap-1">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
        </div>
      </div>

      {/* Hero section */}
      <div className="px-3 py-4">
        <div className="w-3/4 h-2 rounded-full mb-1.5" style={{ backgroundColor: palette.text, opacity: 0.9 }} />
        <div className="w-1/2 h-2 rounded-full mb-2" style={{ backgroundColor: palette.text, opacity: 0.5 }} />
        <div
          className="w-14 h-4 rounded"
          style={{ backgroundColor: palette.accent }}
        />
      </div>

      {/* Content blocks - vary by template type */}
      <div className="px-3 pb-2">
        {(templateType === 'portfolio') ? (
          <div className="grid grid-cols-3 gap-1">
            {[0.15, 0.2, 0.12, 0.18, 0.25, 0.14].map((opacity, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: palette.accent, opacity: opacity + 0.15 }}
              />
            ))}
          </div>
        ) : (templateType === 'food-drink') ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.4 }} />
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-sm p-1.5"
                style={{ backgroundColor: isDark ? `${palette.text}10` : `${palette.text}08` }}
              >
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="mt-auto px-3 py-1.5"
        style={{ backgroundColor: isDark ? `${palette.text}08` : `${palette.text}05` }}
      >
        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [activePalettes, setActivePalettes] = useState<Record<string, number>>(
    Object.fromEntries(templates.map((t) => [t.type, 0]))
  )

  return (
    <main className="bg-neutral-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-4">
            Template gallery
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
            Pick the layout that fits your business
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Every template is mobile-ready, SEO-optimised, and works with all six colour palettes. Click a swatch to preview different styles.
          </p>
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => {
            const activeIndex = activePalettes[template.type]
            const activePalette = palettes[activeIndex]

            return (
              <div
                key={template.type}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all group"
              >
                {/* Preview mockup */}
                <Link href={`/templates/${template.type}`} className="block p-4 pb-0">
                  <TemplateMockup palette={activePalette} templateType={template.type} />
                </Link>

                {/* Palette swatches */}
                <div className="px-4 pt-3 flex items-center gap-2">
                  {palettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() =>
                        setActivePalettes((prev) => ({ ...prev, [template.type]: index }))
                      }
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        index === activeIndex
                          ? 'border-blue-600 scale-110'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: palette.bg }}
                      title={palette.name}
                    />
                  ))}
                  <span className="ml-auto text-xs text-neutral-400">{activePalette.name}</span>
                </div>

                {/* Info */}
                <div className="p-4 pt-3">
                  <Link href={`/templates/${template.type}`}>
                    <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    <span className="font-medium text-neutral-500">Best for:</span>{' '}
                    {template.bestFor}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            Not sure which to pick?
          </h2>
          <p className="mt-3 text-neutral-500 max-w-lg mx-auto">
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
