'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Colour palettes — mix of celestial/spiritual + professional/neutral
// ---------------------------------------------------------------------------

const palettes = [
  // Celestial / spiritual
  {
    id: 'dark-celestial',
    name: 'Dark Celestial',
    category: 'celestial',
    darkBg: '#0D0B1A',
    lightBg: '#F5F0E8',
    accent: '#C9A84C',
    darkText: '#F5F0E8',
    lightText: '#1a1a2e',
  },
  {
    id: 'ethereal-light',
    name: 'Ethereal Light',
    category: 'celestial',
    darkBg: '#1B1833',
    lightBg: '#F8F6FC',
    accent: '#9B8EC4',
    darkText: '#E8E4F0',
    lightText: '#2D2B3D',
  },
  {
    id: 'crystal-rose',
    name: 'Crystal Rose',
    category: 'celestial',
    darkBg: '#1A1517',
    lightBg: '#FDF2F4',
    accent: '#D4A0A0',
    darkText: '#F0E6E8',
    lightText: '#2d1f23',
  },
  // Nature / organic
  {
    id: 'earthy-sage',
    name: 'Earthy Sage',
    category: 'nature',
    darkBg: '#1A1F1A',
    lightBg: '#F0EDE4',
    accent: '#8B9A6B',
    darkText: '#E8E0D4',
    lightText: '#1a1f1a',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    category: 'nature',
    darkBg: '#1F1710',
    lightBg: '#F5EDE0',
    accent: '#D4943A',
    darkText: '#F0E8DC',
    lightText: '#1f1710',
  },
  // Professional / corporate
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    category: 'professional',
    darkBg: '#0F1923',
    lightBg: '#EEF2F7',
    accent: '#4A90D9',
    darkText: '#E8EDF2',
    lightText: '#0f1923',
  },
  {
    id: 'slate-grey',
    name: 'Slate Grey',
    category: 'professional',
    darkBg: '#18181B',
    lightBg: '#F4F4F5',
    accent: '#71717A',
    darkText: '#E4E4E7',
    lightText: '#27272A',
  },
  {
    id: 'navy-gold',
    name: 'Navy Gold',
    category: 'professional',
    darkBg: '#0C1220',
    lightBg: '#F0F2F8',
    accent: '#B8860B',
    darkText: '#E0E4ED',
    lightText: '#1a2035',
  },
  // Bold / modern
  {
    id: 'electric-coral',
    name: 'Electric Coral',
    category: 'bold',
    darkBg: '#1A1118',
    lightBg: '#FFF5F5',
    accent: '#FF6B6B',
    darkText: '#F0E4E8',
    lightText: '#2d1b28',
  },
  {
    id: 'fresh-mint',
    name: 'Fresh Mint',
    category: 'bold',
    darkBg: '#0F1A17',
    lightBg: '#F0FAF7',
    accent: '#34D399',
    darkText: '#D1FAE5',
    lightText: '#064E3B',
  },
  {
    id: 'vivid-indigo',
    name: 'Vivid Indigo',
    category: 'bold',
    darkBg: '#110F24',
    lightBg: '#F0EEFF',
    accent: '#6366F1',
    darkText: '#E0E0FF',
    lightText: '#1e1b4b',
  },
  // Warm / welcoming
  {
    id: 'terracotta',
    name: 'Terracotta',
    category: 'warm',
    darkBg: '#1C1410',
    lightBg: '#FDF6F0',
    accent: '#C2703E',
    darkText: '#F0E0D0',
    lightText: '#3b2518',
  },
]

// ---------------------------------------------------------------------------
// Templates — single-page and multi-page
// ---------------------------------------------------------------------------

type PageType = 'single' | 'multi'

interface Template {
  type: string
  name: string
  description: string
  bestFor: string
  pages: PageType
  pageCount?: number
  mockupStyle: string
}

const templates: Template[] = [
  // Single-page templates
  {
    type: 'standard',
    name: 'Standard',
    description: 'A clean, versatile layout that works for any business. Hero section, services grid, testimonials, and contact form.',
    bestFor: 'Any business',
    pages: 'single',
    mockupStyle: 'grid-3',
  },
  {
    type: 'trades',
    name: 'Trades and Services',
    description: 'Built for businesses that work with their hands. Project gallery, service area map, and quote request form.',
    bestFor: 'Plumbers, builders, electricians, roofers',
    pages: 'single',
    mockupStyle: 'split-gallery',
  },
  {
    type: 'hair-beauty',
    name: 'Hair and Beauty',
    description: 'Designed to showcase your craft. Portfolio grid, price list, and booking integration ready.',
    bestFor: 'Salons, spas, barbers, nail techs',
    pages: 'single',
    mockupStyle: 'gallery-4',
  },
  {
    type: 'food-drink',
    name: 'Food and Drink',
    description: 'Put your menu front and centre. Opening hours, location map, and reservation links included.',
    bestFor: 'Restaurants, cafes, pubs, bakeries',
    pages: 'single',
    mockupStyle: 'menu-list',
  },
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'Let your work do the talking. Full-width image grid, case studies, and a minimal aesthetic.',
    bestFor: 'Photographers, designers, artists, videographers',
    pages: 'single',
    mockupStyle: 'grid-6',
  },
  {
    type: 'professional',
    name: 'Professional',
    description: 'Establish authority and trust. Credentials section, client logos, and a clean content-first layout.',
    bestFor: 'Consultants, coaches, accountants, solicitors',
    pages: 'single',
    mockupStyle: 'grid-3',
  },
  {
    type: 'health-fitness',
    name: 'Health and Fitness',
    description: 'Class timetable, trainer profiles, and booking integration. Built for active businesses.',
    bestFor: 'Personal trainers, gyms, yoga studios, sports coaches',
    pages: 'single',
    mockupStyle: 'timetable',
  },
  {
    type: 'events',
    name: 'Events and Entertainment',
    description: 'Showcase your showreel, list packages, and let clients check availability.',
    bestFor: 'DJs, entertainers, venues, event planners',
    pages: 'single',
    mockupStyle: 'hero-wide',
  },
  {
    type: 'pet-services',
    name: 'Pet Services',
    description: 'Service area map, pricing tiers, and a gallery that wins hearts. Built for animal lovers.',
    bestFor: 'Dog groomers, walkers, vets, pet sitters',
    pages: 'single',
    mockupStyle: 'gallery-4',
  },
  {
    type: 'automotive',
    name: 'Automotive',
    description: 'MOT and service lists, before-and-after gallery, and quote request form.',
    bestFor: 'Garages, detailers, car dealers, mechanics',
    pages: 'single',
    mockupStyle: 'split-gallery',
  },
  {
    type: 'education',
    name: 'Education and Tutoring',
    description: 'Subject grid, qualification badges, testimonials, and booking form.',
    bestFor: 'Tutors, training providers, music teachers, driving instructors',
    pages: 'single',
    mockupStyle: 'grid-3',
  },
  {
    type: 'property',
    name: 'Property and Lettings',
    description: 'Listings grid, valuation request form, and area guides. Built for the property market.',
    bestFor: 'Estate agents, landlords, property managers',
    pages: 'single',
    mockupStyle: 'listings',
  },
  {
    type: 'medical',
    name: 'Medical and Dental',
    description: 'Service list, team credentials, patient booking, and trust signals throughout.',
    bestFor: 'Clinics, dentists, physios, opticians',
    pages: 'single',
    mockupStyle: 'grid-3',
  },
  {
    type: 'creative-agency',
    name: 'Creative Agency',
    description: 'Bold case studies, client logos, team section, and a strong visual identity.',
    bestFor: 'Design studios, marketing agencies, dev shops',
    pages: 'single',
    mockupStyle: 'hero-wide',
  },
  {
    type: 'shop',
    name: 'Shop',
    description: 'Product grid, category filters, and a clean layout ready for e-commerce integration.',
    bestFor: 'Boutiques, gift shops, artisan sellers, online stores',
    pages: 'single',
    mockupStyle: 'product-grid',
  },
  // Multi-page templates
  {
    type: 'business-pro',
    name: 'Business Pro',
    description: 'A full multi-page website with Home, About, Services, Blog, and Contact pages. Everything a growing business needs.',
    bestFor: 'Established businesses, agencies, consultancies',
    pages: 'multi',
    pageCount: 6,
    mockupStyle: 'multi-tabs',
  },
  {
    type: 'startup',
    name: 'Startup',
    description: 'Landing page with product features, pricing table, team profiles, blog, and a clear sign-up funnel.',
    bestFor: 'SaaS startups, tech companies, app launches',
    pages: 'multi',
    pageCount: 5,
    mockupStyle: 'multi-tabs',
  },
  {
    type: 'restaurant-full',
    name: 'Restaurant Full',
    description: 'Multi-page site with dedicated menu, gallery, events, reservations, and about pages.',
    bestFor: 'Restaurants, bars, hotels, catering businesses',
    pages: 'multi',
    pageCount: 6,
    mockupStyle: 'multi-tabs',
  },
  {
    type: 'portfolio-full',
    name: 'Portfolio Full',
    description: 'Multi-page portfolio with individual case study pages, an about section, blog, and contact form.',
    bestFor: 'Freelancers, architects, interior designers',
    pages: 'multi',
    pageCount: 5,
    mockupStyle: 'multi-tabs',
  },
  {
    type: 'clinic',
    name: 'Clinic',
    description: 'Full clinic site with service pages, team profiles, patient information, FAQs, and booking.',
    bestFor: 'Dental practices, physio clinics, veterinary surgeries',
    pages: 'multi',
    pageCount: 7,
    mockupStyle: 'multi-tabs',
  },
  {
    type: 'property-full',
    name: 'Property Full',
    description: 'Multi-page site with listings, area guides, valuation tool, team profiles, and blog.',
    bestFor: 'Estate agents, letting agencies, property developers',
    pages: 'multi',
    pageCount: 6,
    mockupStyle: 'multi-tabs',
  },
]

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
// Mockup component
// ---------------------------------------------------------------------------

function TemplateMockup({
  palette,
  template,
  isDark,
}: {
  palette: typeof palettes[0]
  template: Template
  isDark: boolean
}) {
  const bg = isDark ? palette.darkBg : palette.lightBg
  const text = isDark ? palette.darkText : palette.lightText
  const accent = palette.accent

  const renderContent = () => {
    switch (template.mockupStyle) {
      case 'grid-6':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[0.15, 0.2, 0.12, 0.18, 0.25, 0.14].map((opacity, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: opacity + 0.15 }} />
            ))}
          </div>
        )
      case 'gallery-4':
        return (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/2] rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 + i * 0.05 }} />
            ))}
          </div>
        )
      case 'menu-list':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.4 }} />
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        )
      case 'split-gallery':
        return (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.2 }} />
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.3 }} />
            </div>
            <div className="h-3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 }} />
          </div>
        )
      case 'timetable':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex gap-0.5">
                {[1, 2, 3, 4].map((col) => (
                  <div key={col} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: accent, opacity: (row + col) % 2 === 0 ? 0.25 : 0.1 }} />
                ))}
              </div>
            ))}
          </div>
        )
      case 'hero-wide':
        return (
          <div className="space-y-1.5">
            <div className="h-8 rounded-sm" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.1 + i * 0.05 }} />
              ))}
            </div>
          </div>
        )
      case 'listings':
        return (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-sm p-1" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="h-4 rounded-sm mb-0.5" style={{ backgroundColor: accent, opacity: 0.15 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        )
      case 'product-grid':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 + i * 0.03 }} />
                <div className="p-0.5">
                  <div className="w-full h-1 rounded-full mb-0.5" style={{ backgroundColor: text, opacity: 0.25 }} />
                  <div className="w-1/2 h-1 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        )
      case 'multi-tabs':
        return (
          <div className="space-y-1.5">
            {/* Tab bar to indicate multiple pages */}
            <div className="flex gap-0.5">
              {Array.from({ length: template.pageCount || 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{
                    backgroundColor: i === 0 ? accent : text,
                    opacity: i === 0 ? 0.8 : 0.15,
                    flex: i === 0 ? 2 : 1,
                  }}
                />
              ))}
            </div>
            {/* Page content preview */}
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-sm p-1" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                  <div className="w-full h-1 rounded-full mb-0.5" style={{ backgroundColor: accent, opacity: 0.4 }} />
                  <div className="w-2/3 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm p-1.5" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: accent, opacity: 0.5 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div
      className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-colors duration-300"
      style={{ backgroundColor: bg }}
    >
      {/* Nav bar */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${accent}30` }}>
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

      {/* Hero */}
      <div className="px-3 py-4">
        <div className="w-3/4 h-2 rounded-full mb-1.5" style={{ backgroundColor: text, opacity: 0.9 }} />
        <div className="w-1/2 h-2 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.5 }} />
        <div className="w-14 h-4 rounded" style={{ backgroundColor: accent }} />
      </div>

      {/* Content */}
      <div className="px-3 pb-2">{renderContent()}</div>

      {/* Footer */}
      <div className="mt-auto px-3 py-1.5" style={{ backgroundColor: isDark ? `${text}08` : `${text}05` }}>
        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
      </div>
    </div>
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

  const filteredTemplates = useMemo(() => {
    if (pageFilter === 'all') return templates
    return templates.filter((t) => t.pages === pageFilter)
  }, [pageFilter])

  const counts = useMemo(() => ({
    all: templates.length,
    single: templates.filter((t) => t.pages === 'single').length,
    multi: templates.filter((t) => t.pages === 'multi').length,
  }), [])

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
            {templates.length} templates across {palettes.length} colour palettes. Single-page sites for quick launches, multi-page sites when you need room to grow.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-[65px] z-40">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-2">
          {([
            { key: 'all' as FilterType, label: 'All templates' },
            { key: 'single' as FilterType, label: 'Single page' },
            { key: 'multi' as FilterType, label: 'Multi-page' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPageFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pageFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${pageFilter === key ? 'text-blue-200' : 'text-neutral-400 dark:text-neutral-500'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
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
                          ? 'border-blue-600 scale-125 ring-2 ring-blue-600/20'
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
                          ? 'bg-neutral-700 dark:bg-neutral-600 text-blue-400 shadow-sm'
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
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h2>
                    </Link>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      template.pages === 'multi'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
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
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Build your site now
          </Link>
        </div>
      </section>
    </main>
  )
}
