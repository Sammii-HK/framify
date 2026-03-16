import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// In-memory rate limit store: subdomain -> timestamps of recent submissions
const rateLimitStore = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 10

function isRateLimited(subdomain: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitStore.get(subdomain) || []
  // Remove entries outside the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW)
  rateLimitStore.set(subdomain, recent)
  return recent.length >= RATE_LIMIT_MAX
}

function recordSubmission(subdomain: string): void {
  const timestamps = rateLimitStore.get(subdomain) || []
  timestamps.push(Date.now())
  rateLimitStore.set(subdomain, timestamps)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function corsHeaders(origin: string | null) {
  // Allow requests from any *.craftmypage.com subdomain or localhost for dev
  const allowedOrigin =
    origin &&
    (origin.endsWith('.craftmypage.com') ||
      origin === 'https://craftmypage.com' ||
      origin.startsWith('http://localhost'))
      ? origin
      : 'https://craftmypage.com'

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

/**
 * POST /api/form-submit
 *
 * Accepts contact form submissions from customer static sites.
 * Stores them in the DB linked to the site by subdomain.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  try {
    const body = await req.json()
    const { subdomain, name, email, message, website } = body

    // Honeypot: if the hidden `website` field is filled, silently discard
    if (website) {
      return NextResponse.json(
        { success: true },
        { status: 200, headers }
      )
    }

    // Validate required fields
    if (!subdomain || typeof subdomain !== 'string') {
      return NextResponse.json(
        { error: 'Missing subdomain' },
        { status: 400, headers }
      )
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400, headers }
      )
    }

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400, headers }
      )
    }

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400, headers }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be 2000 characters or fewer' },
        { status: 400, headers }
      )
    }

    // Rate limit check
    if (isRateLimited(subdomain)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers }
      )
    }

    // Look up site by subdomain
    const site = await prisma.site.findUnique({
      where: { subdomain: subdomain.toLowerCase().trim() },
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404, headers }
      )
    }

    // Store the submission
    await prisma.formSubmission.create({
      data: {
        siteId: site.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    })

    recordSubmission(subdomain)

    return NextResponse.json({ success: true }, { status: 200, headers })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500, headers }
    )
  }
}
