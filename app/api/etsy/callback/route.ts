import { NextRequest, NextResponse } from 'next/server'

// GET /api/etsy/callback — handles the OAuth code exchange
// Stores access + refresh tokens in env (manual step) or a DB record

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get('etsy_state')?.value
  const codeVerifier = request.cookies.get('etsy_code_verifier')?.value

  if (!code || state !== storedState || !codeVerifier) {
    return NextResponse.json({ error: 'Invalid OAuth state' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://craftmypage.com'
  const redirectUri = `${appUrl}/api/etsy/callback`

  const tokenRes = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ETSY_API_KEY!,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Token exchange failed', details: tokens }, { status: 400 })
  }

  // Return tokens as JSON — copy access_token and refresh_token to Vercel env vars:
  // ETSY_ACCESS_TOKEN and ETSY_REFRESH_TOKEN
  return NextResponse.json({
    message: 'Copy these to your Vercel env vars',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
    token_type: tokens.token_type,
  })
}
