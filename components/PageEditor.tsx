'use client'

import { useCallback } from 'react'

export interface Page {
  slug: string
  title: string
  content: string
  showInNav: boolean
  order: number
}

interface PageEditorProps {
  pages: Page[]
  onChange: (pages: Page[]) => void
}

const PAGE_PRESETS = [
  { title: 'About', slug: 'about' },
  { title: 'Services', slug: 'services' },
  { title: 'Gallery', slug: 'gallery' },
  { title: 'FAQ', slug: 'faq' },
  { title: 'Team', slug: 'team' },
  { title: 'Pricing', slug: 'pricing' },
] as const

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function PageEditor({ pages, onChange }: PageEditorProps) {
  const addPage = useCallback((title: string, slug: string) => {
    // Prevent duplicates
    if (pages.some(p => p.slug === slug)) return
    const newPage: Page = {
      slug,
      title,
      content: '',
      showInNav: true,
      order: pages.length,
    }
    onChange([...pages, newPage])
  }, [pages, onChange])

  const updatePage = useCallback((index: number, updates: Partial<Page>) => {
    const updated = pages.map((p, i) => {
      if (i !== index) return p
      const merged = { ...p, ...updates }
      // Auto-update slug when title changes, unless slug was manually set
      if (updates.title && !updates.slug) {
        merged.slug = slugify(updates.title)
      }
      return merged
    })
    onChange(updated)
  }, [pages, onChange])

  const removePage = useCallback((index: number) => {
    const updated = pages.filter((_, i) => i !== index)
    // Reindex order values
    onChange(updated.map((p, i) => ({ ...p, order: i })))
  }, [pages, onChange])

  const movePage = useCallback((index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= pages.length) return
    const updated = [...pages]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    // Reindex order values
    onChange(updated.map((p, i) => ({ ...p, order: i })))
  }, [pages, onChange])

  // Filter presets to only show ones not already added
  const availablePresets = PAGE_PRESETS.filter(
    preset => !pages.some(p => p.slug === preset.slug)
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-1">Site pages</h3>
        <p className="text-sm text-zinc-400">
          Add extra pages to your site. Each page gets its own URL and appears in the navigation.
        </p>
      </div>

      {/* Page list */}
      {pages.length > 0 && (
        <div className="space-y-4">
          {pages.map((page, index) => (
            <div
              key={page.slug + index}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 space-y-3"
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => movePage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Move page up"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => movePage(index, 'down')}
                      disabled={index === pages.length - 1}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Move page down"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Title input */}
                  <input
                    type="text"
                    value={page.title}
                    onChange={e => updatePage(index, { title: e.target.value })}
                    placeholder="Page title"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Show in nav toggle */}
                  <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={page.showInNav}
                      onChange={e => updatePage(index, { showInNav: e.target.checked })}
                      className="rounded border-zinc-600 bg-zinc-900 text-zinc-400 focus:ring-zinc-500 focus:ring-offset-0"
                    />
                    Show in nav
                  </label>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removePage(index)}
                    className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-700"
                    aria-label={`Delete ${page.title} page`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Slug display */}
              <div className="text-xs text-zinc-500 pl-8">
                URL: /{page.slug}.html
              </div>

              {/* Content textarea */}
              <div className="pl-8">
                <textarea
                  value={page.content}
                  onChange={e => updatePage(index, { content: e.target.value })}
                  placeholder="Page content (HTML supported)"
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add page section */}
      {availablePresets.length > 0 && (
        <div>
          <p className="text-sm text-zinc-400 mb-2">Add a page:</p>
          <div className="flex flex-wrap gap-2">
            {availablePresets.map(preset => (
              <button
                key={preset.slug}
                type="button"
                onClick={() => addPage(preset.title, preset.slug)}
                className="px-3 py-1.5 text-sm rounded border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
              >
                + {preset.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom page */}
      <button
        type="button"
        onClick={() => {
          const title = 'New page'
          let slug = slugify(title)
          let counter = 1
          while (pages.some(p => p.slug === slug)) {
            slug = `${slugify(title)}-${counter}`
            counter++
          }
          addPage(title, slug)
        }}
        className="w-full py-2 text-sm rounded border border-dashed border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
      >
        + Add custom page
      </button>

      {pages.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-4">
          No extra pages yet. Your site will be a single page. Add pages above to create a multi-page site.
        </p>
      )}
    </div>
  )
}
