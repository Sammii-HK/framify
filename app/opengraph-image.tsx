import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'
export const alt = 'CraftMyPage — Professional Websites for Local Businesses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: 80,
          position: 'relative',
        }}
      >
        {/* Background grid dots */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          display: 'flex',
        }} />

        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, backgroundColor: '#7c3aed', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 24, height: 24, backgroundColor: 'white', borderRadius: 6, display: 'flex' }} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
            CraftMyPage
          </span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 64, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24 }}>
          Professional Websites
          <br />
          for Local Businesses
        </div>

        {/* Subtext */}
        <div style={{ fontSize: 24, color: '#c4b5fd', textAlign: 'center', maxWidth: 700, lineHeight: 1.5, marginBottom: 48 }}>
          Pick a template, answer a few questions, and go live in minutes. Hosting, domain, and SSL included.
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: '21 templates' },
            { label: '12 colour palettes' },
            { label: 'From $15' },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 22px', borderRadius: 99, fontSize: 18, fontWeight: 600 }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
