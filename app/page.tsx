import Link from 'next/link'
import { PricingSection } from '@/components/PricingSection'

const palettes = [
  {
    name: 'Dark Celestial',
    description: 'Bold and dramatic. Perfect for nightlife venues, barbers, and modern trades.',
    colours: ['#0f172a', '#1e293b', '#3b82f6', '#e2e8f0'],
  },
  {
    name: 'Earthy Sage',
    description: 'Warm and grounded. Great for wellness studios, organic cafes, and consultants.',
    colours: ['#1a2e1a', '#4a7c59', '#a7c4a0', '#f5f0e8'],
  },
  {
    name: 'Ethereal Light',
    description: 'Clean and airy. Ideal for salons, photographers, and creative professionals.',
    colours: ['#1e1b4b', '#6366f1', '#c7d2fe', '#fafafa'],
  },
  {
    name: 'Crystal Rose',
    description: 'Soft and refined. Suits beauty brands, florists, and boutique businesses.',
    colours: ['#4a1942', '#be185d', '#f9a8d4', '#fff1f2'],
  },
]

const businessTypes = [
  {
    title: 'Builders and Trades',
    description: 'Showcase your work, list your services, and let customers request quotes directly.',
  },
  {
    title: 'Hair and Beauty',
    description: 'Display your portfolio, share your price list, and make it easy to book appointments.',
  },
  {
    title: 'Restaurants and Cafes',
    description: 'Feature your menu, opening hours, and location so customers can find you instantly.',
  },
  {
    title: 'Consultants and Coaches',
    description: 'Establish credibility with a professional site that highlights your expertise and testimonials.',
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="text-brand-600 font-semibold text-sm tracking-wide uppercase mb-4">
            Professional websites for local businesses
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight tracking-tight">
            Your business deserves a website.
            <br className="hidden md:block" />
            {' '}Get one in 5 minutes.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
            No coding. No designers. Just fill in your details and go live.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              Build your site now
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Three steps. That is it.
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            No learning curve. No templates to wrestle with. Just answer a few questions and your site is ready.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[
              {
                step: '1',
                title: 'Fill in your details',
                description: 'Business name, what you do, contact info. The basics you already know.',
              },
              {
                step: '2',
                title: 'Pick a style',
                description: 'Choose a colour palette that fits your brand. Every option looks professional.',
              },
              {
                step: '3',
                title: 'Go live instantly',
                description: 'Your site is generated and published. Share the link, add it to Google, done.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template showcase */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Styles that suit your business
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            Every palette has been designed to look sharp on any device. Pick the one that feels right.
          </p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {palettes.map((palette) => (
              <div
                key={palette.name}
                className="rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  {palette.colours.map((colour, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border border-neutral-200"
                      style={{ backgroundColor: colour }}
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{palette.name}</h3>
                <p className="mt-1 text-neutral-500 text-sm leading-relaxed">{palette.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Built for businesses like yours
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            Whether you work with your hands or your head, your customers are searching for you online.
          </p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {businessTypes.map((type) => (
              <div
                key={type.title}
                className="rounded-xl bg-white border border-neutral-200 p-6"
              >
                <h3 className="text-lg font-semibold text-neutral-900">{type.title}</h3>
                <p className="mt-2 text-neutral-500 text-sm leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Add-ons / customisation section */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Make it fully yours
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            Your site works beautifully out of the box. When you are ready for more, these add-ons are one click away.
          </p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Custom domain</h3>
              <p className="mt-2 text-neutral-500 text-sm leading-relaxed">
                Connect your own domain like yourbusiness.co.uk. Bring one you already own or register a new one. From £10/yr.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-6">
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">White-label branding</h3>
              <p className="mt-2 text-neutral-500 text-sm leading-relaxed">
                Remove the CraftMyPage footer and present your site as entirely your own. Just £3/mo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO section */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Built for Google
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            Every CraftMyPage site is engineered to rank. No plugins, no extras, no SEO consultants needed.
          </p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Proper meta tags',
                description: 'Title, description, and Open Graph tags are generated automatically from your business details.',
              },
              {
                title: 'Semantic HTML',
                description: 'Clean, meaningful markup that search engines understand. No div soup.',
              },
              {
                title: 'Fast loading',
                description: 'Static HTML means your site loads in under a second. Speed is a ranking factor.',
              },
              {
                title: 'Mobile-first design',
                description: 'Every template is responsive by default. Google prioritises mobile-friendly sites.',
              },
              {
                title: 'Structured data',
                description: 'LocalBusiness schema markup so Google shows your hours, address, and reviews.',
              },
              {
                title: 'No bloat',
                description: 'No page builders, no WordPress plugins, no JavaScript frameworks slowing you down.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white border border-neutral-200 p-6">
                <h3 className="text-base font-semibold text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-neutral-900">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Ready to get online?
          </h2>
          <p className="mt-4 text-neutral-400 text-lg max-w-lg mx-auto">
            Your competitors already have a website. It takes 5 minutes to join them.
          </p>
          <Link
            href="/generate"
            className="mt-10 inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Build your site now
          </Link>
        </div>
      </section>
    </main>
  )
}
