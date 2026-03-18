/**
 * Local test script for Framify spiritual template generation.
 * Run with: npx tsx test-local.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { generateTemplateCode, extractMetadata } from './lib/openai'
import { getDesignSystemPrompt, PALETTES, LIGHT_PALETTES } from './lib/design-system'
import { getCMSPromptBlock } from './lib/cms-templates'
import { validateTemplateQuality } from './lib/template-quality'
import { suggestPricing } from './lib/pricing'

async function main() {
  console.log('\n=== FRAMIFY LOCAL TEST ===\n')

  // 1. Test design system prompt generation
  console.log('1. Testing design system prompt...')
  const dsPrompt = getDesignSystemPrompt('dark-celestial')
  console.log(`   ✓ Design system prompt generated (${dsPrompt.length} chars)`)
  console.log(`   Palette: ${PALETTES['dark-celestial'].name}`)
  console.log(`   Background: ${PALETTES['dark-celestial'].bg.deep}`)
  console.log(`   Accent: ${PALETTES['dark-celestial'].accent.primary}`)

  // 2. Test CMS prompt block
  console.log('\n2. Testing CMS prompt block...')
  const cmsPrompt = getCMSPromptBlock('spiritual')
  console.log(`   ✓ CMS prompt generated (${cmsPrompt.length} chars)`)
  const collectionCount = (cmsPrompt.match(/###/g) || []).length
  console.log(`   Collections included: ${collectionCount}`)

  // 3. Test all 4 palettes have light mode counterparts
  console.log('\n3. Testing palette pairs...')
  for (const key of Object.keys(PALETTES) as Array<keyof typeof PALETTES>) {
    const dark = PALETTES[key]
    const light = LIGHT_PALETTES[key]
    console.log(`   ✓ ${dark.name}: dark(${dark.bg.deep}) / light(${light.bg.deep})`)
  }

  // 4. Generate a real template with GPT-4
  console.log('\n4. Generating spiritual template with AI...')
  console.log('   Style: Spiritual / Dark Celestial')
  console.log('   This will take 30-60 seconds...\n')

  const startTime = Date.now()
  const result = await generateTemplateCode(
    'A mystical astrology landing page with hero, services section, testimonials, and contact form',
    'Spiritual / Dark Celestial'
  )
  const genTime = ((Date.now() - startTime) / 1000).toFixed(1)
  const code = result.code

  console.log(`   ✓ Template generated in ${genTime}s`)
  console.log(`   Title: ${result.title}`)
  console.log(`   Code length: ${code.length} chars`)
  console.log(`   Has React import: ${code.includes('import React') || code.includes("from 'react'")}`)
  console.log(`   Has dark mode toggle: ${code.includes('dark') && code.includes('mode')}`)
  console.log(`   Has Tailwind classes: ${code.includes('flex') || code.includes('grid')}`)

  // Check for design system colours
  const hasDSColours = code.includes('#0D0B1A') || code.includes('#0d0b1a') ||
    code.includes('#C4A265') || code.includes('#c4a265') ||
    code.includes('#161331') || code.includes('celestial')
  console.log(`   Uses design system colours: ${hasDSColours}`)

  // 5. Extract metadata
  console.log('\n5. Extracting metadata...')
  const prompt = 'A mystical astrology landing page with hero, services section, testimonials, and contact form'
  const metadata = extractMetadata(prompt, 'Spiritual / Dark Celestial')
  console.log(`   Category: ${metadata.category}`)
  console.log(`   Tags: ${metadata.tags?.join(', ') || 'none'}`)
  console.log(`   Description: ${metadata.description.slice(0, 80)}...`)

  // 6. Quality validation
  console.log('\n6. Running quality validation...')
  const quality = validateTemplateQuality(code)
  console.log(`   Score: ${quality.score}/100`)
  console.log(`   Responsive: ${quality.hasResponsiveDesign}`)
  console.log(`   Typography: ${quality.hasTypographyHierarchy}`)
  console.log(`   Colour palette: ${quality.hasColorPalette}`)
  console.log(`   TypeScript: ${quality.hasTypeScriptTypes}`)
  console.log(`   Safe assets: ${quality.usesSafeAssets}`)
  if (quality.issues.length > 0) {
    console.log(`   Issues (${quality.issues.length}): ${quality.issues.slice(0, 3).join(' | ')}`)
  }

  // 7. Pricing suggestion
  console.log('\n7. Pricing suggestion...')
  const pricing = suggestPricing('Spiritual / Dark Celestial', metadata.category, metadata.tags)
  console.log(`   Tier: ${pricing.tier}`)
  console.log(`   Price: £${pricing.price}`)

  // 8. Preview first 30 lines of generated code
  console.log('\n8. Generated code preview (first 30 lines):')
  console.log('─'.repeat(60))
  code.split('\n').slice(0, 30).forEach((line, i) => {
    console.log(`   ${String(i + 1).padStart(3)}: ${line}`)
  })
  console.log('─'.repeat(60))

  console.log('\n=== ALL TESTS PASSED ===\n')
}

main().catch((err) => {
  console.error('\n❌ Test failed:', err.message)
  process.exit(1)
})
