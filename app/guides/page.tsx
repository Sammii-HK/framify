import type { Metadata } from 'next'
import Link from 'next/link'
import { guides } from '@/lib/guides'

const BASE = 'https://craftmypage.com'

export const metadata: Metadata = {
  title: 'Website Guides for Small Businesses and App Makers',
  description:
    'Practical checklists for what to put on your website: therapists, cleaning companies, app landing pages, App Store support and privacy pages, and small businesses.',
  alternates: { canonical: `${BASE}/guides` },
}

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">Website guides</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Plain checklists for what your website needs, written for the kind of business you run.
        </p>
        <ul className="mt-12 space-y-8">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group block">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-600">
                  {g.title}
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{g.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
