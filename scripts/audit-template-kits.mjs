#!/usr/bin/env node
/**
 * Accessibility + layout audit for every kit in /template-kits.
 *
 * Opens each page in every palette, light and dark, desktop and phone width,
 * runs axe-core (WCAG 2.1 A/AA + best practice), and fails on any violation,
 * horizontal overflow or JavaScript error.
 *
 *   node scripts/audit-template-kits.mjs
 *
 * Uses Playwright (devDependency) and axe-core (installed with
 * eslint-plugin-jsx-a11y). Run `npx playwright install chromium` once if needed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'template-kits')
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

function palettesFor(kit) {
  const css = fs.readFileSync(path.join(root, kit, 'styles.css'), 'utf8')
  return [...new Set([...css.matchAll(/\[data-palette="([a-z-]+)"\]/g)].map((m) => m[1]))]
}

const browser = await chromium.launch()
let failures = 0
let checked = 0
for (const kit of fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory())) {
  const pages = fs.readdirSync(path.join(root, kit)).filter((f) => f.endsWith('.html'))
  const palettes = palettesFor(kit)
  for (const theme of ['light', 'dark']) {
    for (const palette of palettes) {
      for (const page of palette === palettes[0] ? pages : ['index.html']) {
        for (const width of page === 'index.html' && palette === palettes[0] ? [1440, 390] : [1440]) {
          const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme })
          const tab = await ctx.newPage()
          const errors = []
          tab.on('pageerror', (e) => errors.push(e.message))
          await tab.goto(`file://${path.join(root, kit, page)}`, { waitUntil: 'networkidle' })
          await tab.evaluate((p) => {
            document.documentElement.setAttribute('data-palette', p)
            document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
          }, palette)
          await tab.waitForTimeout(800)
          await tab.addScriptTag({ content: axeSource })
          const violations = await tab.evaluate(async () => {
            const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })
            return r.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(' ')}`)
          })
          const overflow = await tab.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
          checked++
          if (violations.length || overflow > 0 || errors.length) {
            failures++
            console.log(`FAIL ${kit}/${page} ${palette} ${theme} ${width}px`)
            violations.forEach((v) => console.log(`  axe: ${v}`))
            if (overflow > 0) console.log(`  horizontal overflow: ${overflow}px`)
            errors.forEach((e) => console.log(`  js error: ${e}`))
          }
          await ctx.close()
        }
      }
    }
  }
}
await browser.close()
console.log(`${checked} combinations checked, ${failures} failing`)
process.exit(failures ? 1 : 0)
