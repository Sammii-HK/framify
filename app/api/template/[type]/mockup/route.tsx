import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { templates, palettes } from '@/lib/template-data'

export const runtime = 'edge'

// Renders each mockup style as inline Satori JSX (duplicated from preview route,
// kept here so this route is self-contained as an edge function)
function renderContent(mockupStyle: string, pageCount: number | undefined, accent: string, text: string, isDark: boolean) {
  const block = (opacity: number, style?: object) => (
    <div style={{ backgroundColor: accent, opacity, borderRadius: 2, ...style }} />
  )

  switch (mockupStyle) {
    case 'grid-6':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[0.30, 0.35, 0.27, 0.33, 0.40, 0.29].map((op, i) => (
            <div key={i} style={{ width: '30%', aspectRatio: '1', backgroundColor: accent, opacity: op, borderRadius: 2 }} />
          ))}
        </div>
      )
    case 'gallery-4':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[0.20, 0.25, 0.30, 0.23].map((op, i) => (
            <div key={i} style={{ width: '47%', height: 22, backgroundColor: accent, opacity: op, borderRadius: 2 }} />
          ))}
        </div>
      )
    case 'menu-list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '55%', height: 3, backgroundColor: text, opacity: 0.4, borderRadius: 99 }} />
              <div style={{ width: '18%', height: 3, backgroundColor: accent, opacity: 0.7, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      )
    case 'split-gallery':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {block(0.25, { flex: 1, height: 22 })}
            {block(0.35, { flex: 1, height: 22 })}
          </div>
          {block(0.18, { height: 10 })}
        </div>
      )
    case 'timetable':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((row) => (
            <div key={row} style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4].map((col) => (
                <div key={col} style={{ flex: 1, height: 10, backgroundColor: accent, opacity: (row + col) % 2 === 0 ? 0.28 : 0.12, borderRadius: 2 }} />
              ))}
            </div>
          ))}
        </div>
      )
    case 'hero-wide':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {block(0.22, { height: 26 })}
          <div style={{ display: 'flex', gap: 3 }}>
            {[0.15, 0.20, 0.25].map((op, i) => (
              <div key={i} style={{ flex: 1, height: 10, backgroundColor: accent, opacity: op, borderRadius: 2 }} />
            ))}
          </div>
        </div>
      )
    case 'listings':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: '47%', backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 3, padding: 4 }}>
              {block(0.18, { height: 16, marginBottom: 3 })}
              <div style={{ width: '70%', height: 3, backgroundColor: text, opacity: 0.3, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      )
    case 'product-grid':
      return (
        <div style={{ display: 'flex', gap: 3 }}>
          {[0.18, 0.21, 0.24].map((op, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 3 }}>
              <div style={{ aspectRatio: '1', backgroundColor: accent, opacity: op, borderRadius: '3px 3px 0 0' }} />
              <div style={{ padding: 3 }}>
                <div style={{ width: '90%', height: 3, backgroundColor: text, opacity: 0.25, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      )
    case 'multi-tabs':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: pageCount || 5 }).map((_, i) => (
              <div key={i} style={{ flex: i === 0 ? 2 : 1, height: 4, backgroundColor: i === 0 ? accent : text, opacity: i === 0 ? 0.8 : 0.15, borderRadius: 99 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 3, padding: 4 }}>
                <div style={{ width: '90%', height: 3, backgroundColor: accent, opacity: 0.4, borderRadius: 99 }} />
                <div style={{ marginTop: 3, width: '65%', height: 3, backgroundColor: text, opacity: 0.2, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return (
        <div style={{ display: 'flex', gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, backgroundColor: isDark ? `${text}18` : `${text}10`, borderRadius: 3, padding: 5 }}>
              <div style={{ width: '90%', height: 3, backgroundColor: accent, opacity: 0.5, borderRadius: 99 }} />
              <div style={{ marginTop: 4, width: '70%', height: 3, backgroundColor: text, opacity: 0.2, borderRadius: 99 }} />
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
  // bg options: 'white', 'dark', 'gradient' (default: gradient)
  const bg = sp.get('bg') || 'gradient'

  const template = templates.find(t => t.type === type)
  if (!template) return new Response('Not found', { status: 404 })

  const palette = palettes.find(p => p.id === paletteId) || palettes[5]
  const siteBg = isDark ? palette.darkBg : palette.lightBg
  const siteText = isDark ? palette.darkText : palette.lightText
  const accent = palette.accent

  // Background behind the MacBook
  const outerBg = bg === 'white' ? '#ffffff'
    : bg === 'dark' ? '#111111'
    : `linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)`

  const W = 1200
  const H = 900

  // MacBook screen dimensions (within 1200x900 canvas)
  const laptopW = 700
  const laptopH = 440
  const screenW = 560
  const screenH = 350
  const laptopX = (W - laptopW) / 2
  const laptopY = 80

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          background: outerBg,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* MacBook body */}
        <div style={{
          position: 'absolute',
          top: laptopY,
          left: laptopX,
          width: laptopW,
          height: laptopH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Lid / screen bezel */}
          <div style={{
            width: laptopW,
            height: laptopH - 40,
            backgroundColor: '#1a1a1a',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Notch */}
            <div style={{
              position: 'absolute',
              top: laptopY,
              left: laptopX + laptopW / 2 - 40,
              width: 80,
              height: 14,
              backgroundColor: '#1a1a1a',
              borderRadius: '0 0 8px 8px',
              zIndex: 10,
              display: 'flex',
            }} />
            {/* Screen */}
            <div style={{
              width: screenW,
              height: screenH,
              backgroundColor: siteBg,
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Site nav */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderBottom: `1px solid ${accent}30`,
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 24, height: 5, backgroundColor: accent, borderRadius: 99 }} />
                  <div style={{ width: 16, height: 5, backgroundColor: accent, opacity: 0.4, borderRadius: 99 }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: 20, height: 4, backgroundColor: siteText, opacity: 0.3, borderRadius: 99 }} />)}
                </div>
              </div>
              {/* Hero */}
              <div style={{ padding: '14px 14px 8px', flexShrink: 0 }}>
                <div style={{ width: '72%', height: 7, backgroundColor: siteText, opacity: 0.9, borderRadius: 99, marginBottom: 6 }} />
                <div style={{ width: '48%', height: 5, backgroundColor: siteText, opacity: 0.5, borderRadius: 99, marginBottom: 10 }} />
                <div style={{ width: 48, height: 16, backgroundColor: accent, borderRadius: 4 }} />
              </div>
              {/* Content */}
              <div style={{ padding: '0 14px 10px', flex: 1 }}>
                {renderContent(template.mockupStyle, template.pageCount, accent, siteText, isDark)}
              </div>
            </div>
          </div>

          {/* Hinge */}
          <div style={{
            width: laptopW,
            height: 6,
            backgroundColor: '#2a2a2a',
            display: 'flex',
          }} />

          {/* Base */}
          <div style={{
            width: laptopW + 20,
            height: 34,
            backgroundColor: '#222222',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Trackpad */}
            <div style={{
              width: 100,
              height: 18,
              backgroundColor: '#2d2d2d',
              borderRadius: 4,
              display: 'flex',
            }} />
          </div>
        </div>

        {/* Info card — bottom */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              {template.name} Template
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '5px 14px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
                HTML + CSS
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '5px 14px', borderRadius: 99, fontSize: 14, fontWeight: 600 }}>
                {template.pages === 'multi' ? `${template.pageCount} pages` : '1 page'}
              </div>
              <div style={{ backgroundColor: accent, color: 'white', padding: '5px 14px', borderRadius: 99, fontSize: 14, fontWeight: 700 }}>
                ${template.price || 15}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              craftmypage.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  )
}
