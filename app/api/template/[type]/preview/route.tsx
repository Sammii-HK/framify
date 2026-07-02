import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { templates, palettes } from '@/lib/template-data'

export const runtime = 'edge'

// Recreates TemplateMockup layout in Satori-compatible inline styles
function renderContent(mockupStyle: string, pageCount: number | undefined, accent: string, text: string, isDark: boolean) {
  const block = (opacity: number, style?: object) => (
    <div style={{ backgroundColor: accent, opacity, borderRadius: 3, ...style }} />
  )
  const textBar = (w: string, opacity: number) => (
    <div style={{ width: w, height: 4, backgroundColor: text, opacity, borderRadius: 99 }} />
  )

  switch (mockupStyle) {
    case 'grid-6':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[0.30, 0.35, 0.27, 0.33, 0.40, 0.29].map((op, i) => (
            <div key={i} style={{ width: '30%', aspectRatio: '1', backgroundColor: accent, opacity: op, borderRadius: 3 }} />
          ))}
        </div>
      )
    case 'gallery-4':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[0.20, 0.25, 0.30, 0.23].map((op, i) => (
            <div key={i} style={{ width: '47%', height: 32, backgroundColor: accent, opacity: op, borderRadius: 3 }} />
          ))}
        </div>
      )
    case 'menu-list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {textBar('55%', 0.4)}
              <div style={{ width: '18%', height: 4, backgroundColor: accent, opacity: 0.7, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      )
    case 'split-gallery':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {block(0.25, { flex: 1, height: 32 })}
            {block(0.35, { flex: 1, height: 32 })}
          </div>
          {block(0.18, { height: 14 })}
        </div>
      )
    case 'timetable':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[1, 2, 3].map((row) => (
            <div key={row} style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3, 4].map((col) => (
                <div key={col} style={{ flex: 1, height: 14, backgroundColor: accent, opacity: (row + col) % 2 === 0 ? 0.28 : 0.12, borderRadius: 3 }} />
              ))}
            </div>
          ))}
        </div>
      )
    case 'hero-wide':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {block(0.25, { height: 36 })}
          <div style={{ display: 'flex', gap: 4 }}>
            {[0.15, 0.20, 0.25].map((op, i) => block(op, { flex: 1, height: 14, key: i }))}
          </div>
        </div>
      )
    case 'listings':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: '47%', backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 4, padding: 5 }}>
              {block(0.20, { height: 22, marginBottom: 4 })}
              {textBar('70%', 0.3)}
            </div>
          ))}
        </div>
      )
    case 'product-grid':
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {[0.18, 0.21, 0.24].map((op, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 4 }}>
              <div style={{ aspectRatio: '1', backgroundColor: accent, opacity: op, borderRadius: '4px 4px 0 0' }} />
              <div style={{ padding: 4 }}>
                {textBar('90%', 0.25)}
                <div style={{ marginTop: 3 }}>
                  {textBar('55%', 0.45)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    case 'multi-tabs':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: pageCount || 5 }).map((_, i) => (
              <div key={i} style={{ flex: i === 0 ? 2 : 1, height: 6, backgroundColor: i === 0 ? accent : text, opacity: i === 0 ? 0.8 : 0.15, borderRadius: 99 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 4, padding: 6 }}>
                {textBar('90%', 0.45)}
                <div style={{ marginTop: 4 }}>
                  {textBar('65%', 0.2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 4, padding: 6 }}>
              {textBar('90%', 0.55)}
              <div style={{ marginTop: 5 }}>
                {textBar('70%', 0.2)}
              </div>
            </div>
          ))}
        </div>
      )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const sp = request.nextUrl.searchParams
  const paletteId = sp.get('palette') || 'steel-blue'
  const isDark = sp.get('dark') !== 'false'

  const template = templates.find((t) => t.type === type)
  if (!template) {
    return new Response('Not found', { status: 404 })
  }

  const palette = palettes.find((p) => p.id === paletteId) || palettes[5] // steel-blue default
  const bg = isDark ? palette.darkBg : palette.lightBg
  const text = isDark ? palette.darkText : palette.lightText
  const accent = palette.accent

  // 1200×900 — good for Etsy (requires at least 570px wide) and OG
  const W = 1200
  const H = 900
  const SCALE = 8  // scale factor so the mockup elements look sharp

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          backgroundColor: '#F8F8F8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: 60,
          gap: 60,
        }}
      >
        {/* Mockup */}
        <div
          style={{
            width: 520,
            height: 390,
            backgroundColor: bg,
            borderRadius: 12,
            overflow: 'hidden',
            border: `2px solid ${accent}40`,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          }}
        >
          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${accent}30` }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 36, height: 8, backgroundColor: accent, borderRadius: 99 }} />
              <div style={{ width: 24, height: 8, backgroundColor: accent, opacity: 0.4, borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: 28, height: 6, backgroundColor: text, opacity: 0.3, borderRadius: 99 }} />
              ))}
            </div>
          </div>

          {/* Hero */}
          <div style={{ padding: '20px 20px 12px' }}>
            <div style={{ width: '75%', height: 10, backgroundColor: text, opacity: 0.9, borderRadius: 99, marginBottom: 8 }} />
            <div style={{ width: '50%', height: 8, backgroundColor: text, opacity: 0.5, borderRadius: 99, marginBottom: 14 }} />
            <div style={{ width: 72, height: 22, backgroundColor: accent, borderRadius: 6 }} />
          </div>

          {/* Content */}
          <div style={{ padding: '0 20px 16px', flex: 1 }}>
            {renderContent(template.mockupStyle, template.pageCount, accent, text, isDark)}
          </div>

          {/* Footer */}
          <div style={{ padding: '8px 20px', backgroundColor: isDark ? `${text}08` : `${text}05` }}>
            <div style={{ width: 50, height: 5, backgroundColor: text, opacity: 0.2, borderRadius: 99 }} />
          </div>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              CraftMyPage Template
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#111', lineHeight: 1.1, marginBottom: 12 }}>
              {template.name}
            </div>
            <div style={{ fontSize: 18, color: '#555', lineHeight: 1.5 }}>
              {template.description}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#f3f0ff', color: '#7c3aed', padding: '6px 14px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
              {template.pages === 'multi' ? `${template.pageCount} pages` : '1 page'}
            </div>
            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 14px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
              HTML + CSS
            </div>
            <div style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '6px 14px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
              ${template.price || 15}
            </div>
          </div>

          <div style={{ fontSize: 15, color: '#888' }}>
            Best for: {template.bestFor}
          </div>

          <div style={{ marginTop: 'auto', fontSize: 15, color: '#aaa', fontWeight: 600 }}>
            craftmypage.com
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  )
}
