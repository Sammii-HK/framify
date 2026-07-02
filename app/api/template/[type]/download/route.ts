import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { templates } from '@/lib/template-data'
import JSZip from 'jszip'

// Unicode steganography — embeds buyer email as zero-width chars after the closing </html> tag
// U+200B = bit 0, U+200C = bit 1, U+200D = delimiter between chars
function embedWatermark(html: string, buyerEmail: string): string {
  const encode = (char: string): string => {
    const byte = char.charCodeAt(0)
    let bits = ''
    for (let i = 7; i >= 0; i--) {
      bits += (byte >> i) & 1 ? '\u200C' : '\u200B'
    }
    return bits + '\u200D'
  }
  const watermark = buyerEmail.split('').map(encode).join('')
  return html.replace(/<\/html>/i, `</html>${watermark}`)
}

const README = (title: string, bestFor: string) => `# ${title} — CraftMyPage Template

## What's included

- \`index.html\` — Your complete website, ready to customise
- \`README.md\` — This file

## Best for

${bestFor}

## How to use

### Option A: Deploy automatically (recommended)

Go to **craftmypage.com**, pick this template, answer a few questions, and we handle
hosting, your domain, SSL, and deployment — live in minutes with zero technical setup.

### Option B: Self-host

1. Open \`index.html\` in a code editor
2. Replace placeholder text and images with your own content
3. Upload to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages — all free)

## Colour palettes

The template ships with 12 colour palettes. To switch palette, change the \`data-palette\`
attribute on the \`<html>\` tag:

\`\`\`html
<html data-palette="electric-coral" data-theme="dark">
\`\`\`

Available palettes: steel-blue, electric-coral, forest-green, warm-amber,
rose-gold, slate-purple, ocean-teal, crimson-red, golden-hour, midnight-navy,
sage-green, dusty-rose

## Licence

Personal and commercial use on a single website.
Redistribution or resale of the original files is not permitted.
Your download is uniquely watermarked to your email address.

© CraftMyPage — craftmypage.com
`

function generateGalleryTemplateHtml(type: string, name: string, bestFor: string): string {
  const palettes: Record<string, { accent: string; accentDark: string; bg: string; text: string }> = {
    'steel-blue':    { accent: '#3b82f6', accentDark: '#2563eb', bg: '#0f172a', text: '#f1f5f9' },
    'electric-coral':{ accent: '#f97316', accentDark: '#ea580c', bg: '#0f172a', text: '#f1f5f9' },
    'forest-green':  { accent: '#22c55e', accentDark: '#16a34a', bg: '#0f172a', text: '#f1f5f9' },
    'rose-gold':     { accent: '#f43f5e', accentDark: '#e11d48', bg: '#0f172a', text: '#f1f5f9' },
    'slate-purple':  { accent: '#8b5cf6', accentDark: '#7c3aed', bg: '#0f172a', text: '#f1f5f9' },
  }

  return `<!DOCTYPE html>
<html lang="en" data-palette="steel-blue" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — Your Business Name</title>
  <meta name="description" content="Professional website for ${bestFor}" />
  <style>
    /* ── Reset & base ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --accent: #3b82f6;
      --accent-dark: #2563eb;
      --bg: #0f172a;
      --bg-card: #1e293b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --border: rgba(255,255,255,0.08);
      --radius: 10px;
      --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    /* Palette overrides — change data-palette on <html> to switch */
    [data-palette="electric-coral"] { --accent: #f97316; --accent-dark: #ea580c; }
    [data-palette="forest-green"]   { --accent: #22c55e; --accent-dark: #16a34a; }
    [data-palette="warm-amber"]     { --accent: #f59e0b; --accent-dark: #d97706; }
    [data-palette="rose-gold"]      { --accent: #f43f5e; --accent-dark: #e11d48; }
    [data-palette="slate-purple"]   { --accent: #8b5cf6; --accent-dark: #7c3aed; }
    [data-palette="ocean-teal"]     { --accent: #06b6d4; --accent-dark: #0891b2; }
    [data-palette="crimson-red"]    { --accent: #ef4444; --accent-dark: #dc2626; }
    [data-palette="golden-hour"]    { --accent: #eab308; --accent-dark: #ca8a04; }
    [data-palette="midnight-navy"]  { --accent: #6366f1; --accent-dark: #4f46e5; }
    [data-palette="sage-green"]     { --accent: #84cc16; --accent-dark: #65a30d; }
    [data-palette="dusty-rose"]     { --accent: #ec4899; --accent-dark: #db2777; }
    /* Light theme */
    [data-theme="light"] {
      --bg: #f8fafc; --bg-card: #ffffff; --text: #0f172a;
      --text-muted: #64748b; --border: rgba(0,0,0,0.08);
    }

    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
    }

    /* ── Layout ── */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    section { padding: 80px 0; }

    /* ── Nav ── */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: color-mix(in srgb, var(--bg) 90%, transparent);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 64px;
    }
    .logo {
      font-size: 1.2rem; font-weight: 700; color: var(--text);
      text-decoration: none; letter-spacing: -0.02em;
    }
    .logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .nav-cta {
      background: var(--accent); color: #fff; padding: 9px 20px;
      border-radius: var(--radius); font-size: 0.875rem; font-weight: 600;
      text-decoration: none; transition: background 0.2s;
    }
    .nav-cta:hover { background: var(--accent-dark); }
    @media (max-width: 640px) { .nav-links { display: none; } }

    /* ── Hero ── */
    #hero {
      padding: 100px 0 80px;
      background: radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--accent) 15%, transparent), transparent);
    }
    .hero-tag {
      display: inline-flex; align-items: center; gap: 8px;
      background: color-mix(in srgb, var(--accent) 15%, transparent);
      color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
      padding: 5px 14px; border-radius: 99px;
      font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
      margin-bottom: 24px;
    }
    h1 {
      font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800;
      line-height: 1.1; letter-spacing: -0.03em;
      margin-bottom: 20px;
    }
    h1 em { font-style: normal; color: var(--accent); }
    .hero-sub {
      font-size: 1.1rem; color: var(--text-muted); max-width: 560px;
      line-height: 1.7; margin-bottom: 36px;
    }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-primary {
      background: var(--accent); color: #fff; padding: 14px 28px;
      border-radius: var(--radius); font-size: 1rem; font-weight: 700;
      text-decoration: none; transition: background 0.2s; display: inline-block;
    }
    .btn-primary:hover { background: var(--accent-dark); }
    .btn-ghost {
      background: transparent; color: var(--text); padding: 14px 28px;
      border-radius: var(--radius); font-size: 1rem; font-weight: 600;
      text-decoration: none; border: 1px solid var(--border);
      transition: border-color 0.2s; display: inline-block;
    }
    .btn-ghost:hover { border-color: var(--text-muted); }

    /* ── Section headings ── */
    .section-tag {
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--accent); margin-bottom: 12px;
    }
    h2 {
      font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800;
      letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 16px;
    }
    .section-sub { color: var(--text-muted); max-width: 500px; line-height: 1.7; }

    /* ── Cards ── */
    .card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: calc(var(--radius) * 1.4); padding: 28px;
    }

    /* ── Services grid ── */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
    .service-icon {
      width: 44px; height: 44px; background: color-mix(in srgb, var(--accent) 15%, transparent);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px; color: var(--accent);
    }
    .service-icon svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .service-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
    .service-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.65; }

    /* ── Stats ── */
    .stats-row { display: flex; flex-wrap: wrap; gap: 32px; margin-top: 48px; }
    .stat-num { font-size: 2.4rem; font-weight: 800; color: var(--accent); line-height: 1; letter-spacing: -0.03em; }
    .stat-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }

    /* ── Testimonials ── */
    .testi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
    .testi-text { font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 20px; }
    blockquote::before { content: '"'; font-size: 3rem; color: var(--accent); line-height: 0; vertical-align: -0.4em; margin-right: 4px; }
    .testi-author { font-weight: 700; font-size: 0.9rem; }
    .testi-role { font-size: 0.8rem; color: var(--text-muted); }

    /* ── Contact form ── */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full { grid-column: 1 / -1; }
    label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
    input, textarea, select {
      background: var(--bg); border: 1px solid var(--border); color: var(--text);
      border-radius: var(--radius); padding: 11px 14px; font-size: 0.95rem;
      font-family: inherit; outline: none; transition: border-color 0.2s; width: 100%;
    }
    input:focus, textarea:focus { border-color: var(--accent); }
    textarea { resize: vertical; min-height: 120px; }
    button[type="submit"] {
      background: var(--accent); color: #fff; border: none; cursor: pointer;
      padding: 13px 28px; border-radius: var(--radius); font-size: 1rem;
      font-weight: 700; transition: background 0.2s; margin-top: 8px;
    }
    button[type="submit"]:hover { background: var(--accent-dark); }
    a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
      outline: 2px solid var(--accent); outline-offset: 2px;
    }
    .skip-link {
      position: absolute; left: -9999px; top: 0; z-index: 200;
      padding: 12px 20px; background: #000; color: #fff;
      font-size: 14px; font-weight: 600; border-radius: 0 0 var(--radius) 0;
    }
    .skip-link:focus { left: 0; }

    /* ── Footer ── */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 0 32px;
    }
    .footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .footer-copy { font-size: 0.85rem; color: var(--text-muted); }
    .footer-links { display: flex; gap: 20px; }
    .footer-links a { font-size: 0.85rem; color: var(--text-muted); text-decoration: none; }
    .footer-links a:hover { color: var(--text); }
  </style>
</head>
<body>
  <a href="#hero" class="skip-link">Skip to content</a>

  <!-- Navigation -->
  <nav>
    <div class="container">
      <div class="nav-inner">
        <a href="#" class="logo">Your<span>Brand</span></a>
        <ul class="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#testimonials">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#contact" class="nav-cta">Get in touch</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section id="hero">
    <div class="container">
      <div class="hero-tag">
        <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        ${name}
      </div>
      <h1>The best in <em>your area</em><br />for ${bestFor.split(',')[0]}</h1>
      <p class="hero-sub">
        Trusted by local customers. Professional service, reliable results, and a team that actually picks up the phone.
      </p>
      <div class="hero-actions">
        <a href="#contact" class="btn-primary">Get a free quote</a>
        <a href="#services" class="btn-ghost">See our services</a>
      </div>
      <div class="stats-row">
        <div><div class="stat-num">500+</div><div class="stat-label">Happy customers</div></div>
        <div><div class="stat-num">10+</div><div class="stat-label">Years experience</div></div>
        <div><div class="stat-num">4.9★</div><div class="stat-label">Average rating</div></div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section id="services">
    <div class="container">
      <p class="section-tag">What we do</p>
      <h2>Services built around you</h2>
      <p class="section-sub">From initial enquiry to final delivery, we handle everything professionally and on time.</p>
      <div class="services-grid">
        <div class="card">
          <div class="service-icon">
            <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div class="service-title">Service One</div>
          <div class="service-desc">Replace this with your primary service. Describe what you do, who it's for, and what makes you different.</div>
        </div>
        <div class="card">
          <div class="service-icon">
            <svg viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          </div>
          <div class="service-title">Service Two</div>
          <div class="service-desc">Your second key service. Highlight the benefits and any guarantees or warranties you offer.</div>
        </div>
        <div class="card">
          <div class="service-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div class="service-title">Service Three</div>
          <div class="service-desc">A third service offering. Use specific language your customers would search for to improve SEO.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- About -->
  <section id="about">
    <div class="container">
      <p class="section-tag">About us</p>
      <h2>Experienced, reliable, local</h2>
      <p class="section-sub">
        We're a local team with over a decade of experience serving customers in the area.
        Replace this with your real story — where you're based, what you specialise in,
        and why customers choose you over the competition.
      </p>
      <div class="stats-row" style="margin-top: 32px;">
        <div><div class="stat-num">100%</div><div class="stat-label">Satisfaction guaranteed</div></div>
        <div><div class="stat-num">Same day</div><div class="stat-label">Response time</div></div>
        <div><div class="stat-num">Fully</div><div class="stat-label">Insured &amp; certified</div></div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section id="testimonials">
    <div class="container">
      <p class="section-tag">Reviews</p>
      <h2>What customers say</h2>
      <div class="testi-grid">
        <div class="card">
          <p class="testi-text"><blockquote>Absolutely brilliant service. Fast, professional, and great value. Would recommend to anyone in the area.</blockquote></p>
          <div class="testi-author">Sarah M.</div>
          <div class="testi-role">Local customer</div>
        </div>
        <div class="card">
          <p class="testi-text"><blockquote>Used them twice now and both times exceeded expectations. Clear communication throughout.</blockquote></p>
          <div class="testi-author">James T.</div>
          <div class="testi-role">Regular customer</div>
        </div>
        <div class="card">
          <p class="testi-text"><blockquote>Really impressed with the quality and attention to detail. Finally found someone reliable locally.</blockquote></p>
          <div class="testi-author">Emma R.</div>
          <div class="testi-role">New customer</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact">
    <div class="container">
      <p class="section-tag">Get in touch</p>
      <h2>Ready to get started?</h2>
      <p class="section-sub" style="margin-bottom: 40px;">Fill in the form and we'll get back to you within one business day. No obligation, free quote.</p>
      <div class="card" style="max-width: 640px;">
        <form onsubmit="event.preventDefault(); alert('Form submitted! Replace this with your backend or a form service like Formspree.');">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Your name</label>
              <input type="text" id="name" placeholder="Jane Smith" required />
            </div>
            <div class="form-group">
              <label for="email">Email address</label>
              <input type="email" id="email" placeholder="jane@example.com" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone number</label>
              <input type="tel" id="phone" placeholder="07700 000000" />
            </div>
            <div class="form-group">
              <label for="service">Service needed</label>
              <select id="service">
                <option value="">Select a service...</option>
                <option>Service One</option>
                <option>Service Two</option>
                <option>Service Three</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="form-group full">
              <label for="message">Tell us more</label>
              <textarea id="message" placeholder="Describe what you need, any specific requirements, and your preferred timeline..."></textarea>
            </div>
          </div>
          <button type="submit">Send enquiry</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footer-inner">
        <span class="footer-copy">© 2025 Your Business Name. All rights reserved.</span>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </div>
  </footer>

</body>
</html>`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params
  const buyerEmail = request.nextUrl.searchParams.get('buyer')

  // ── Gallery template (static, from template-data.ts) ──
  const galleryTemplate = templates.find(t => t.type === type)
  if (galleryTemplate) {
    const rawHtml = generateGalleryTemplateHtml(galleryTemplate.type, galleryTemplate.name, galleryTemplate.bestFor)
    const html = buyerEmail ? embedWatermark(rawHtml, buyerEmail) : rawHtml

    const zip = new JSZip()
    const slug = galleryTemplate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    zip.file('index.html', html)
    zip.file('README.md', README(galleryTemplate.name, galleryTemplate.bestFor))

    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${slug}-template.zip"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  }

  // ── User-built template (DB lookup) ──
  const template = await prisma.template.findUnique({
    where: { id: type },
    select: { id: true, title: true, code: true, isPublic: true },
  })

  if (!template || !template.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const html = buyerEmail ? embedWatermark(template.code, buyerEmail) : template.code
  const zip = new JSZip()
  const slug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  zip.file('index.html', html)
  zip.file('README.md', README(template.title, 'Your business'))

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.zip"`,
      'Content-Length': buffer.length.toString(),
    },
  })
}
