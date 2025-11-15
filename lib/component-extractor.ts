/**
 * Component Extraction Utility
 * 
 * Extracts reusable components from template code and generates metadata
 */

import { extractMetadata, type Style } from './openai'
import { suggestPricing } from './pricing'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export type ComponentType = 
  | 'button'
  | 'card'
  | 'hero'
  | 'nav'
  | 'footer'
  | 'section'
  | 'form'
  | 'testimonial'
  | 'feature'
  | 'pricing'
  | 'gallery'
  | 'other'

export interface ExtractedComponent {
  name: string
  code: string
  componentType: ComponentType
  description: string
  tags: string[]
  price: number
}

/**
 * Detect component type from code patterns
 */
export function detectComponentType(code: string, name: string): ComponentType {
  const lowerCode = code.toLowerCase()
  const lowerName = name.toLowerCase()

  // Check name first
  if (lowerName.includes('button') || lowerName.includes('btn')) {
    return 'button'
  }
  if (lowerName.includes('card')) {
    return 'card'
  }
  if (lowerName.includes('hero')) {
    return 'hero'
  }
  if (lowerName.includes('nav') || lowerName.includes('header') || lowerName.includes('menu')) {
    return 'nav'
  }
  if (lowerName.includes('footer')) {
    return 'footer'
  }
  if (lowerName.includes('form') || lowerName.includes('input') || lowerName.includes('contact')) {
    return 'form'
  }
  if (lowerName.includes('testimonial') || lowerName.includes('review')) {
    return 'testimonial'
  }
  if (lowerName.includes('feature')) {
    return 'feature'
  }
  if (lowerName.includes('pricing') || lowerName.includes('price')) {
    return 'pricing'
  }
  if (lowerName.includes('gallery') || lowerName.includes('grid') || lowerName.includes('masonry')) {
    return 'gallery'
  }

  // Check code patterns
  if (lowerCode.includes('onclick') || lowerCode.includes('onclick=') || lowerCode.includes('button')) {
    if (lowerCode.includes('href') || lowerCode.includes('link')) {
      return 'button'
    }
  }
  if (lowerCode.includes('testimonial') || lowerCode.includes('review') || lowerCode.includes('quote')) {
    return 'testimonial'
  }
  if (lowerCode.includes('pricing') || lowerCode.includes('price') || lowerCode.includes('$')) {
    return 'pricing'
  }
  if (lowerCode.includes('gallery') || lowerCode.includes('grid-cols') || lowerCode.includes('masonry')) {
    return 'gallery'
  }
  if (lowerCode.includes('hero') || lowerCode.includes('banner') || (lowerCode.includes('h1') && lowerCode.includes('cta'))) {
    return 'hero'
  }
  if (lowerCode.includes('nav') || lowerCode.includes('navigation') || lowerCode.includes('menu')) {
    return 'nav'
  }
  if (lowerCode.includes('footer') || lowerCode.includes('copyright')) {
    return 'footer'
  }
  if (lowerCode.includes('card') || lowerCode.includes('shadow') && lowerCode.includes('rounded')) {
    return 'card'
  }
  if (lowerCode.includes('form') || lowerCode.includes('input') || lowerCode.includes('textarea')) {
    return 'form'
  }
  if (lowerCode.includes('feature') || lowerCode.includes('benefit')) {
    return 'feature'
  }

  // Check for section patterns
  if (lowerCode.includes('<section') || lowerCode.includes('section>')) {
    return 'section'
  }

  return 'other'
}

/**
 * Extract component code from template code
 */
export function extractComponentCode(
  templateCode: string,
  componentName: string,
  startLine?: number,
  endLine?: number
): string {
  // If specific lines provided, extract those
  if (startLine !== undefined && endLine !== undefined) {
    const lines = templateCode.split('\n')
    return lines.slice(startLine - 1, endLine).join('\n')
  }

  // Try to find component function/const
  const namePattern = new RegExp(
    `(const|function|export\\s+(?:const|function))\\s+${componentName}\\s*[=:]?\\s*[({]`,
    'i'
  )
  const match = templateCode.match(namePattern)
  
  if (!match) {
    // Try to find JSX with component name
    const jsxPattern = new RegExp(`<${componentName}[^>]*>`, 'i')
    const jsxMatch = templateCode.match(jsxPattern)
    if (jsxMatch) {
      // Extract the component definition
      const startIdx = templateCode.indexOf(jsxMatch[0])
      let braceCount = 0
      let inComponent = false
      let endIdx = startIdx

      for (let i = startIdx; i < templateCode.length; i++) {
        if (templateCode[i] === '{') {
          braceCount++
          inComponent = true
        } else if (templateCode[i] === '}') {
          braceCount--
          if (inComponent && braceCount === 0) {
            endIdx = i + 1
            break
          }
        }
      }

      return templateCode.substring(startIdx, endIdx)
    }
  }

  // Fallback: try to extract function/const component
  const functionPattern = new RegExp(
    `(const|function|export\\s+(?:const|function))\\s+${componentName}\\s*[=:]?\\s*[({][\\s\\S]*?\\n\\}`,
    'i'
  )
  const functionMatch = templateCode.match(functionPattern)
  if (functionMatch) {
    return functionMatch[0]
  }

  // Last resort: return the whole code
  return templateCode
}

/**
 * Make component code standalone (add necessary imports)
 */
export function makeComponentStandalone(
  componentCode: string,
  componentName: string
): string {
  // Check if imports already exist
  if (componentCode.includes('import')) {
    return componentCode
  }

  // Add necessary imports
  const imports = [
    "import { motion } from 'framer-motion'",
    "import React from 'react'",
  ].join('\n')

  // Ensure component is exported
  let code = componentCode
  if (!code.includes('export')) {
    if (code.includes('const') && code.includes('=')) {
      code = code.replace(/const\s+(\w+)/, 'export const $1')
    } else if (code.includes('function')) {
      code = code.replace(/function\s+(\w+)/, 'export function $1')
    } else {
      code = `export default function ${componentName}() {\n  return (\n    ${code}\n  )\n}`
    }
  }

  return `${imports}\n\n${code}`
}

/**
 * Generate component description using AI
 */
export async function generateComponentDescription(
  componentCode: string,
  componentName: string,
  componentType: ComponentType,
  style: string
): Promise<string> {
  try {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `Analyze this React component code and generate a concise, compelling description for selling it on a marketplace. 

Component Name: ${componentName}
Component Type: ${componentType}
Style: ${style}

Code:
\`\`\`tsx
${componentCode.substring(0, 2000)}
\`\`\`

Generate a 2-3 sentence description that:
- Explains what the component does
- Highlights key features (animations, responsive design, etc.)
- Mentions use cases
- Is compelling for potential buyers

Keep it under 150 words.`,
      temperature: 0.7,
      maxTokens: 200,
    })

    return result.text.trim()
  } catch (error) {
    console.error('Error generating component description:', error)
    // Fallback description
    return `A ${componentType} component in ${style} style. Ready to use in your Framer projects.`
  }
}

/**
 * Generate tags for component
 */
export function generateComponentTags(
  componentType: ComponentType,
  style: string,
  componentCode: string
): string[] {
  const tags: string[] = [componentType]

  // Add style-based tags
  const styleLower = style.toLowerCase()
  if (styleLower.includes('minimal')) tags.push('minimal', 'clean')
  if (styleLower.includes('dark')) tags.push('dark', 'tech')
  if (styleLower.includes('saas')) tags.push('saas', 'tech')
  if (styleLower.includes('e-commerce')) tags.push('e-commerce', 'shop')
  if (styleLower.includes('portfolio')) tags.push('portfolio', 'creative')
  if (styleLower.includes('agency')) tags.push('agency', 'bold')
  if (styleLower.includes('luxury')) tags.push('luxury', 'premium')
  if (styleLower.includes('retro')) tags.push('retro', 'y2k')
  if (styleLower.includes('playful')) tags.push('playful', 'friendly')

  // Add feature-based tags
  const codeLower = componentCode.toLowerCase()
  if (codeLower.includes('framer-motion') || codeLower.includes('motion.')) {
    tags.push('animated')
  }
  if (codeLower.includes('md:') || codeLower.includes('lg:') || codeLower.includes('responsive')) {
    tags.push('responsive')
  }
  if (codeLower.includes('hover') || codeLower.includes('onhover')) {
    tags.push('interactive')
  }
  if (codeLower.includes('gradient')) {
    tags.push('gradient')
  }

  // Remove duplicates and limit
  return Array.from(new Set(tags)).slice(0, 8)
}

/**
 * Suggest pricing for component based on complexity
 */
export function suggestComponentPricing(
  componentType: ComponentType,
  componentCode: string
): number {
  const codeLength = componentCode.length
  const hasAnimations = componentCode.includes('framer-motion') || componentCode.includes('motion.')
  const hasComplexLogic = componentCode.includes('useState') || componentCode.includes('useEffect') || componentCode.includes('map(')

  // Base pricing by type
  const basePrices: Record<ComponentType, number> = {
    button: 5,
    card: 8,
    hero: 15,
    nav: 12,
    footer: 8,
    section: 10,
    form: 12,
    testimonial: 8,
    feature: 8,
    pricing: 15,
    gallery: 12,
    other: 10,
  }

  let price = basePrices[componentType] || 10

  // Adjust for complexity
  if (codeLength > 1000) price += 5
  if (hasAnimations) price += 5
  if (hasComplexLogic) price += 5

  // Cap at reasonable maximum
  return Math.min(price, 30)
}

/**
 * Extract component from template with full metadata
 */
export async function extractComponent(
  templateCode: string,
  componentName: string,
  style: string,
  templateCategory?: string,
  startLine?: number,
  endLine?: number
): Promise<ExtractedComponent> {
  // Extract code
  let code = extractComponentCode(templateCode, componentName, startLine, endLine)
  code = makeComponentStandalone(code, componentName)

  // Detect type
  const componentType = detectComponentType(code, componentName)

  // Generate description
  const description = await generateComponentDescription(code, componentName, componentType, style)

  // Generate tags
  const tags = generateComponentTags(componentType, style, code)

  // Suggest pricing
  const price = suggestComponentPricing(componentType, code)

  return {
    name: componentName,
    code,
    componentType,
    description,
    tags,
    price,
  }
}

/**
 * Check if a component name suggests it's a reusable component
 */
function isReusableComponent(name: string, code: string): boolean {
  const lowerName = name.toLowerCase()
  const lowerCode = code.toLowerCase()

  // Skip main app components and non-reusable patterns
  const skipPatterns = [
    'app',
    'main',
    'page',
    'layout',
    'default',
    'component', // Generic "Component"
    'wrapper',
    'container', // Unless it's a specific container component
  ]

  if (skipPatterns.some(pattern => lowerName === pattern)) {
    return false
  }

  // Good reusable component patterns
  const reusablePatterns = [
    'button', 'btn',
    'card',
    'hero',
    'nav', 'navigation', 'header', 'menu',
    'footer',
    'section',
    'form', 'input', 'textarea', 'select',
    'testimonial', 'review', 'quote',
    'feature', 'benefit',
    'pricing', 'price',
    'gallery', 'grid', 'masonry',
    'modal', 'dialog', 'popup',
    'badge', 'tag', 'chip',
    'avatar', 'profile',
    'list', 'item',
    'tabs', 'tab',
    'accordion',
    'carousel', 'slider',
    'banner', 'alert', 'notification',
    'sidebar',
    'breadcrumb',
    'pagination',
    'tooltip',
    'dropdown', 'select',
    'checkbox', 'radio',
    'switch', 'toggle',
  ]

  // Check if name contains reusable patterns
  if (reusablePatterns.some(pattern => lowerName.includes(pattern))) {
    return true
  }

  // Check code for reusable component indicators
  const hasJSX = /return\s*\(/.test(code) || /return\s*</.test(code)
  const hasProps = /props|interface.*Props|type.*Props/.test(code)
  const hasReusableElements = /button|div.*className|motion\./.test(code)
  
  // If it has JSX and props, it's likely reusable
  if (hasJSX && hasProps && hasReusableElements) {
    return true
  }

  // Check if it's exported (more likely to be reusable)
  const isExported = code.includes(`export`) || code.includes(`export default`)
  
  // If exported and has JSX, likely reusable
  if (isExported && hasJSX && name.length > 2) {
    return true
  }

  return false
}

/**
 * Auto-detect all reusable components in template code
 */
export function detectComponents(templateCode: string): Array<{ name: string; startLine: number; endLine: number }> {
  const components: Array<{ name: string; startLine: number; endLine: number }> = []
  const lines = templateCode.split('\n')

  // Pattern for component definitions (React components)
  const componentPatterns = [
    /^(export\s+)?(const|function)\s+([A-Z][a-zA-Z0-9]*)\s*[=:]?\s*[({]/,
  ]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const pattern of componentPatterns) {
      const match = line.match(pattern)
      if (match) {
        const componentName = match[3]
        
        // Skip if it's the main App component or common non-reusable patterns
        if (componentName === 'App' || componentName === 'Component' || componentName === 'default') {
          continue
        }

        // Try to find the end of the component
        let braceCount = 0
        let startFound = false
        let endLine = i + 1
        let componentCode = ''

        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j]
          componentCode += currentLine + '\n'
          const openBraces = (currentLine.match(/{/g) || []).length
          const closeBraces = (currentLine.match(/}/g) || []).length

          if (openBraces > 0) startFound = true
          braceCount += openBraces - closeBraces

          if (startFound && braceCount === 0 && j > i) {
            endLine = j + 1
            break
          }
        }

        // Check if this is a reusable component
        if (isReusableComponent(componentName, componentCode)) {
          components.push({
            name: componentName,
            startLine: i + 1,
            endLine,
          })
        }
        break
      }
    }
  }

  return components
}

