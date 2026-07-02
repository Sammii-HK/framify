'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function DownloadContent() {
  const params = useSearchParams()
  const templateType = params.get('template')
  const buyer = params.get('buyer')           // from direct URL (old LS flow)
  const sessionId = params.get('session_id')  // from Stripe redirect
  const triggered = useRef(false)
  const [resolvedBuyer, setResolvedBuyer] = useState<string | null>(buyer)
  const [error, setError] = useState(false)

  // Resolve buyer email from Stripe session if needed
  useEffect(() => {
    if (buyer || !sessionId || triggered.current) return
    triggered.current = true

    fetch(`/api/checkout/session?id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.email) setResolvedBuyer(d.email)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [buyer, sessionId])

  // Trigger download once we have buyer email
  useEffect(() => {
    if (!templateType || !resolvedBuyer) return
    const a = document.createElement('a')
    a.href = `/api/template/${templateType}/download?buyer=${encodeURIComponent(resolvedBuyer)}`
    a.click()
  }, [templateType, resolvedBuyer])

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">We couldn't verify your purchase. Please contact us at hello@craftmypage.com with your order details.</p>
          <Link href="/templates" className="text-brand-600 hover:text-brand-700 text-sm font-medium">Back to templates</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          {resolvedBuyer ? 'Your download is starting' : 'Verifying your purchase…'}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          {resolvedBuyer
            ? 'Your template ZIP will download automatically. Check your downloads folder if it doesn\'t start within a few seconds.'
            : 'Just a moment while we confirm your payment.'}
        </p>

        {templateType && resolvedBuyer && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-8">
            <a
              href={`/api/template/${templateType}/download?buyer=${encodeURIComponent(resolvedBuyer)}`}
              className="underline hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Click here if it didn't start
            </a>
          </p>
        )}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-left">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
            Rather skip the setup entirely?
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Deploy this template on CraftMyPage and we handle hosting, your domain, SSL, and deployment — live in minutes.
          </p>
          <Link
            href={templateType ? `/generate?template=${templateType}` : '/generate'}
            className="inline-flex items-center justify-center w-full rounded-lg bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            Deploy it for me
          </Link>
        </div>
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
