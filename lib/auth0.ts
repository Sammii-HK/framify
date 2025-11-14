import { Auth0Client } from '@auth0/nextjs-auth0/server'

// Auth0Client automatically reads from environment variables:
// AUTH0_SECRET, AUTH0_BASE_URL, AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
// 
// Note: AUTH0_ISSUER_BASE_URL should be the full URL with https:// (e.g., https://your-tenant.auth0.com)
//       AUTH0_BASE_URL should be your app's base URL (e.g., https://your-app.vercel.app)
export const auth0 = new Auth0Client()



