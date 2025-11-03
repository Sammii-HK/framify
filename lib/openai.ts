import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export type Style = 'Minimal' | 'Bold' | 'Soft' | 'Dark'

const stylePrompts: Record<Style, string> = {
  Minimal: `Research and draw inspiration from minimalist design systems like:
- Apple's Human Interface Guidelines (clean, spacious, purposeful)
- Brutalist minimalism (stark, functional, type-focused)
- Japanese minimalism (ma, negative space, restraint)
- Scandinavian design (light, natural, uncluttered)

Create an original design inspired by these principles but NOT a direct copy. Use:
- Generous whitespace (60%+ negative space)
- Subtle, muted color palette (grays, beiges, soft blues)
- Clean typography hierarchy (Inter, System fonts, or serif contrast)
- Purposeful animations (subtle fades, gentle slides)
- Focus on content and clarity over decoration
- Limited color palette (2-3 colors max)
- Geometric shapes and clean lines`,

  Bold: `Research and draw inspiration from bold design systems like:
- Stripe's bold geometric patterns and vibrant gradients
- Vercel's high-contrast, tech-forward aesthetic
- Spotify's dark mode with vibrant accents
- Modern tech startups (Linear, Notion's bold moments)

Create an original design inspired by these principles but NOT a direct copy. Use:
- Vibrant, saturated colors (electric blues, purples, oranges)
- High contrast (black/white with color pops)
- Bold typography (large headings, compressed fonts, weight contrast)
- Dynamic animations (bouncy, energetic, attention-grabbing)
- Geometric patterns and shapes
- Strong visual hierarchy with scale
- Confident color combinations`,

  Soft: `Research and draw inspiration from soft, approachable design systems like:
- Instagram's pastel gradients and warm tones
- Dribbble's friendly, creative aesthetic
- Notion's inviting, human-centered design
- Airbnb's warm, welcoming interface

Create an original design inspired by these principles but NOT a direct copy. Use:
- Soft pastel colors (lavender, peach, mint, sky blue)
- Gentle gradients (subtle transitions, no harsh stops)
- Rounded corners (12-24px border radius)
- Warm, inviting color temperatures
- Playful but professional animations (gentle bounces, smooth slides)
- Comfortable spacing (not too tight, not too loose)
- Human, friendly typography (Inter, System fonts with warmth)
- Organic shapes alongside geometric ones`,

  Dark: `Research and draw inspiration from dark mode design systems like:
- GitHub Dark's sophisticated monochrome with accent colors
- Linear's sleek, modern dark interface
- Spotify's immersive dark experience
- Apple's Dark Mode guidelines

Create an original design inspired by these principles but NOT a direct copy. Use:
- Rich dark backgrounds (near-black, dark grays: #0a0a0a, #1a1a1a)
- High contrast text (pure white or light gray on dark)
- Sophisticated accent colors (electric blue, purple, cyan)
- Glassmorphism effects (subtle blur, transparency)
- Smooth, premium animations (glide, fade, scale)
- Modern aesthetics (sleek, futuristic, professional)
- Careful use of light and shadow
- Monospace or modern sans-serif fonts for tech feel`,
}

export async function generateTemplateCode(
  prompt: string,
  style: Style
): Promise<{ code: string; title: string }> {
  const systemPrompt = `You are an expert React developer and UI/UX designer specializing in Framer Motion animations and Tailwind CSS.
Your task is to generate a complete, production-ready React component that can be used as a Framer template.

CRITICAL DESIGN PHILOSOPHY:
- Draw inspiration from real design systems and trends, but create ORIGINAL work
- Never copy directly - synthesize multiple influences into something new
- Research current design trends and apply them thoughtfully
- Create designs that feel authentic and intentional, not generic
- Balance familiarity (users understand it) with uniqueness (it stands out)

Requirements:
1. The component must use Framer Motion (import motion from 'framer-motion')
2. Use Tailwind CSS classes for all styling
3. Make the component visually appealing and functional
4. Include smooth animations using Framer Motion variants and transitions
5. Follow the specified design style principles: ${stylePrompts[style]}
6. The component should be a complete, self-contained React component
7. Export the component as default export
8. Use TypeScript for type safety
9. Make it responsive using Tailwind's responsive utilities (sm:, md:, lg: breakpoints)

Design Process:
1. Research the style category and understand its principles
2. Identify 2-3 design systems that exemplify this style
3. Synthesize their approaches into something original
4. Apply the style principles authentically to the user's prompt
5. Create unique design decisions that feel intentional

Structure:
- Import statements at the top
- Component definition with proper TypeScript types
- Use Framer Motion's motion.div, motion.section, etc. for animated elements
- Apply Tailwind utility classes for styling
- Include variants for animations (fade in, slide up, scale, etc.)
- Make it responsive using Tailwind's responsive utilities

Generate a meaningful, original component that feels inspired by great design but is uniquely yours.`

  try {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      prompt: `Create a React component with Framer Motion and Tailwind CSS for: ${prompt}`,
      temperature: 0.7,
      maxTokens: 3000,
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

