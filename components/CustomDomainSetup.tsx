'use client'

import { useState } from 'react'

interface CustomDomainSetupProps {
  siteId: string
  onConnected?: (domain: string) => void
}

type VerificationStatus = 'idle' | 'pending' | 'verified' | 'failed'

interface DnsInstructions {
  type: string
  name: string
  value: string
  note: string
}

export default function CustomDomainSetup({ siteId, onConnected }: CustomDomainSetupProps) {
  const [domain, setDomain] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [instructions, setInstructions] = useState<DnsInstructions | null>(null)
  const [connectedDomain, setConnectedDomain] = useState('')
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [copied, setCopied] = useState<string | null>(null)

  async function handleConnect() {
    setError('')
    const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')

    if (!cleaned) {
      setError('Please enter a domain name.')
      return
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/.test(cleaned)) {
      setError('Please enter a valid domain, e.g. yourbusiness.com')
      return
    }

    setConnecting(true)

    try {
      const res = await fetch('/api/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cleaned, siteId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to connect domain. Please try again.')
        return
      }

      setInstructions(data.instructions)
      setConnectedDomain(data.domain)
      setStatus('pending')
      onConnected?.(data.domain)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  async function handleVerify() {
    setVerifying(true)
    setError('')

    try {
      const res = await fetch(
        `/api/custom-domain?domain=${encodeURIComponent(connectedDomain)}&siteId=${encodeURIComponent(siteId)}`
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification check failed.')
        setStatus('failed')
        return
      }

      setStatus(data.verified ? 'verified' : 'failed')
    } catch {
      setError('Could not check DNS. Please try again.')
      setStatus('failed')
    } finally {
      setVerifying(false)
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  // Step 1: Domain input
  if (status === 'idle') {
    return (
      <div className="mt-4 bg-white border border-neutral-200 rounded-lg p-5">
        <h4 className="text-sm font-semibold text-neutral-900 mb-1">
          Connect your own domain
        </h4>
        <p className="text-xs text-neutral-500 mb-4">
          Already own a domain? Point it to your CraftMyPage site.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourbusiness.com"
            className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
          />
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {connecting ? 'Connecting...' : 'Connect domain'}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }

  // Step 2: DNS instructions + verification
  return (
    <div className="mt-4 bg-white border border-neutral-200 rounded-lg p-5">
      <h4 className="text-sm font-semibold text-neutral-900 mb-1">
        Set up DNS for {connectedDomain}
      </h4>
      <p className="text-xs text-neutral-500 mb-4">
        Add these DNS records at your domain registrar (e.g. GoDaddy, Namecheap, Google Domains).
      </p>

      {/* DNS records table */}
      <div className="overflow-hidden border border-neutral-200 rounded-lg mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">CNAME</td>
              <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">@</td>
              <td className="px-3 py-2.5 font-mono text-xs text-brand-600">{instructions?.value}</td>
              <td className="px-3 py-2.5 text-right">
                <button
                  onClick={() => copyToClipboard(instructions?.value || '', 'root')}
                  className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                  title="Copy value"
                >
                  {copied === 'root' ? 'Copied' : 'Copy'}
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">CNAME</td>
              <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">www</td>
              <td className="px-3 py-2.5 font-mono text-xs text-brand-600">{instructions?.value}</td>
              <td className="px-3 py-2.5 text-right">
                <button
                  onClick={() => copyToClipboard(instructions?.value || '', 'www')}
                  className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                  title="Copy value"
                >
                  {copied === 'www' ? 'Copied' : 'Copy'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Help text */}
      <div className="bg-neutral-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-neutral-600 leading-relaxed">
          <span className="font-medium">How to do this:</span> Log in to wherever you bought your domain
          (e.g. GoDaddy, Namecheap). Find the DNS settings page and add the two CNAME records above.
          If your registrar does not support a CNAME on the root (@), use their "alias" or "flattening"
          option instead. DNS changes can take up to 48 hours to propagate.
        </p>
      </div>

      {/* Verification status */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? 'Checking...' : 'Verify DNS'}
        </button>

        {status === 'pending' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Pending verification
          </span>
        )}

        {status === 'verified' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Domain verified and active
          </span>
        )}

        {status === 'failed' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            DNS not detected yet
          </span>
        )}
      </div>

      {status === 'failed' && (
        <p className="text-xs text-neutral-500">
          Your DNS records have not propagated yet. This is normal and can take up to 48 hours.
          Make sure the records above are added correctly, then try verifying again later.
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
