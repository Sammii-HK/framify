'use client'

import { useState, useEffect, useCallback } from 'react'

interface Submission {
  id: string
  siteId: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
  site: { subdomain: string }
}

interface FormSubmissionsProps {
  siteId?: string
}

export default function FormSubmissions({ siteId }: FormSubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchSubmissions = useCallback(async () => {
    try {
      const params = siteId ? `?siteId=${siteId}` : ''
      const res = await fetch(`/api/submissions${params}`)
      if (!res.ok) throw new Error('Failed to load submissions')
      const data = await res.json()
      setSubmissions(data.submissions)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [siteId])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: !currentRead }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, read: !currentRead } : s))
      )
      setUnreadCount((prev) => prev + (currentRead ? 1 : -1))
    } catch {
      // Silently fail -- user can retry
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-4">
        {error}
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p>No form submissions yet</p>
        <p className="text-sm mt-1 text-gray-500">
          Submissions from your site contact forms will appear here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Form submissions</h3>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-600 text-white">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-2">
        {submissions.map((sub) => {
          const isExpanded = expandedId === sub.id
          return (
            <div
              key={sub.id}
              className={`rounded-lg border transition-colors ${
                sub.read
                  ? 'bg-gray-900/40 border-gray-800'
                  : 'bg-gray-900 border-gray-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3"
              >
                {/* Unread dot */}
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    sub.read ? 'bg-transparent' : 'bg-brand-500'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm truncate ${
                        sub.read
                          ? 'text-gray-400'
                          : 'text-white font-medium'
                      }`}
                    >
                      {sub.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {sub.email}
                    </span>
                  </div>
                  {!isExpanded && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {sub.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!siteId && (
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                      {sub.site.subdomain}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(sub.createdAt)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-800">
                  <div className="pt-3 space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        From
                      </span>
                      <p className="text-sm text-gray-300">
                        {sub.name} &lt;{sub.email}&gt;
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Message
                      </span>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap mt-1">
                        {sub.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleRead(sub.id, sub.read)
                        }}
                        className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                      >
                        {sub.read ? 'Mark as unread' : 'Mark as read'}
                      </button>
                      <a
                        href={`mailto:${sub.email}?subject=Re: Your enquiry on ${sub.site.subdomain}.craftmypage.com`}
                        className="text-xs px-3 py-1.5 rounded bg-brand-600 text-white hover:bg-brand-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
