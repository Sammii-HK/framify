'use client'

import type { Palette, Template } from '@/lib/template-data'

export default function TemplateMockup({
  palette,
  template,
  isDark,
}: {
  palette: Palette
  template: Template
  isDark: boolean
}) {
  const bg = isDark ? palette.darkBg : palette.lightBg
  const text = isDark ? palette.darkText : palette.lightText
  const accent = palette.accent

  const renderContent = () => {
    switch (template.mockupStyle) {
      case 'grid-6':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[0.15, 0.2, 0.12, 0.18, 0.25, 0.14].map((opacity, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: opacity + 0.15 }} />
            ))}
          </div>
        )
      case 'gallery-4':
        return (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/2] rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 + i * 0.05 }} />
            ))}
          </div>
        )
      case 'menu-list':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.4 }} />
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
              </div>
            ))}
          </div>
        )
      case 'split-gallery':
        return (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.2 }} />
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: accent, opacity: 0.3 }} />
            </div>
            <div className="h-3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 }} />
          </div>
        )
      case 'timetable':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex gap-0.5">
                {[1, 2, 3, 4].map((col) => (
                  <div key={col} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: accent, opacity: (row + col) % 2 === 0 ? 0.25 : 0.1 }} />
                ))}
              </div>
            ))}
          </div>
        )
      case 'hero-wide':
        return (
          <div className="space-y-1.5">
            <div className="h-8 rounded-sm" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: accent, opacity: 0.1 + i * 0.05 }} />
              ))}
            </div>
          </div>
        )
      case 'listings':
        return (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-sm p-1" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="h-4 rounded-sm mb-0.5" style={{ backgroundColor: accent, opacity: 0.15 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        )
      case 'product-grid':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 + i * 0.03 }} />
                <div className="p-0.5">
                  <div className="w-full h-1 rounded-full mb-0.5" style={{ backgroundColor: text, opacity: 0.25 }} />
                  <div className="w-1/2 h-1 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        )
      case 'multi-tabs':
        return (
          <div className="space-y-1.5">
            <div className="flex gap-0.5">
              {Array.from({ length: template.pageCount || 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{
                    backgroundColor: i === 0 ? accent : text,
                    opacity: i === 0 ? 0.8 : 0.15,
                    flex: i === 0 ? 2 : 1,
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-sm p-1" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                  <div className="w-full h-1 rounded-full mb-0.5" style={{ backgroundColor: accent, opacity: 0.4 }} />
                  <div className="w-2/3 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm p-1.5" style={{ backgroundColor: isDark ? `${text}10` : `${text}08` }}>
                <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: accent, opacity: 0.5 }} />
                <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div
      className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-colors duration-300"
      style={{ backgroundColor: bg }}
    >
      {/* Nav bar */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${accent}30` }}>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: accent, opacity: 0.4 }} />
        </div>
        <div className="flex gap-1">
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
          <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: text, opacity: 0.3 }} />
        </div>
      </div>

      {/* Hero */}
      <div className="px-3 py-4">
        <div className="w-3/4 h-2 rounded-full mb-1.5" style={{ backgroundColor: text, opacity: 0.9 }} />
        <div className="w-1/2 h-2 rounded-full mb-2" style={{ backgroundColor: text, opacity: 0.5 }} />
        <div className="w-14 h-4 rounded" style={{ backgroundColor: accent }} />
      </div>

      {/* Content */}
      <div className="px-3 pb-2">{renderContent()}</div>

      {/* Footer */}
      <div className="mt-auto px-3 py-1.5" style={{ backgroundColor: isDark ? `${text}08` : `${text}05` }}>
        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: text, opacity: 0.2 }} />
      </div>
    </div>
  )
}
