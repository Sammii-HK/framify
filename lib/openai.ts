import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export type Style = 'Minimal' | 'Bold' | 'Soft' | 'Dark'

const stylePrompts: Record<Style, string> = {
  Minimal: 'Use a minimalist design with clean lines, ample whitespace, subtle colors, and simple typography.',
  Bold: 'Use bold, vibrant colors, strong typography, high contrast, and impactful visual elements.',
  Soft: 'Use soft pastel colors, gentle gradients, rounded corners, and warm, inviting aesthetics.',
  Dark: 'Use dark backgrounds with light text, modern aesthetics, sleek design elements, and sophisticated color schemes.',
}

export async function generateTemplateCode(
  prompt: string,
  style: Style
): Promise<{ code: string; title: string }> {
  const systemPrompt = `You are an expert React developer specializing in Framer Motion animations and Tailwind CSS.
Your task is to generate a complete, production-ready React component that can be used as a Framer template.

Requirements:
1. The component must use Framer Motion (import motion from 'framer-motion')
2. Use Tailwind CSS classes for all styling
3. Make the component visually appealing and functional
4. Include smooth animations using Framer Motion variants and transitions
5. Follow the specified design style: ${stylePrompts[style]}
6. The component should be a complete, self-contained React component
7. Export the component as default export
8. Use TypeScript for type safety

Structure:
- Import statements at the top
- Component definition with proper TypeScript types
- Use Framer Motion's motion.div, motion.section, etc. for animated elements
- Apply Tailwind utility classes for styling
- Include variants for animations
- Make it responsive using Tailwind's responsive utilities

Generate a meaningful component based on the user's prompt.`

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

