'use client'

import { useState } from 'react'

interface DomainSearchProps {
  siteId: string
  subdomain: string
  onPurchaseStarted?: () => void
}

interface SearchResult {
  available: boolean
  domain: string
  pricePence: number
  tld: string
}

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

// Suggest alternative TLDs when a domain is taken
const ALTERNATIVE_TLDS = ['.co.uk', '.uk', '.site', '.online', '.store', '.dev']

export default function DomainSearch({ siteId, subdomain, onPurchaseStarted }: DomainSearchProps) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [alternatives, setAlternatives] = useState<SearchResult[]>([])
  const [error, setError] = useState('')
  const [purchasing, setPurchasing] = useState(false)

  async function checkDomain(domain: string): Promise<SearchResult | null> {
    try {
      const res = await fetch(`/api/domain-check?domain=${encodeURIComponent(domain)}`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  async function handleSearch() {
    setError('')
    setResult(null)
    setAlternatives([])

    let cleaned = query.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')
    if (!cleaned) {
      setError('Enter a domain name to search.')
      return
    }

    // If they only typed a name without a TLD, add .com
    if (!cleaned.includes('.')) {
      cleaned = cleaned + '.com'
    }

    setSearching(true)

    try {
      // Check the main domain
      const main = await checkDomain(cleaned)
      if (!main) {
        setError('Could not check that domain. Please try again.')
        return
      }
      setResult(main)

      // If taken, check alternatives in parallel
      if (!main.available) {
        const baseName = cleaned.split('.')[0]
        const altPromises = ALTERNATIVE_TLDS
          .filter(tld => !cleaned.endsWith(tld))
          .slice(0, 4)
          .map(tld => checkDomain(baseName + tld))

        const altResults = await Promise.all(altPromises)
        setAlternatives(
          altResults.filter((r): r is SearchResult => r !== null && r.available)
        )
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  async function handlePurchase(domain: string, pricePence: number) {
    setPurchasing(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'domain',
          siteId,
          subdomain,
          domainPrice: pricePence,
          customDomain: domain,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        onPurchaseStarted?.()
        window.location.href = data.url
      } else {
        const data = await res.json()
        setError(data.error || 'Could not start checkout.')
      }
    } catch {
      setError('Could not start checkout. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="mt-4 bg-white border border-neutral-200 rounded-lg p-5">
      <h4 className="text-sm font-semibold text-neutral-900 mb-1">
        Find a domain
      </h4>
      <p className="text-xs text-neutral-500 mb-4">
        Search for a domain name and we will register and connect it for you.
      </p>

      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="yourbusiness.com"
          className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {/* Search results */}
      {result && (
        <div className="mt-4 space-y-2">
          {/* Main result */}
          <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
            result.available
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                result.available ? 'bg-green-500' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium text-neutral-900 truncate">
                {result.domain}
              </span>
            </div>
            {result.available ? (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-neutral-900">
                  {formatPrice(result.pricePence)}/yr
                </span>
                <button
                  onClick={() => handlePurchase(result.domain, result.pricePence)}
                  disabled={purchasing}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Register'}
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-red-600 shrink-0">Taken</span>
            )}
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <>
              <p className="text-xs font-medium text-neutral-500 pt-2">
                Available alternatives
              </p>
              {alternatives.map((alt) => (
                <div
                  key={alt.domain}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {alt.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatPrice(alt.pricePence)}/yr
                    </span>
                    <button
                      onClick={() => handlePurchase(alt.domain, alt.pricePence)}
                      disabled={purchasing}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {purchasing ? '...' : 'Register'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Pricing note */}
          <p className="text-xs text-neutral-400 pt-1">
            Prices are per year and include registration, DNS setup, and automatic renewal.
          </p>
        </div>
      )}
    </div>
  )
}
