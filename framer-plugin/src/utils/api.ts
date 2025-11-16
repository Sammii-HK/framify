/**
 * API utilities for fetching templates and components from Framify
 */

const API_BASE_URL = process.env.FRAMIFY_API_URL || 'https://framify-nine.vercel.app';

export interface Template {
  id: string;
  title: string;
  description?: string;
  style: string;
  category?: string;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  createdAt: string;
}

export interface Component {
  id: string;
  name: string;
  title: string;
  description?: string;
  componentType: string;
  category?: string;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  createdAt: string;
}

export interface TemplateWithCode extends Template {
  code: string;
}

export interface ComponentWithCode extends Component {
  code: string;
}

/**
 * Fetch list of public templates
 */
export async function fetchTemplates(params?: {
  style?: string;
  category?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}): Promise<{ templates: Template[]; pagination: any }> {
  const queryParams = new URLSearchParams();
  if (params?.style) queryParams.set('style', params.style);
  if (params?.category) queryParams.set('category', params.category);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.featured) queryParams.set('featured', 'true');

  const url = `${API_BASE_URL}/api/templates/public${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch templates: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch template code by ID (for plugin use)
 */
export async function fetchTemplateCode(id: string): Promise<TemplateWithCode> {
  const url = `${API_BASE_URL}/api/plugin/templates/${id}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch template code: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch list of public components
 */
export async function fetchComponents(params?: {
  category?: string;
  componentType?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}): Promise<{ components: Component[]; pagination: any }> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.set('category', params.category);
  if (params?.componentType) queryParams.set('componentType', params.componentType);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.featured) queryParams.set('featured', 'true');

  const url = `${API_BASE_URL}/api/components/public${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch components: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch component code by ID (for plugin use)
 */
export async function fetchComponentCode(id: string): Promise<ComponentWithCode> {
  const url = `${API_BASE_URL}/api/plugin/components/${id}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch component code: ${response.statusText}`);
  }

  return response.json();
}

