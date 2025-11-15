import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Auth0Client automatically reads from environment variables:
// AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL
//
// Make sure these are set in .env.local:
// - APP_BASE_URL=http://localhost:3000
// - AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com (no protocol, no trailing slash)
// - AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
// - AUTH0_CLIENT_SECRET=<your-secret>
// - AUTH0_SECRET=<generated-secret>

// Clean and validate domain (remove any whitespace)
const domain = process.env.AUTH0_DOMAIN?.trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

if (!domain) {
  console.error("❌ AUTH0_DOMAIN is not set in environment variables");
}

if (!process.env.AUTH0_CLIENT_ID) {
  console.error("❌ AUTH0_CLIENT_ID is not set in environment variables");
}

if (!process.env.AUTH0_CLIENT_SECRET) {
  console.error("❌ AUTH0_CLIENT_SECRET is not set in environment variables");
}

if (!process.env.APP_BASE_URL) {
  console.error("❌ APP_BASE_URL is not set in environment variables");
}

// Create Auth0Client with explicit domain configuration
// This ensures the domain is properly formatted
export const auth0 = new Auth0Client({
  domain: domain,
});
