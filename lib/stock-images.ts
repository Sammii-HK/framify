/**
 * Stock image fetching for CraftMyPage demo/portfolio sites.
 *
 * Primary source: Unsplash API (free tier, 50 req/hour).
 * Falls back to hardcoded royalty-free placeholder URLs when the API
 * key is missing or the request fails.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const UTM_PARAMS = '?utm_source=craftmypage&utm_medium=referral'

const FALLBACK_ACCESS_KEY = 'ffcX9zjAmWQhmYAFkUXzixqcKMQ0_q99Y3r_ioiTJp8'

function getAccessKey(): string | undefined {
  return process.env.UNSPLASH_ACCESS_KEY || FALLBACK_ACCESS_KEY
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StockImage {
  url: string
  alt: string
  credit: string
  photographerName: string
  photographerUrl: string
  unsplashUrl: string
  downloadEndpoint: string
}

// ---------------------------------------------------------------------------
// Keyword mappings per business type
// ---------------------------------------------------------------------------

const KEYWORD_MAP: Record<string, string[]> = {
  plumber: ['plumber working', 'bathroom renovation', 'copper pipes', 'modern bathroom'],
  plumbing: ['plumber working', 'bathroom renovation', 'copper pipes', 'modern bathroom'],
  builder: ['construction site', 'house building', 'bricklaying', 'new build home'],
  construction: ['construction site', 'house building', 'bricklaying', 'new build home'],
  salon: ['hair salon interior', 'hairdresser styling', 'salon chair', 'hair color'],
  hairdresser: ['hair salon interior', 'hairdresser styling', 'salon chair', 'hair color'],
  restaurant: ['restaurant interior', 'chef cooking', 'food plating', 'cafe ambiance'],
  cafe: ['restaurant interior', 'chef cooking', 'food plating', 'cafe ambiance'],
  electrician: ['electrician working', 'electrical panel', 'home wiring', 'light installation'],
  landscaper: ['garden design', 'landscaping', 'patio garden', 'lawn care'],
  garden: ['garden design', 'landscaping', 'patio garden', 'lawn care'],
  cleaner: ['professional cleaning', 'clean home interior', 'cleaning service', 'spotless kitchen'],
  cleaning: ['professional cleaning', 'clean home interior', 'cleaning service', 'spotless kitchen'],
  consultant: ['business meeting', 'office workspace', 'professional headshot', 'consultation'],
  coach: ['business meeting', 'office workspace', 'professional headshot', 'consultation'],
}

const DEFAULT_KEYWORDS = ['small business', 'professional service', 'local business', 'team working']

// ---------------------------------------------------------------------------
// Template query mappings (all 21 template types)
// ---------------------------------------------------------------------------

export const TEMPLATE_QUERIES: Record<string, string> = {
  standard: 'small business storefront',
  trades: 'construction worker tools',
  'hair-beauty': 'hair salon interior',
  'food-drink': 'restaurant interior food',
  portfolio: 'creative workspace design',
  professional: 'business meeting professional',
  'health-fitness': 'gym fitness training',
  events: 'event venue stage lighting',
  'pet-services': 'dog grooming pets',
  automotive: 'car mechanic garage',
  education: 'tutoring classroom learning',
  property: 'house exterior real estate',
  medical: 'dental clinic medical office',
  'creative-agency': 'design studio creative team',
  shop: 'retail boutique store display',
  'business-pro': 'corporate office modern',
  startup: 'startup technology workspace',
  'restaurant-full': 'restaurant dining fine food',
  'portfolio-full': 'architecture interior design',
  clinic: 'medical clinic reception area',
  'property-full': 'luxury property estate',
}

// ---------------------------------------------------------------------------
// Hardcoded fallback images (royalty-free from Unsplash — no API key needed
// when using the special /photo/ URL format which is permitted for hotlinking)
// ---------------------------------------------------------------------------

const FALLBACK_IMAGES: StockImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    alt: 'Modern office workspace',
    credit: 'Photo by Marvin Meyer on Unsplash',
    photographerName: 'Marvin Meyer',
    photographerUrl: `https://unsplash.com/@marvinmeyer${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/SYTO3xs06fU${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    alt: 'Team collaboration',
    credit: 'Photo by Annie Spratt on Unsplash',
    photographerName: 'Annie Spratt',
    photographerUrl: `https://unsplash.com/@anniespratt${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/QckxruozjRg${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    alt: 'Professional business environment',
    credit: 'Photo by Austin Distel on Unsplash',
    photographerName: 'Austin Distel',
    photographerUrl: `https://unsplash.com/@austindistel${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/wD1LRb9OeEo${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    alt: 'Clean modern interior',
    credit: 'Photo by Nastuh Abootalebi on Unsplash',
    photographerName: 'Nastuh Abootalebi',
    photographerUrl: `https://unsplash.com/@sunday_digital${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/eHD8Y1Znfpk${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
    alt: 'Small business storefront',
    credit: 'Photo by Mike Petrucci on Unsplash',
    photographerName: 'Mike Petrucci',
    photographerUrl: `https://unsplash.com/@mikepetrucci${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/c9FQyqIECds${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
  {
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    alt: 'Business team discussion',
    credit: 'Photo by Dylan Gillis on Unsplash',
    photographerName: 'Dylan Gillis',
    photographerUrl: `https://unsplash.com/@dylandgillis${UTM_PARAMS}`,
    unsplashUrl: `https://unsplash.com/photos/KdeqA3aTnBY${UTM_PARAMS}`,
    downloadEndpoint: '',
  },
]

// ---------------------------------------------------------------------------
// Unsplash API
// ---------------------------------------------------------------------------

interface UnsplashPhoto {
  urls: { regular: string; small: string }
  alt_description: string | null
  description: string | null
  user: { name: string; links: { html: string } }
  links: { html: string; download_location: string }
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[]
}

/**
 * Parse an Unsplash API photo object into a StockImage with full attribution.
 */
function parseUnsplashPhoto(photo: UnsplashPhoto, fallbackAlt: string): StockImage {
  return {
    url: photo.urls.regular,
    alt: photo.alt_description || photo.description || fallbackAlt,
    credit: `Photo by ${photo.user.name} on Unsplash`,
    photographerName: photo.user.name,
    photographerUrl: `${photo.user.links.html}${UTM_PARAMS}`,
    unsplashUrl: `${photo.links.html}${UTM_PARAMS}`,
    downloadEndpoint: photo.links.download_location,
  }
}

async function searchUnsplash(
  query: string,
  perPage: number,
  apiKey: string,
): Promise<StockImage[]> {
  const url = new URL('https://api.unsplash.com/search/photos')
  url.searchParams.set('query', query)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('orientation', 'landscape')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${apiKey}` },
  })

  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as UnsplashSearchResponse

  return data.results.map((photo) => parseUnsplashPhoto(photo, query))
}

// ---------------------------------------------------------------------------
// Download tracking (required by Unsplash guidelines)
// ---------------------------------------------------------------------------

/**
 * Trigger Unsplash download tracking. Fire-and-forget — no await needed.
 * Must be called whenever a photo is used/displayed, per Unsplash API guidelines.
 */
export function triggerDownload(downloadEndpoint: string): void {
  if (!downloadEndpoint) return

  const apiKey = getAccessKey()
  if (!apiKey) return

  const separator = downloadEndpoint.includes('?') ? '&' : '?'
  const url = `${downloadEndpoint}${separator}client_id=${apiKey}`

  // Fire-and-forget — intentionally not awaited
  fetch(url).catch(() => {
    // Silently ignore tracking failures
  })
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Check if a URL is from Unsplash's image CDN.
 */
export function isUnsplashUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'images.unsplash.com'
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve the keyword list for a given business type string.
 * Performs a case-insensitive lookup and falls back to DEFAULT_KEYWORDS.
 */
export function getKeywordsForBusiness(businessType: string): string[] {
  const normalised = businessType.toLowerCase().trim()

  // Try exact match first
  if (KEYWORD_MAP[normalised]) return KEYWORD_MAP[normalised]

  // Try partial match (e.g. "plumbing services" should match "plumbing")
  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    if (normalised.includes(key) || key.includes(normalised)) {
      return keywords
    }
  }

  return DEFAULT_KEYWORDS
}

/**
 * Fetch stock images relevant to a business type.
 *
 * Uses the Unsplash API when UNSPLASH_ACCESS_KEY is set in the environment.
 * Falls back to hardcoded royalty-free placeholder images otherwise.
 *
 * @param businessType - e.g. "plumber", "salon", "restaurant"
 * @param count - number of images to return (default 4)
 */
export async function getStockImages(
  businessType: string,
  count: number = 4,
): Promise<StockImage[]> {
  const keywords = getKeywordsForBusiness(businessType)
  const apiKey = getAccessKey()

  if (!apiKey) {
    // No API key — return fallback images, cycling if count exceeds available
    return pickFallbacks(count)
  }

  try {
    // Search using the first keyword (most representative) and request enough
    const images = await searchUnsplash(keywords[0], count, apiKey)

    if (images.length >= count) {
      return images.slice(0, count)
    }

    // If we didn't get enough from the first keyword, try more keywords
    const collected = [...images]
    for (let i = 1; i < keywords.length && collected.length < count; i++) {
      const more = await searchUnsplash(keywords[i], count - collected.length, apiKey)
      collected.push(...more)
    }

    if (collected.length > 0) {
      return collected.slice(0, count)
    }

    // API returned nothing — fall back
    return pickFallbacks(count)
  } catch {
    // API error — fall back silently
    return pickFallbacks(count)
  }
}

/**
 * Fetch preview images for a specific template type.
 * Returns 4-6 images with full attribution data from Unsplash.
 *
 * @param templateType - one of the keys from TEMPLATE_QUERIES (e.g. "trades", "hair-beauty")
 * @param count - number of images to return (default 6)
 */
export async function getTemplatePreviewImages(
  templateType: string,
  count: number = 6,
): Promise<StockImage[]> {
  const query = TEMPLATE_QUERIES[templateType]
  if (!query) {
    return pickFallbacks(Math.min(count, 6))
  }

  const apiKey = getAccessKey()
  if (!apiKey) {
    return pickFallbacks(Math.min(count, 6))
  }

  try {
    const images = await searchUnsplash(query, count, apiKey)
    if (images.length > 0) {
      return images.slice(0, count)
    }
    return pickFallbacks(Math.min(count, 6))
  } catch {
    return pickFallbacks(Math.min(count, 6))
  }
}

/**
 * Pick N fallback images, cycling through available ones if needed.
 */
function pickFallbacks(count: number): StockImage[] {
  const result: StockImage[] = []
  for (let i = 0; i < count; i++) {
    result.push(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])
  }
  return result
}

// ---------------------------------------------------------------------------
// Note: Unsplash requires hotlinking from their CDN (no re-hosting).
// Generated static sites link directly to Unsplash URLs, which is compliant.
// R2 storage is used only for user-uploaded images, not stock images.
// ---------------------------------------------------------------------------
