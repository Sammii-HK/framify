import { config } from 'dotenv'
config({ path: '.env.local' })
import { generateTemplateCode } from './lib/openai'
import { writeFileSync } from 'fs'

function stripForPreview(code: string): string {
  let clean = code

  // Strip imports (including lucide-react — icons are loaded via CDN global)
  clean = clean.replace(/import\s+.*from\s+['"].*['"];?\s*/g, '')

  // Remove ALL TypeScript interfaces (multiline)
  clean = clean.replace(/interface\s+\w+\s*\{[\s\S]*?\n\}/g, '')

  // Remove TS type annotations from destructured params
  clean = clean.replace(/\}:\s*\w+\)/g, '})')

  // Replace motion.* tags with regular HTML tags (handles multiline)
  clean = clean.replace(/<motion\.(\w+)/g, '<$1')
  clean = clean.replace(/<\/motion\.(\w+)/g, '</$1')

  // Remove framer-motion props (multiline safe)
  clean = clean.replace(/\s+(initial|animate|whileTap|whileHover|whileInView|transition|variants|exit)=\{\{[\s\S]*?\}\}/g, '')

  // Replace export default with assignment
  clean = clean.replace(/export\s+default\s+function\s+(\w+)/, 'const GeneratedTemplate = function $1')

  return clean
}

async function main() {
  console.log('Generating Dark Celestial template...')
  const result = await generateTemplateCode(
    'A mystical astrology landing page with hero, services section, testimonials, and contact form',
    'Spiritual / Dark Celestial'
  )

  // Write the raw component code
  writeFileSync('/tmp/framify-preview-code.tsx', result.code)
  console.log(`Component code saved (${result.code.length} chars)`)

  const cleanCode = stripForPreview(result.code)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Framify Preview - Dark Celestial</title>
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
    // Lucide icons - destructure from global
    const lucide = window.LucideReact || {};
    const { Sun, Moon, Star, Sparkles, Diamond, Heart, Mail, Phone, MapPin, Clock, ArrowRight, Menu, X, ChevronRight, Send, MessageCircle, Calendar, User, Gem, Eye, Compass, Zap, Shield, Award, BookOpen, Globe, Layers, Target, TrendingUp } = lucide;

    ${cleanCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(GeneratedTemplate));
  <\/script>
</body>
</html>`

  writeFileSync('/tmp/framify-preview.html', html)
  console.log('Preview HTML saved to /tmp/framify-preview.html')
}

main().catch(err => {
  console.error('Failed:', err.message)
  process.exit(1)
})
