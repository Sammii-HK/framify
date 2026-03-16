/**
 * CMS Collection Templates
 *
 * Generates Framer CMS-ready data structures and collection components.
 * These get injected into the AI prompt so generated templates
 * include proper CMS integration patterns.
 */

export interface CMSField {
  name: string
  type: 'text' | 'richtext' | 'image' | 'date' | 'number' | 'boolean' | 'enum' | 'link'
  required: boolean
  description: string
}

export interface CMSCollection {
  name: string
  slug: string
  description: string
  fields: CMSField[]
  sampleData: Record<string, unknown>[]
}

// ---------------------------------------------------------------------------
// Standard CMS collections for different template types
// ---------------------------------------------------------------------------

export const CMS_COLLECTIONS: Record<string, CMSCollection[]> = {
  // Blog collections (used by most templates)
  blog: [
    {
      name: 'Blog Posts',
      slug: 'blog-posts',
      description: 'Articles and blog content',
      fields: [
        { name: 'title', type: 'text', required: true, description: 'Post title' },
        { name: 'slug', type: 'text', required: true, description: 'URL slug' },
        { name: 'excerpt', type: 'text', required: true, description: '1-2 sentence summary' },
        { name: 'content', type: 'richtext', required: true, description: 'Full article body' },
        { name: 'coverImage', type: 'image', required: true, description: 'Hero image (16:9)' },
        { name: 'author', type: 'text', required: true, description: 'Author name' },
        { name: 'authorImage', type: 'image', required: false, description: 'Author avatar (1:1)' },
        { name: 'category', type: 'enum', required: true, description: 'Post category' },
        { name: 'publishedAt', type: 'date', required: true, description: 'Publication date' },
        { name: 'readingTime', type: 'number', required: false, description: 'Minutes to read' },
        { name: 'featured', type: 'boolean', required: false, description: 'Show as featured post' },
      ],
      sampleData: [
        {
          title: 'Understanding Your Birth Chart',
          slug: 'understanding-birth-chart',
          excerpt: 'A beginner-friendly guide to reading the cosmic blueprint of your soul.',
          author: 'Luna Starweaver',
          category: 'Guides',
          publishedAt: '2026-03-10',
          readingTime: 8,
          featured: true,
        },
        {
          title: 'Full Moon Rituals for Release',
          slug: 'full-moon-rituals',
          excerpt: 'Harness the energy of the full moon to let go of what no longer serves you.',
          author: 'Luna Starweaver',
          category: 'Rituals',
          publishedAt: '2026-03-05',
          readingTime: 5,
          featured: false,
        },
        {
          title: 'Crystal Cleansing Methods',
          slug: 'crystal-cleansing',
          excerpt: 'The complete guide to purifying and recharging your crystal collection.',
          author: 'Sage Moon',
          category: 'Crystals',
          publishedAt: '2026-02-28',
          readingTime: 6,
          featured: false,
        },
      ],
    },
  ],

  // Testimonials collection
  testimonials: [
    {
      name: 'Testimonials',
      slug: 'testimonials',
      description: 'Client reviews and testimonials',
      fields: [
        { name: 'quote', type: 'text', required: true, description: '2-3 sentence testimonial' },
        { name: 'name', type: 'text', required: true, description: 'Client name' },
        { name: 'role', type: 'text', required: true, description: 'Client role or title' },
        { name: 'company', type: 'text', required: false, description: 'Company or business' },
        { name: 'avatar', type: 'image', required: false, description: 'Client photo (1:1)' },
        { name: 'rating', type: 'number', required: false, description: 'Star rating (1-5)' },
      ],
      sampleData: [
        {
          quote: 'This reading completely shifted my perspective. I finally understand my life path and feel aligned with my purpose.',
          name: 'Sarah M.',
          role: 'Life Coach',
          rating: 5,
        },
        {
          quote: 'The most beautiful and intuitive experience. Every detail feels intentional and the guidance was transformative.',
          name: 'James K.',
          role: 'Yoga Instructor',
          rating: 5,
        },
        {
          quote: 'I have tried many services but nothing compares. The depth of insight and care is extraordinary.',
          name: 'Aria L.',
          role: 'Wellness Entrepreneur',
          rating: 5,
        },
      ],
    },
  ],

  // Team/instructor collection
  team: [
    {
      name: 'Team Members',
      slug: 'team',
      description: 'Team or instructor profiles',
      fields: [
        { name: 'name', type: 'text', required: true, description: 'Full name' },
        { name: 'role', type: 'text', required: true, description: 'Job title or specialty' },
        { name: 'bio', type: 'text', required: true, description: '2-3 sentence biography' },
        { name: 'photo', type: 'image', required: true, description: 'Portrait photo (3:4)' },
        { name: 'specialties', type: 'text', required: false, description: 'Comma-separated specialties' },
        { name: 'socialLink', type: 'link', required: false, description: 'Instagram or website URL' },
      ],
      sampleData: [
        {
          name: 'Luna Starweaver',
          role: 'Lead Astrologer',
          bio: 'With over 15 years of practice, Luna specialises in natal chart readings and transit forecasting.',
          specialties: 'Natal Charts, Transits, Synastry',
        },
        {
          name: 'Sage Moon',
          role: 'Crystal Healer',
          bio: 'Sage brings ancient crystal wisdom into modern healing practices, combining geology with intuition.',
          specialties: 'Crystal Grids, Chakra Work, Reiki',
        },
      ],
    },
  ],

  // Services/offerings collection
  services: [
    {
      name: 'Services',
      slug: 'services',
      description: 'Business offerings and services',
      fields: [
        { name: 'title', type: 'text', required: true, description: 'Service name' },
        { name: 'description', type: 'text', required: true, description: '2-3 sentence description' },
        { name: 'price', type: 'text', required: false, description: 'Price or price range' },
        { name: 'duration', type: 'text', required: false, description: 'Session duration' },
        { name: 'icon', type: 'text', required: false, description: 'Emoji or icon name' },
        { name: 'image', type: 'image', required: false, description: 'Service image (16:9)' },
        { name: 'featured', type: 'boolean', required: false, description: 'Highlight on homepage' },
        { name: 'bookingLink', type: 'link', required: false, description: 'Booking URL' },
      ],
      sampleData: [
        {
          title: 'Birth Chart Reading',
          description: 'A comprehensive analysis of your natal chart, revealing your cosmic blueprint and life themes.',
          price: 'From £75',
          duration: '60 minutes',
          icon: '✦',
          featured: true,
        },
        {
          title: 'Tarot Guidance Session',
          description: 'An intuitive tarot reading to illuminate your current path and help you navigate decisions ahead.',
          price: 'From £45',
          duration: '45 minutes',
          icon: '☽',
          featured: true,
        },
        {
          title: 'Crystal Healing',
          description: 'A deeply relaxing session using crystals to balance your energy centres and release blockages.',
          price: 'From £60',
          duration: '60 minutes',
          icon: '◇',
          featured: false,
        },
      ],
    },
  ],

  // Products collection (for crystal shops / e-commerce)
  products: [
    {
      name: 'Products',
      slug: 'products',
      description: 'Physical or digital products for sale',
      fields: [
        { name: 'name', type: 'text', required: true, description: 'Product name' },
        { name: 'description', type: 'text', required: true, description: 'Product description' },
        { name: 'price', type: 'number', required: true, description: 'Price in GBP' },
        { name: 'image', type: 'image', required: true, description: 'Product image (1:1)' },
        { name: 'category', type: 'enum', required: true, description: 'Product category' },
        { name: 'inStock', type: 'boolean', required: true, description: 'Availability' },
        { name: 'featured', type: 'boolean', required: false, description: 'Show on homepage' },
        { name: 'shopLink', type: 'link', required: false, description: 'External shop URL' },
      ],
      sampleData: [
        {
          name: 'Rose Quartz Tower',
          description: 'A beautiful polished rose quartz tower, ethically sourced from Madagascar. Perfect for heart chakra work.',
          price: 24.99,
          category: 'Crystals',
          inStock: true,
          featured: true,
        },
        {
          name: 'Amethyst Cluster',
          description: 'Stunning natural amethyst cluster with deep purple colouring. Ideal for meditation and intuition.',
          price: 34.99,
          category: 'Crystals',
          inStock: true,
          featured: true,
        },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Get CMS collections for a specific template category
// ---------------------------------------------------------------------------
export function getCMSCollectionsForCategory(category: string): CMSCollection[] {
  const collections: CMSCollection[] = []

  // All templates get blog + testimonials
  collections.push(...CMS_COLLECTIONS.blog)
  collections.push(...CMS_COLLECTIONS.testimonials)

  // Category-specific collections
  if (
    category === 'spiritual' ||
    category === 'wellness' ||
    category === 'agency'
  ) {
    collections.push(...CMS_COLLECTIONS.services)
    collections.push(...CMS_COLLECTIONS.team)
  }

  if (category === 'metaphysical-shop' || category === 'e-commerce') {
    collections.push(...CMS_COLLECTIONS.products)
  }

  return collections
}

// ---------------------------------------------------------------------------
// Generate CMS prompt block for AI
// ---------------------------------------------------------------------------
export function getCMSPromptBlock(category: string): string {
  const collections = getCMSCollectionsForCategory(category)

  if (collections.length === 0) return ''

  let prompt = `
CMS COLLECTIONS (build these as typed data arrays in the component):

`

  for (const collection of collections) {
    prompt += `### ${collection.name} (${collection.slug})
${collection.description}

Fields:
${collection.fields.map((f) => `- ${f.name}: ${f.type}${f.required ? ' (required)' : ''} — ${f.description}`).join('\n')}

Sample data (use this EXACT data in your component):
\`\`\`typescript
const ${collection.slug.replace(/-/g, '_')} = ${JSON.stringify(collection.sampleData, null, 2)}
\`\`\`

`
  }

  prompt += `
IMPORTANT CMS RULES:
- Define ALL data as typed arrays at the top of the component (before the return)
- Use TypeScript interfaces for each collection
- Use .map() with proper keys to render collection items
- Use optional chaining on all property access
- Include enough sample data to fill the layout (minimum 3 items per collection)
- Structure data so it can be easily replaced by a headless CMS (Contentful, Sanity, Notion API)
`

  return prompt
}
