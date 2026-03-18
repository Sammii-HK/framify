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
  layoutSections: string[]  // Used for single-page templates (or default page for multi)
  pages?: { name: string; sections: string[] }[]  // For multi-page templates
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
  'health-fitness': {
    name: 'Health and Fitness',
    description: 'Built for active businesses that run on schedules and energy.',
    longDescription: 'The Health and Fitness template is designed around how fitness businesses actually operate. A class timetable grid lets visitors see what is on and when, trainer profiles build personal connection, and a booking call to action makes it easy to sign up. Testimonials from real clients add social proof, and the layout feels dynamic without being cluttered.',
    bestFor: 'Personal trainers, gyms, yoga studios, sports coaches',
    features: [
      { title: 'Class timetable', description: 'A visual grid of time slots and classes so visitors can find a session that fits their schedule.' },
      { title: 'Trainer profiles', description: 'Individual cards for each trainer with their photo, specialities, and qualifications.' },
      { title: 'Booking call to action', description: 'A prominent button linking to your booking system so visitors can sign up in seconds.' },
      { title: 'Testimonials section', description: 'Real client stories that show the results people are getting with your business.' },
      { title: 'Pricing tiers', description: 'Clear membership or session pricing displayed in an easy-to-compare layout.' },
      { title: 'Mobile-first design', description: 'Clients checking the timetable on their phone get a fast, clean experience.' },
    ],
    layoutSections: ['nav', 'hero', 'timetable', 'team', 'testimonials', 'booking-cta', 'footer'],
  },
  events: {
    name: 'Events and Entertainment',
    description: 'Showcase your talent and let clients book with confidence.',
    longDescription: 'The Events and Entertainment template is built for performers, venues, and event planners who need to make a strong first impression. A full-width hero sets the tone, an image grid acts as your showreel, and a package price list makes it simple for clients to understand what they are getting. Testimonials and a contact form close the deal.',
    bestFor: 'DJs, entertainers, venues, event planners',
    features: [
      { title: 'Full-width hero', description: 'A cinematic header area with your best photo or video background to grab attention instantly.' },
      { title: 'Showreel gallery', description: 'An image grid showcasing your past events, performances, or venue setups.' },
      { title: 'Package price list', description: 'Clear pricing for different packages so clients can compare and choose.' },
      { title: 'Testimonials', description: 'Glowing reviews from past clients that build trust and excitement.' },
      { title: 'Availability enquiry', description: 'A contact form tailored for event bookings with date and event type fields.' },
      { title: 'Video embed support', description: 'Space to embed showreel videos from YouTube or Vimeo directly on the page.' },
    ],
    layoutSections: ['nav', 'hero-fullwidth', 'image-grid', 'price-list', 'testimonials', 'contact', 'footer'],
  },
  'pet-services': {
    name: 'Pet Services',
    description: 'Win hearts with a gallery-led layout built for animal lovers.',
    longDescription: 'The Pet Services template knows that a great photo of a happy dog does more selling than any paragraph of text. A gallery grid takes pride of place, followed by a clear services breakdown and pricing. Testimonials from happy pet owners and a simple contact form round out a page that feels warm, trustworthy, and professional.',
    bestFor: 'Dog groomers, walkers, vets, pet sitters',
    features: [
      { title: 'Pet photo gallery', description: 'A grid of adorable pet photos that instantly builds an emotional connection with visitors.' },
      { title: 'Services grid', description: 'A clear breakdown of everything you offer, from grooming to walking to overnight stays.' },
      { title: 'Testimonials', description: 'Reviews from pet owners who trust you with their animals.' },
      { title: 'Service area display', description: 'Let customers know which areas you cover so they can check before enquiring.' },
      { title: 'Pricing breakdown', description: 'Transparent pricing displayed in a clean, scannable format.' },
      { title: 'Contact form', description: 'A simple form for new clients to get in touch and book their first visit.' },
    ],
    layoutSections: ['nav', 'hero', 'gallery-grid', 'services-grid', 'testimonials', 'contact', 'footer'],
  },
  automotive: {
    name: 'Automotive',
    description: 'Service lists, before-and-after shots, and instant quote requests.',
    longDescription: 'The Automotive template is built for garages, detailers, and mechanics who need to show the quality of their work. A before-and-after gallery grid demonstrates results visually, a services grid covers everything from MOTs to full restorations, and an accreditations bar displays industry certifications. The quote request form captures vehicle details upfront so you can respond with an accurate estimate.',
    bestFor: 'Garages, detailers, car dealers, mechanics',
    features: [
      { title: 'Emergency banner', description: 'A prominent banner for breakdown or urgent repair services with a click-to-call number.' },
      { title: 'Before-and-after gallery', description: 'Side-by-side photo grids showing the quality of your work on real vehicles.' },
      { title: 'Services grid', description: 'A comprehensive list of services from MOTs and servicing to bodywork and detailing.' },
      { title: 'Accreditations bar', description: 'Display RAC, AA, or manufacturer-approved certifications prominently.' },
      { title: 'Quote request form', description: 'A tailored form capturing vehicle make, model, and job details for accurate estimates.' },
      { title: 'Trust signals', description: 'Years of experience, vehicles serviced, and customer ratings displayed clearly.' },
    ],
    layoutSections: ['nav', 'emergency-banner', 'hero', 'gallery-grid', 'services-grid', 'accreditations', 'quote-form', 'footer'],
  },
  education: {
    name: 'Education and Tutoring',
    description: 'Qualification badges, subject grids, and easy booking.',
    longDescription: 'The Education and Tutoring template is designed for tutors, training providers, and instructors who need to demonstrate expertise and make booking simple. A credentials section highlights your qualifications, a subject grid makes it easy for students to find the right course, and testimonials from past learners build confidence. A booking call to action links directly to your scheduling tool.',
    bestFor: 'Tutors, training providers, music teachers, driving instructors',
    features: [
      { title: 'Subject grid', description: 'A visual grid of subjects or courses you teach, making it easy for students to find what they need.' },
      { title: 'Qualification badges', description: 'Display your teaching qualifications, DBS checks, and professional memberships.' },
      { title: 'Testimonials', description: 'Success stories from students and parents that demonstrate your teaching impact.' },
      { title: 'Booking call to action', description: 'A clear button linking to your scheduling tool for trial lessons or consultations.' },
      { title: 'Pricing table', description: 'Session rates displayed clearly with options for different lesson lengths or packages.' },
      { title: 'About section', description: 'Your teaching philosophy and experience presented in a warm, approachable layout.' },
    ],
    layoutSections: ['nav', 'hero', 'credentials', 'services-grid', 'testimonials', 'booking-cta', 'footer'],
  },
  property: {
    name: 'Property and Lettings',
    description: 'Listings grid, valuation forms, and area authority.',
    longDescription: 'The Property and Lettings template is purpose-built for estate agents and letting agencies. An image grid showcases current listings, a services section covers valuations, lettings, and sales, and a lead capture form converts visitors into valuation requests. Testimonials from satisfied sellers and landlords add credibility in a competitive market.',
    bestFor: 'Estate agents, landlords, property managers',
    features: [
      { title: 'Property listings grid', description: 'An image grid displaying your current properties with key details visible at a glance.' },
      { title: 'Services breakdown', description: 'Clear sections for sales, lettings, property management, and valuations.' },
      { title: 'Valuation request form', description: 'A lead capture form that gathers property details for free valuation requests.' },
      { title: 'Testimonials', description: 'Reviews from sellers, buyers, and landlords who have worked with you.' },
      { title: 'Area expertise', description: 'Position yourself as the local expert with area knowledge and market insights.' },
      { title: 'Trust signals', description: 'Professional body memberships, years in business, and properties sold figures.' },
    ],
    layoutSections: ['nav', 'hero', 'image-grid', 'services-grid', 'testimonials', 'lead-form', 'footer'],
  },
  medical: {
    name: 'Medical and Dental',
    description: 'Trust-first design with credentials, team profiles, and patient booking.',
    longDescription: 'The Medical and Dental template prioritises trust at every level. A services grid covers treatments clearly, team profiles with credentials reassure patients they are in safe hands, and a booking call to action reduces friction for new appointments. The clean, professional layout avoids anything flashy, focusing instead on clarity and confidence.',
    bestFor: 'Clinics, dentists, physios, opticians',
    features: [
      { title: 'Treatment services grid', description: 'A clear grid of treatments and services with descriptions that patients can easily understand.' },
      { title: 'Team profiles', description: 'Individual cards for each practitioner with their photo, qualifications, and specialities.' },
      { title: 'Credentials display', description: 'Professional registrations, CQC ratings, and accreditations displayed prominently.' },
      { title: 'Patient testimonials', description: 'Reviews from real patients that build confidence in your practice.' },
      { title: 'Booking call to action', description: 'A prominent button linking to your patient booking system.' },
      { title: 'Accessibility focused', description: 'Clean typography and high contrast ensure the site is easy to read for all visitors.' },
    ],
    layoutSections: ['nav', 'hero', 'services-grid', 'team', 'credentials', 'testimonials', 'booking-cta', 'footer'],
  },
  'creative-agency': {
    name: 'Creative Agency',
    description: 'Bold visuals, case studies, and a strong studio identity.',
    longDescription: 'The Creative Agency template is designed for studios and agencies that need their website to reflect the quality of their work. A full-width hero makes a bold first impression, a portfolio grid showcases case studies, and client logos add commercial credibility. The minimal navigation and clean contact section keep the focus on your creative output.',
    bestFor: 'Design studios, marketing agencies, dev shops',
    features: [
      { title: 'Full-width hero', description: 'A bold, cinematic header that sets the tone for your agency brand immediately.' },
      { title: 'Case study grid', description: 'A portfolio grid displaying your best projects with visual thumbnails and titles.' },
      { title: 'Client logos', description: 'A logo bar showing the brands you have worked with for instant credibility.' },
      { title: 'Team section', description: 'Introduce your team with photos and roles to put faces to the work.' },
      { title: 'Minimal navigation', description: 'A stripped-back header that keeps the visual focus on your portfolio.' },
      { title: 'Contact section', description: 'A clean, minimal contact area for new business enquiries.' },
    ],
    layoutSections: ['nav-minimal', 'hero-fullwidth', 'portfolio-grid', 'client-logos', 'team', 'contact-minimal', 'footer'],
  },
  shop: {
    name: 'Shop',
    description: 'Product grids, featured items, and a layout ready for commerce.',
    longDescription: 'The Shop template is built for retail businesses that want to showcase products online. An image grid displays your catalogue, a featured items section highlights bestsellers or new arrivals, and testimonials from happy customers build buying confidence. The layout is clean and browsable, designed to work whether you sell handmade candles or vintage furniture.',
    bestFor: 'Boutiques, gift shops, artisan sellers, online stores',
    features: [
      { title: 'Product image grid', description: 'A visual catalogue displaying your products in a clean, browsable grid layout.' },
      { title: 'Featured items', description: 'A highlighted section for bestsellers, new arrivals, or seasonal picks.' },
      { title: 'Customer testimonials', description: 'Reviews from happy buyers that build trust and encourage purchases.' },
      { title: 'Category organisation', description: 'Products grouped by category so visitors can find what they are looking for quickly.' },
      { title: 'Contact and ordering', description: 'A form for custom orders, wholesale enquiries, or general questions.' },
      { title: 'Brand story section', description: 'Space to tell the story behind your products and what makes them special.' },
    ],
    layoutSections: ['nav', 'hero', 'image-grid', 'price-list', 'testimonials', 'contact', 'footer'],
  },
  'business-pro': {
    name: 'Business Pro',
    description: 'A complete multi-page website for established businesses.',
    longDescription: 'The Business Pro template gives you a full multi-page website with six dedicated pages. Each page is structured for a specific purpose, from showcasing services and team members to publishing blog content and capturing leads. It is designed for businesses that have outgrown a single page and need room to grow.',
    bestFor: 'Established businesses, agencies, consultancies',
    features: [
      { title: 'Six dedicated pages', description: 'Home, About, Services, Portfolio, Blog, and Contact pages each with their own layout.' },
      { title: 'Services with pricing', description: 'A dedicated services page with detailed descriptions and a pricing breakdown.' },
      { title: 'Team and credentials', description: 'An about page featuring team profiles and professional credentials.' },
      { title: 'Portfolio gallery', description: 'A standalone page to showcase your best work with an image grid layout.' },
      { title: 'Blog-ready layout', description: 'A blog page for articles, case studies, and industry insights.' },
      { title: 'Lead capture contact', description: 'A contact page with form, office hours, and location details.' },
    ],
    layoutSections: ['nav', 'hero', 'services-grid', 'testimonials', 'contact', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav', 'hero', 'services-grid', 'testimonials', 'contact', 'footer'] },
      { name: 'About', sections: ['nav', 'hero', 'team', 'credentials', 'client-logos', 'footer'] },
      { name: 'Services', sections: ['nav', 'hero', 'services-grid', 'price-list', 'footer'] },
      { name: 'Portfolio', sections: ['nav', 'hero', 'image-grid', 'footer'] },
      { name: 'Blog', sections: ['nav', 'hero', 'services-grid', 'footer'] },
      { name: 'Contact', sections: ['nav', 'hero', 'contact', 'hours-location', 'footer'] },
    ],
  },
  startup: {
    name: 'Startup',
    description: 'Product-led pages with features, pricing, and a sign-up funnel.',
    longDescription: 'The Startup template is designed for tech companies and SaaS products that need to convert visitors into users. A bold landing page leads with your value proposition, a features page breaks down what your product does, and a pricing page makes the decision easy. Team profiles add a human element, and a clean contact page handles sales enquiries.',
    bestFor: 'SaaS startups, tech companies, app launches',
    features: [
      { title: 'Five focused pages', description: 'Home, Features, Pricing, Team, and Contact pages structured for conversion.' },
      { title: 'Feature showcase', description: 'A dedicated features page with visual grids and detailed descriptions.' },
      { title: 'Pricing table', description: 'A clear pricing page with tier comparison to help visitors choose a plan.' },
      { title: 'Social proof', description: 'Client logos and testimonials placed strategically to build confidence.' },
      { title: 'Team profiles', description: 'A team page with photos, roles, and credentials to humanise your brand.' },
      { title: 'Conversion-focused layout', description: 'Every page is designed with a clear call to action driving towards sign-up.' },
    ],
    layoutSections: ['nav', 'hero-fullwidth', 'services-grid', 'client-logos', 'testimonials', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav', 'hero-fullwidth', 'services-grid', 'client-logos', 'testimonials', 'footer'] },
      { name: 'Features', sections: ['nav', 'hero', 'services-grid', 'image-grid', 'footer'] },
      { name: 'Pricing', sections: ['nav', 'hero', 'price-list', 'testimonials', 'footer'] },
      { name: 'Team', sections: ['nav', 'hero', 'team', 'credentials', 'footer'] },
      { name: 'Contact', sections: ['nav', 'hero', 'contact', 'footer'] },
    ],
  },
  'restaurant-full': {
    name: 'Restaurant Full',
    description: 'A complete restaurant site with menu, gallery, events, and reservations.',
    longDescription: 'The Restaurant Full template gives food and hospitality businesses a proper multi-page website. A dedicated menu page handles your full offerings, a gallery showcases your food and venue, an events page promotes what is coming up, and a reservation system makes booking easy. The about page tells your story, and the contact page ensures you are always reachable.',
    bestFor: 'Restaurants, bars, hotels, catering businesses',
    features: [
      { title: 'Six dedicated pages', description: 'Home, Menu, Gallery, Events, About, and Contact pages each purpose-built.' },
      { title: 'Full menu display', description: 'A dedicated menu page with multiple sections for starters, mains, desserts, and drinks.' },
      { title: 'Photo gallery', description: 'A standalone gallery page for food photography, interior shots, and event photos.' },
      { title: 'Events listing', description: 'A page for upcoming events, live music nights, and seasonal specials.' },
      { title: 'Reservation system', description: 'Booking integration on the home page for easy table reservations.' },
      { title: 'Chef and team profiles', description: 'An about page introducing your team with their background and specialities.' },
    ],
    layoutSections: ['nav', 'hero-fullwidth', 'specials-banner', 'testimonials', 'reservation', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav', 'hero-fullwidth', 'specials-banner', 'testimonials', 'reservation', 'footer'] },
      { name: 'Menu', sections: ['nav', 'hero', 'menu-list', 'menu-list', 'footer'] },
      { name: 'Gallery', sections: ['nav', 'hero', 'image-grid', 'portfolio-grid', 'footer'] },
      { name: 'Events', sections: ['nav', 'hero', 'services-grid', 'booking-cta', 'footer'] },
      { name: 'About', sections: ['nav', 'hero', 'team', 'credentials', 'footer'] },
      { name: 'Contact', sections: ['nav', 'hero', 'hours-location', 'contact', 'footer'] },
    ],
  },
  'portfolio-full': {
    name: 'Portfolio Full',
    description: 'A multi-page portfolio with case studies, blog, and about section.',
    longDescription: 'The Portfolio Full template expands the single-page portfolio into a complete creative website. A dedicated work page displays your projects in detail, an about page builds personal connection, a blog page positions you as a thought leader, and a minimal contact page makes it easy for clients to reach out. The design stays clean and focused on your visual work throughout.',
    bestFor: 'Freelancers, architects, interior designers',
    features: [
      { title: 'Five creative pages', description: 'Home, Work, About, Blog, and Contact pages designed for creative professionals.' },
      { title: 'Portfolio homepage', description: 'A full-width home page with your best work displayed in an impactful grid.' },
      { title: 'Detailed work page', description: 'A dedicated page for projects with both grid and detailed portfolio layouts.' },
      { title: 'Client logos', description: 'A logo bar on the home page showing the brands you have worked with.' },
      { title: 'Blog section', description: 'A page for writing about your process, industry trends, or project breakdowns.' },
      { title: 'Minimal contact', description: 'A clean contact page that matches the understated aesthetic of the rest of the site.' },
    ],
    layoutSections: ['nav-minimal', 'hero-fullwidth', 'portfolio-grid', 'client-logos', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav-minimal', 'hero-fullwidth', 'portfolio-grid', 'client-logos', 'footer'] },
      { name: 'Work', sections: ['nav-minimal', 'hero', 'image-grid', 'portfolio-grid', 'footer'] },
      { name: 'About', sections: ['nav-minimal', 'hero', 'team', 'credentials', 'footer'] },
      { name: 'Blog', sections: ['nav-minimal', 'hero', 'services-grid', 'footer'] },
      { name: 'Contact', sections: ['nav-minimal', 'hero', 'contact-minimal', 'footer'] },
    ],
  },
  clinic: {
    name: 'Clinic',
    description: 'A comprehensive clinic site with services, team, patient info, and booking.',
    longDescription: 'The Clinic template provides everything a healthcare practice needs across seven dedicated pages. Services and pricing are clearly laid out, team profiles with credentials build patient trust, a patient information page answers common questions, and booking calls to action appear throughout. The design prioritises clarity and professionalism, ensuring patients feel confident from their first visit to the site.',
    bestFor: 'Dental practices, physio clinics, veterinary surgeries',
    features: [
      { title: 'Seven dedicated pages', description: 'Home, Services, Team, Patients, FAQs, Blog, and Contact pages for a complete clinic presence.' },
      { title: 'Services with pricing', description: 'A dedicated services page with treatment descriptions and clear pricing.' },
      { title: 'Team credentials', description: 'Individual practitioner profiles with qualifications, registrations, and specialities.' },
      { title: 'Patient information', description: 'A page for new patient guides, what to expect, and preparation instructions.' },
      { title: 'FAQ section', description: 'A dedicated page answering common patient questions to reduce admin calls.' },
      { title: 'Multi-point booking', description: 'Booking calls to action on multiple pages so patients can book from anywhere on the site.' },
    ],
    layoutSections: ['nav', 'hero', 'services-grid', 'team', 'testimonials', 'booking-cta', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav', 'hero', 'services-grid', 'team', 'testimonials', 'booking-cta', 'footer'] },
      { name: 'Services', sections: ['nav', 'hero', 'services-grid', 'price-list', 'footer'] },
      { name: 'Team', sections: ['nav', 'hero', 'team', 'credentials', 'footer'] },
      { name: 'Patients', sections: ['nav', 'hero', 'services-grid', 'contact', 'footer'] },
      { name: 'FAQs', sections: ['nav', 'hero', 'services-grid', 'footer'] },
      { name: 'Blog', sections: ['nav', 'hero', 'services-grid', 'footer'] },
      { name: 'Contact', sections: ['nav', 'hero', 'hours-location', 'contact', 'booking-cta', 'footer'] },
    ],
  },
  'property-full': {
    name: 'Property Full',
    description: 'A multi-page estate agency site with listings, area guides, and team profiles.',
    longDescription: 'The Property Full template gives estate agents and letting agencies a comprehensive online presence. A listings page displays current properties with a portfolio-style grid, area guides position you as the local expert, team profiles build personal trust, and a blog page keeps your content fresh for SEO. The contact page captures valuation requests and general enquiries with office hours and location details.',
    bestFor: 'Estate agents, letting agencies, property developers',
    features: [
      { title: 'Six dedicated pages', description: 'Home, Listings, Area Guides, Team, Blog, and Contact pages for a complete agency site.' },
      { title: 'Property listings', description: 'A dedicated page with image grids and portfolio layouts for current properties.' },
      { title: 'Area guides', description: 'Local area content pages that demonstrate your market knowledge and boost SEO.' },
      { title: 'Team profiles', description: 'Individual agent profiles with their photo, credentials, and contact details.' },
      { title: 'Blog section', description: 'A page for market updates, property tips, and local news content.' },
      { title: 'Valuation capture', description: 'Contact forms and calls to action focused on generating valuation requests.' },
    ],
    layoutSections: ['nav', 'hero-fullwidth', 'image-grid', 'services-grid', 'testimonials', 'footer'],
    pages: [
      { name: 'Home', sections: ['nav', 'hero-fullwidth', 'image-grid', 'services-grid', 'testimonials', 'footer'] },
      { name: 'Listings', sections: ['nav', 'hero', 'image-grid', 'portfolio-grid', 'footer'] },
      { name: 'Area Guides', sections: ['nav', 'hero', 'services-grid', 'image-grid', 'footer'] },
      { name: 'Team', sections: ['nav', 'hero', 'team', 'credentials', 'footer'] },
      { name: 'Blog', sections: ['nav', 'hero', 'services-grid', 'footer'] },
      { name: 'Contact', sections: ['nav', 'hero', 'contact', 'hours-location', 'footer'] },
    ],
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
