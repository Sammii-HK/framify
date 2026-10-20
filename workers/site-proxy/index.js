/**
 * Cloudflare Worker: site-proxy
 *
 * Routes *.craftmypage.com → {subdomain}.framify-sites.pages.dev
 * and sends www.craftmypage.com to the apex (it used to 404).
 *
 * Deploy with:
 *   cd workers/site-proxy && wrangler deploy
 *
 * Then add a wildcard route in Cloudflare dashboard:
 *   Route: *.craftmypage.com/*
 *   Worker: site-proxy
 */

const PAGES_DOMAIN = 'framify-sites.pages.dev'
const APEX = 'craftmypage.com'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const subdomain = url.hostname.split('.')[0]

    // www is the marketing site, not a customer site: 301 to the apex, keeping path and query.
    if (subdomain === 'www') {
      url.hostname = APEX
      return Response.redirect(url.toString(), 301)
    }

    const target = new URL(request.url)
    target.hostname = `${subdomain}.${PAGES_DOMAIN}`

    const proxied = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    })

    return fetch(proxied)
  },
}
