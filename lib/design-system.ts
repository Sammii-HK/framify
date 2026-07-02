/**
 * Design System Tokens for AI Template Generation
 *
 * Foundation: Open Props numeric system
 * Aesthetic: Custom palettes per niche (NOT Lunary brand colours)
 * Purpose: Baked into AI prompts to produce consistent, premium output
 */

// ---------------------------------------------------------------------------
// Spacing Scale (4px base unit)
// ---------------------------------------------------------------------------
export const SPACING = {
  '1': '4px', // 0.25rem
  '2': '8px', // 0.5rem
  '3': '12px', // 0.75rem
  '4': '16px', // 1rem
  '6': '24px', // 1.5rem
  '8': '32px', // 2rem
  '12': '48px', // 3rem
  '16': '64px', // 4rem
  '24': '96px', // 6rem
  '32': '128px', // 8rem
} as const

// ---------------------------------------------------------------------------
// Typography Scale
// ---------------------------------------------------------------------------
export const TYPE_SCALE = {
  xs: { size: '12px', lineHeight: '1.5', letterSpacing: '0em' },
  sm: { size: '14px', lineHeight: '1.5', letterSpacing: '0em' },
  base: { size: '16px', lineHeight: '1.5', letterSpacing: '0em' },
  lg: { size: '18px', lineHeight: '1.5', letterSpacing: '-0.01em' },
  xl: { size: '20px', lineHeight: '1.4', letterSpacing: '-0.01em' },
  '2xl': { size: '24px', lineHeight: '1.3', letterSpacing: '-0.02em' },
  '3xl': { size: '30px', lineHeight: '1.2', letterSpacing: '-0.02em' },
  '4xl': { size: '36px', lineHeight: '1.2', letterSpacing: '-0.02em' },
  '5xl': { size: '48px', lineHeight: '1.1', letterSpacing: '-0.03em' },
  '6xl': { size: '60px', lineHeight: '1.1', letterSpacing: '-0.03em' },
} as const

// ---------------------------------------------------------------------------
// Layout Constants
// ---------------------------------------------------------------------------
export const LAYOUT = {
  maxWidth: '1280px',
  textMaxWidth: '65ch',
  contentNarrow: '640px',
  contentDefault: '768px',
  contentWide: '1024px',
  contentFull: '1280px',
  sectionPaddingY: { mobile: '48px', tablet: '64px', desktop: '96px' },
  sectionPaddingX: { mobile: '16px', tablet: '32px', desktop: '48px' },
} as const

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------
export const RADII = {
  sm: '4px',
  default: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '9999px',
} as const

// ---------------------------------------------------------------------------
// Shadows (3 levels)
// ---------------------------------------------------------------------------
export const SHADOWS = {
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  dramatic:
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------
export const MOTION = {
  micro: { duration: '150ms', easing: 'ease-out' },
  layout: { duration: '300ms', easing: 'ease-in-out' },
  entrance: { duration: '500ms', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  spring: { stiffness: 100, damping: 15, mass: 1 },
} as const

// ---------------------------------------------------------------------------
// Colour Palettes (Separate from Lunary brand)
// ---------------------------------------------------------------------------

export type PaletteKey =
  | 'dark-celestial'
  | 'earthy-sage'
  | 'ethereal-light'
  | 'crystal-rose'
  | 'steel-blue'
  | 'warm-amber'

export interface ColourPalette {
  name: string
  description: string
  targetBuyer: string
  bg: { deep: string; surface: string; elevated: string }
  text: { primary: string; secondary: string; muted: string }
  accent: { primary: string; secondary: string; highlight: string }
  border: { subtle: string; default: string }
  gradient: string
}

export const PALETTES: Record<PaletteKey, ColourPalette> = {
  'dark-celestial': {
    name: 'Dark Celestial',
    description:
      'Deep indigo nights with golden starlight. Mystical, powerful, enchanting.',
    targetBuyer:
      'Tarot readers, astrologers, witchy brands, occult practitioners',
    bg: { deep: '#0D0B1A', surface: '#161331', elevated: '#1E1A42' },
    text: { primary: '#F5F0E8', secondary: '#C4B89C', muted: '#837E99' },
    accent: {
      primary: '#C4A265',
      secondary: '#8B6FC0',
      highlight: '#E8D5A3',
    },
    border: { subtle: '#2A2550', default: '#3D3670' },
    gradient: 'linear-gradient(135deg, #0D0B1A 0%, #1E1A42 50%, #2D1B69 100%)',
  },

  'earthy-sage': {
    name: 'Earthy Sage',
    description:
      'Grounded forest greens with warm stone. Natural, organic, healing.',
    targetBuyer:
      'Herbalists, yoga studios, holistic health practitioners, naturopaths',
    bg: { deep: '#1A1F1A', surface: '#242B24', elevated: '#2E362E' },
    text: { primary: '#F0EDE5', secondary: '#C4BFAD', muted: '#8B9E7C' },
    accent: {
      primary: '#8B9E7C',
      secondary: '#6B7F5C',
      highlight: '#C4A265',
    },
    border: { subtle: '#3A4238', default: '#4E5A4A' },
    gradient: 'linear-gradient(135deg, #1A1F1A 0%, #2C3E2D 50%, #3A4A38 100%)',
  },

  'ethereal-light': {
    name: 'Ethereal Light',
    description:
      'Soft moonstone with gentle violet. Airy, peaceful, transcendent.',
    targetBuyer:
      'Meditation coaches, reiki practitioners, spiritual coaches, wellness brands',
    bg: { deep: '#F8F6FC', surface: '#FFFFFF', elevated: '#F0EDF8' },
    text: { primary: '#1A1528', secondary: '#4A4358', muted: '#766D8E' },
    accent: {
      primary: '#9B72CF',
      secondary: '#7B5DAF',
      highlight: '#C9A8E8',
    },
    border: { subtle: '#E8E2F4', default: '#D4CCE8' },
    gradient: 'linear-gradient(135deg, #F8F6FC 0%, #E8E2F4 50%, #D4D7E0 100%)',
  },

  'crystal-rose': {
    name: 'Crystal Rose',
    description:
      'Warm blush with dusty rose. Feminine, nurturing, heart-centred.',
    targetBuyer:
      'Crystal shops, feminine wellness, self-care brands, beauty/skincare',
    bg: { deep: '#1A1517', surface: '#211C1E', elevated: '#2A2325' },
    text: { primary: '#F5EDE8', secondary: '#D4C5BE', muted: '#A08E88' },
    accent: {
      primary: '#C4868B',
      secondary: '#A06A6F',
      highlight: '#E8C4C4',
    },
    border: { subtle: '#3A2E32', default: '#4E3E42' },
    gradient: 'linear-gradient(135deg, #1A1517 0%, #2A2025 50%, #3A2830 100%)',
  },

  'steel-blue': {
    name: 'Steel Blue',
    description:
      'Strong steel blue on dark graphite. Professional, dependable, sharp.',
    targetBuyer:
      'Trades, professional services, contractors, engineering firms',
    bg: { deep: '#0F1923', surface: '#1A2735', elevated: '#243348' },
    text: { primary: '#E8EDF2', secondary: '#8A9BB0', muted: '#7B90A6' },
    accent: {
      primary: '#4A90D9',
      secondary: '#3570B0',
      highlight: '#7AB3F0',
    },
    border: { subtle: '#2A3A4D', default: '#3A4E65' },
    gradient: 'linear-gradient(135deg, #0F1923 0%, #1A2735 50%, #2A4060 100%)',
  },

  'warm-amber': {
    name: 'Warm Amber',
    description:
      'Rich amber gold on dark warm brown. Inviting, earthy, appetising.',
    targetBuyer:
      'Restaurants, cafes, pubs, bakeries, hospitality, food brands',
    bg: { deep: '#1F1710', surface: '#2A2018', elevated: '#352A20' },
    text: { primary: '#F0E8DC', secondary: '#B09880', muted: '#998671' },
    accent: {
      primary: '#D4943A',
      secondary: '#B07828',
      highlight: '#F0B860',
    },
    border: { subtle: '#3A2E22', default: '#4E3E30' },
    gradient: 'linear-gradient(135deg, #1F1710 0%, #2A2018 50%, #3A3020 100%)',
  },
} as const

// ---------------------------------------------------------------------------
// Light Mode Counterparts (for dark/light toggle support)
// ---------------------------------------------------------------------------

export const LIGHT_PALETTES: Record<PaletteKey, ColourPalette> = {
  'dark-celestial': {
    name: 'Dark Celestial — Light',
    description: 'Warm parchment with indigo accents. Mystical but airy.',
    targetBuyer: 'Same buyers who want a lighter option',
    bg: { deep: '#FAF7F2', surface: '#FFFFFF', elevated: '#F0EBE3' },
    text: { primary: '#1A1528', secondary: '#3D3650', muted: '#736D8A' },
    accent: {
      primary: '#8B6FC0',
      secondary: '#6B52A0',
      highlight: '#C4A265',
    },
    border: { subtle: '#E8E2D8', default: '#D4CCB8' },
    gradient: 'linear-gradient(135deg, #FAF7F2 0%, #F0EBE3 50%, #E8E2D8 100%)',
  },
  'earthy-sage': {
    name: 'Earthy Sage — Light',
    description: 'Warm cream with sage green accents. Fresh and grounded.',
    targetBuyer: 'Same buyers who want a lighter option',
    bg: { deep: '#FAFAF5', surface: '#FFFFFF', elevated: '#F0F0E8' },
    text: { primary: '#1A1F1A', secondary: '#3A4238', muted: '#667958' },
    accent: {
      primary: '#6B7F5C',
      secondary: '#5A6E4C',
      highlight: '#C4A265',
    },
    border: { subtle: '#E0E0D5', default: '#C8C8B8' },
    gradient: 'linear-gradient(135deg, #FAFAF5 0%, #F0F0E8 50%, #E5E5D8 100%)',
  },
  'ethereal-light': {
    name: 'Ethereal Light — Dark',
    description: 'Deep violet with moonstone accents. Night-time meditation.',
    targetBuyer: 'Same buyers who want a darker option',
    bg: { deep: '#0E0A18', surface: '#16112A', elevated: '#1E1838' },
    text: { primary: '#E8E2F4', secondary: '#C4BCD8', muted: '#8B84A0' },
    accent: {
      primary: '#9B72CF',
      secondary: '#7B5DAF',
      highlight: '#C9A8E8',
    },
    border: { subtle: '#2A2445', default: '#3D3660' },
    gradient: 'linear-gradient(135deg, #0E0A18 0%, #16112A 50%, #1E1838 100%)',
  },
  'crystal-rose': {
    name: 'Crystal Rose — Light',
    description: 'Soft blush with rose accents. Warm and inviting.',
    targetBuyer: 'Same buyers who want a lighter option',
    bg: { deep: '#FDF8F6', surface: '#FFFFFF', elevated: '#F8F0ED' },
    text: { primary: '#2A2022', secondary: '#4A3E40', muted: '#7E6E71' },
    accent: {
      primary: '#C17F84',
      secondary: '#A06A6F',
      highlight: '#E8C4C4',
    },
    border: { subtle: '#F0E0DD', default: '#E0CCC8' },
    gradient: 'linear-gradient(135deg, #FDF8F6 0%, #F8F0ED 50%, #F0E4E0 100%)',
  },
  'steel-blue': {
    name: 'Steel Blue — Light',
    description: 'Clean white with steel blue accents. Crisp and professional.',
    targetBuyer: 'Same buyers who want a lighter option',
    bg: { deep: '#F2F5F8', surface: '#FFFFFF', elevated: '#E8EDF2' },
    text: { primary: '#0F1923', secondary: '#3A4E65', muted: '#5A6F85' },
    accent: {
      primary: '#4A90D9',
      secondary: '#3570B0',
      highlight: '#7AB3F0',
    },
    border: { subtle: '#D8E0E8', default: '#C0CCD8' },
    gradient: 'linear-gradient(135deg, #F2F5F8 0%, #E8EDF2 50%, #D8E0E8 100%)',
  },
  'warm-amber': {
    name: 'Warm Amber — Light',
    description: 'Warm cream with amber accents. Welcoming and appetising.',
    targetBuyer: 'Same buyers who want a lighter option',
    bg: { deep: '#FBF6F0', surface: '#FFFFFF', elevated: '#F5EDE2' },
    text: { primary: '#1F1710', secondary: '#4E3E30', muted: '#7A6A58' },
    accent: {
      primary: '#C0822A',
      secondary: '#B07828',
      highlight: '#F0B860',
    },
    border: { subtle: '#E8DDD0', default: '#D4C8B8' },
    gradient: 'linear-gradient(135deg, #FBF6F0 0%, #F5EDE2 50%, #E8DDD0 100%)',
  },
}

// ---------------------------------------------------------------------------
// Dark/Light Mode Toggle Pattern (injected into prompts)
// ---------------------------------------------------------------------------
export function getDarkLightModePrompt(
  darkPalette: ColourPalette,
  lightPalette: ColourPalette
): string {
  return `
DARK/LIGHT MODE TOGGLE (MANDATORY for £49+ templates):

Implement a theme toggle using React state and CSS variables.

PATTERN:
1. Add a state variable: const [isDark, setIsDark] = useState(true)
2. Define colour objects for both modes:

   const themes = {
     dark: {
       bg: "${darkPalette.bg.deep}",
       surface: "${darkPalette.bg.surface}",
       elevated: "${darkPalette.bg.elevated}",
       textPrimary: "${darkPalette.text.primary}",
       textSecondary: "${darkPalette.text.secondary}",
       textMuted: "${darkPalette.text.muted}",
       accent: "${darkPalette.accent.primary}",
       accentSecondary: "${darkPalette.accent.secondary}",
       highlight: "${darkPalette.accent.highlight}",
       borderSubtle: "${darkPalette.border.subtle}",
       border: "${darkPalette.border.default}",
     },
     light: {
       bg: "${lightPalette.bg.deep}",
       surface: "${lightPalette.bg.surface}",
       elevated: "${lightPalette.bg.elevated}",
       textPrimary: "${lightPalette.text.primary}",
       textSecondary: "${lightPalette.text.secondary}",
       textMuted: "${lightPalette.text.muted}",
       accent: "${lightPalette.accent.primary}",
       accentSecondary: "${lightPalette.accent.secondary}",
       highlight: "${lightPalette.accent.highlight}",
       borderSubtle: "${lightPalette.border.subtle}",
       border: "${lightPalette.border.default}",
     },
   }

3. Use: const t = isDark ? themes.dark : themes.light
4. Apply via inline styles: style={{ backgroundColor: t.bg, color: t.textPrimary }}
5. Toggle button in the navigation bar (sun/moon icon)

TOGGLE BUTTON:
- Position: in the nav bar, right side
- Icon: sun (☀) for light mode active, moon (☾) for dark mode active
- Transition: 300ms ease-in-out on all colour changes
- Use motion.button with whileTap={{ scale: 0.95 }}
`
}

// ---------------------------------------------------------------------------
// Section Stack (what premium templates must include)
// ---------------------------------------------------------------------------
export const PREMIUM_SECTIONS = [
  'hero',
  'social-proof-logos',
  'features-grid',
  'how-it-works',
  'testimonials',
  'pricing-table',
  'faq-accordion',
  'cta-section',
  'footer',
] as const

export const PREMIUM_PAGES = [
  'Home',
  'About',
  'Services / Work',
  'Work Single / Case Study',
  'Blog Listing',
  'Blog Post',
  'Contact',
  '404',
] as const

// ---------------------------------------------------------------------------
// Prompt Block (compact, baked into AI system prompt)
// ---------------------------------------------------------------------------
export function getDesignSystemPrompt(palette?: PaletteKey): string {
  const paletteData = palette ? PALETTES[palette] : null

  return `
DESIGN SYSTEM (MANDATORY — follow these exact values):

SPACING SCALE (4px base unit — NO arbitrary values):
- Use ONLY these Tailwind spacings: p-1(4px), p-2(8px), p-3(12px), p-4(16px), p-6(24px), p-8(32px), p-12(48px), p-16(64px), p-24(96px)
- Section vertical padding: py-12 (mobile), md:py-16 (tablet), lg:py-24 (desktop)
- Section horizontal padding: px-4 (mobile), md:px-8 (tablet), lg:px-12 (desktop)
- Container max-width: max-w-7xl (1280px)
- Text max-width: max-w-prose (65ch) for readability

TYPE SCALE (with paired line-heights):
- Display: text-5xl md:text-6xl (48-60px), leading-[1.1], tracking-tight (-0.03em)
- H1: text-4xl md:text-5xl (36-48px), leading-[1.1], tracking-tight
- H2: text-3xl md:text-4xl (30-36px), leading-[1.2], tracking-tight
- H3: text-xl md:text-2xl (20-24px), leading-[1.3]
- Body: text-base md:text-lg (16-18px), leading-relaxed (1.625)
- Small: text-sm (14px), leading-normal (1.5)
- Caption: text-xs (12px), leading-normal, tracking-wide (0.05em)
- Font pairing: max 2 fonts. Sans-serif body (Inter, system-ui). Serif headings optional.
- Letter spacing: tracking-tight for headings (>=24px), tracking-normal for body

COLOUR RULES:
- Max 5 colours total (background, text, accent, secondary accent, border)
- Contrast: >=4.5:1 for body text, >=3:1 for UI elements (WCAG AA)
- NO pure black (#000000) or pure white (#FFFFFF) — use near-black/near-white
- Define hover states: darken accent by 10% or lighten by 10%
- Disabled states: 50% opacity of default${
    paletteData
      ? `

COLOUR PALETTE — "${paletteData.name}" (${paletteData.description}):
- Background deep: ${paletteData.bg.deep} (page background)
- Background surface: ${paletteData.bg.surface} (card/section backgrounds)
- Background elevated: ${paletteData.bg.elevated} (hover states, modals)
- Text primary: ${paletteData.text.primary} (headings, important text)
- Text secondary: ${paletteData.text.secondary} (body text)
- Text muted: ${paletteData.text.muted} (captions, labels)
- Accent primary: ${paletteData.accent.primary} (CTA buttons, links)
- Accent secondary: ${paletteData.accent.secondary} (secondary actions)
- Accent highlight: ${paletteData.accent.highlight} (badges, tags, decorative)
- Border subtle: ${paletteData.border.subtle} (card borders, dividers)
- Border default: ${paletteData.border.default} (input borders, stronger dividers)
- Hero gradient: ${paletteData.gradient}
Use inline styles for these exact hex values. Do NOT use generic Tailwind colour names like bg-gray-900.`
      : ''
  }

BORDER RADIUS:
- Buttons: rounded-lg (8px)
- Cards: rounded-xl (12px)
- Pills/tags: rounded-full (9999px)
- Inputs: rounded-lg (8px)
- Modals: rounded-2xl (16px)
- Images: rounded-xl (12px) or rounded-2xl (16px)

SHADOWS (3 levels only):
- Subtle: shadow-sm (cards at rest)
- Medium: shadow-md (cards on hover, dropdowns)
- Dramatic: shadow-xl (modals, floating elements)
- Dark themes: use border instead of shadow for depth

MOTION & ANIMATION:
- Micro-interactions: 150ms ease-out (hover, focus, toggle)
- Layout transitions: 300ms ease-in-out (expand, collapse, slide)
- Entrance animations: 500ms cubic-bezier(0.16, 1, 0.3, 1) (fade-in, slide-up)
- Framer Motion spring: stiffness: 100, damping: 15
- Scroll animations: staggerChildren: 0.1, viewport: { once: true, margin: "-100px" }
- ONLY animate: opacity, transform (y, x, scale, rotate)
- NEVER animate: width, height, margin, padding, left, top

SECTION LAYOUT PATTERNS:
- Hero: min-h-[80vh], centered content, clear CTA above fold
- Features grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6 md:gap-8
- Testimonials: grid or horizontal scroll, include name + role + avatar + quote
- Pricing: side-by-side cards with highlighted "popular" option
- FAQ: accordion with smooth height animation
- CTA: full-width section, contrasting background, single focused action
- Footer: 3-4 column grid collapsing to single column on mobile

RESPONSIVE BREAKPOINTS:
- Mobile first: base styles for 320-639px
- sm: (640px+) — minor adjustments
- md: (768px+) — tablet layout, 2-column grids
- lg: (1024px+) — desktop layout, 3-column grids, larger typography
- xl: (1280px+) — wide desktop, max-width containers

REAL-WORLD CONTENT RULES:
- Headlines: 4-12 words (test with both short "Get Started" and long "Transform Your Practice Today")
- Body text: 2-4 sentences per paragraph
- Feature lists: 6 items minimum (not 3)
- Testimonials: 3 minimum with name, role, company, and 2-3 sentence quote
- Navigation: 4-6 items
- CTA buttons: 2-4 words ("Book Now", "Start Free Trial", "Get Started")
- Logo bar: 5-6 placeholder logos
- Images: use aspect-ratio utilities (aspect-video for heroes, aspect-square for avatars)
`
}

// ---------------------------------------------------------------------------
// Style-specific section requirements
// ---------------------------------------------------------------------------
export const STYLE_SECTIONS: Record<string, string[]> = {
  'Spiritual / Mystical': [
    'hero with celestial/mystical imagery',
    'services or offerings grid',
    'about / origin story',
    'testimonials from clients',
    'booking or contact CTA',
    'blog or resources section',
    'social proof or credentials',
    'footer with social links',
  ],
  'Wellness / Yoga Studio': [
    'hero with calm, inviting imagery',
    'class schedule or services',
    'instructor or team section',
    'pricing or membership plans',
    'testimonials',
    'location and contact',
    'blog or wellness tips',
    'footer',
  ],
  'Crystal / Metaphysical Shop': [
    'hero with product showcase',
    'featured collections grid',
    'about the shop story',
    'product categories',
    'testimonials or reviews',
    'blog or crystal guides',
    'newsletter signup',
    'footer with shipping info',
  ],
}
