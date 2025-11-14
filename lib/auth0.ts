import { Auth0Client } from '@auth0/nextjs-auth0/server'

export const auth0 = new Auth0Client({
  // Ensure domain is properly formatted (no trailing slash, no protocol)
  domain: process.env.AUTH0_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, ''),
})



