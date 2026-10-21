import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guides, getGuide } from '@/lib/guides'
import { getTemplate } from '@/lib/template-data'

const BASE = 'https://craftmypage.com'

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: 'Guide not found', robots: { index: false } }
  const url = `${BASE}/guides/${slug}`
  return {
    title: { absolute: guide.seoTitle },
    description: guide.description,
    alternates: { canonical: url },
    openGraph: { title: guide.title, description: guide.description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description },
  }
}

/** Serialise JSON-LD safely: escaping "<" stops any value closing the script tag. */
function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const template = getTemplate(guide.template)
  const url = `${BASE}/guides/${slug}`
  const updated = new Date(guide.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.description,
      dateModified: guide.updated,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'CraftMyPage', url: BASE },
      publisher: { '@type': 'Organization', name: 'CraftMyPage', url: BASE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guides', item: `${BASE}/guides` },
        { '@type': 'ListItem', position: 2, name: guide.title, item: url },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Static guide data only, serialised with "<" escaped (same as the template pages). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <nav className="text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/guides" className="hover:underline">Guides</Link>
        </nav>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">{guide.title}</h1>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Updated {updated}</p>

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {guide.intro.map((p) => <p key={p}>{p}</p>)}
        </div>

        {guide.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">{p}</p>
            ))}
            {s.list && (
              <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-neutral-700 dark:text-neutral-300">
                {s.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}

        {template && (
          <aside className="mt-14 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Template</p>
            <p className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">{template.name}</p>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">{template.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/templates/${template.type}`} className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700">
                See the template{template.price ? `, £${template.price}` : ''}
              </Link>
              {template.demoUrl && (
                <a href={template.demoUrl} className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  Live demo
                </a>
              )}
            </div>
          </aside>
        )}

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Questions</h2>
          <dl className="mt-4 space-y-6">
            {guide.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-neutral-900 dark:text-white">{f.q}</dt>
                <dd className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-14 text-neutral-600 dark:text-neutral-400">
          <Link href="/guides" className="text-brand-600 hover:underline">More website guides</Link>
        </p>
      </article>
    </main>
  )
}
