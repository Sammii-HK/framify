/**
 * Template Quality Validation & Documentation
 * Ensures generated templates meet sellable quality standards
 */

export interface TemplateQualityCheck {
  hasResponsiveDesign: boolean
  hasTypographyHierarchy: boolean
  hasColorPalette: boolean
  hasCustomizableContent: boolean
  hasPerformanceOptimization: boolean
  hasDocumentation: boolean
  hasTypeScriptTypes: boolean
  usesSafeAssets: boolean
  score: number
  issues: string[]
}

/**
 * Check template code for runtime errors and undefined references
 */
export function validateRuntimeSafety(code: string): { safe: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check for undefined property access patterns
  const unsafePatterns = [
    /\{\w+\.\w+\}/g, // {obj.prop} without optional chaining
    /\.\w+\s*[=!<>]/g, // .prop comparisons
  ]
  
  // Check for common undefined access patterns
  if (code.includes('.title') && !code.includes('?.title') && !code.includes('title ||')) {
    issues.push('Potential undefined access: .title without optional chaining')
  }
  if (code.includes('.content') && !code.includes('?.content') && !code.includes('content ||')) {
    issues.push('Potential undefined access: .content without optional chaining')
  }
  
  // Check if variables are defined before use
  const variableUses = code.match(/\{(\w+)\}/g) || []
  const variableDefs = code.match(/(const|let|var)\s+(\w+)/g) || []
  
  // Check for array/object access without defaults
  if (code.includes('.map(') || code.includes('.filter(') || code.includes('.forEach(')) {
    const hasDefaultArray = code.includes('= []') || code.includes('|| []') || code.includes('?? []')
    const hasArrayDef = code.match(/(const|let|var)\s+\w+\s*=\s*\[/g)
    if (!hasDefaultArray && !hasArrayDef) {
      issues.push('Array methods used without default empty array')
    }
  }
  
  // Check for direct property access without optional chaining
  const unsafePropertyAccess = code.match(/\{(\w+)\.(\w+)\}/g)
  if (unsafePropertyAccess) {
    unsafePropertyAccess.forEach(match => {
      if (!match.includes('?.')) {
        issues.push(`Unsafe property access: ${match} - should use optional chaining`)
      }
    })
  }
  
  return {
    safe: issues.length === 0,
    issues,
  }
}

/**
 * Check template code for quality requirements
 */
export function validateTemplateQuality(code: string): TemplateQualityCheck {
  const issues: string[] = []
  let score = 100
  
  // First check runtime safety
  const runtimeCheck = validateRuntimeSafety(code)
  if (!runtimeCheck.safe) {
    issues.push(...runtimeCheck.issues)
    score -= runtimeCheck.issues.length * 5 // Deduct 5 points per runtime issue
  }

  // Check for responsive design - STRICT: Must have multiple breakpoints
  const responsiveBreakpoints = (code.match(/sm:|md:|lg:|xl:/g) || []).length
  const hasResponsiveDesign = responsiveBreakpoints >= 3 // Must have at least 3 breakpoint uses
  if (!hasResponsiveDesign) {
    issues.push(`Missing responsive design utilities (sm:, md:, lg:) - found only ${responsiveBreakpoints} breakpoint(s), need at least 3`)
    score -= 20 // Increased penalty
  }

  // Check for typography hierarchy - STRICT: Must have multiple text sizes
  // Count UNIQUE text sizes and font weights (not total occurrences)
  const textSizeMatches = code.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)/g) || []
  const uniqueTextSizes = new Set(textSizeMatches).size
  const fontWeightMatches = code.match(/font-(thin|light|normal|medium|semibold|bold)/g) || []
  const uniqueFontWeights = new Set(fontWeightMatches).size
  const hasTypographyHierarchy = uniqueTextSizes >= 3 && uniqueFontWeights >= 2 // Must have at least 3 unique text sizes and 2 unique font weights
  if (!hasTypographyHierarchy) {
    issues.push(`Missing typography hierarchy (text-*, font-* classes) - found ${uniqueTextSizes} unique text size(s) and ${uniqueFontWeights} unique font weight(s), need at least 3 and 2`)
    score -= 15 // Increased penalty
  }

  // Check for color palette usage
  const hasColorPalette =
    /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)/.test(
      code
    )
  if (!hasColorPalette) {
    issues.push('Missing color palette (bg-*, text-* color classes)')
    score -= 10
  }

  // Check for customizable content (props, placeholders)
  const hasCustomizableContent =
    /interface.*Props|const.*=.*\{|placeholder|Your |Add your/i.test(code)
  if (!hasCustomizableContent) {
    issues.push('Missing customizable content (props, placeholders)')
    score -= 15
  }

  // Check for performance optimization
  const hasPerformanceOptimization =
    /useMemo|useCallback|transform|opacity|will-change/i.test(code) &&
    !/animate.*left|animate.*top|animate.*width|animate.*height/i.test(code)
  if (!hasPerformanceOptimization) {
    issues.push('May have performance issues (animating layout properties)')
    score -= 10
  }

  // Check for documentation
  const hasDocumentation =
    /\/\*\*|\/\/.*customize|\/\/.*section|\/\/.*example/i.test(code)
  if (!hasDocumentation) {
    issues.push('Missing documentation comments')
    score -= 10
  }

  // Check for TypeScript types
  const hasTypeScriptTypes =
    /interface|type.*=|:.*\{|:.*string|:.*number/i.test(code)
  if (!hasTypeScriptTypes) {
    issues.push('Missing TypeScript type definitions')
    score -= 10
  }

  // Check for safe assets (no copyrighted content)
  const usesSafeAssets =
    !/copyright|©|all rights reserved/i.test(code.toLowerCase()) &&
    /placeholder|via\.placeholder|heroicons|lucide|system font/i.test(
      code.toLowerCase()
    )
  if (!usesSafeAssets) {
    issues.push('May contain copyrighted assets - verify licensing')
    score -= 20
  }

  return {
    hasResponsiveDesign,
    hasTypographyHierarchy,
    hasColorPalette,
    hasCustomizableContent,
    hasPerformanceOptimization,
    hasDocumentation,
    hasTypeScriptTypes,
    usesSafeAssets,
    score: Math.max(0, score),
    issues,
  }
}

/**
 * Generate quality report for a template
 */
export function generateQualityReport(
  code: string,
  title: string
): string {
  const check = validateTemplateQuality(code)

  const report = `
# Template Quality Report: ${title}

## Overall Score: ${check.score}/100

### ✅ Requirements Met:
${check.hasResponsiveDesign ? '✅' : '❌'} Responsive Design
${check.hasTypographyHierarchy ? '✅' : '❌'} Typography Hierarchy
${check.hasColorPalette ? '✅' : '❌'} Color Palette
${check.hasCustomizableContent ? '✅' : '❌'} Customizable Content
${check.hasPerformanceOptimization ? '✅' : '❌'} Performance Optimization
${check.hasDocumentation ? '✅' : '❌'} Documentation
${check.hasTypeScriptTypes ? '✅' : '❌'} TypeScript Types
${check.usesSafeAssets ? '✅' : '❌'} Safe Assets (Licensing)

### ⚠️ Issues Found:
${check.issues.length > 0 ? check.issues.map((i) => `- ${i}`).join('\n') : 'None'}

### Recommendations:
${check.score < 80 ? '⚠️ Template needs improvements before publishing' : '✅ Template meets quality standards'}
`

  return report
}

