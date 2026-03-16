'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const palettes = [
  {
    id: 'dark-celestial',
    name: 'Dark Celestial',
    description: 'Bold and dramatic. Deep navy tones with gold accents that command attention.',
    bg: '#0D0B1A',
    accent: '#C9A84C',
    text: '#F5F0E8',
  },
  {
    id: 'earthy-sage',
    name: 'Earthy Sage',
    description: 'Warm and grounded. Natural greens with soft cream text for an organic feel.',
    bg: '#1A1F1A',
    accent: '#8B9A6B',
    text: '#E8E0D4',
  },
  {
    id: 'ethereal-light',
    name: 'Ethereal Light',
    description: 'Clean and airy. A light background with gentle purple accents for a modern look.',
    bg: '#F8F6FC',
    accent: '#9B8EC4',
    text: '#2D2B3D',
  },
  {
    id: 'crystal-rose',
    name: 'Crystal Rose',
    description: 'Soft and refined. Dark base with dusty rose accents for understated elegance.',
    bg: '#1A1517',
    accent: '#D4A0A0',
    text: '#F0E6E8',
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    description: 'Professional and sharp. Dark steel base with a strong blue accent for authority.',
    bg: '#0F1923',
    accent: '#4A90D9',
    text: '#E8EDF2',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    description: 'Warm and inviting. Rich brown base with amber gold accents for hospitality.',
    bg: '#1F1710',
    accent: '#D4943A',
    text: '#F0E8DC',
  },
]

const templates: Record<
  string,
  {
    name: string
    description: string
    longDescription: string
    bestFor: string
    features: { title: string; description: string }[]
    layoutSections: string[]
  }
> = {
  standard: {
    name: 'Standard',
    description: 'A clean, versatile layout that works for any business.',
    longDescription:
      'The Standard template is designed to work for every type of business. It features a strong hero section, a flexible services grid, customer testimonials, and a built-in contact form. Whether you run a local shop or a consultancy, this layout adapts to your content.',
    bestFor: 'Any business',
    features: [
      { title: 'Flexible hero section', description: 'A bold header area with your headline, subtext, and a clear call to action button.' },
      { title: 'Services grid', description: 'A three-column grid to showcase what you offer, with space for icons and descriptions.' },
      { title: 'Testimonials section', description: 'Dedicated space for customer reviews that builds trust with new visitors.' },
      { title: 'Contact form', description: 'A built-in form so visitors can reach you directly from the site.' },
      { title: 'About section', description: 'Tell your story with a side-by-side text and image layout.' },
      { title: 'Mobile responsive', description: 'Looks sharp on phones, tablets, and desktops without any extra work.' },
    ],
    layoutSections: ['nav', 'hero', 'services-grid', 'testimonials', 'contact', 'footer'],
  },
  trades: {
    name: 'Trades and Services',
    description: 'Built for businesses that work with their hands.',
    longDescription:
      'The Trades template is purpose-built for tradespeople. It includes a project gallery to show off your best work, a service area section so customers know you cover their location, and a quote request form that captures the details you need. There is also space for accreditations and an emergency callout banner.',
    bestFor: 'Plumbers, builders, electricians, roofers',
    features: [
      { title: 'Project gallery', description: 'Show before-and-after photos or completed jobs in a visual grid layout.' },
      { title: 'Service area section', description: 'Let customers know exactly where you operate with a clear coverage display.' },
      { title: 'Quote request form', description: 'Capture job details upfront so you can respond with an accurate estimate.' },
      { title: 'Accreditations bar', description: 'Display Gas Safe, NICEIC, or any professional certifications prominently.' },
      { title: 'Emergency callout banner', description: 'A sticky banner for urgent services with a click-to-call phone number.' },
      { title: 'Trust signals', description: 'Customer review quotes and years of experience displayed front and centre.' },
    ],
    layoutSections: ['nav', 'emergency-banner', 'hero', 'gallery-grid', 'accreditations', 'quote-form', 'footer'],
  },
  'hair-beauty': {
    name: 'Hair and Beauty',
    description: 'Designed to showcase your craft and style.',
    longDescription:
      'The Hair and Beauty template puts your portfolio front and centre. It includes a stunning image gallery, a clear price list layout, booking integration, and team profile cards. The design feels premium and polished, matching the quality of the services you provide.',
    bestFor: 'Salons, spas, barbers, nail techs',
    features: [
      { title: 'Portfolio gallery', description: 'A beautiful image grid to showcase your best work, from cuts to colour to nails.' },
      { title: 'Price list layout', description: 'A clean, scannable price list that groups services by category.' },
      { title: 'Booking button', description: 'A prominent booking call to action that links to your scheduling tool.' },
      { title: 'Team profiles', description: 'Individual cards for each stylist or therapist with their photo and specialities.' },
      { title: 'Instagram feed section', description: 'Space to display your latest social media posts and grow your following.' },
      { title: 'Opening hours', description: 'Clearly displayed hours so clients know when to visit or call.' },
    ],
    layoutSections: ['nav', 'hero', 'portfolio-grid', 'price-list', 'team', 'booking-cta', 'footer'],
  },
  'food-drink': {
    name: 'Food and Drink',
    description: 'Put your menu front and centre.',
    longDescription:
      'The Food and Drink template is designed for restaurants, cafes, pubs, and bakeries. Your menu is the star, displayed in a clean format that is easy to read on any device. Location, opening hours, and a reservation link are all prominently featured so customers can find you and book a table.',
    bestFor: 'Restaurants, cafes, pubs, bakeries',
    features: [
      { title: 'Menu display', description: 'A well-structured menu layout with categories, items, and prices that is easy to scan.' },
      { title: 'Opening hours widget', description: 'Clearly shows when you are open, including any special holiday hours.' },
      { title: 'Location map', description: 'An embedded map so customers can find directions to your venue.' },
      { title: 'Reservation link', description: 'A prominent button linking to your booking platform or phone number.' },
      { title: 'Daily specials banner', description: 'A highlighted section for featured dishes, happy hour deals, or seasonal offers.' },
      { title: 'Photo gallery', description: 'Showcase your dishes, interior, and ambience with a visual gallery.' },
    ],
    layoutSections: ['nav', 'hero', 'specials-banner', 'menu-list', 'hours-location', 'reservation', 'footer'],
  },
  portfolio: {
    name: 'Portfolio',
    description: 'Let your work do the talking.',
    longDescription:
      'The Portfolio template is built for creatives who want their work to take centre stage. Full-width imagery, a minimal navigation, and a case study layout ensure the focus stays on what you have made. Client logos and a brief about section add credibility without cluttering the page.',
    bestFor: 'Photographers, designers, artists, videographers',
    features: [
      { title: 'Full-width image grid', description: 'A masonry-style gallery that displays your work in large, impactful tiles.' },
      { title: 'Case study layout', description: 'Dedicated pages for each project with context, process, and final results.' },
      { title: 'Lightbox gallery', description: 'Click any image to view it full-screen with smooth transitions.' },
      { title: 'Client logos bar', description: 'Display the brands and businesses you have worked with for instant credibility.' },
      { title: 'Minimal navigation', description: 'A stripped-back header that keeps the focus on your visual work.' },
      { title: 'Contact section', description: 'A simple enquiry form for potential clients to reach out.' },
    ],
    layoutSections: ['nav-minimal', 'hero-fullwidth', 'image-grid', 'client-logos', 'contact-minimal', 'footer'],
  },
  professional: {
    name: 'Professional',
    description: 'Establish authority and trust.',
    longDescription:
      'The Professional template is designed for service providers who need to build credibility. A credentials section, client logos, and testimonial carousel work together to demonstrate your expertise. The clean, content-first layout puts your message ahead of distractions, with a lead capture form to convert visitors into clients.',
    bestFor: 'Consultants, coaches, accountants, solicitors',
    features: [
      { title: 'Credentials section', description: 'Highlight your qualifications, certifications, and years of experience.' },
      { title: 'Client logos', description: 'Show who you have worked with to build instant trust.' },
      { title: 'Testimonial carousel', description: 'Rotating client reviews that reinforce your reputation.' },
      { title: 'Blog-ready layout', description: 'A section for articles or insights that positions you as a thought leader.' },
      { title: 'Lead capture form', description: 'A tailored enquiry form that captures the right details for your sales process.' },
      { title: 'Content-first design', description: 'Clean typography and generous spacing that makes your content easy to read.' },
    ],
    layoutSections: ['nav', 'hero', 'credentials', 'client-logos', 'testimonials', 'lead-form', 'footer'],
  },
}

function FullMockup({
  palette,
  templateType,
}: {
  palette: typeof palettes[0]
  templateType: string
}) {
  const isDark = palette.id !== 'ethereal-light'
  const template = templates[templateType]
  const sections = template?.layoutSections || templates.standard.layoutSections

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-sm"
      style={{ backgroundColor: palette.bg }}
    >
      {/* Nav */}
      {sections.includes('nav') || sections.includes('nav-minimal') ? (
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: `1px solid ${palette.accent}25` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 rounded-full" style={{ backgroundColor: palette.accent }} />
          </div>
          <div className="flex gap-2">
            {(sections.includes('nav-minimal') ? [1, 2] : [1, 2, 3, 4]).map((i) => (
              <div
                key={i}
                className="w-8 h-1.5 rounded-full"
                style={{ backgroundColor: palette.text, opacity: 0.3 }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Emergency banner (trades) */}
      {sections.includes('emergency-banner') && (
        <div className="px-5 py-2 flex items-center justify-between" style={{ backgroundColor: palette.accent }}>
          <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: palette.bg, opacity: 0.8 }} />
          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: palette.bg, opacity: 0.6 }} />
        </div>
      )}

      {/* Specials banner (food) */}
      {sections.includes('specials-banner') && (
        <div
          className="px-5 py-2 text-center"
          style={{ backgroundColor: `${palette.accent}20` }}
        >
          <div className="w-32 h-1.5 rounded-full mx-auto" style={{ backgroundColor: palette.accent, opacity: 0.7 }} />
        </div>
      )}

      {/* Hero */}
      <div className={`px-5 ${sections.includes('hero-fullwidth') ? 'py-10' : 'py-6'}`}>
        <div className="w-2/3 h-3 rounded-full mb-2" style={{ backgroundColor: palette.text, opacity: 0.9 }} />
        <div className="w-1/2 h-3 rounded-full mb-2" style={{ backgroundColor: palette.text, opacity: 0.5 }} />
        <div className="w-5/12 h-2 rounded-full mb-4" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
        <div className="w-20 h-6 rounded-md" style={{ backgroundColor: palette.accent }} />
      </div>

      {/* Content area - varies by template */}
      <div className="px-5 pb-4 space-y-4">
        {/* Services / gallery grid */}
        {(sections.includes('services-grid') || sections.includes('gallery-grid')) && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-md p-3"
                style={{ backgroundColor: isDark ? `${palette.text}08` : `${palette.text}06` }}
              >
                <div className="w-6 h-6 rounded-md mb-2 mx-auto" style={{ backgroundColor: palette.accent, opacity: 0.4 }} />
                <div className="w-full h-1.5 rounded-full mb-1" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
                <div className="w-3/4 h-1.5 rounded-full mx-auto" style={{ backgroundColor: palette.text, opacity: 0.15 }} />
              </div>
            ))}
          </div>
        )}

        {/* Portfolio image grid */}
        {sections.includes('image-grid') && (
          <div className="grid grid-cols-3 gap-2">
            {[0.2, 0.3, 0.15, 0.25, 0.18, 0.22].map((opacity, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={{ backgroundColor: palette.accent, opacity: opacity + 0.15 }}
              />
            ))}
          </div>
        )}

        {/* Portfolio grid (hair/beauty) */}
        {sections.includes('portfolio-grid') && (
          <div className="grid grid-cols-4 gap-1.5">
            {[0.2, 0.35, 0.15, 0.3, 0.25, 0.18, 0.32, 0.22].map((opacity, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: palette.accent, opacity: opacity + 0.1 }}
              />
            ))}
          </div>
        )}

        {/* Price list (hair/beauty) */}
        {sections.includes('price-list') && (
          <div
            className="rounded-md p-3 space-y-2"
            style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}
          >
            <div className="w-20 h-1.5 rounded-full mb-2" style={{ backgroundColor: palette.accent, opacity: 0.6 }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
                <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        )}

        {/* Menu list (food) */}
        {sections.includes('menu-list') && (
          <div className="space-y-3">
            {['Starters', 'Mains'].map((label) => (
              <div
                key={label}
                className="rounded-md p-3"
                style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}
              >
                <div className="w-16 h-1.5 rounded-full mb-2" style={{ backgroundColor: palette.accent, opacity: 0.7 }} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between mb-1.5 last:mb-0">
                    <div>
                      <div className="w-24 h-1.5 rounded-full mb-0.5" style={{ backgroundColor: palette.text, opacity: 0.4 }} />
                      <div className="w-32 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.15 }} />
                    </div>
                    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Hours and location (food) */}
        {sections.includes('hours-location') && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md p-3" style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}>
              <div className="w-16 h-1.5 rounded-full mb-2" style={{ backgroundColor: palette.accent, opacity: 0.6 }} />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between mb-1">
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
                  <div className="w-14 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
                </div>
              ))}
            </div>
            <div
              className="rounded-md"
              style={{ backgroundColor: isDark ? `${palette.text}10` : `${palette.text}08` }}
            />
          </div>
        )}

        {/* Accreditations bar */}
        {sections.includes('accreditations') && (
          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: palette.accent, opacity: 0.2 }}
              />
            ))}
          </div>
        )}

        {/* Client logos */}
        {sections.includes('client-logos') && (
          <div className="flex items-center justify-center gap-4 py-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-4 rounded"
                style={{ backgroundColor: palette.text, opacity: 0.1 }}
              />
            ))}
          </div>
        )}

        {/* Credentials */}
        {sections.includes('credentials') && (
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-md p-2 text-center"
                style={{ backgroundColor: isDark ? `${palette.text}08` : `${palette.text}05` }}
              >
                <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: palette.accent, opacity: 0.3 }} />
                <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )}

        {/* Testimonials */}
        {(sections.includes('testimonials')) && (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-md p-3"
                style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}
              >
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
                <div className="w-3/4 h-1 rounded-full mb-2" style={{ backgroundColor: palette.text, opacity: 0.15 }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.3 }} />
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.25 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team profiles (hair/beauty) */}
        {sections.includes('team') && (
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-1" style={{ backgroundColor: palette.accent, opacity: 0.25 }} />
                <div className="w-8 h-1 rounded-full mx-auto" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        )}

        {/* Contact / quote / lead form */}
        {(sections.includes('contact') || sections.includes('quote-form') || sections.includes('lead-form') || sections.includes('contact-minimal')) && (
          <div
            className="rounded-md p-3"
            style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}
          >
            <div className="w-20 h-1.5 rounded-full mb-3" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
            <div className="space-y-2">
              {(sections.includes('quote-form') ? [1, 2, 3, 4] : [1, 2, 3]).map((i) => (
                <div
                  key={i}
                  className="w-full h-5 rounded"
                  style={{ backgroundColor: isDark ? `${palette.text}08` : `${palette.text}06` }}
                />
              ))}
            </div>
            <div className="w-16 h-5 rounded mt-2" style={{ backgroundColor: palette.accent }} />
          </div>
        )}

        {/* Booking CTA */}
        {sections.includes('booking-cta') && (
          <div className="text-center py-2">
            <div className="w-28 h-7 rounded-md mx-auto" style={{ backgroundColor: palette.accent }} />
          </div>
        )}

        {/* Reservation CTA */}
        {sections.includes('reservation') && (
          <div className="text-center py-2">
            <div className="w-24 h-7 rounded-md mx-auto" style={{ backgroundColor: palette.accent }} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: isDark ? `${palette.text}06` : `${palette.text}04` }}
      >
        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.1 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TemplatePage() {
  const params = useParams()
  const type = params.type as string
  const template = templates[type]
  const [activePaletteIndex, setActivePaletteIndex] = useState(0)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  if (!template) {
    return (
      <main className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Template not found</h1>
          <p className="text-neutral-500 mb-6">That template type does not exist.</p>
          <Link
            href="/templates"
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Back to templates
          </Link>
        </div>
      </main>
    )
  }

  const activePalette = palettes[activePaletteIndex]

  return (
    <main className="bg-neutral-50 min-h-screen">
      {/* Back link */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <Link
            href="/templates"
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            All templates
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-3">
              {template.name} template
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight">
              {template.description}
            </h1>
            <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
              {template.longDescription}
            </p>
            <p className="mt-3 text-sm text-neutral-400">
              <span className="font-medium text-neutral-500">Best for:</span> {template.bestFor}
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

      {/* Full-page preview with controls */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight text-center mb-3">
          Live preview
        </h2>
        <p className="text-neutral-500 text-center max-w-xl mx-auto mb-8">
          Switch palettes and viewports to see how this template looks with different styles.
        </p>

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white rounded-xl border border-neutral-200 p-4">
          {/* Palette swatches */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-500">Palette:</span>
            <div className="flex items-center gap-2">
              {palettes.map((palette, index) => (
                <button
                  key={palette.id}
                  onClick={() => setActivePaletteIndex(index)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    index === activePaletteIndex
                      ? 'border-blue-600 scale-110 shadow-sm'
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: palette.bg }}
                  title={palette.name}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-400 hidden sm:inline">{activePalette.name}</span>
          </div>

          {/* Viewport toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewport === 'desktop'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
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
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
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
          <div
            className={`transition-all duration-300 ${
              viewport === 'mobile' ? 'w-[375px]' : 'w-full'
            }`}
          >
            <FullMockup palette={activePalette} templateType={type} />
          </div>
        </div>

        {/* Colour chips */}
        <div className="mt-6 flex items-center justify-center gap-6">
          {[
            { label: 'Background', colour: activePalette.bg },
            { label: 'Accent', colour: activePalette.accent },
            { label: 'Text', colour: activePalette.text },
          ].map((chip) => (
            <div key={chip.label} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-neutral-200"
                style={{ backgroundColor: chip.colour }}
              />
              <div>
                <span className="text-xs text-neutral-400 block leading-none">{chip.label}</span>
                <span className="text-xs text-neutral-500 font-mono">{chip.colour}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below preview */}
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
      <section className="bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight text-center mb-3">
            What makes this template special
          </h2>
          <p className="text-neutral-500 text-center max-w-xl mx-auto mb-12">
            Every feature has been chosen to help businesses like yours succeed online.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {template.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-neutral-200 p-6"
              >
                <h3 className="text-base font-semibold text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-3 text-neutral-400 max-w-lg mx-auto">
            Fill in your details and have a live site using the {template.name} template in under five minutes.
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
