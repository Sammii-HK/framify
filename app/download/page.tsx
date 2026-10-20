'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getTemplate } from '@/lib/template-data'

function DownloadContent() {
  const params = useSearchParams()
  const templateType = params.get('template')
  const sessionId = params.get('session_id') // from the Stripe success redirect
  const template = templateType ? getTemplate(templateType) : undefined
  const triggered = useRef(false)
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking')

  // The download URL carries the Stripe session, which the server verifies.
  // No buyer email goes in the URL.
  const downloadHref =
    templateType && sessionId
      ? `/api/template/${encodeURIComponent(templateType)}/download?session_id=${encodeURIComponent(sessionId)}`
      : null

  useEffect(() => {
    if (!sessionId || triggered.current) return
    triggered.current = true
    fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`)
      .then((r) => (r.ok ? setStatus('ready') : setStatus('error')))
      .catch(() => setStatus('error'))
  }, [sessionId])

  useEffect(() => {
    if (status !== 'ready' || !downloadHref) return
    const a = document.createElement('a')
    a.href = downloadHref
    a.click()
  }, [status, downloadHref])

  if (!sessionId || status === 'error') {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">We couldn&apos;t find that purchase</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Use the download link in your receipt email, or contact hello@craftmypage.com with your order details and we&apos;ll sort it out.
          </p>
          <Link href="/templates" className="text-brand-600 hover:text-brand-700 text-sm font-medium">Back to templates</Link>
        </div>
      </main>
    )
  }

  const canDeploy = !template?.kit

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          {status === 'ready' ? 'Your download is starting' : 'Confirming your purchase…'}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8" role="status">
          {status === 'ready'
            ? `${template?.productName || template?.name || 'Your template'} will download as a zip. Start with README.md inside it. We've also emailed you a link so you can download it again later.`
            : 'Just a moment while we check your payment.'}
        </p>

        {status === 'ready' && downloadHref && (
          <p className="mb-8">
            <a
              href={downloadHref}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-900"
            >
              Download again
            </a>
          </p>
        )}

        {canDeploy && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-left">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Rather skip the setup entirely?</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Deploy this template on CraftMyPage and we handle hosting, your domain, SSL, and deployment, live in minutes.
            </p>
            <Link
              href={templateType ? `/generate?template=${templateType}` : '/generate'}
              className="inline-flex items-center justify-center w-full rounded-lg bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Deploy it for me
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default function DownloadPage() {
  return (
    <Suspense>
      <DownloadContent />
    </Suspense>
  )
}
