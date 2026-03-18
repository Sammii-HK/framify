// ---------------------------------------------------------------------------
// Shared template and palette data used by the gallery and detail pages
// ---------------------------------------------------------------------------

export type PageType = 'single' | 'multi'
export type CategoryType = 'all' | 'services' | 'food-hospitality' | 'creative' | 'professional' | 'health-wellness' | 'retail' | 'tech'

export interface Palette {
  id: string
  name: string
  category: string
  darkBg: string
  lightBg: string
  accent: string
  darkText: string
  lightText: string
}

export interface Template {
  type: string
  name: string
  description: string
  bestFor: string
  pages: PageType
  pageCount?: number
  mockupStyle: string
  category: CategoryType
}

export interface TemplateDetail {
  name: string
  description: string
  longDescription: string
  bestFor: string
  features: { title: string; description: string }[]
  layoutSections: string[]
}

// ---------------------------------------------------------------------------
// Industry categories
// ---------------------------------------------------------------------------

export const categories: { key: CategoryType; label: string }[] = [
  { key: 'all', label: 'All industries' },
  { key: 'services', label: 'Services' },
  { key: 'food-hospitality', label: 'Food and hospitality' },
  { key: 'creative', label: 'Creative' },
  { key: 'professional', label: 'Professional' },
  { key: 'health-wellness', label: 'Health and wellness' },
  { key: 'retail', label: 'Retail' },
  { key: 'tech', label: 'Tech' },
]

// ---------------------------------------------------------------------------
// Colour palettes
// ---------------------------------------------------------------------------

export const palettes: Palette[] = [
  // Celestial / spiritual
  { id: 'dark-celestial', name: 'Dark Celestial', category: 'celestial', darkBg: '#0D0B1A', lightBg: '#F5F0E8', accent: '#C9A84C', darkText: '#F5F0E8', lightText: '#1a1a2e' },
  { id: 'ethereal-light', name: 'Ethereal Light', category: 'celestial', darkBg: '#1B1833', lightBg: '#F8F6FC', accent: '#9B8EC4', darkText: '#E8E4F0', lightText: '#2D2B3D' },
  { id: 'crystal-rose', name: 'Crystal Rose', category: 'celestial', darkBg: '#1A1517', lightBg: '#FDF2F4', accent: '#D4A0A0', darkText: '#F0E6E8', lightText: '#2d1f23' },
  // Nature / organic
  { id: 'earthy-sage', name: 'Earthy Sage', category: 'nature', darkBg: '#1A1F1A', lightBg: '#F0EDE4', accent: '#8B9A6B', darkText: '#E8E0D4', lightText: '#1a1f1a' },
  { id: 'warm-amber', name: 'Warm Amber', category: 'nature', darkBg: '#1F1710', lightBg: '#F5EDE0', accent: '#D4943A', darkText: '#F0E8DC', lightText: '#1f1710' },
  // Professional / corporate
  { id: 'steel-blue', name: 'Steel Blue', category: 'professional', darkBg: '#0F1923', lightBg: '#EEF2F7', accent: '#4A90D9', darkText: '#E8EDF2', lightText: '#0f1923' },
  { id: 'slate-grey', name: 'Slate Grey', category: 'professional', darkBg: '#18181B', lightBg: '#F4F4F5', accent: '#71717A', darkText: '#E4E4E7', lightText: '#27272A' },
  { id: 'navy-gold', name: 'Navy Gold', category: 'professional', darkBg: '#0C1220', lightBg: '#F0F2F8', accent: '#B8860B', darkText: '#E0E4ED', lightText: '#1a2035' },
  // Bold / modern
  { id: 'electric-coral', name: 'Electric Coral', category: 'bold', darkBg: '#1A1118', lightBg: '#FFF5F5', accent: '#FF6B6B', darkText: '#F0E4E8', lightText: '#2d1b28' },
  { id: 'fresh-mint', name: 'Fresh Mint', category: 'bold', darkBg: '#0F1A17', lightBg: '#F0FAF7', accent: '#34D399', darkText: '#D1FAE5', lightText: '#064E3B' },
  { id: 'vivid-indigo', name: 'Vivid Indigo', category: 'bold', darkBg: '#110F24', lightBg: '#F0EEFF', accent: '#6366F1', darkText: '#E0E0FF', lightText: '#1e1b4b' },
  // Warm / welcoming
  { id: 'terracotta', name: 'Terracotta', category: 'warm', darkBg: '#1C1410', lightBg: '#FDF6F0', accent: '#C2703E', darkText: '#F0E0D0', lightText: '#3b2518' },
]

// ---------------------------------------------------------------------------
// Templates (gallery list)
// ---------------------------------------------------------------------------

export const templates: Template[] = [
  // Single-page
  { type: 'standard', name: 'Standard', description: 'A clean, versatile layout that works for any business. Hero section, services grid, testimonials, and contact form.', bestFor: 'Any business', pages: 'single', mockupStyle: 'grid-3', category: 'services' },
  { type: 'trades', name: 'Trades and Services', description: 'Built for businesses that work with their hands. Project gallery, service area map, and quote request form.', bestFor: 'Plumbers, builders, electricians, roofers', pages: 'single', mockupStyle: 'split-gallery', category: 'services' },
  { type: 'hair-beauty', name: 'Hair and Beauty', description: 'Designed to showcase your craft. Portfolio grid, price list, and booking integration ready.', bestFor: 'Salons, spas, barbers, nail techs', pages: 'single', mockupStyle: 'gallery-4', category: 'health-wellness' },
  { type: 'food-drink', name: 'Food and Drink', description: 'Put your menu front and centre. Opening hours, location map, and reservation links included.', bestFor: 'Restaurants, cafes, pubs, bakeries', pages: 'single', mockupStyle: 'menu-list', category: 'food-hospitality' },
  { type: 'portfolio', name: 'Portfolio', description: 'Let your work do the talking. Full-width image grid, case studies, and a minimal aesthetic.', bestFor: 'Photographers, designers, artists, videographers', pages: 'single', mockupStyle: 'grid-6', category: 'creative' },
  { type: 'professional', name: 'Professional', description: 'Establish authority and trust. Credentials section, client logos, and a clean content-first layout.', bestFor: 'Consultants, coaches, accountants, solicitors', pages: 'single', mockupStyle: 'grid-3', category: 'professional' },
  { type: 'health-fitness', name: 'Health and Fitness', description: 'Class timetable, trainer profiles, and booking integration. Built for active businesses.', bestFor: 'Personal trainers, gyms, yoga studios, sports coaches', pages: 'single', mockupStyle: 'timetable', category: 'health-wellness' },
  { type: 'events', name: 'Events and Entertainment', description: 'Showcase your showreel, list packages, and let clients check availability.', bestFor: 'DJs, entertainers, venues, event planners', pages: 'single', mockupStyle: 'hero-wide', category: 'food-hospitality' },
  { type: 'pet-services', name: 'Pet Services', description: 'Service area map, pricing tiers, and a gallery that wins hearts. Built for animal lovers.', bestFor: 'Dog groomers, walkers, vets, pet sitters', pages: 'single', mockupStyle: 'gallery-4', category: 'services' },
  { type: 'automotive', name: 'Automotive', description: 'MOT and service lists, before-and-after gallery, and quote request form.', bestFor: 'Garages, detailers, car dealers, mechanics', pages: 'single', mockupStyle: 'split-gallery', category: 'services' },
  { type: 'education', name: 'Education and Tutoring', description: 'Subject grid, qualification badges, testimonials, and booking form.', bestFor: 'Tutors, training providers, music teachers, driving instructors', pages: 'single', mockupStyle: 'grid-3', category: 'professional' },
  { type: 'property', name: 'Property and Lettings', description: 'Listings grid, valuation request form, and area guides. Built for the property market.', bestFor: 'Estate agents, landlords, property managers', pages: 'single', mockupStyle: 'listings', category: 'professional' },
  { type: 'medical', name: 'Medical and Dental', description: 'Service list, team credentials, patient booking, and trust signals throughout.', bestFor: 'Clinics, dentists, physios, opticians', pages: 'single', mockupStyle: 'grid-3', category: 'health-wellness' },
  { type: 'creative-agency', name: 'Creative Agency', description: 'Bold case studies, client logos, team section, and a strong visual identity.', bestFor: 'Design studios, marketing agencies, dev shops', pages: 'single', mockupStyle: 'hero-wide', category: 'creative' },
  { type: 'shop', name: 'Shop', description: 'Product grid, category filters, and a clean layout ready for e-commerce integration.', bestFor: 'Boutiques, gift shops, artisan sellers, online stores', pages: 'single', mockupStyle: 'product-grid', category: 'retail' },
  // Multi-page
  { type: 'business-pro', name: 'Business Pro', description: 'A full multi-page website with Home, About, Services, Blog, and Contact pages. Everything a growing business needs.', bestFor: 'Established businesses, agencies, consultancies', pages: 'multi', pageCount: 6, mockupStyle: 'multi-tabs', category: 'professional' },
  { type: 'startup', name: 'Startup', description: 'Landing page with product features, pricing table, team profiles, blog, and a clear sign-up funnel.', bestFor: 'SaaS startups, tech companies, app launches', pages: 'multi', pageCount: 5, mockupStyle: 'multi-tabs', category: 'tech' },
  { type: 'restaurant-full', name: 'Restaurant Full', description: 'Multi-page site with dedicated menu, gallery, events, reservations, and about pages.', bestFor: 'Restaurants, bars, hotels, catering businesses', pages: 'multi', pageCount: 6, mockupStyle: 'multi-tabs', category: 'food-hospitality' },
  { type: 'portfolio-full', name: 'Portfolio Full', description: 'Multi-page portfolio with individual case study pages, an about section, blog, and contact form.', bestFor: 'Freelancers, architects, interior designers', pages: 'multi', pageCount: 5, mockupStyle: 'multi-tabs', category: 'creative' },
  { type: 'clinic', name: 'Clinic', description: 'Full clinic site with service pages, team profiles, patient information, FAQs, and booking.', bestFor: 'Dental practices, physio clinics, veterinary surgeries', pages: 'multi', pageCount: 7, mockupStyle: 'multi-tabs', category: 'health-wellness' },
  { type: 'property-full', name: 'Property Full', description: 'Multi-page site with listings, area guides, valuation tool, team profiles, and blog.', bestFor: 'Estate agents, letting agencies, property developers', pages: 'multi', pageCount: 6, mockupStyle: 'multi-tabs', category: 'professional' },
]

// ---------------------------------------------------------------------------
// Template detail data (for the [type] detail page)
// ---------------------------------------------------------------------------

export const templateDetails: Record<string, TemplateDetail> = {
  standard: {
    name: 'Standard',
    description: 'A clean, versatile layout that works for any business.',
    longDescription: 'The Standard template is designed to work for every type of business. It features a strong hero section, a flexible services grid, customer testimonials, and a built-in contact form. Whether you run a local shop or a consultancy, this layout adapts to your content.',
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
    longDescription: 'The Trades template is purpose-built for tradespeople. It includes a project gallery to show off your best work, a service area section so customers know you cover their location, and a quote request form that captures the details you need. There is also space for accreditations and an emergency callout banner.',
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
    longDescription: 'The Hair and Beauty template puts your portfolio front and centre. It includes a stunning image gallery, a clear price list layout, booking integration, and team profile cards. The design feels premium and polished, matching the quality of the services you provide.',
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
    longDescription: 'The Food and Drink template is designed for restaurants, cafes, pubs, and bakeries. Your menu is the star, displayed in a clean format that is easy to read on any device. Location, opening hours, and a reservation link are all prominently featured so customers can find you and book a table.',
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
    longDescription: 'The Portfolio template is built for creatives who want their work to take centre stage. Full-width imagery, a minimal navigation, and a case study layout ensure the focus stays on what you have made. Client logos and a brief about section add credibility without cluttering the page.',
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
    longDescription: 'The Professional template is designed for service providers who need to build credibility. A credentials section, client logos, and testimonial carousel work together to demonstrate your expertise. The clean, content-first layout puts your message ahead of distractions, with a lead capture form to convert visitors into clients.',
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

// Helper to find a template by type
export function getTemplateByType(type: string): Template | undefined {
  return templates.find((t) => t.type === type)
}

// Helper to get detail data, falling back to standard
export function getTemplateDetail(type: string): TemplateDetail {
  return templateDetails[type] || templateDetails.standard
}
