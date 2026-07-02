import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Etsy OAuth 2.0 with PKCE
// GET /api/etsy/auth — redirects to Etsy OAuth consent page
// Only callable by the shop owner (you)

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function GET() {
  const codeVerifier = base64url(crypto.randomBytes(32))
  const codeChallenge = base64url(
    crypto.createHash('sha256').update(codeVerifier).digest()
  )
  const state = base64url(crypto.randomBytes(16))

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'
  const redirectUri = `${appUrl}/api/etsy/callback`

  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'listings_r listings_w listings_d shops_r',
    client_id: process.env.ETSY_API_KEY!,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  // Store verifier in a short-lived cookie for the callback
  const response = NextResponse.redirect(
    `https://www.etsy.com/oauth/connect?${params.toString()}`
  )
  response.cookies.set('etsy_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 300, // 5 minutes
  })
  response.cookies.set('etsy_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 300,
  })

  return response
}
