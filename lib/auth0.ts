import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Auth0Client automatically reads from environment variables:
// This file supports both new and legacy Auth0 env vars.
//
// New: AUTH0_BASE_URL, AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET
// Legacy: APP_BASE_URL, AUTH0_DOMAIN (for backwards compatibility)
//
// Note: AUTH0_ISSUER_BASE_URL should be the full URL with https:// (e.g., https://your-tenant.auth0.com)
//       AUTH0_BASE_URL should be your app's base URL (e.g., https://your-app.vercel.app)
//
// Support for legacy variable names (APP_BASE_URL, AUTH0_DOMAIN)
if (!process.env.AUTH0_BASE_URL && process.env.APP_BASE_URL) {
  process.env.AUTH0_BASE_URL = process.env.APP_BASE_URL;
}

if (!process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_DOMAIN) {
  // Add https:// prefix if missing and remove trailing slash if any
  let domain = process.env.AUTH0_DOMAIN;
  if (!domain.startsWith("http")) {
    domain = `https://${domain}`;
  }
  domain = domain.replace(/\/$/, "");
  process.env.AUTH0_ISSUER_BASE_URL = domain;
}

// If you want to provide explicit domain parameter to the Auth0 client, you can do so here:
const domain = process.env.AUTH0_DOMAIN
  ? process.env.AUTH0_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")
  : undefined;

export const auth0 = new Auth0Client(domain ? { domain } : undefined);
