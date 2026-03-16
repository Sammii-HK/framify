/**
 * Pre-configured demo site content for CraftMyPage portfolio pieces.
 *
 * Each entry includes realistic UK business details, services with GBP
 * pricing, testimonials, and a businessType field that maps to the
 * stock-images keyword system.
 */

import type { SiteContent } from '@/lib/site-generator'
import type { PaletteKey } from '@/lib/design-system'

// ---------------------------------------------------------------------------
// Extended type for demo sites (adds businessType for image matching)
// ---------------------------------------------------------------------------

export interface DemoSite extends SiteContent {
  businessType: string
}

// ---------------------------------------------------------------------------
// Demo site data
// ---------------------------------------------------------------------------

export const DEMO_SITES: DemoSite[] = [
  // ── Hartley Plumbing ────────────────────────────────────────────────
  {
    businessType: 'plumber',
    businessName: 'Hartley Plumbing',
    tagline: 'Reliable plumbing you can trust',
    description:
      'Family-run plumbing company serving Bristol and the surrounding areas. From emergency repairs to full bathroom installations, we deliver quality workmanship every time.',
    palette: 'earthy-sage' as PaletteKey,
    services: [
      {
        title: 'Emergency repairs',
        description:
          'Burst pipes, leaks and blockages fixed fast. We aim to be with you within the hour across the Bristol area.',
        price: 'From \u00a375',
        duration: '1-2 hours',
      },
      {
        title: 'Bathroom installation',
        description:
          'Complete bathroom design and fitting, from plumbing and tiling to the finishing touches.',
        price: 'From \u00a32,500',
        duration: '5-7 days',
      },
      {
        title: 'Boiler servicing',
        description:
          'Annual gas boiler service to keep your heating running safely and efficiently. Gas Safe registered.',
        price: '\u00a389',
        duration: '1 hour',
      },
    ],
    testimonials: [
      {
        quote:
          'Called at 7am with a burst pipe and Dave was here by 8. Fixed it quickly and left everything spotless. Absolute lifesaver.',
        name: 'Sarah M.',
        role: 'Homeowner, Clifton',
      },
      {
        quote:
          'Hartley Plumbing did our entire bathroom refit. The attention to detail was brilliant and they finished on time.',
        name: 'James T.',
        role: 'Homeowner, Redland',
      },
      {
        quote:
          'We have used them for years for our rental properties. Always professional, always fair on price.',
        name: 'Karen L.',
        role: 'Landlord, Bristol',
      },
    ],
    contact: {
      email: 'info@hartleyplumbing.co.uk',
      phone: '0117 496 2301',
      location: 'Bristol, BS1',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },

  // ── Rose & Thorn Salon ─────────────────────────────────────────────
  {
    businessType: 'salon',
    businessName: 'Rose & Thorn Salon',
    tagline: 'Where style meets substance',
    description:
      'A modern hair salon in the heart of Manchester. We specialise in colour, cuts and styling for all hair types, using only cruelty-free products.',
    palette: 'crystal-rose' as PaletteKey,
    services: [
      {
        title: 'Cut and blow dry',
        description:
          'Precision cutting tailored to your face shape and lifestyle, finished with a professional blow dry.',
        price: 'From \u00a345',
        duration: '45 mins',
      },
      {
        title: 'Full colour',
        description:
          'Root-to-tip colour using ammonia-free formulas. Includes a consultation to find your perfect shade.',
        price: 'From \u00a385',
        duration: '2 hours',
      },
      {
        title: 'Balayage',
        description:
          'Hand-painted highlights for a natural, sun-kissed finish. Low maintenance and beautifully blended.',
        price: 'From \u00a3120',
        duration: '3 hours',
      },
    ],
    testimonials: [
      {
        quote:
          'Best balayage I have ever had. The colour is so natural and the grow-out is seamless. Already booked my next appointment.',
        name: 'Emily R.',
        role: 'Client, Didsbury',
      },
      {
        quote:
          'I have been going to Rose and Thorn for two years now. The team really listen and the vibe is so relaxed.',
        name: 'Priya K.',
        role: 'Client, Chorlton',
      },
      {
        quote:
          'Finally found a salon that understands curly hair. My curls have never looked this good.',
        name: 'Ava S.',
        role: 'Client, Northern Quarter',
      },
    ],
    contact: {
      email: 'hello@roseandthorn.co.uk',
      phone: '0161 234 5678',
      location: 'Manchester, M1',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },

  // ── The Oak Kitchen ─────────────────────────────────────────────────
  {
    businessType: 'restaurant',
    businessName: 'The Oak Kitchen',
    tagline: 'Seasonal British dining',
    description:
      'A neighbourhood restaurant in Edinburgh serving modern British food made from locally sourced, seasonal ingredients. Relaxed atmosphere, serious cooking.',
    palette: 'earthy-sage' as PaletteKey,
    services: [
      {
        title: 'A la carte dining',
        description:
          'Our seasonal menu changes weekly, built around the best produce from Scottish farms and coastal suppliers.',
        price: 'Mains from \u00a318',
        duration: 'Lunch & dinner',
      },
      {
        title: 'Sunday roast',
        description:
          'Slow-roasted meats with all the trimmings. Booking recommended as tables fill quickly.',
        price: '\u00a322 per person',
        duration: 'Sundays 12-4pm',
      },
      {
        title: 'Private dining',
        description:
          'Our upstairs room seats up to 20 guests. Perfect for birthdays, anniversaries and small celebrations.',
        price: 'From \u00a345 per head',
        duration: 'By arrangement',
      },
    ],
    testimonials: [
      {
        quote:
          'The tasting menu was outstanding. Every course was thoughtful and the wine pairings were spot on.',
        name: 'Douglas W.',
        role: 'Diner, Stockbridge',
      },
      {
        quote:
          'Best Sunday roast in Edinburgh, hands down. The Yorkshire puddings alone are worth the trip.',
        name: 'Fiona M.',
        role: 'Diner, Morningside',
      },
      {
        quote:
          'We hosted our anniversary dinner here. The private room was lovely and the staff made the evening feel really special.',
        name: 'Tom and Claire B.',
        role: 'Diners, Leith',
      },
    ],
    contact: {
      email: 'bookings@theoakkitchen.co.uk',
      phone: '0131 556 7890',
      location: 'Edinburgh, EH1',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },

  // ── Summit Builders ─────────────────────────────────────────────────
  {
    businessType: 'builder',
    businessName: 'Summit Builders',
    tagline: 'Building with care, built to last',
    description:
      'Experienced construction company based in Leeds. We handle everything from extensions and loft conversions to full new builds, with transparent pricing and no surprises.',
    palette: 'dark-celestial' as PaletteKey,
    services: [
      {
        title: 'Home extensions',
        description:
          'Single and double storey extensions designed to maximise your living space. Full planning and build service.',
        price: 'From \u00a325,000',
        duration: '8-12 weeks',
      },
      {
        title: 'Loft conversions',
        description:
          'Transform your loft into a bedroom, office or playroom. Dormer, hip-to-gable and Velux options available.',
        price: 'From \u00a318,000',
        duration: '6-8 weeks',
      },
      {
        title: 'New builds',
        description:
          'Bespoke residential builds from foundation to handover. We work closely with architects to bring your plans to life.',
        price: 'Quote on enquiry',
        duration: '16-24 weeks',
      },
    ],
    testimonials: [
      {
        quote:
          'Summit built our rear extension and it has completely transformed how we use the house. Professional from start to finish.',
        name: 'Richard P.',
        role: 'Homeowner, Headingley',
      },
      {
        quote:
          'They kept us informed every step of the way and the build came in on budget. Could not have asked for more.',
        name: 'Helen D.',
        role: 'Homeowner, Roundhay',
      },
      {
        quote:
          'We have used Summit for three separate projects now. Consistent quality and a team you can actually rely on.',
        name: 'Mark and Jo S.',
        role: 'Property developers, Leeds',
      },
    ],
    contact: {
      email: 'enquiries@summitbuilders.co.uk',
      phone: '0113 345 6789',
      location: 'Leeds, LS1',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },

  // ── Greenfield Landscaping ──────────────────────────────────────────
  {
    businessType: 'landscaper',
    businessName: 'Greenfield Landscaping',
    tagline: 'Gardens designed for living',
    description:
      'Landscape design and garden maintenance across Surrey. We create outdoor spaces that are beautiful, functional and built to thrive year-round.',
    palette: 'earthy-sage' as PaletteKey,
    services: [
      {
        title: 'Garden design',
        description:
          'Full garden redesign with 3D plans, planting schemes and hard landscaping. We handle everything from concept to completion.',
        price: 'From \u00a33,500',
        duration: '2-4 weeks',
      },
      {
        title: 'Patio and decking',
        description:
          'Natural stone patios, composite decking and outdoor entertaining areas. Built to last with proper drainage.',
        price: 'From \u00a32,000',
        duration: '3-5 days',
      },
      {
        title: 'Garden maintenance',
        description:
          'Regular lawn care, hedge trimming, border maintenance and seasonal planting to keep your garden looking its best.',
        price: 'From \u00a340/visit',
        duration: 'Weekly or fortnightly',
      },
    ],
    testimonials: [
      {
        quote:
          'They turned our overgrown back garden into somewhere we actually want to spend time. The patio is gorgeous.',
        name: 'Catherine F.',
        role: 'Homeowner, Guildford',
      },
      {
        quote:
          'Professional, creative and really easy to work with. The planting scheme they designed has been stunning all year.',
        name: 'Robert H.',
        role: 'Homeowner, Woking',
      },
      {
        quote:
          'We use Greenfield for our monthly maintenance and the garden has never looked better. Reliable and great value.',
        name: 'Anne and Peter G.',
        role: 'Homeowners, Esher',
      },
    ],
    contact: {
      email: 'hello@greenfieldlandscaping.co.uk',
      phone: '01483 123 456',
      location: 'Guildford, Surrey',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },

  // ── Clear Spark Electrical ──────────────────────────────────────────
  {
    businessType: 'electrician',
    businessName: 'Clear Spark Electrical',
    tagline: 'Safe, certified, straightforward',
    description:
      'NICEIC-approved electricians covering Birmingham and the West Midlands. Domestic and commercial electrical work with full certification on every job.',
    palette: 'dark-celestial' as PaletteKey,
    services: [
      {
        title: 'Rewiring',
        description:
          'Full and partial house rewires to bring older properties up to current safety standards. Minimal disruption guaranteed.',
        price: 'From \u00a32,800',
        duration: '3-5 days',
      },
      {
        title: 'Consumer unit upgrade',
        description:
          'Replace your old fuse box with a modern consumer unit. Includes full testing and certification.',
        price: 'From \u00a3350',
        duration: 'Half day',
      },
      {
        title: 'Lighting design and installation',
        description:
          'From recessed downlights to outdoor lighting schemes. We supply and fit with clean, tidy workmanship.',
        price: 'From \u00a3150',
        duration: '1-2 days',
      },
    ],
    testimonials: [
      {
        quote:
          'Had the whole house rewired and they were brilliant. Tidy, on time and explained everything clearly.',
        name: 'Steve B.',
        role: 'Homeowner, Moseley',
      },
      {
        quote:
          'Clear Spark upgraded our consumer unit and fitted new lighting throughout. Excellent workmanship and fair pricing.',
        name: 'Nadia K.',
        role: 'Homeowner, Edgbaston',
      },
      {
        quote:
          'We use them for all electrical work across our commercial properties. Always reliable, always certified.',
        name: 'David C.',
        role: 'Property manager, Birmingham',
      },
    ],
    contact: {
      email: 'info@clearsparkelectrical.co.uk',
      phone: '0121 456 7890',
      location: 'Birmingham, B1',
    },
    social: { instagram: '', facebook: '', twitter: '' },
  },
]

// ---------------------------------------------------------------------------
// Lookup helper
// ---------------------------------------------------------------------------

/**
 * Find a demo site by business type (case-insensitive partial match).
 * Returns undefined if no match is found.
 */
export function getDemoSite(type: string): DemoSite | undefined {
  const normalised = type.toLowerCase().trim()

  // Exact match on businessType
  const exact = DEMO_SITES.find((d) => d.businessType === normalised)
  if (exact) return exact

  // Partial match on businessType or businessName
  return DEMO_SITES.find(
    (d) =>
      d.businessType.includes(normalised) ||
      normalised.includes(d.businessType) ||
      d.businessName.toLowerCase().includes(normalised),
  )
}
