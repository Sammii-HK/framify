import { readFileSync, writeFileSync } from 'fs'
import { PALETTES, LIGHT_PALETTES, type PaletteKey } from './lib/design-system'

const baseCode = readFileSync('/tmp/framify-preview-code.tsx', 'utf-8')

const paletteKeys: PaletteKey[] = ['dark-celestial', 'earthy-sage', 'ethereal-light', 'crystal-rose']

function stripForPreview(code: string): string {
  let clean = code
  clean = clean.replace(/import\s+.*from\s+['"].*['"];?\s*/g, '')
  clean = clean.replace(/interface\s+\w+\s*\{[\s\S]*?\n\}/g, '')
  clean = clean.replace(/\}:\s*\w+\)/g, '})')
  clean = clean.replace(/<motion\.(\w+)/g, '<$1')
  clean = clean.replace(/<\/motion\.(\w+)/g, '</$1')
  clean = clean.replace(/\s+(initial|animate|whileTap|whileHover|whileInView|transition|variants|exit)=\{\{[\s\S]*?\}\}/g, '')
  clean = clean.replace(/export\s+default\s+function\s+(\w+)/, 'const GeneratedTemplate = function $1')
  return clean
}

function swapPalette(code: string, key: PaletteKey): string {
  const dark = PALETTES[key]
  const light = LIGHT_PALETTES[key]

  // Replace the entire themes object block with the new palette values
  // This avoids hex collision issues from sequential find-and-replace
  const themesRegex = /const themes = \{[\s\S]*?\n  \};/
  const newThemes = `const themes = {
    dark: {
      bg: "${dark.bg.deep}",
      surface: "${dark.bg.surface}",
      elevated: "${dark.bg.elevated}",
      textPrimary: "${dark.text.primary}",
      textSecondary: "${dark.text.secondary}",
      textMuted: "${dark.text.muted}",
      accent: "${dark.accent.primary}",
      accentSecondary: "${dark.accent.secondary}",
      highlight: "${dark.accent.highlight}",
      borderSubtle: "${dark.border.subtle}",
      border: "${dark.border.default}",
    },
    light: {
      bg: "${light.bg.deep}",
      surface: "${light.bg.surface}",
      elevated: "${light.bg.elevated}",
      textPrimary: "${light.text.primary}",
      textSecondary: "${light.text.secondary}",
      textMuted: "${light.text.muted}",
      accent: "${light.accent.primary}",
      accentSecondary: "${light.accent.secondary}",
      highlight: "${light.accent.highlight}",
      borderSubtle: "${light.border.subtle}",
      border: "${light.border.default}",
    },
  };`

  let swapped = code.replace(themesRegex, newThemes)

  // Also swap the hardcoded gradient in the hero section
  swapped = swapped.replace(
    /linear-gradient\(135deg, #0D0B1A 0%, #1E1A42 50%, #2D1B69 100%\)/g,
    dark.gradient.replace('linear-gradient(', 'linear-gradient(')
  )
  swapped = swapped.replace(
    /linear-gradient\(135deg, #FAF7F2 0%, #F0EBE3 50%, #D4CCB8 100%\)/g,
    light.gradient.replace('linear-gradient(', 'linear-gradient(')
  )

  // Swap the hardcoded button text colour for dark mode
  // Original: color: isDark ? "#0D0B1A" : "#FFFFFF"
  swapped = swapped.replace(
    /color: isDark \? "#0D0B1A" : "#FFFFFF"/g,
    `color: isDark ? "${dark.bg.deep}" : "#FFFFFF"`
  )

  return swapped
}

function buildHTML(cleanCode: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Framify Preview - ${title}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script>window.react = window.React;<\/script>
  <script src="https://unpkg.com/lucide-react@0.460.0/dist/umd/lucide-react.min.js"><\/script>
  <style>* { margin: 0; padding: 0; box-sizing: border-box; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useMemo, useCallback, useRef } = React;
    const lucide = window.LucideReact || {};
    const { Sun, Moon, Star, Sparkles, Diamond, Heart, Mail, Phone, MapPin, Clock, ArrowRight, Menu, X, ChevronRight, Send, MessageCircle, Calendar, User, Gem, Eye, Compass, Zap, Shield, Award, BookOpen, Globe, Layers, Target, TrendingUp } = lucide;

    ${cleanCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(GeneratedTemplate));
  <\/script>
</body>
</html>`
}

// Generate index page
const links = paletteKeys.map(key => {
  const name = PALETTES[key].name
  const filename = `framify-preview-${key}.html`
  return `<a href="${filename}" style="display:block;padding:16px 24px;margin:8px 0;border-radius:12px;background:${PALETTES[key].bg.surface};border:1px solid ${PALETTES[key].border.default};color:${PALETTES[key].text.primary};text-decoration:none;font-size:18px;">${name} <span style="color:${PALETTES[key].accent.primary};float:right;">&rarr;</span></a>`
})

const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Framify - All Palette Previews</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0D0B1A; color: #F5F0E8; font-family: system-ui, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 500px; width: 100%; padding: 32px; }
    h1 { font-size: 32px; margin-bottom: 24px; text-align: center; }
    p { text-align: center; color: #7B7592; margin-bottom: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Framify Palettes</h1>
    <p>Click a palette to preview the template</p>
    ${links.join('\n    ')}
  </div>
</body>
</html>`

writeFileSync('/tmp/framify-index.html', indexHTML)
console.log('Index page saved')

// Generate each palette preview
for (const key of paletteKeys) {
  const name = PALETTES[key].name
  let code = baseCode

  if (key !== 'dark-celestial') {
    code = swapPalette(code, key)
  }

  const cleanCode = stripForPreview(code)
  const html = buildHTML(cleanCode, name)
  const filename = `/tmp/framify-preview-${key}.html`
  writeFileSync(filename, html)
  console.log(`${name} saved to ${filename}`)
}

console.log('\nAll 4 palettes generated!')
