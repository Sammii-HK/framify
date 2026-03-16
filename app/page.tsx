import Link from 'next/link'

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
          <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-4">
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
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Build your site now
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center text-base font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              See how it works
            </a>
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
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
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
            Start free. Upgrade when you are ready.
          </p>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free tier */}
            <div className="rounded-xl border border-neutral-200 p-8">
              <h3 className="text-lg font-semibold text-neutral-900">Free</h3>
              <p className="mt-1 text-sm text-neutral-500">Get started without spending a penny</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-neutral-900">£0</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Hosted on craftmypage.com subdomain
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  All templates and colour palettes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Contact form included
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Mobile responsive
                </li>
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Launch tier */}
            <div className="rounded-xl border-2 border-blue-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most popular
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Launch</h3>
              <p className="mt-1 text-sm text-neutral-500">Everything you need to look professional</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-neutral-900">£149</span>
                <span className="text-neutral-500 text-sm ml-1">one-off</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Custom domain setup
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  All Free features included
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Priority support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  SEO boost pack
                </li>
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro tier */}
            <div className="rounded-xl border border-neutral-200 p-8">
              <h3 className="text-lg font-semibold text-neutral-900">Pro</h3>
              <p className="mt-1 text-sm text-neutral-500">For businesses that want ongoing support</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-neutral-900">£29</span>
                <span className="text-neutral-500 text-sm ml-1">/year</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Custom domain + annual renewal
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Site analytics dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  Priority support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 font-bold">&#10003;</span>
                  All templates and updates
                </li>
              </ul>
              <Link
                href="/generate"
                className="mt-8 block w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO section */}
      <section className="bg-neutral-50">
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
            className="mt-10 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Build your site now
          </Link>
        </div>
      </section>
    </main>
  )
}
