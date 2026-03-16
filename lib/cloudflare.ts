const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const PROJECT_NAME = process.env.CLOUDFLARE_PAGES_PROJECT || 'framify-sites'

interface DeployResult {
  url: string
  deploymentId: string
}

export async function deploySite(html: string, subdomain: string): Promise<DeployResult> {
  // Cloudflare Pages Direct Upload API
  // Step 1: Create a deployment
  const formData = new FormData()
  formData.append('index.html', new Blob([html], { type: 'text/html' }), '/index.html')

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
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
    throw new Error('No deployment URL returned from Cloudflare')
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
