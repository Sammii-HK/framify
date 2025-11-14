import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Auth0Client automatically reads from environment variables:
// AUTH0_SECRET, AUTH0_BASE_URL, AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
// 
// Note: AUTH0_ISSUER_BASE_URL should be the full URL with https:// (e.g., https://your-tenant.auth0.com)
//       AUTH0_BASE_URL should be your app's base URL (e.g., https://your-app.vercel.app)
//
// Support for legacy variable names (APP_BASE_URL, AUTH0_DOMAIN)
if (!process.env.AUTH0_BASE_URL && process.env.APP_BASE_URL) {
  process.env.AUTH0_BASE_URL = process.env.APP_BASE_URL
}

if (!process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_DOMAIN) {
  // Add https:// prefix if missing
  const domain = process.env.AUTH0_DOMAIN.startsWith('http') 
    ? process.env.AUTH0_DOMAIN 
    : `https://${process.env.AUTH0_DOMAIN}`
  process.env.AUTH0_ISSUER_BASE_URL = domain
}

export const auth0 = new Auth0Client()



