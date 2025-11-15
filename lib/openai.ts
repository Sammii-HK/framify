import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

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
  const systemPrompt = `You are an expert React developer and UI/UX designer specializing in Framer Motion animations and Tailwind CSS.
Your task is to generate a complete, production-ready, SELLABLE React component that can be used as a Framer template.

⚠️ CRITICAL: Your code will be AUTOMATICALLY REJECTED if it doesn't meet these exact requirements. Read carefully! ⚠️

CRITICAL DESIGN PHILOSOPHY:
- Draw inspiration from real design systems and trends, but create ORIGINAL work
- Never copy directly - synthesize multiple influences into something new
- Research current design trends and apply them thoughtfully
- Create designs that feel authentic and intentional, not generic
- Balance familiarity (users understand it) with uniqueness (it stands out)

MANDATORY QUALITY REQUIREMENTS FOR SELLABLE TEMPLATES:

    1. RESPONSIVE DESIGN (CRITICAL - MANDATORY - VALIDATED - MINIMUM 3 BREAKPOINT USES):
       - MUST use Tailwind responsive breakpoints: sm: (640px+), md: (768px+), lg: (1024px+), xl: (1280px+)
       - MINIMUM REQUIREMENT: Use sm:, md:, or lg: at least 3 TIMES in your component
       - REQUIRED PATTERNS (use these exact patterns):
         * Layout: className="flex flex-col md:flex-row lg:flex-row"
         * Typography: className="text-2xl md:text-4xl lg:text-5xl"
         * Spacing: className="px-4 md:px-8 lg:px-12"
         * Grid: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
         * Width: className="w-full md:w-1/2 lg:w-1/3"
       - Mobile-first: Base styles for mobile (320px-639px), then sm:, md:, lg: for larger screens
       - NO fixed widths without responsive alternatives
       - Touch-friendly: Interactive elements min 44x44px on mobile
       - COUNT YOUR BREAKPOINTS: Make sure you use sm:, md:, or lg: at least 3 times total

    2. TYPOGRAPHY & HIERARCHY (MANDATORY - VALIDATED - MINIMUM 3 TEXT SIZES, 2 FONT WEIGHTS):
       - MUST use Tailwind typography classes for ALL text
       - MINIMUM REQUIREMENT: Use at least 3 DIFFERENT text sizes AND at least 2 DIFFERENT font weights
       - REQUIRED PATTERNS (use these exact patterns):
         * h1: className="text-3xl md:text-4xl lg:text-5xl font-bold"
         * h2: className="text-2xl md:text-3xl lg:text-4xl font-semibold"
         * h3: className="text-xl md:text-2xl lg:text-3xl font-semibold"
         * body: className="text-base md:text-lg font-normal"
         * small: className="text-sm font-medium"
       - COUNT YOUR TYPOGRAPHY: Make sure you use at least 3 different text-* sizes and 2 different font-* weights
       - Line height: leading-tight, leading-normal, leading-relaxed
       - NO inline styles for typography - use Tailwind classes only
       - System fonts: font-sans (Inter, system-ui) or font-serif for headings

3. COLOR PALETTE PER STYLE:
   ${stylePrompts[style]}
   - Define 3-5 primary colors max (background, text, accent, secondary)
   - Use Tailwind color classes consistently throughout
   - Ensure sufficient contrast ratios for accessibility
   - Document color usage in comments

4. CUSTOMIZABLE CONTENT PLACEHOLDERS:
   - Replace all hardcoded images with placeholder variables or props
   - Use descriptive placeholder text: "Your headline here", "Add your description"
   - Make text content easily editable via props or constants
   - Include example data structure in comments showing how to customize
   - Use placeholder images: "https://via.placeholder.com/800x600" or similar
   - All user-facing text should be easily replaceable
   - CRITICAL: All variables MUST be defined before use - NO undefined references
   - CRITICAL: If using arrays/objects, provide default empty arrays/objects: const items = [] or const data = {}
   - CRITICAL: Use optional chaining (?.) or null checks when accessing nested properties
   - CRITICAL: Provide default values for all props: interface Props { items?: Item[] } then const { items = [] } = props

    5. PERFORMANCE OPTIMIZATION (CRITICAL - VALIDATED):
       - ANIMATION RULES (MANDATORY):
         * ✅ DO animate: transform, opacity, scale, rotate
         * ❌ NEVER animate: width, height, left, top, margin, padding (causes layout thrashing)
       - REQUIRED: Use Framer Motion variants with transform/opacity:
         * Example: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
         * NOT: initial={{ top: -100 }} animate={{ top: 0 }}
       - Use will-change CSS property for animated elements: will-change="transform, opacity"
       - Optimize with useMemo/useCallback for expensive computations
       - Lazy load images: Use loading="lazy" attribute
       - Use Framer Motion's spring/easeInOut transitions (not linear)
       - Example: transition={{ type: "spring", stiffness: 100 }} NOT transition={{ duration: 1 }}

6. CMS & DYNAMIC CONTENT SUPPORT:
   - Structure component to accept props for dynamic content
   - Include TypeScript interfaces for content structure
   - Support arrays for repeatable sections (features, testimonials, products)
   - Make it easy to integrate with headless CMS (Contentful, Sanity, etc.)
   - Include example data structure in comments

7. DOCUMENTATION (Include in code comments):
   - Component purpose and use case
   - Props interface with descriptions
   - How to customize colors, fonts, spacing
   - Section breakdown (what each section does)
   - Customization guide: "To change colors, edit Tailwind classes..."
   - Example usage with sample data

8. LICENSING & ASSETS:
   - Use only open-source, commercially-safe fonts (Google Fonts, system fonts)
   - Use placeholder images or clearly marked free-to-use sources
   - Icons: Use Heroicons, Lucide, or similar open-source icon libraries
   - NO copyrighted images, fonts, or assets
   - Include license info in comments if using specific libraries

9. METADATA & SEARCH OPTIMIZATION:
   - Generate SEO-friendly component structure
   - Use semantic HTML (header, nav, main, section, footer)
   - Include proper alt text placeholders for images
   - Structure content for search engines

TECHNICAL REQUIREMENTS:
1. The component must use Framer Motion (import motion from 'framer-motion')
2. Use Tailwind CSS classes for all styling
3. Include smooth animations using Framer Motion variants and transitions
4. Follow the specified design style principles: ${stylePrompts[style]}
5. The component should be a complete, self-contained React component
6. Export the component as default export
7. Use TypeScript for type safety with proper interfaces
8. Make it responsive using Tailwind's responsive utilities (sm:, md:, lg:, xl: breakpoints)

CODE STRUCTURE (FOLLOW THIS EXACT ORDER):
1. Import statements at the top
2. TypeScript interfaces for props with default values
3. Define ALL data structures BEFORE the component:
   * const features = [{ title: "Feature 1", description: "..." }, { title: "Feature 2", description: "..." }]
   * const hero = { title: "Your Title", subtitle: "Your Subtitle" }
   * const testimonials = [{ name: "John", quote: "..." }]
4. Component definition with proper TypeScript types
5. Use Framer Motion's motion.div, motion.section, etc. for animated elements
6. Apply Tailwind utility classes for styling (with responsive breakpoints!)
7. Include variants for animations (fade in, slide up, scale, etc.)
8. Comprehensive comments explaining customization
9. Example data structure in comments

CRITICAL SAFETY RULES:
- ALL arrays MUST be defined: const items = [] or const { items = [] } = props
- ALL property access MUST use optional chaining: feature?.title NOT feature.title
- ALL variables MUST be defined before use
- NEVER access properties on potentially undefined objects without checks

BEFORE OUTPUTTING YOUR CODE, VALIDATE IT MEETS THESE REQUIREMENTS:

STEP 1: COUNT RESPONSIVE BREAKPOINTS
- Search your code for "sm:", "md:", "lg:"
- Count how many times they appear
- REQUIREMENT: At least 3 total uses
- If less than 3, ADD MORE responsive classes

STEP 2: COUNT TYPOGRAPHY CLASSES
- Search for "text-" classes (text-xl, text-2xl, text-3xl, etc.)
- Count how many DIFFERENT text sizes you use
- REQUIREMENT: At least 3 different text sizes
- Search for "font-" classes (font-normal, font-bold, etc.)
- Count how many DIFFERENT font weights you use
- REQUIREMENT: At least 2 different font weights
- If missing, ADD MORE typography variety

STEP 3: CHECK RUNTIME SAFETY
- Find all arrays: .map(, .filter(, .forEach(
- Verify each has: const items = [] or const { items = [] } = props
- Find all property access: {feature.title}
- Replace with: {feature?.title || "Default"}
- Verify all variables are defined before use

STEP 4: VERIFY REQUIREMENTS MET
✅ At least 3 responsive breakpoints (sm:, md:, lg:) - COUNTED: ___
✅ At least 3 different text sizes (text-*) - COUNTED: ___
✅ At least 2 different font weights (font-*) - COUNTED: ___
✅ All arrays have default values
✅ All property access uses optional chaining (?.)
✅ All variables defined before use

YOUR CODE WILL BE REJECTED IF:
- Score < 75/100
- Missing responsive breakpoints (need at least 3 uses of sm:/md:/lg:)
- Missing typography hierarchy (need at least 3 text sizes, 2 font weights)
- Any undefined property access
- Array methods without default empty arrays

Generate a production-ready, sellable component that meets ALL these requirements. The template should be immediately usable and customizable by buyers.`

  // Example template structure that passes all validations
  const exampleTemplate = `import { motion } from 'framer-motion'

interface Props {
  title?: string
  subtitle?: string
  features?: Array<{ title: string; description: string }>
}

export default function ExampleTemplate({ 
  title = "Your Headline Here",
  subtitle = "Your subtitle here",
  features = [
    { title: "Feature 1", description: "Description here" },
    { title: "Feature 2", description: "Description here" }
  ]
}: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-base md:text-lg font-normal text-gray-600">
          {subtitle}
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 lg:px-12 py-8 md:py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features?.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {feature?.title || "Feature Title"}
              </h3>
              <p className="text-sm md:text-base font-normal text-gray-600">
                {feature?.description || ""}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}`

  try {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      prompt: `Create a production-ready, sellable React component with Framer Motion and Tailwind CSS for: ${prompt}

⚠️ YOUR CODE WILL BE AUTOMATICALLY REJECTED IF IT DOESN'T MEET THESE REQUIREMENTS ⚠️

EXAMPLE TEMPLATE STRUCTURE (Follow this pattern exactly):
\`\`\`tsx
${exampleTemplate}
\`\`\`

KEY PATTERNS FROM EXAMPLE (Copy these patterns EXACTLY):

RESPONSIVE BREAKPOINTS (MUST HAVE ≥3):
- "px-4 md:px-8 lg:px-12" = 2 breakpoints (md:, lg:)
- "py-12 md:py-16 lg:py-20" = 2 more breakpoints (md:, lg:)
- "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" = 2 more breakpoints (md:, lg:)
- "gap-6 md:gap-8" = 1 more breakpoint (md:)
- TOTAL: 7 breakpoints ✅ (need ≥3)

TYPOGRAPHY (MUST HAVE ≥3 SIZES, ≥2 WEIGHTS):
- "text-3xl md:text-4xl lg:text-5xl font-bold" = 3 sizes (text-3xl, text-4xl, text-5xl), 1 weight (font-bold)
- "text-base md:text-lg font-normal" = 2 sizes (text-base, text-lg), 1 weight (font-normal)
- "text-xl md:text-2xl font-semibold" = 2 sizes (text-xl, text-2xl), 1 weight (font-semibold)
- "text-sm md:text-base font-normal" = 2 sizes (text-sm, text-base), 1 weight (font-normal)
- TOTAL: 7+ sizes ✅ (need ≥3), 3 weights ✅ (need ≥2)

ARRAYS & SAFETY:
- features = [{...}, {...}] defined BEFORE component
- features?.map() uses optional chaining
- feature?.title || "Default" safe property access

MANDATORY REQUIREMENTS (Code will be rejected if missing):

1. RESPONSIVE DESIGN (MANDATORY - MUST HAVE AT LEAST 3 BREAKPOINT USES):
   - Use Tailwind breakpoints: sm:, md:, lg: in MULTIPLE className attributes
   - MINIMUM: Use sm:, md:, lg: at least 3 times total across your component
   - Example: className="flex flex-col md:flex-row lg:flex-row"
   - Example: className="text-2xl md:text-4xl lg:text-5xl"
   - Example: className="px-4 md:px-8 lg:px-12"
   - Example: className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
   - NO fixed layouts without responsive alternatives

2. TYPOGRAPHY HIERARCHY (MANDATORY - MUST HAVE AT LEAST 3 TEXT SIZES, 2 FONT WEIGHTS):
   - Use Tailwind text-* classes for ALL text elements
   - MINIMUM: Use at least 3 different text sizes (e.g., text-xl, text-2xl, text-3xl)
   - MINIMUM: Use at least 2 different font weights (e.g., font-normal, font-bold)
   - Example: className="text-3xl md:text-4xl font-bold"
   - Example: className="text-base md:text-lg font-normal"
   - Example: className="text-sm font-medium"
   - NO inline styles or CSS for typography

3. RUNTIME SAFETY (MANDATORY - CODE WILL CRASH IF MISSING):
   - ALL variables MUST be defined before use
   - ALL arrays MUST have default values: const features = [] or const { items = [] } = props
   - ALL property access MUST use optional chaining: feature?.title NOT feature.title
   - Example safe pattern:
     const features = [
       { title: "Feature 1", description: "..." },
       { title: "Feature 2", description: "..." }
     ]
     return (
       <div>
         {features.map((feature, index) => (
           <div key={index}>
             <h3>{feature?.title || "Default Title"}</h3>
             <p>{feature?.description || ""}</p>
           </div>
         ))}
       </div>
     )

4. PERFORMANCE (MANDATORY):
   - Animate ONLY: transform, opacity, scale, rotate
   - NEVER animate: width, height, left, top, margin, padding
   - Example: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
   - Use will-change="transform, opacity" for animated elements

5. COLOR PALETTE:
   - Use Tailwind color classes: bg-*, text-*, border-*
   - Well-defined color palette for ${style} style

6. CUSTOMIZABLE CONTENT:
   - Props interface with TypeScript types and default values
   - Placeholder text: "Your headline here", "Add description"
   - Example data structure in comments

7. DOCUMENTATION:
   - Comments explaining customization
   - Section breakdowns
   - Props interface descriptions

CRITICAL: BEFORE OUTPUTTING CODE, VERIFY:

1. COUNT RESPONSIVE BREAKPOINTS:
   - Search for "md:" and "lg:" in your className attributes
   - You MUST have at least 3 total uses (e.g., "md:px-8", "lg:px-12", "md:flex-row", "lg:text-5xl")
   - If you have less than 3, ADD MORE responsive classes

2. COUNT TYPOGRAPHY:
   - Count DIFFERENT text-* classes: text-xl, text-2xl, text-3xl, text-base, text-sm (need ≥3 different ones)
   - Count DIFFERENT font-* classes: font-bold, font-semibold, font-normal, font-medium (need ≥2 different ones)
   - If missing, ADD MORE typography variety

3. CHECK ARRAYS:
   - Every .map(, .filter(, .forEach( MUST have: const items = [...] or const { items = [] } = props
   - Example: const features = [{...}, {...}] BEFORE using features.map

4. CHECK PROPERTY ACCESS:
   - Every {item.property} MUST be {item?.property || "Default"}
   - Example: {feature?.title || "Title"} NOT {feature.title}

5. VERIFY STRUCTURE:
   - Imports at top
   - Interface with default values
   - Data arrays defined BEFORE component
   - Component uses all the data

VALIDATION CHECKLIST - Verify your code has:
✅ At least 3 uses of responsive breakpoints (md:, lg:) - COUNT THEM!
✅ At least 3 different text size classes (text-*) - COUNT THEM!
✅ At least 2 different font weight classes (font-*) - COUNT THEM!
✅ All arrays have default values (const items = [] or || [])
✅ All property access uses optional chaining (?.)
✅ All variables defined before use
✅ Framer Motion animations use only transform/opacity

The code MUST run without errors. Every property access must be safe.`,
      temperature: 0.3, // Very low temperature for strict rule-following
      maxTokens: 4000,
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

