const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const PROJECT_NAME = process.env.CLOUDFLARE_PAGES_PROJECT || 'framify-sites'

/**
 * Create a Cloudflare Web Analytics site and return the site tag (token).
 * Returns null on failure so callers can gracefully degrade.
 */
export async function createWebAnalyticsSite(siteName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/rum/site_info`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: `${siteName}.craftmypage.com`,
          auto_install: false,
        }),
      }
    )
    const data = await res.json()
    if (data.success && data.result?.site_tag) {
      return data.result.site_tag
    }
    console.error('CF Web Analytics site creation failed:', data.errors)
    return null
  } catch (err) {
    console.error('CF Web Analytics site creation error:', err)
    return null
  }
}

/**
 * Query Cloudflare Web Analytics (RUM) for page views and unique visitors.
 * Falls back to zeroes on any error.
 */
export async function getWebAnalytics(
  siteTag: string,
  days: number = 30
): Promise<{ pageViews: number; visitors: number }> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          viewer {
            accounts(filter: { accountTag: "${ACCOUNT_ID}" }) {
              rumPageloadEventsAdaptiveGroups(
                filter: {
                  AND: [
                    { siteTag: "${siteTag}" },
                    { datetime_geq: "${since.toISOString()}" },
                    { datetime_leq: "${new Date().toISOString()}" }
                  ]
                }
                limit: 1
              ) {
                count
                sum { visits }
              }
            }
          }
        }`,
      }),
    })
    const data = await res.json()
    const groups =
      data?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups?.[0]
    return {
      pageViews: groups?.count ?? 0,
      visitors: groups?.sum?.visits ?? 0,
    }
  } catch {
    return { pageViews: 0, visitors: 0 }
  }
}

interface DeployResult {
  url: string
  deploymentId: string
}

/**
 * Deploy one or more HTML files to Cloudflare Pages via Direct Upload API.
 * `files` is a map of filename (e.g. "index.html", "about.html") → HTML content.
 * `branch` sets the Pages branch alias (use the subdomain so the Worker can route to it).
 */
export async function deploySite(files: Map<string, string>, branch: string): Promise<DeployResult> {
  const formData = new FormData()

  for (const [filename, content] of files) {
    const path = filename.startsWith('/') ? filename : `/${filename}`
    formData.append(path, new Blob([content], { type: 'text/html' }), path)
  }

  // Branch name determines the alias URL: {branch}.{project}.pages.dev
  formData.append('branch', branch)

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: formData,
    }
  )

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Cloudflare deploy failed: ${error}`)
  }

  const data = await res.json()
  const deploymentUrl = data.result?.url

  if (!deploymentUrl) {
    throw new Error(`No deployment URL in Cloudflare response: ${JSON.stringify(data)}`)
  }

  return {
    url: deploymentUrl,
    deploymentId: data.result.id,
  }
}

export async function createCustomDomain(subdomain: string): Promise<string> {
  // Add a custom domain to the Pages project
  // This requires the domain to be on Cloudflare DNS
  const domain = `${subdomain}.${process.env.NEXT_PUBLIC_CUSTOMER_DOMAIN || 'craftmypage.com'}`

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  )

  if (!res.ok) {
    const error = await res.text()
    console.error('Custom domain failed:', error)
    // Non-fatal — the deployment URL still works
  }

  return domain
}
