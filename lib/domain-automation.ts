import { prisma } from '@/lib/prisma'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const PAGES_PROJECT = process.env.CLOUDFLARE_PAGES_PROJECT || 'framify'

interface StepResult {
  name: string
  success: boolean
  error?: string
}

interface ProvisionResult {
  success: boolean
  domain: string
  steps: StepResult[]
}

async function cfFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

/**
 * Full domain provisioning flow:
 * 1. Register domain on CF Registrar
 * 2. Create/verify zone
 * 3. Add DNS records (CNAME @ and www)
 * 4. Add custom domain to Pages project
 * 5. Update DB
 */
export async function provisionDomain(
  subdomain: string,
  customDomain: string,
  siteId: string
): Promise<ProvisionResult> {
  const steps: StepResult[] = []
  const pagesTarget = `${PAGES_PROJECT}.pages.dev`

  // Strip any leading/trailing whitespace or protocol
  const domain = customDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '').trim()

  console.log(`[Domain] Starting provisioning: domain=${domain}, subdomain=${subdomain}, siteId=${siteId}`)

  // ── Step 1: Register domain on CF Registrar ──
  try {
    console.log(`[Domain] Step 1: Registering ${domain} on Cloudflare Registrar`)
    const res = await cfFetch(`/accounts/${ACCOUNT_ID}/registrar/domains`, {
      method: 'POST',
      body: JSON.stringify({
        name: domain,
        auto_renew: true,
      }),
    })

    if (res.ok) {
      steps.push({ name: 'register_domain', success: true })
      console.log(`[Domain] Domain registered: ${domain}`)
    } else {
      const body = await res.json().catch(() => ({ errors: [{ message: res.statusText }] }))
      const errorMsg = body.errors?.[0]?.message || `HTTP ${res.status}`
      // If already registered, that's fine
      if (res.status === 409 || errorMsg.includes('already')) {
        steps.push({ name: 'register_domain', success: true, error: 'Already registered (OK)' })
        console.log(`[Domain] Domain already registered: ${domain}`)
      } else {
        steps.push({ name: 'register_domain', success: false, error: errorMsg })
        console.error(`[Domain] Registration failed: ${errorMsg}`)
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    steps.push({ name: 'register_domain', success: false, error: msg })
    console.error(`[Domain] Registration error: ${msg}`)
  }

  // ── Step 2: Create/verify zone ──
  let zoneId: string | null = null
  try {
    console.log(`[Domain] Step 2: Creating zone for ${domain}`)
    const res = await cfFetch('/zones', {
      method: 'POST',
      body: JSON.stringify({
        name: domain,
        account: { id: ACCOUNT_ID },
        type: 'full',
      }),
    })

    const body = await res.json().catch(() => null)

    if (res.ok) {
      zoneId = body?.result?.id || null
      steps.push({ name: 'create_zone', success: true })
      console.log(`[Domain] Zone created: ${zoneId}`)
    } else if (res.status === 409) {
      // Zone already exists, look it up
      steps.push({ name: 'create_zone', success: true, error: 'Zone already exists (OK)' })
      console.log(`[Domain] Zone already exists for ${domain}`)
      // Fetch the existing zone ID
      try {
        const lookupRes = await cfFetch(`/zones?name=${encodeURIComponent(domain)}`)
        const lookupBody = await lookupRes.json()
        zoneId = lookupBody?.result?.[0]?.id || null
      } catch {
        // Non-fatal, we'll continue without it
      }
    } else {
      const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
      steps.push({ name: 'create_zone', success: false, error: errorMsg })
      console.error(`[Domain] Zone creation failed: ${errorMsg}`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    steps.push({ name: 'create_zone', success: false, error: msg })
    console.error(`[Domain] Zone error: ${msg}`)
  }

  // ── Step 3: Add DNS records ──
  if (zoneId) {
    // CNAME @ (root) -> Pages
    try {
      console.log(`[Domain] Step 3a: Adding CNAME @ -> ${pagesTarget}`)
      const res = await cfFetch(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'CNAME',
          name: '@',
          content: pagesTarget,
          proxied: true,
          ttl: 1, // auto
        }),
      })

      if (res.ok) {
        steps.push({ name: 'dns_cname_root', success: true })
        console.log(`[Domain] Root CNAME added`)
      } else {
        const body = await res.json().catch(() => null)
        const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
        // Duplicate record is fine
        if (res.status === 409 || errorMsg.includes('already exists')) {
          steps.push({ name: 'dns_cname_root', success: true, error: 'Record already exists (OK)' })
        } else {
          steps.push({ name: 'dns_cname_root', success: false, error: errorMsg })
          console.error(`[Domain] Root CNAME failed: ${errorMsg}`)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      steps.push({ name: 'dns_cname_root', success: false, error: msg })
      console.error(`[Domain] Root CNAME error: ${msg}`)
    }

    // CNAME www -> Pages
    try {
      console.log(`[Domain] Step 3b: Adding CNAME www -> ${pagesTarget}`)
      const res = await cfFetch(`/zones/${zoneId}/dns_records`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'CNAME',
          name: 'www',
          content: pagesTarget,
          proxied: true,
          ttl: 1,
        }),
      })

      if (res.ok) {
        steps.push({ name: 'dns_cname_www', success: true })
        console.log(`[Domain] WWW CNAME added`)
      } else {
        const body = await res.json().catch(() => null)
        const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
        if (res.status === 409 || errorMsg.includes('already exists')) {
          steps.push({ name: 'dns_cname_www', success: true, error: 'Record already exists (OK)' })
        } else {
          steps.push({ name: 'dns_cname_www', success: false, error: errorMsg })
          console.error(`[Domain] WWW CNAME failed: ${errorMsg}`)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      steps.push({ name: 'dns_cname_www', success: false, error: msg })
      console.error(`[Domain] WWW CNAME error: ${msg}`)
    }
  } else {
    steps.push({ name: 'dns_cname_root', success: false, error: 'Skipped: no zone ID' })
    steps.push({ name: 'dns_cname_www', success: false, error: 'Skipped: no zone ID' })
    console.warn(`[Domain] Skipping DNS records: no zone ID available`)
  }

  // ── Step 4: Add custom domain to Pages project ──
  try {
    console.log(`[Domain] Step 4a: Adding ${domain} to Pages project ${PAGES_PROJECT}`)
    const res = await cfFetch(
      `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`,
      {
        method: 'POST',
        body: JSON.stringify({ name: domain }),
      }
    )

    if (res.ok) {
      steps.push({ name: 'pages_domain', success: true })
      console.log(`[Domain] Pages domain added: ${domain}`)
    } else {
      const body = await res.json().catch(() => null)
      const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
      if (res.status === 409 || errorMsg.includes('already')) {
        steps.push({ name: 'pages_domain', success: true, error: 'Already added (OK)' })
      } else {
        steps.push({ name: 'pages_domain', success: false, error: errorMsg })
        console.error(`[Domain] Pages domain failed: ${errorMsg}`)
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    steps.push({ name: 'pages_domain', success: false, error: msg })
    console.error(`[Domain] Pages domain error: ${msg}`)
  }

  // www variant
  try {
    console.log(`[Domain] Step 4b: Adding www.${domain} to Pages project`)
    const res = await cfFetch(
      `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`,
      {
        method: 'POST',
        body: JSON.stringify({ name: `www.${domain}` }),
      }
    )

    if (res.ok) {
      steps.push({ name: 'pages_domain_www', success: true })
      console.log(`[Domain] Pages www domain added`)
    } else {
      const body = await res.json().catch(() => null)
      const errorMsg = body?.errors?.[0]?.message || `HTTP ${res.status}`
      if (res.status === 409 || errorMsg.includes('already')) {
        steps.push({ name: 'pages_domain_www', success: true, error: 'Already added (OK)' })
      } else {
        steps.push({ name: 'pages_domain_www', success: false, error: errorMsg })
        console.error(`[Domain] Pages www domain failed: ${errorMsg}`)
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    steps.push({ name: 'pages_domain_www', success: false, error: msg })
    console.error(`[Domain] Pages www domain error: ${msg}`)
  }

  // ── Step 5: Update database ──
  try {
    console.log(`[Domain] Step 5: Updating Site record ${siteId}`)
    await prisma.site.update({
      where: { id: siteId },
      data: {
        customDomain: domain,
        status: 'PUBLISHED',
      },
    })
    steps.push({ name: 'update_database', success: true })
    console.log(`[Domain] Database updated`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    steps.push({ name: 'update_database', success: false, error: msg })
    console.error(`[Domain] Database update failed: ${msg}`)
  }

  const allSuccess = steps.every((s) => s.success)
  console.log(
    `[Domain] Provisioning ${allSuccess ? 'completed' : 'completed with errors'}: ${domain}`,
    JSON.stringify(steps, null, 2)
  )

  return {
    success: allSuccess,
    domain,
    steps,
  }
}
