'use client'

import { useState } from 'react'
import Link from 'next/link'

const tiers = {
  starter: {
    name: 'Starter',
    description: 'Everything you need to get your business online',
    monthly: 9,
    yearly: 89,
    features: [
      'Hosted on craftmypage.com subdomain',
      'All templates and colour palettes',
      'Contact form included',
      'Mobile responsive',
      'SEO optimised',
      '"Made with CraftMyPage" branding',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Custom domain and full control over your brand',
    monthly: 19,
    yearly: 179,
    popular: true,
    features: [
      'Custom domain included',
      'All templates and colour palettes',
      'Contact form included',
      'Basic site analytics',
      'No CraftMyPage branding',
      'Mobile responsive',
      'SEO optimised',
      'Domain renewal included',
      'Priority support',
    ],
  },
}

export function PricingSection() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center tracking-tight">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-neutral-500 text-center text-lg max-w-xl mx-auto">
          Generate and preview your site for free. Subscribe when you are ready to publish.
        </p>

        {/* Interval toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${interval === 'monthly' ? 'text-neutral-900' : 'text-neutral-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setInterval(interval === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-7 w-12 items-center rounded-full bg-brand-600 transition-colors"
            aria-label="Toggle billing interval"
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                interval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${interval === 'yearly' ? 'text-neutral-900' : 'text-neutral-400'}`}>
            Yearly
          </span>
          {interval === 'yearly' && (
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-green-700 bg-green-100">
              Save up to 22%
            </span>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Starter */}
          <div className="rounded-xl border border-neutral-200 p-8">
            <h3 className="text-lg font-semibold text-neutral-900">{tiers.starter.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{tiers.starter.description}</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-neutral-900">
                £{interval === 'monthly' ? tiers.starter.monthly : tiers.starter.yearly}
              </span>
              <span className="text-neutral-500 text-sm ml-1">
                /{interval === 'monthly' ? 'mo' : 'yr'}
              </span>
            </p>
            <ul className="mt-8 space-y-3 text-sm text-neutral-600">
              {tiers.starter.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5 font-bold">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/generate"
              className="mt-8 block w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-xl border-2 border-brand-600 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most popular
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">{tiers.pro.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{tiers.pro.description}</p>
            <p className="mt-6">
              <span className="text-4xl font-bold text-neutral-900">
                £{interval === 'monthly' ? tiers.pro.monthly : tiers.pro.yearly}
              </span>
              <span className="text-neutral-500 text-sm ml-1">
                /{interval === 'monthly' ? 'mo' : 'yr'}
              </span>
            </p>
            <ul className="mt-8 space-y-3 text-sm text-neutral-600">
              {tiers.pro.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5 font-bold">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/generate"
              className="mt-8 block w-full rounded-lg bg-brand-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-400">
          Want to see the templates first?{' '}
          <Link href="/templates" className="text-brand-600 hover:text-brand-700 font-medium">
            Browse the gallery
          </Link>
        </p>
      </div>
    </section>
  )
}
