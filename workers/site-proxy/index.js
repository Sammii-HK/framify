/**
 * Cloudflare Worker: site-proxy
 *
 * Routes *.craftmypage.com → {subdomain}.framify-sites.pages.dev
 *
 * Deploy with:
 *   cd workers/site-proxy && wrangler deploy
 *
 * Then add a wildcard route in Cloudflare dashboard:
 *   Route: *.craftmypage.com/*
 *   Worker: site-proxy
 */

const PAGES_DOMAIN = 'framify-sites.pages.dev'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const subdomain = url.hostname.split('.')[0]

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
