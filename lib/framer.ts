/**
 * Framer API Integration
 * 
 * Based on Framer's API documentation:
 * - Framer uses OAuth 2.0 for authentication
 * - CodeFile API allows creating/updating code components in existing projects
 * - Projects are typically created manually; code components can be added via API
 * 
 * See: https://framer.com/developers/reference
 * OAuth: https://framer.com/developers/oauth
 */

interface FramerProject {
  id: string
  url: string
  name: string
}

interface FramerCodeFile {
  id: string
  name: string
  url: string
  projectId: string
}

interface FramerOAuthToken {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
}

/**
 * Get OAuth access token for Framer API
 * Uses client credentials flow or authorization code flow
 */
async function getFramerAccessToken(): Promise<string> {
  const clientId = process.env.FRAMER_CLIENT_ID
  const clientSecret = process.env.FRAMER_CLIENT_SECRET
  const accessToken = process.env.FRAMER_ACCESS_TOKEN

  // If access token is directly provided, use it
  if (accessToken) {
    return accessToken
  }

  // Otherwise, use OAuth client credentials flow
  if (!clientId || !clientSecret) {
    throw new Error(
      'Framer authentication required. Please provide either FRAMER_ACCESS_TOKEN or FRAMER_CLIENT_ID and FRAMER_CLIENT_SECRET in .env.local'
    )
  }

  try {
    const response = await fetch('https://framer.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OAuth token request failed: ${response.status} ${errorText}`)
    }

    const tokenData: FramerOAuthToken = await response.json()
    return tokenData.access_token
  } catch (error) {
    console.error('Error getting Framer OAuth token:', error)
    throw new Error(
      'Failed to authenticate with Framer. Please check your OAuth credentials.'
    )
  }
}

/**
 * Create a code component in a Framer project
 * Requires an existing project ID
 */
async function createFramerCodeComponent(
  projectId: string,
  name: string,
  code: string,
  accessToken: string
): Promise<FramerCodeFile> {
  const apiBaseUrl = process.env.FRAMER_API_BASE_URL || 'https://api.framer.com/v1'

  const response = await fetch(
    `${apiBaseUrl}/projects/${projectId}/code-files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        code: code,
        type: 'component', // Code component type
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    
    if (response.status === 404) {
      throw new Error(
        `Project not found. Please ensure FRAMER_PROJECT_ID is correct and you have access to the project.`
      )
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        'Unauthorized. Please check your Framer API credentials and project permissions.'
      )
    }

    throw new Error(
      `Failed to create code component: ${response.status} ${response.statusText}. ${errorText}`
    )
  }

  const data = await response.json()
  return {
    id: data.id || data.fileId,
    name: data.name || name,
    url: data.url || `https://framer.com/projects/${projectId}/code/${data.id}`,
    projectId: projectId,
  }
}

/**
 * Main function to create a Framer project/code component
 * 
 * Note: Framer doesn't have a direct API to create new projects.
 * This function creates a code component in an existing project.
 * If no project ID is provided, it will guide the user to create one manually.
 */
export async function createFramerProject(
  title: string,
  code: string
): Promise<FramerProject> {
  const projectId = process.env.FRAMER_PROJECT_ID

  if (!projectId) {
    throw new Error(
      'FRAMER_PROJECT_ID is required. Please create a Framer project manually and add its ID to .env.local. ' +
      'You can find the project ID in the URL: https://framer.com/projects/[PROJECT_ID]/...'
    )
  }

  try {
    // Get OAuth access token
    const accessToken = await getFramerAccessToken()

    // Create code component in the existing project
    const codeComponent = await createFramerCodeComponent(
      projectId,
      title,
      code,
      accessToken
    )

    // Return project information with link to the code component
    return {
      id: codeComponent.projectId,
      url: `https://framer.com/projects/${codeComponent.projectId}`,
      name: title,
    }
  } catch (error) {
    // Re-throw with context if it's already our error
    if (error instanceof Error && error.message.includes('Framer')) {
      throw error
    }

    console.error('Error creating Framer code component:', error)
    throw new Error(
      `Failed to create Framer component: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}

/**
 * Alternative approach: Generate a Framer-compatible package
 * If direct API doesn't work, we can create a downloadable package
 */
export function generateFramerPackage(title: string, code: string) {
  return {
    'package.json': JSON.stringify(
      {
        name: title.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: `Generated template: ${title}`,
        main: 'App.tsx',
        dependencies: {
          'framer-motion': '^11.5.4',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
        },
      },
      null,
      2
    ),
    'App.tsx': code,
  }
}

