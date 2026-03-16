import { createOpenAI, openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// DeepInfra provider — OpenAI-compatible API, 80x cheaper than GPT-4o
const deepinfra = createOpenAI({
  apiKey: process.env.DEEPINFRA_API_KEY,
  baseURL: 'https://api.deepinfra.com/v1/openai',
})

// Template generation model — falls back to GPT-4o if no DeepInfra key
const templateModel = process.env.DEEPINFRA_API_KEY
  ? deepinfra('Qwen/Qwen2.5-Coder-32B-Instruct')
  : openai('gpt-4o')

import {
  getDesignSystemPrompt,
  getDarkLightModePrompt,
  PALETTES,
  LIGHT_PALETTES,
  type PaletteKey,
} from './design-system'
import { getCMSPromptBlock } from './cms-templates'

export type Style =
  | 'Minimal Corporate'
  | 'Dark Tech / SaaS'
  | 'E-commerce Product Showcase'
  | 'Creative Portfolio / Designer'
  | 'Agency / Studio Bold'
  | 'Grid / Magazine Editorial'
  | 'Luxury / Premium Brand'
  | 'Retro / Y2K'
  | 'Pastel / Playful'
  | 'Single-Page App / Startup Landing'
  | 'Spiritual / Dark Celestial'
  | 'Spiritual / Earthy Sage'
  | 'Spiritual / Ethereal Light'
  | 'Spiritual / Crystal Rose'
  | 'Wellness / Yoga Studio'
  | 'Crystal / Metaphysical Shop'

const stylePrompts: Record<Style, string> = {
  'Minimal Corporate': `Research and draw inspiration from corporate minimalism:
- IBM's clean, professional aesthetic
- Microsoft's Fluent Design System (subtle, purposeful)
- Corporate annual reports (elegant, trustworthy)
- B2B SaaS platforms (Calendly, Zoom's clean interfaces)

Create an original corporate minimal design. Use:
- Generous whitespace (50%+ negative space)
- Professional color palette (navy blues, grays, white)
- Clean, readable typography (Inter, System fonts, serif for headings)
- Subtle, professional animations (smooth fades, gentle slides)
- Trust-building elements (testimonials, logos, certifications)
- Limited color palette (2-3 corporate colors)
- Professional imagery placeholders
- Clear call-to-action buttons`,

  'Dark Tech / SaaS': `Research and draw inspiration from modern SaaS dark themes:
- Linear's sleek dark interface
- GitHub Dark's sophisticated aesthetic
- Vercel's tech-forward dark mode
- Notion's dark theme elegance

Create an original dark tech/SaaS design. Use:
- Rich dark backgrounds (#0a0a0a, #1a1a1a, #0f0f0f)
- High contrast text (white/light gray on dark)
- Tech accent colors (electric blue, cyan, purple)
- Glassmorphism and subtle glows
- Smooth, premium animations
- Code-like aesthetics (monospace fonts for data)
- Modern UI elements (cards, gradients, subtle borders)
- Professional, futuristic feel`,

  'E-commerce Product Showcase': `Research and draw inspiration from e-commerce leaders:
- Apple's product pages (clean, focused on product)
- Stripe's payment pages (trustworthy, clear)
- Shopify themes (product-first layouts)
- Modern DTC brands (Allbirds, Glossier)

Create an original e-commerce design. Use:
- Product-focused layouts (large images, clear hierarchy)
- Trust elements (reviews, ratings, badges)
- Clear pricing and CTA buttons
- Product galleries with zoom/swipe
- Shopping cart integration placeholders
- Related products sections
- Mobile-optimized product views
- Conversion-focused design`,

  'Creative Portfolio / Designer': `Research and draw inspiration from creative portfolios:
- Behance's creative showcase layouts
- Dribbble's portfolio presentations
- Creative agency sites (Pentagram, IDEO)
- Designer portfolios (typography-focused, bold)

Create an original creative portfolio design. Use:
- Bold, expressive typography (custom fonts, large scale)
- Creative layouts (asymmetric grids, overlapping elements)
- Vibrant color combinations
- Showcase galleries (masonry, grid, carousel)
- Creative animations (parallax, reveals, transitions)
- Personal branding elements
- Case study sections
- Contact/commission CTAs`,

  'Agency / Studio Bold': `Research and draw inspiration from creative agencies:
- Pentagram's bold, confident aesthetic
- IDEO's human-centered bold design
- R/GA's tech-forward agency style
- Modern creative studios (Instrument, Work & Co)

Create an original agency/studio design. Use:
- Bold, confident typography (large headings, compressed fonts)
- High contrast color schemes
- Dynamic, energetic animations
- Showcase of work (case studies, portfolios)
- Team sections with personality
- Bold geometric shapes and patterns
- Strong visual hierarchy
- Confident, professional presentation`,

  'Grid / Magazine Editorial': `Research and draw inspiration from editorial design:
- The New York Times digital layouts
- Medium's clean reading experience
- Vogue's editorial spreads
- Modern magazine sites (Kinfolk, Cereal)

Create an original editorial/magazine design. Use:
- Grid-based layouts (masonry, columns)
- Typography-focused (serif headlines, readable body)
- Editorial imagery (large hero images, photo essays)
- Article/article list layouts
- Reading-focused design (comfortable line length)
- Category/tag navigation
- Social sharing elements
- Clean, content-first approach`,

  'Luxury / Premium Brand': `Research and draw inspiration from luxury brands:
- Apple's premium aesthetic
- Tesla's luxury tech presentation
- High-end fashion brands (Gucci, Chanel digital)
- Premium automotive sites

Create an original luxury/premium design. Use:
- Elegant, sophisticated color palette (blacks, golds, deep colors)
- Premium typography (serif for luxury feel, elegant sans-serif)
- High-quality imagery placeholders
- Smooth, refined animations
- Generous whitespace
- Premium materials aesthetic (leather, metal textures)
- Exclusive, aspirational messaging
- Refined, polished details`,

  'Retro / Y2K': `Research and draw inspiration from Y2K and retro aesthetics:
- Early 2000s web design (nostalgic, playful)
- Retro gaming aesthetics
- Y2K fashion and design trends
- Nostalgic tech interfaces

Create an original retro/Y2K design. Use:
- Nostalgic color palettes (bright neons, gradients)
- Retro typography (pixel fonts, chunky sans-serif)
- Playful animations (bouncy, energetic)
- Retro UI elements (glossy buttons, gradients)
- Nostalgic imagery styles
- Fun, playful interactions
- Y2K aesthetic (chrome, glass, gradients)
- Nostalgic, fun personality`,

  'Pastel / Playful': `Research and draw inspiration from playful, friendly designs:
- Instagram's pastel aesthetic
- Notion's friendly, approachable design
- Modern startup brands (Stripe's playful moments)
- Creative, friendly SaaS products

Create an original pastel/playful design. Use:
- Soft pastel colors (lavender, peach, mint, sky blue)
- Gentle gradients and rounded corners
- Playful but professional animations
- Friendly, approachable typography
- Warm, inviting color temperatures
- Playful illustrations/icons placeholders
- Comfortable, spacious layouts
- Human, friendly personality`,

  'Spiritual / Dark Celestial': `Design a mystical, enchanting website with dark celestial aesthetics.
Draw inspiration from:
- High-end tarot/astrology brands (not cheap fortune-telling sites)
- Luxury dark UI (Linear, Vercel) but with warm gold/amber accents
- Celestial art (star maps, constellation patterns, moon phases)
- Occult bookshops and mystical apothecaries

Create an original dark celestial design. Use:
- Deep indigo/navy backgrounds (#0D0B1A, #161331) — NOT pure black
- Warm gold accents (#C4A265) for CTAs, highlights, and decorative elements
- Soft purple secondary (#8B6FC0) for hover states and secondary actions
- Cream/warm white text (#F5F0E8) — NOT pure white
- Star-field or gradient hero backgrounds
- Serif fonts for headings (mystical feel), sans-serif for body
- Subtle glow effects on accent elements
- Smooth, slow animations (mystical = unhurried, 500-700ms entrances)
- Moon phase or celestial decorative elements
- Sections: hero, services/offerings, about/origin story, testimonials, booking CTA, blog/resources, footer`,

  'Spiritual / Earthy Sage': `Design a grounded, natural website with earthy sage aesthetics.
Draw inspiration from:
- Premium wellness brands (Goop, Moon Juice)
- Organic skincare packaging (Aesop, Herbivore)
- Botanical illustration styles
- High-end yoga retreats and herbalism practices

Create an original earthy sage design. Use:
- Dark forest greens (#1A1F1A, #242B24) for backgrounds
- Sage green accents (#8B9E7C) for highlights and CTAs
- Warm gold (#C4A265) for premium touches
- Warm cream text (#F0EDE5) — organic, not clinical
- Botanical line art or leaf motifs as decorative elements
- Natural textures (paper, linen, wood grain) suggested through subtle patterns
- Rounded corners (16px+) for an organic, soft feel
- Gentle, flowing animations (ease-in-out, 400-500ms)
- Sections: hero, services/class schedule, instructors/team, pricing, testimonials, blog/tips, contact, footer`,

  'Spiritual / Ethereal Light': `Design an airy, transcendent website with ethereal light aesthetics.
Draw inspiration from:
- Meditation apps (Calm, Headspace) but more elevated
- High-end spa and wellness retreat websites
- Soft gradient art and abstract light photography
- Premium spiritual coaching brands

Create an original ethereal light design. Use:
- Soft lavender/moonstone backgrounds (#F8F6FC, #F0EDF8) — NOT stark white
- Gentle violet accents (#9B72CF) for CTAs and highlights
- Deep plum text (#1A1528) for headings, softer purple (#4A4358) for body
- Soft gradients from white to lavender
- Lots of whitespace (60%+ negative space)
- Light, airy typography with generous line-height
- Gentle entrance animations (fade + slight y movement, 500ms)
- Floating or breathing decorative elements
- Sections: hero, philosophy/approach, services, testimonials, booking, blog, footer`,

  'Spiritual / Crystal Rose': `Design a warm, heart-centred website with crystal rose aesthetics.
Draw inspiration from:
- Crystal and gemstone shop brands
- Feminine wellness brands (rituals, self-care)
- Rose quartz and pink tourmaline colour palettes
- High-end beauty and skincare aesthetics

Create an original crystal rose design. Use:
- Dark warm backgrounds (#1A1517, #211C1E) — intimate, not cold
- Dusty rose accents (#C4868B) for CTAs and highlights
- Soft pink highlight (#E8C4C4) for badges and decorative elements
- Warm cream text (#F5EDE8) — soft, nurturing
- Soft glow effects on accent elements
- Rounded, organic shapes and generous border-radius
- Warm, embracing animations (ease-in-out, gentle scale)
- Sections: hero, featured products/collections, about story, crystal guides, testimonials, newsletter signup, footer`,

  'Wellness / Yoga Studio': `Design a calm, professional website for a yoga or wellness studio.
Draw inspiration from:
- Premium yoga studios (Alo Yoga, Y7 Studio)
- Wellness retreat websites
- Fitness class booking platforms (ClassPass, Mindbody)
- Clean health and fitness brands

Create an original wellness studio design. Use:
- Choose ONE colour base and commit to it (dark or light, not mixed)
- Calm, muted colour palette — no harsh colours
- Clear typography hierarchy for class names, schedules, and pricing
- Image-forward hero (yoga poses, studio spaces)
- Schedule/timetable section with clean grid
- Instructor profiles with photos and credentials
- Pricing cards with clear tier differentiation
- Trust signals (certifications, years of experience, client count)
- Smooth, calming animations (nothing jarring or fast)
- Sections: hero, class schedule, instructors, pricing/membership, testimonials, location/contact, blog, footer`,

  'Crystal / Metaphysical Shop': `Design a premium e-commerce website for a crystal or metaphysical shop.
Draw inspiration from:
- Modern DTC brands (Glossier, Mejuri) but mystical
- Crystal and gemstone photography aesthetics
- Witchy stationery and apothecary brands
- High-end marketplace templates

Create an original metaphysical shop design. Use:
- Dark or warm neutral backgrounds that make crystals pop
- Product grid with hover zoom effects
- Collection/category navigation
- Trust signals (ethically sourced, hand-selected, authenticity guaranteed)
- Educational content section (crystal guides, how-to articles)
- Newsletter signup with incentive ("Get your birth crystal guide free")
- Shopping-focused layout with clear CTAs
- Subtle sparkle or shimmer animations on product cards
- Sections: hero, featured collections, product grid, about story, crystal guides, testimonials, newsletter, footer`,

  'Single-Page App / Startup Landing': `Research and draw inspiration from modern startup landing pages:
- Stripe's clean landing pages
- Linear's focused single-page design
- Modern SaaS landing pages (Vercel, Supabase)
- Startup launch pages (Product Hunt style)

Create an original startup landing page design. Use:
- Single-page scroll layout (hero, features, testimonials, CTA)
- Clear value proposition above the fold
- Feature highlights with icons
- Social proof (logos, testimonials, metrics)
- Clear, prominent CTA buttons
- Modern, tech-forward aesthetic
- Fast-loading, performance-focused
- Conversion-optimized layout`,
}

export async function generateTemplateCode(
  prompt: string,
  style: Style
): Promise<{ code: string; title: string }> {
  // Determine palette for spiritual styles
  const paletteMap: Partial<Record<Style, PaletteKey>> = {
    'Spiritual / Dark Celestial': 'dark-celestial',
    'Spiritual / Earthy Sage': 'earthy-sage',
    'Spiritual / Ethereal Light': 'ethereal-light',
    'Spiritual / Crystal Rose': 'crystal-rose',
  }
  const palette = paletteMap[style]
  const designSystemBlock = getDesignSystemPrompt(palette)

  // Add dark/light mode toggle for spiritual palettes
  const darkLightBlock = palette
    ? getDarkLightModePrompt(PALETTES[palette], LIGHT_PALETTES[palette])
    : ''

  // Determine category for CMS collections
  const categoryForCMS = style.includes('Spiritual')
    ? 'spiritual'
    : style.includes('Wellness')
      ? 'wellness'
      : style.includes('Crystal') || style.includes('Metaphysical')
        ? 'metaphysical-shop'
        : style.includes('E-commerce')
          ? 'e-commerce'
          : style.includes('Agency')
            ? 'agency'
            : 'general'
  const cmsBlock = getCMSPromptBlock(categoryForCMS)

  const systemPrompt = `You generate production-ready, sellable React + Tailwind + Framer Motion templates.
Output ONLY the TSX code — no markdown fences, no explanation.

${designSystemBlock}
${darkLightBlock}
${cmsBlock}

STYLE: ${stylePrompts[style]}

REQUIRED SECTIONS (in order): Nav, Hero, Services/Features (3+ cards), Testimonials (3 cards), Contact form, Footer.

RULES — your code is auto-validated, violations cause rejection:

1. DARK/LIGHT TOGGLE (MANDATORY):
   - const [isDark, setIsDark] = useState(true)
   - Define a themes object with dark + light colour sets:
     const themes = {
       dark: { bg: "#0D0B1A", surface: "#161331", text: "#F5F0E8", muted: "#C4B89C", accent: "#C4A265", border: "#2A2550" },
       light: { bg: "#FAF7F2", surface: "#FFFFFF", text: "#1A1528", muted: "#3D3650", accent: "#8B6FC0", border: "#E5E0D8" }
     }
   - const t = isDark ? themes.dark : themes.light
   - Root div: style={{ backgroundColor: t.bg, color: t.text }}
   - Cards: style={{ backgroundColor: t.surface, borderColor: t.border }}
   - Muted text: style={{ color: t.muted }}
   - Accents/buttons: style={{ backgroundColor: t.accent, color: isDark ? "#0D0B1A" : "#FFFFFF" }}
   - Nav toggle button: onClick={() => setIsDark(!isDark)}
   - CRITICAL: EVERY background, text, and border colour MUST come from the t object
   - CRITICAL: NO hardcoded colour values outside the themes object — not in className, not in style
   - CRITICAL: The hero section MUST also use t.bg/t.text — do NOT use a fixed gradient. Use style={{ background: isDark ? "linear-gradient(...dark...)" : "linear-gradient(...light...)" }}
   - ACCESSIBILITY: Ensure minimum 4.5:1 contrast ratio in both modes. Dark mode = light text on dark bg. Light mode = dark text on light bg. Test every text/bg combination mentally.

2. ICONS (MANDATORY):
   - Import icons from lucide-react: import { Sun, Moon, Star, Sparkles, Diamond, Heart, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
   - Use <Sun /> and <Moon /> for the dark/light toggle
   - Use Lucide icons for service cards, nav, CTA buttons, and decorative elements
   - NEVER use emoji characters (no ✦ ☽ ◇ ☀ ✧ or any other emoji)
   - Size icons with className="w-5 h-5" or "w-6 h-6"

3. RESPONSIVE: Use md: and lg: breakpoints on spacing, grids, and typography (≥10 uses).
   Pattern: className="px-4 md:px-8 lg:px-12" / "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

4. TYPOGRAPHY: ≥4 different text-* sizes, ≥2 font-* weights.
   Pattern: "text-3xl md:text-5xl font-bold" / "text-sm font-medium"

5. SAFETY: All props optional with defaults. Use ?. on all property access in JSX.
   Pattern: {item?.title || "Default"}

6. ANIMATION: Only animate opacity/transform. Use motion.section with initial/animate.
   Pattern: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}

7. STRUCTURE:
   - Imports at top (React, useState, motion from framer-motion, Lucide icons)
   - TypeScript interfaces
   - Default data arrays BEFORE component (use the CMS sample data above)
   - export default function ComponentName({ ...props with defaults })
   - Semantic HTML: nav, section, footer

8. CTA BUTTONS: All "Get Started" / "Book Now" / hero CTA buttons MUST scroll to the contact section.
   Pattern: onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
   Add id="contact" to the contact/booking section.

9. NO external images, no copyrighted assets, no emoji characters.`

  try {
    const result = await generateText({
      model: templateModel,
      system: systemPrompt,
      prompt: `Create: ${prompt}

Output the complete TSX component. Key reminders:
- Dark/light toggle: define themes object, const t = isDark ? themes.dark : themes.light, apply t.bg/t.text/t.surface/t.accent to EVERY element including the hero
- Icons: import from lucide-react, NEVER use emoji characters
- Accessibility: ensure all text is readable in both modes (4.5:1 contrast ratio)`,
      temperature: 0.3, // Very low temperature for strict rule-following
      maxTokens: 8000, // gpt-4o supports up to 16k output tokens
    })

    const generatedText = result.text
    
    // Extract code block if wrapped in markdown
    let code = generatedText
    if (generatedText.includes('```')) {
      const codeMatch = generatedText.match(/```(?:tsx|ts|jsx|js)?\n([\s\S]*?)```/)
      if (codeMatch) {
        code = codeMatch[1].trim()
      }
    }

    // Post-process: Ensure minimum requirements are met
    // Count breakpoints
    const breakpointCount = (code.match(/sm:|md:|lg:|xl:/g) || []).length
    if (breakpointCount < 3) {
      console.warn(`⚠️ Post-processing: Only ${breakpointCount} breakpoints found, adding more...`)
      // Try to add responsive classes to existing elements
      code = code.replace(
        /className="([^"]*px-[^"]*)"/g,
        (match, classes) => {
          if (!classes.includes('md:') && !classes.includes('lg:')) {
            return `className="${classes} md:px-8 lg:px-12"`
          }
          return match
        }
      )
    }

    // Count text sizes
    const textSizeMatches = code.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/g) || []
    const uniqueTextSizes = new Set(textSizeMatches).size
    if (uniqueTextSizes < 3) {
      console.warn(`⚠️ Post-processing: Only ${uniqueTextSizes} unique text sizes found`)
    }

    // Count font weights
    const fontWeightMatches = code.match(/font-(thin|light|normal|medium|semibold|bold)/g) || []
    const uniqueFontWeights = new Set(fontWeightMatches).size
    if (uniqueFontWeights < 2) {
      console.warn(`⚠️ Post-processing: Only ${uniqueFontWeights} unique font weights found`)
    }

    // Post-process: Fix unsafe property access in JSX expressions
    // Pattern: {item.prop} → {item?.prop}  (inside JSX curly braces)
    code = code.replace(
      /\{(\w+)\.(\w+)\}/g,
      (match, obj, prop) => {
        // Skip known safe objects (React, motion, Math, JSON, console, document, window, Object, Array)
        const safeObjects = ['React', 'motion', 'Math', 'JSON', 'console', 'document', 'window', 'Object', 'Array', 'Date', 'Number', 'String', 'Boolean', 'Promise']
        if (safeObjects.includes(obj)) return match
        // Skip if already using optional chaining
        if (match.includes('?.')) return match
        return `{${obj}?.${prop}}`
      }
    )

    // Also fix chained access like {item.nested.prop}
    code = code.replace(
      /\{(\w+)\.(\w+)\.(\w+)\}/g,
      (match, obj, mid, prop) => {
        const safeObjects = ['React', 'motion', 'Math', 'JSON', 'console', 'document', 'window']
        if (safeObjects.includes(obj)) return match
        return `{${obj}?.${mid}?.${prop}}`
      }
    )

    // Extract title from the prompt or generate a simple one
    const title = extractTitle(prompt)

    return { code, title }
  } catch (error) {
    console.error('Error generating template code:', error)
    throw new Error('Failed to generate template code. Please try again.')
  }
}

function extractTitle(prompt: string): string {
  // Simple title extraction - take first few words
  const words = prompt.split(' ').slice(0, 5).join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1) + ' Template'
}

/**
 * Extract metadata from prompt for better marketplace discoverability
 */
export function extractMetadata(
  prompt: string,
  style: Style
): {
  category: string
  tags: string[]
  description: string
} {
  const lowerPrompt = prompt.toLowerCase()
  
  // Determine category based on prompt keywords
  let category = 'general'
  if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('designer') || lowerPrompt.includes('artist')) {
    category = 'portfolio'
  } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software') || lowerPrompt.includes('app')) {
    category = 'saas'
  } else if (lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('product')) {
    category = 'e-commerce'
  } else if (lowerPrompt.includes('agency') || lowerPrompt.includes('studio') || lowerPrompt.includes('creative')) {
    category = 'agency'
  } else if (lowerPrompt.includes('landing') || lowerPrompt.includes('startup')) {
    category = 'landing-page'
  } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('magazine') || lowerPrompt.includes('editorial')) {
    category = 'blog'
  } else if (lowerPrompt.includes('corporate') || lowerPrompt.includes('business') || lowerPrompt.includes('b2b')) {
    category = 'corporate'
  } else if (lowerPrompt.includes('spiritual') || lowerPrompt.includes('astrology') || lowerPrompt.includes('tarot') || lowerPrompt.includes('mystical') || lowerPrompt.includes('witchy') || lowerPrompt.includes('occult')) {
    category = 'spiritual'
  } else if (lowerPrompt.includes('wellness') || lowerPrompt.includes('yoga') || lowerPrompt.includes('meditation') || lowerPrompt.includes('healing') || lowerPrompt.includes('reiki')) {
    category = 'wellness'
  } else if (lowerPrompt.includes('crystal') || lowerPrompt.includes('metaphysical') || lowerPrompt.includes('apothecary') || lowerPrompt.includes('herbal')) {
    category = 'metaphysical-shop'
  }

  // Extract tags from prompt
  const tags: string[] = []
  const tagKeywords: Record<string, string[]> = {
    'responsive': ['responsive', 'mobile', 'tablet', 'desktop'],
    'modern': ['modern', 'contemporary', 'fresh'],
    'minimal': ['minimal', 'clean', 'simple'],
    'bold': ['bold', 'vibrant', 'energetic'],
    'professional': ['professional', 'corporate', 'business'],
    'creative': ['creative', 'artistic', 'design'],
    'e-commerce': ['shop', 'store', 'product', 'cart', 'checkout'],
    'portfolio': ['portfolio', 'gallery', 'showcase', 'work'],
    'landing': ['landing', 'hero', 'cta', 'conversion'],
    'saas': ['saas', 'software', 'app', 'tool'],
    'spiritual': ['spiritual', 'astrology', 'tarot', 'mystical', 'witchy', 'occult', 'celestial'],
    'wellness': ['wellness', 'yoga', 'meditation', 'healing', 'reiki', 'holistic', 'mindfulness'],
    'crystal': ['crystal', 'gemstone', 'metaphysical', 'apothecary', 'herbal'],
  }

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      tags.push(tag)
    }
  }

  // Add style-based tags
  if (style.includes('Corporate')) tags.push('corporate', 'professional')
  if (style.includes('SaaS')) tags.push('saas', 'tech', 'developer')
  if (style.includes('E-commerce')) tags.push('e-commerce', 'shop', 'product')
  if (style.includes('Portfolio')) tags.push('portfolio', 'creative', 'designer')
  if (style.includes('Agency')) tags.push('agency', 'studio', 'creative')
  if (style.includes('Editorial')) tags.push('blog', 'content', 'editorial')
  if (style.includes('Luxury')) tags.push('luxury', 'premium', 'high-end')
  if (style.includes('Retro')) tags.push('retro', 'y2k', 'nostalgic')
  if (style.includes('Playful')) tags.push('playful', 'friendly', 'startup')
  if (style.includes('Startup')) tags.push('startup', 'landing', 'saas')
  if (style.includes('Spiritual')) tags.push('spiritual', 'astrology', 'mystical', 'wellness', 'tarot')
  if (style.includes('Celestial')) tags.push('dark', 'celestial', 'witchy', 'occult')
  if (style.includes('Sage')) tags.push('earthy', 'natural', 'herbal', 'yoga')
  if (style.includes('Ethereal')) tags.push('light', 'meditation', 'reiki', 'healing')
  if (style.includes('Crystal Rose')) tags.push('crystal', 'feminine', 'self-care', 'rose')
  if (style.includes('Wellness')) tags.push('wellness', 'yoga', 'fitness', 'health', 'studio')
  if (style.includes('Metaphysical')) tags.push('crystal', 'shop', 'metaphysical', 'e-commerce')

  // Remove duplicates
  const uniqueTags = Array.from(new Set(tags))

  // Generate description
  const description = `${style} template${category !== 'general' ? ` for ${category.replace('-', ' ')}` : ''}. ${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}`

  return {
    category,
    tags: uniqueTags.slice(0, 8), // Limit to 8 tags
    description,
  }
}

