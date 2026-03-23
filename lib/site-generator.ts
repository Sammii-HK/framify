import { PALETTES, LIGHT_PALETTES, type PaletteKey } from '@/lib/design-system'

// ---------------------------------------------------------------------------
// Image placeholder helpers
// ---------------------------------------------------------------------------
// Preview images from Unsplash are for demo purposes only. Generated/downloaded
// sites use clean placeholders so users add their own photos.

function isUnsplashUrl(url: string): boolean {
  return url.includes('images.unsplash.com')
}

function imagePlaceholder(label: string = 'Your image here'): string {
  return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:200px;background:#f3f4f6;border:2px dashed #d1d5db;border-radius:8px;color:#9ca3af;font-size:14px;text-align:center;padding:20px;">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 8px;display:block;opacity:0.5;">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      ${label}
    </div>
  </div>`
}

export interface SiteContent {
  businessName: string
  tagline: string
  description: string
  palette: PaletteKey
  services: { title: string; description: string; price: string; duration: string }[]
  testimonials: { quote: string; name: string; role: string }[]
  contact: { email: string; phone: string; location: string }
  social: { instagram: string; facebook: string; twitter: string }
  images?: { hero?: string; gallery?: string[]; about?: string }
  // Template-specific fields
  templateType?: 'trades' | 'salon' | 'restaurant' | 'portfolio' | 'consultant' | 'standard'
  // Trades
  coverageArea?: string
  accreditations?: string[]
  emergencyAvailable?: boolean
  // Salon
  treatments?: { name: string; duration: string; price: string }[]
  teamMembers?: { name: string; role: string }[]
  bookingUrl?: string
  // Restaurant
  menuCategories?: { category: string; items: { name: string; description: string; price: string }[] }[]
  openingHours?: { day: string; hours: string }[]
  cuisineType?: string
  // Portfolio
  projects?: { title: string; description: string }[]
  // Consultant
  specialisms?: string[]
  processSteps?: { title: string; description: string }[]
  // Multi-page support
  pages?: {
    slug: string        // e.g. 'about', 'services', 'gallery'
    title: string       // Page title
    content: string     // HTML content or markdown
    showInNav: boolean  // Whether to show in navigation
    order: number       // Navigation order
  }[]
}

export const VALID_PALETTES: PaletteKey[] = ['dark-celestial', 'earthy-sage', 'ethereal-light', 'crystal-rose', 'steel-blue', 'warm-amber']

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function generateStaticSite(content: SiteContent, subdomain?: string, analyticsToken?: string, showBranding: boolean = true): string {
  const dark = PALETTES[content.palette]
  const light = LIGHT_PALETTES[content.palette]

  const businessName = escapeHtml(content.businessName || 'My Business')
  const tagline = escapeHtml(content.tagline || 'Welcome to our website')
  const description = escapeHtml(content.description || 'We provide exceptional services tailored to your needs.')
  const metaDescription = escapeHtml((content.description || 'We provide exceptional services tailored to your needs.').slice(0, 160))

  const services = content.services
    .filter(s => s.title)
    .map(s => ({
      title: escapeHtml(s.title),
      description: escapeHtml(s.description || 'Service description'),
      price: escapeHtml(s.price || ''),
      duration: escapeHtml(s.duration || ''),
    }))

  const testimonials = content.testimonials
    .filter(t => t.quote)
    .map(t => ({
      quote: escapeHtml(t.quote),
      name: escapeHtml(t.name || 'Client'),
      role: escapeHtml(t.role || ''),
    }))

  const contact = {
    email: escapeHtml(content.contact.email || ''),
    phone: escapeHtml(content.contact.phone || ''),
    location: escapeHtml(content.contact.location || ''),
  }

  const social = {
    instagram: escapeHtml(content.social.instagram || ''),
    facebook: escapeHtml(content.social.facebook || ''),
    twitter: escapeHtml(content.social.twitter || ''),
  }

  const servicesJson = JSON.stringify(services)
  const testimonialsJson = JSON.stringify(testimonials)

  const templateType = content.templateType || 'standard'

  // Trades
  const coverageArea = escapeHtml(content.coverageArea || '')
  const accreditations = (content.accreditations || []).map(a => escapeHtml(a))
  const emergencyAvailable = content.emergencyAvailable || false

  // Salon
  const treatments = (content.treatments || []).map(t => ({
    name: escapeHtml(t.name || ''),
    duration: escapeHtml(t.duration || ''),
    price: escapeHtml(t.price || ''),
  }))
  const teamMembers = (content.teamMembers || []).map(m => ({
    name: escapeHtml(m.name || ''),
    role: escapeHtml(m.role || ''),
  }))
  const bookingUrl = escapeHtml(content.bookingUrl || '')

  // Restaurant
  const menuCategories = (content.menuCategories || []).map(cat => ({
    category: escapeHtml(cat.category || ''),
    items: (cat.items || []).map(item => ({
      name: escapeHtml(item.name || ''),
      description: escapeHtml(item.description || ''),
      price: escapeHtml(item.price || ''),
    })),
  }))
  const openingHours = (content.openingHours || []).map(h => ({
    day: escapeHtml(h.day || ''),
    hours: escapeHtml(h.hours || ''),
  }))
  const cuisineType = escapeHtml(content.cuisineType || '')

  // Portfolio
  const projects = (content.projects || []).map(p => ({
    title: escapeHtml(p.title || ''),
    description: escapeHtml(p.description || ''),
  }))

  // Consultant
  const specialisms = (content.specialisms || []).map(s => escapeHtml(s))
  const processSteps = (content.processSteps || []).map(s => ({
    title: escapeHtml(s.title || ''),
    description: escapeHtml(s.description || ''),
  }))

  // Images — strip Unsplash URLs so downloaded sites use placeholders instead of preview images
  const rawHeroImage = content.images?.hero || ''
  const heroImage = isUnsplashUrl(rawHeroImage) ? '' : escapeHtml(rawHeroImage)
  const galleryImages = (content.images?.gallery || [])
    .map(img => isUnsplashUrl(img) ? '' : escapeHtml(img))
    .filter(img => img !== '')

  const canonicalUrl = subdomain ? `https://${subdomain}.craftmypage.com` : ''
  const pageTitle = `${businessName} — ${tagline}`

  // Build social links array for sameAs
  const sameAsLinks: string[] = []
  if (content.social.instagram) sameAsLinks.push(content.social.instagram)
  if (content.social.facebook) sameAsLinks.push(content.social.facebook)
  if (content.social.twitter) sameAsLinks.push(content.social.twitter)

  // Build JSON-LD structured data
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: content.businessName || 'My Business',
    description: content.description || 'We provide exceptional services tailored to your needs.',
  }
  if (canonicalUrl) jsonLd.url = canonicalUrl
  if (content.contact.phone) jsonLd.telephone = content.contact.phone
  if (content.contact.email) jsonLd.email = content.contact.email
  if (content.contact.location) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: content.contact.location,
    }
  }
  if (sameAsLinks.length > 0) jsonLd.sameAs = sameAsLinks

  // Add OfferCatalog if services exist
  const filteredServices = content.services.filter(s => s.title)
  if (filteredServices.length > 0) {
    jsonLd.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: filteredServices.map(s => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.description || 'Service description',
        },
        ...(s.price ? { price: s.price } : {}),
      })),
    }
  }

  const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDescription}" />
  <meta name="theme-color" content="${dark.accent.primary}" />
${canonicalUrl ? `  <link rel="canonical" href="${canonicalUrl}" />\n` : ''}\
  <!-- Open Graph -->
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:type" content="website" />
${canonicalUrl ? `  <meta property="og:url" content="${canonicalUrl}" />\n` : ''}\
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${metaDescription}" />

  ${jsonLdScript}

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
  <link rel="preconnect" href="https://unpkg.com" crossorigin />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script>window.react = window.React;<\/script>
  <script src="https://unpkg.com/lucide-react@0.460.0/dist/umd/lucide-react.min.js"><\/script>
  <style>* { margin: 0; padding: 0; box-sizing: border-box; } html { scroll-behavior: smooth; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState } = React;
    const lucide = window.LucideReact || {};
    const { Sun, Moon, Star, Heart, Mail, Phone, MapPin, ArrowRight, Sparkles, Diamond, Shield, Clock, Users, Calendar, ExternalLink, Hash, CheckCircle, AlertTriangle, Loader2 } = lucide;

    const SITE = {
      businessName: ${JSON.stringify(businessName)},
      tagline: ${JSON.stringify(tagline)},
      description: ${JSON.stringify(description)},
      services: ${servicesJson},
      testimonials: ${testimonialsJson},
      contact: ${JSON.stringify(contact)},
      social: ${JSON.stringify(social)},
      subdomain: ${JSON.stringify(subdomain || '')},
      templateType: ${JSON.stringify(templateType)},
      coverageArea: ${JSON.stringify(coverageArea)},
      accreditations: ${JSON.stringify(accreditations)},
      emergencyAvailable: ${JSON.stringify(emergencyAvailable)},
      treatments: ${JSON.stringify(treatments)},
      teamMembers: ${JSON.stringify(teamMembers)},
      bookingUrl: ${JSON.stringify(bookingUrl)},
      menuCategories: ${JSON.stringify(menuCategories)},
      openingHours: ${JSON.stringify(openingHours)},
      cuisineType: ${JSON.stringify(cuisineType)},
      projects: ${JSON.stringify(projects)},
      specialisms: ${JSON.stringify(specialisms)},
      processSteps: ${JSON.stringify(processSteps)},
      heroImage: ${JSON.stringify(heroImage)},
      galleryImages: ${JSON.stringify(galleryImages)},
    };

    const GeneratedTemplate = function Site() {
      const [isDark, setIsDark] = useState(true);

      const themes = {
        dark: {
          bg: "${dark.bg.deep}",
          surface: "${dark.bg.surface}",
          elevated: "${dark.bg.elevated}",
          textPrimary: "${dark.text.primary}",
          textSecondary: "${dark.text.secondary}",
          textMuted: "${dark.text.muted}",
          accent: "${dark.accent.primary}",
          accentSecondary: "${dark.accent.secondary}",
          highlight: "${dark.accent.highlight}",
          borderSubtle: "${dark.border.subtle}",
          border: "${dark.border.default}",
        },
        light: {
          bg: "${light.bg.deep}",
          surface: "${light.bg.surface}",
          elevated: "${light.bg.elevated}",
          textPrimary: "${light.text.primary}",
          textSecondary: "${light.text.secondary}",
          textMuted: "${light.text.muted}",
          accent: "${light.accent.primary}",
          accentSecondary: "${light.accent.secondary}",
          highlight: "${light.accent.highlight}",
          borderSubtle: "${light.border.subtle}",
          border: "${light.border.default}",
        },
      };

      const t = isDark ? themes.dark : themes.light;
      const btnContrast = isDark ? "${dark.bg.deep}" : "#FFFFFF";

      return (
        <div style={{ backgroundColor: t.bg, color: t.textPrimary, minHeight: "100vh" }}>
          {/* Nav */}
          <header aria-label="Site header">
            <nav className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-4" aria-label="Main navigation">
              <div className="text-xl font-bold">{SITE.businessName}</div>
              <div className="flex items-center gap-6">
                {SITE.templateType === "salon" && SITE.treatments.length > 0 && (
                  <a href="#treatments" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Treatments</a>
                )}
                {SITE.templateType === "restaurant" && SITE.menuCategories.length > 0 && (
                  <a href="#menu" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Menu</a>
                )}
                {SITE.templateType === "portfolio" && SITE.projects.length > 0 && (
                  <a href="#projects" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Work</a>
                )}
                <a href="#services" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Services</a>
                <a href="#testimonials" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Testimonials</a>
                <a href="#contact" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Contact</a>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: t.surface }}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </nav>
          </header>

          <main>
          {/* Hero */}
          <section
            id="hero"
            className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4"
            style={{
              background: isDark ? "${dark.gradient}" : "${light.gradient}",
              ...(SITE.templateType === "portfolio" && SITE.heroImage ? {
                backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(" + SITE.heroImage + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
              } : {}),
            }}
          >
            {SITE.templateType === "restaurant" && SITE.cuisineType && (
              <span className="text-sm font-medium tracking-widest uppercase mb-4 px-4 py-1 rounded-full border" style={{ color: t.accent, borderColor: t.accent }}>
                {SITE.cuisineType}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-bold mb-6 max-w-4xl">
              {SITE.tagline}
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-prose mb-8" style={{ color: t.textSecondary }}>
              {SITE.description}
            </p>
            <a
              href={SITE.templateType === "salon" && SITE.bookingUrl ? SITE.bookingUrl : "#contact"}
              className="px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
              style={{ backgroundColor: t.accent, color: btnContrast }}
              {...(SITE.templateType === "salon" && SITE.bookingUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {SITE.templateType === "trades" ? "Get a Free Quote" :
               SITE.templateType === "salon" ? "Book Now" :
               SITE.templateType === "restaurant" ? "Reserve a Table" :
               SITE.templateType === "consultant" ? "Book a Consultation" :
               "Get Started"} <ArrowRight className="w-4 h-4" />
            </a>
            {SITE.templateType === "portfolio" && !SITE.heroImage && (
              <p className="mt-6 text-xs" style={{ color: t.textMuted, opacity: 0.6 }}>
                Add a hero background image to make this section stand out
              </p>
            )}
          </section>

          {/* === TRADES SECTIONS === */}

          {/* Trades: Emergency Banner */}
          {SITE.templateType === "trades" && SITE.emergencyAvailable && (
            <section className="py-4 px-4 text-center" style={{ backgroundColor: t.accent, color: btnContrast }}>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold text-lg">24/7 Emergency Call-Outs Available</span>
                {SITE.contact.phone && (
                  <a href={"tel:" + SITE.contact.phone} className="font-bold underline text-lg">
                    {SITE.contact.phone}
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Trades: Accreditations */}
          {SITE.templateType === "trades" && SITE.accreditations.length > 0 && (
            <section className="py-8 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.surface }}>
              <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
                {SITE.accreditations.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: t.accent, color: t.accent }}>
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trades: Coverage Area */}
          {SITE.templateType === "trades" && SITE.coverageArea && (
            <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <div className="max-w-3xl mx-auto text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: t.accent }} />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Areas We Cover</h2>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: t.textSecondary }}>
                  {SITE.coverageArea}
                </p>
              </div>
            </section>
          )}

          {/* === SALON SECTIONS === */}

          {/* Salon: Treatments Menu */}
          {SITE.templateType === "salon" && SITE.treatments.length > 0 && (
            <section id="treatments" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-4">Our Treatments</h2>
              <p className="text-center mb-12 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Browse our full treatment menu below.
              </p>
              <div className="max-w-2xl mx-auto">
                {SITE.treatments.map((treatment, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b" style={{ borderColor: t.borderSubtle }}>
                    <div>
                      <h3 className="font-semibold">{treatment.name}</h3>
                      {treatment.duration && (
                        <span className="text-sm flex items-center gap-1 mt-1" style={{ color: t.textMuted }}>
                          <Clock className="w-3 h-3" /> {treatment.duration}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-lg" style={{ color: t.accent }}>{treatment.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Salon: Team Members */}
          {SITE.templateType === "salon" && SITE.teamMembers.length > 0 && (
            <section className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-12">Meet the Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {SITE.teamMembers.map((member, i) => (
                  <div key={i} className="text-center p-6 rounded-xl border" style={{ backgroundColor: t.surface, borderColor: t.border }}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: t.accent, color: btnContrast }}>
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm mt-1" style={{ color: t.textMuted }}>{member.role}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Salon: Booking CTA */}
          {SITE.templateType === "salon" && SITE.bookingUrl && (
            <section className="py-12 md:py-16 px-4 text-center" style={{ background: isDark ? "${dark.gradient}" : "${light.gradient}" }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Look Your Best?</h2>
              <p className="mb-8 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Book your appointment online in seconds.
              </p>
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2"
                style={{ backgroundColor: t.accent, color: btnContrast }}
              >
                Book Now <ExternalLink className="w-5 h-5" />
              </a>
            </section>
          )}

          {/* === RESTAURANT SECTIONS === */}

          {/* Restaurant: Menu */}
          {SITE.templateType === "restaurant" && SITE.menuCategories.length > 0 && (
            <section id="menu" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-12">Our Menu</h2>
              <div className="max-w-3xl mx-auto space-y-12">
                {SITE.menuCategories.map((cat, ci) => (
                  <div key={ci}>
                    <h3 className="text-2xl font-bold mb-6 pb-2 border-b" style={{ borderColor: t.accent, color: t.accent }}>
                      {cat.category}
                    </h3>
                    <div className="space-y-4">
                      {cat.items.map((item, ii) => (
                        <div key={ii} className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm mt-1" style={{ color: t.textMuted }}>{item.description}</p>
                            )}
                          </div>
                          <span className="font-bold whitespace-nowrap" style={{ color: t.accent }}>{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Restaurant: Opening Hours */}
          {SITE.templateType === "restaurant" && SITE.openingHours.length > 0 && (
            <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-8">Opening Hours</h2>
              <div className="max-w-md mx-auto">
                {SITE.openingHours.map((entry, i) => (
                  <div key={i} className="flex justify-between py-3 border-b" style={{ borderColor: t.borderSubtle }}>
                    <span className="font-medium">{entry.day}</span>
                    <span style={{ color: t.textSecondary }}>{entry.hours}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Restaurant: CTA */}
          {SITE.templateType === "restaurant" && (
            <section className="py-12 md:py-16 px-4 text-center" style={{ background: isDark ? "${dark.gradient}" : "${light.gradient}" }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us for a Meal</h2>
              <p className="mb-8 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Reserve your table or order online today.
              </p>
              <a
                href="#contact"
                className="px-10 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2"
                style={{ backgroundColor: t.accent, color: btnContrast }}
              >
                Reserve a Table <ArrowRight className="w-5 h-5" />
              </a>
            </section>
          )}

          {/* === PORTFOLIO SECTIONS === */}

          {/* Portfolio: Project Gallery */}
          {SITE.templateType === "portfolio" && SITE.projects.length > 0 && (
            <section id="projects" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-12">Selected Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                {SITE.projects.map((project, i) => (
                  <div key={i} className="group p-8 rounded-xl border transition-all hover:scale-[1.02]" style={{ backgroundColor: t.surface, borderColor: t.border }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: t.accent }}>{project.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: t.textSecondary }}>{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Portfolio: Image Gallery */}
          {SITE.templateType === "portfolio" && (
            <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
                {SITE.galleryImages.length > 0 ? (
                  SITE.galleryImages.map((src, i) => (
                    <img key={i} src={src} alt={"Gallery image " + (i + 1)} className="w-full rounded-lg mb-4 break-inside-avoid" loading="lazy" />
                  ))
                ) : (
                  [1, 2, 3].map((n) => (
                    <div key={n} className="mb-4 break-inside-avoid flex items-center justify-center rounded-lg" style={{ minHeight: "200px", background: "#f3f4f6", border: "2px dashed #d1d5db", color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 8px", display: "block", opacity: 0.5 }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        Gallery image {n} — add your own
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* === CONSULTANT SECTIONS === */}

          {/* Consultant: Specialisms */}
          {SITE.templateType === "consultant" && SITE.specialisms.length > 0 && (
            <section className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-8">Areas of Expertise</h2>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {SITE.specialisms.map((spec, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm font-medium border" style={{ borderColor: t.accent, color: t.accent, backgroundColor: t.surface }}>
                    {spec}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Consultant: Process Steps */}
          {SITE.templateType === "consultant" && SITE.processSteps.length > 0 && (
            <section className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-4">How I Work</h2>
              <p className="text-center mb-12 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                A clear, proven process to deliver results.
              </p>
              <div className="max-w-3xl mx-auto space-y-8">
                {SITE.processSteps.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: t.accent, color: btnContrast }}>
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-base leading-relaxed" style={{ color: t.textSecondary }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Consultant: CTA */}
          {SITE.templateType === "consultant" && (
            <section className="py-12 md:py-16 px-4 text-center" style={{ background: isDark ? "${dark.gradient}" : "${light.gradient}" }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
              <p className="mb-8 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Get in touch to discuss how I can help your business grow.
              </p>
              <a
                href="#contact"
                className="px-10 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2"
                style={{ backgroundColor: t.accent, color: btnContrast }}
              >
                Book a Consultation <ArrowRight className="w-5 h-5" />
              </a>
            </section>
          )}

          {/* Trades: Free Quote CTA */}
          {SITE.templateType === "trades" && (
            <section className="py-12 md:py-16 px-4 text-center" style={{ background: isDark ? "${dark.gradient}" : "${light.gradient}" }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get a Free Quote</h2>
              <p className="mb-8 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Tell us about your project and we will get back to you with a no-obligation quote.
              </p>
              <a
                href="#contact"
                className="px-10 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2"
                style={{ backgroundColor: t.accent, color: btnContrast }}
              >
                Request a Quote <ArrowRight className="w-5 h-5" />
              </a>
            </section>
          )}

          {/* Services */}
          {SITE.services.length > 0 && (
            <section id="services" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-4">Our Services</h2>
              <p className="text-center mb-12 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
                Explore what we offer and find the perfect fit for your journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {SITE.services.map((service, index) => (
                  <div key={index} className="p-6 rounded-xl border" style={{ backgroundColor: t.surface, borderColor: t.border }}>
                    <div className="flex items-center mb-4">
                      <Star className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: t.accent }} />
                      <h3 className="text-xl font-semibold">{service?.title}</h3>
                    </div>
                    <p className="text-base leading-relaxed mb-4" style={{ color: t.textSecondary }}>
                      {service?.description}
                    </p>
                    {(service?.price || service?.duration) && (
                      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: t.borderSubtle }}>
                        {service?.price && <span className="text-sm font-medium" style={{ color: t.accent }}>{service.price}</span>}
                        {service?.duration && <span className="text-sm" style={{ color: t.textMuted }}>{service.duration}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials */}
          {SITE.testimonials.length > 0 && (
            <section id="testimonials" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.elevated }}>
              <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-12">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {SITE.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-6 rounded-xl border" style={{ backgroundColor: t.surface, borderColor: t.border }}>
                    <p className="text-base leading-relaxed mb-6" style={{ color: t.textSecondary }}>
                      "{testimonial?.quote}"
                    </p>
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: t.accent }} />
                      <div>
                        <p className="text-sm font-medium">{testimonial?.name}</p>
                        {testimonial?.role && <p className="text-xs" style={{ color: t.textMuted }}>{testimonial.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          <section id="contact" className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
            <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-tight font-bold text-center mb-4">Get in Touch</h2>
            <p className="text-center mb-12 max-w-prose mx-auto" style={{ color: t.textSecondary }}>
              Ready to begin? Send us a message and we will get back to you soon.
            </p>
            {(() => {
              const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" });
              const [status, setStatus] = useState("idle");
              const [errorMsg, setErrorMsg] = useState("");

              const handleSubmit = async (e) => {
                e.preventDefault();
                setStatus("sending");
                setErrorMsg("");
                try {
                  const res = await fetch("https://craftmypage.com/api/form-submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      subdomain: SITE.subdomain,
                      name: formData.name,
                      email: formData.email,
                      message: formData.message,
                      website: formData.website,
                    }),
                  });
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Something went wrong. Please try again.");
                  }
                  setStatus("sent");
                  setFormData({ name: "", email: "", message: "", website: "" });
                } catch (err) {
                  setStatus("error");
                  setErrorMsg(err.message || "Failed to send message. Please try again.");
                }
              };

              if (status === "sent") {
                return (
                  <div className="max-w-lg mx-auto text-center py-8">
                    <div className="text-4xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold mb-2">Message sent</h3>
                    <p style={{ color: t.textSecondary }}>
                      Thank you for getting in touch. We will get back to you soon.
                    </p>
                    <button onClick={() => setStatus("idle")} className="mt-4 text-sm underline" style={{ color: t.textMuted }}>
                      Send another message
                    </button>
                  </div>
                );
              }

              return (
                <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
                  {/* Honeypot — hidden from real users */}
                  <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                    <label>Website</label>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: t.textMuted }}>Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-lg border" style={{ backgroundColor: t.surface, borderColor: t.border, color: t.textPrimary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: t.textMuted }}>Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-lg border" style={{ backgroundColor: t.surface, borderColor: t.border, color: t.textPrimary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: t.textMuted }}>Message</label>
                    <textarea rows={4} required maxLength={2000} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 rounded-lg border" style={{ backgroundColor: t.surface, borderColor: t.border, color: t.textPrimary }}></textarea>
                    <div className="text-xs mt-1 text-right" style={{ color: t.textMuted }}>{formData.message.length}/2000</div>
                  </div>
                  {status === "error" && (
                    <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                      {errorMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ backgroundColor: t.accent, color: btnContrast }}
                  >
                    {status === "sending" ? (<><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>) : "Send Message"}
                  </button>
                </form>
              );
            })()}
          </section>
          </main>

          {/* Footer */}
          <footer className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.surface }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold mb-4">{SITE.businessName}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.textSecondary }}>
                  {SITE.description}
                </p>
              </div>
              {SITE.services.filter(s => s?.title).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <ul className="space-y-2">
                  {SITE.services.filter(s => s?.title).map((s, i) => (
                    <li key={i} className="text-sm" style={{ color: t.textSecondary }}>{s.title}</li>
                  ))}
                </ul>
              </div>
              )}
              {(SITE.contact.email || SITE.contact.phone || SITE.contact.location) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-sm" style={{ color: t.textSecondary }}>
                  {SITE.contact.email && <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {SITE.contact.email}</li>}
                  {SITE.contact.phone && <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {SITE.contact.phone}</li>}
                  {SITE.contact.location && <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {SITE.contact.location}</li>}
                </ul>
              </div>
              )}
              {(SITE.social.instagram || SITE.social.facebook || SITE.social.twitter) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <ul className="space-y-2 text-sm" style={{ color: t.textSecondary }}>
                  {SITE.social.instagram && <li><a href={SITE.social.instagram} className="hover:underline">Instagram</a></li>}
                  {SITE.social.facebook && <li><a href={SITE.social.facebook} className="hover:underline">Facebook</a></li>}
                  {SITE.social.twitter && <li><a href={SITE.social.twitter} className="hover:underline">Twitter</a></li>}
                </ul>
              </div>
              )}
            </div>
            <div className="mt-12 pt-6 text-center text-xs border-t" style={{ borderColor: t.borderSubtle, color: t.textMuted }}>
              &copy; ${new Date().getFullYear()} {SITE.businessName}. All rights reserved.
            </div>
${showBranding ? `            <div className="mt-4 text-center">
              <a href="https://craftmypage.com" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] opacity-40 hover:opacity-70 transition-opacity" style={{ color: t.textMuted }}>
                Created with CraftMyPage
              </a>
            </div>` : ''}
          </footer>
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(GeneratedTemplate));
  <\/script>
${analyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${analyticsToken}"}'></script>` : ''}
</body>
</html>`
}

/**
 * Generate a multi-page static site.
 * Returns a Map of filename -> HTML string (e.g. 'index.html', 'about.html').
 * The homepage is the existing single-page output with nav links to sub-pages.
 * Each sub-page shares the same nav, footer, palette, and CDN setup.
 */
export function generateMultiPageSite(content: SiteContent, subdomain?: string, analyticsToken?: string, showBranding: boolean = true): Map<string, string> {
  const files = new Map<string, string>()

  const dark = PALETTES[content.palette]
  const light = LIGHT_PALETTES[content.palette]

  const businessName = escapeHtml(content.businessName || 'My Business')
  const description = escapeHtml(content.description || 'We provide exceptional services tailored to your needs.')
  const canonicalUrl = subdomain ? `https://${subdomain}.craftmypage.com` : ''

  // Sort pages by order
  const pages = [...(content.pages || [])].sort((a, b) => a.order - b.order)
  const navPages = pages.filter(p => p.showInNav)

  // Build nav links JSON for embedding in generated pages
  const navLinksJson = JSON.stringify(navPages.map(p => ({
    slug: p.slug,
    title: escapeHtml(p.title),
    href: `${p.slug}.html`,
  })))

  // Generate the homepage (index.html) with the full single-page layout + multi-page nav
  files.set('index.html', generateHomePage(content, subdomain, navLinksJson, analyticsToken, showBranding))

  // Generate each sub-page
  for (const page of pages) {
    const pageHtml = generateSubPage({
      page,
      businessName,
      description,
      canonicalUrl,
      navLinksJson,
      dark,
      light,
      analyticsToken,
      showBranding,
    })
    files.set(`${page.slug}.html`, pageHtml)
  }

  return files
}

/**
 * Generate the homepage HTML with multi-page navigation links injected.
 * Reuses generateStaticSite output but injects nav links to sub-pages.
 */
function generateHomePage(
  content: SiteContent,
  subdomain: string | undefined,
  navLinksJson: string,
  analyticsToken?: string,
  showBranding: boolean = true,
): string {
  let html = generateStaticSite(content, subdomain, analyticsToken, showBranding)

  // Inject multi-page nav links into the SITE object
  html = html.replace(
    'const SITE = {',
    `const NAV_PAGES = ${navLinksJson};\n    const SITE = {`
  )

  // Inject sub-page links after the Contact nav link
  html = html.replace(
    '<a href="#contact" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Contact</a>',
    `<a href="#contact" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Contact</a>
                {NAV_PAGES.map((np, i) => (
                  <a key={i} href={np.href} className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>{np.title}</a>
                ))}`
  )

  return html
}

interface SubPageParams {
  page: NonNullable<SiteContent['pages']>[number]
  businessName: string
  description: string
  canonicalUrl: string
  navLinksJson: string
  dark: (typeof PALETTES)[PaletteKey]
  light: (typeof LIGHT_PALETTES)[PaletteKey]
  analyticsToken?: string
  showBranding?: boolean
}

/**
 * Generate a sub-page HTML file.
 * Content is owner-provided (not user-generated input) and rendered via
 * React's dangerouslySetInnerHTML on the static site the owner controls.
 */
function generateSubPage(params: SubPageParams): string {
  const { page, businessName, description, canonicalUrl, navLinksJson, dark, light, analyticsToken, showBranding = true } = params

  const pageTitle = `${escapeHtml(page.title)} — ${businessName}`
  const pageDescription = escapeHtml((page.content || '').replace(/<[^>]*>/g, '').slice(0, 160))
  const pageCanonical = canonicalUrl ? `${canonicalUrl}/${page.slug}.html` : ''
  const pageContent = page.content || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}" />
  <meta name="theme-color" content="${dark.accent.primary}" />
${pageCanonical ? `  <link rel="canonical" href="${pageCanonical}" />\n` : ''}\
  <!-- Open Graph -->
  <meta property="og:title" content="${pageTitle}" />
  <meta property="og:description" content="${pageDescription}" />
  <meta property="og:type" content="website" />
${pageCanonical ? `  <meta property="og:url" content="${pageCanonical}" />\n` : ''}\
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageTitle}" />
  <meta name="twitter:description" content="${pageDescription}" />

  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
  <link rel="preconnect" href="https://unpkg.com" crossorigin />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script>window.react = window.React;<\/script>
  <script src="https://unpkg.com/lucide-react@0.460.0/dist/umd/lucide-react.min.js"><\/script>
  <style>* { margin: 0; padding: 0; box-sizing: border-box; } html { scroll-behavior: smooth; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState } = React;
    const lucide = window.LucideReact || {};
    const { Sun, Moon, Mail, Phone, MapPin, ArrowLeft } = lucide;

    const NAV_PAGES = ${navLinksJson};
    const PAGE = {
      title: ${JSON.stringify(escapeHtml(page.title))},
      content: ${JSON.stringify(pageContent)},
      slug: ${JSON.stringify(page.slug)},
    };
    const SITE = {
      businessName: ${JSON.stringify(businessName)},
      description: ${JSON.stringify(description)},
    };

    function SubPage() {
      const [isDark, setIsDark] = useState(true);

      const themes = {
        dark: {
          bg: "${dark.bg.deep}",
          surface: "${dark.bg.surface}",
          elevated: "${dark.bg.elevated}",
          textPrimary: "${dark.text.primary}",
          textSecondary: "${dark.text.secondary}",
          textMuted: "${dark.text.muted}",
          accent: "${dark.accent.primary}",
          accentSecondary: "${dark.accent.secondary}",
          highlight: "${dark.accent.highlight}",
          borderSubtle: "${dark.border.subtle}",
          border: "${dark.border.default}",
        },
        light: {
          bg: "${light.bg.deep}",
          surface: "${light.bg.surface}",
          elevated: "${light.bg.elevated}",
          textPrimary: "${light.text.primary}",
          textSecondary: "${light.text.secondary}",
          textMuted: "${light.text.muted}",
          accent: "${light.accent.primary}",
          accentSecondary: "${light.accent.secondary}",
          highlight: "${light.accent.highlight}",
          borderSubtle: "${light.border.subtle}",
          border: "${light.border.default}",
        },
      };

      const t = isDark ? themes.dark : themes.light;

      // Content is provided by the site owner, not end-user input
      const contentMarkup = { __html: PAGE.content };

      return (
        <div style={{ backgroundColor: t.bg, color: t.textPrimary, minHeight: "100vh" }}>
          {/* Nav */}
          <header aria-label="Site header">
            <nav className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-4" aria-label="Main navigation">
              <a href="index.html" className="text-xl font-bold hover:opacity-80" style={{ color: t.textPrimary, textDecoration: "none" }}>{SITE.businessName}</a>
              <div className="flex items-center gap-6">
                <a href="index.html" className="hidden md:block text-sm hover:opacity-80" style={{ color: t.textSecondary }}>Home</a>
                {NAV_PAGES.map((np, i) => (
                  <a
                    key={i}
                    href={np.href}
                    className={"hidden md:block text-sm hover:opacity-80" + (np.slug === PAGE.slug ? " font-semibold" : "")}
                    style={{ color: np.slug === PAGE.slug ? t.accent : t.textSecondary }}
                  >
                    {np.title}
                  </a>
                ))}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: t.surface }}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </nav>
          </header>

          <main>
            {/* Page hero */}
            <section
              className="py-16 md:py-24 flex flex-col justify-center items-center text-center px-4"
              style={{ background: isDark ? "${dark.gradient}" : "${light.gradient}" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight font-bold mb-4 max-w-4xl">
                {PAGE.title}
              </h1>
              <a href="index.html" className="inline-flex items-center gap-2 text-sm mt-4 hover:opacity-80" style={{ color: t.textSecondary, textDecoration: "none" }}>
                <ArrowLeft className="w-4 h-4" /> Back to home
              </a>
            </section>

            {/* Page content */}
            <section className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-12">
              <div
                className="max-w-3xl mx-auto prose prose-lg"
                style={{ color: t.textSecondary }}
                dangerouslySetInnerHTML={contentMarkup}
              />
            </section>
          </main>

          {/* Footer */}
          <footer className="py-12 md:py-16 px-4 md:px-8 lg:px-12" style={{ backgroundColor: t.surface }}>
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-lg font-semibold mb-4">{SITE.businessName}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: t.textSecondary }}>
                {SITE.description}
              </p>
              <div className="flex justify-center gap-6 mb-6">
                <a href="index.html" className="text-sm hover:underline" style={{ color: t.textSecondary }}>Home</a>
                {NAV_PAGES.map((np, i) => (
                  <a key={i} href={np.href} className="text-sm hover:underline" style={{ color: t.textSecondary }}>{np.title}</a>
                ))}
              </div>
              <div className="pt-6 text-xs border-t" style={{ borderColor: t.borderSubtle, color: t.textMuted }}>
                &copy; ${new Date().getFullYear()} {SITE.businessName}. All rights reserved.
              </div>
${showBranding ? `              <div className="mt-4">
                <a href="https://craftmypage.com" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] opacity-40 hover:opacity-70 transition-opacity" style={{ color: t.textMuted }}>
                  Created with CraftMyPage
                </a>
              </div>` : ''}
            </div>
          </footer>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(SubPage));
  <\/script>
${analyticsToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${analyticsToken}"}'></script>` : ''}
</body>
</html>`
}
