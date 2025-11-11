# Studio Store API Integration

## API Endpoints for Your Studio Store

### 1. List All Public Templates

**Endpoint:** `GET /api/templates/public`

**Query Parameters:**
- `style` - Filter by style (Minimal, Bold, Soft, Dark)
- `category` - Filter by category
- `featured` - Only featured templates (`true`)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset (default: 0)

**Example:**
```bash
GET /api/templates/public?style=Minimal&limit=10&featured=true
```

**Response:**
```json
{
  "templates": [
    {
      "id": "clx123...",
      "title": "Minimal Landing Page Template",
      "description": "A clean, minimalist landing page...",
      "style": "Minimal",
      "category": "landing-page",
      "tags": ["minimal", "landing-page", "modern"],
      "price": 19.99,
      "licenseType": "commercial",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://framer.com/projects/...",
      "viewUrl": "https://framify.com/template/clx123",
      "stats": {
        "views": 150,
        "downloads": 45,
        "sales": 12
      },
      "featured": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### 2. Get Single Template

**Endpoint:** `GET /api/templates/[id]/public`

**Example:**
```bash
GET /api/templates/clx123/public
```

**Response:**
```json
{
  "id": "clx123",
  "title": "Minimal Landing Page Template",
  "description": "Full description...",
  "style": "Minimal",
  "category": "landing-page",
  "tags": ["minimal", "landing-page"],
  "price": 19.99,
  "licenseType": "commercial",
  "thumbnailUrl": "https://...",
  "previewUrl": "https://framer.com/projects/...",
  "viewUrl": "https://framify.com/template/clx123",
  "purchaseUrl": "https://framify.com/template/clx123?purchase=true",
  "stats": {
    "views": 150,
    "downloads": 45,
    "sales": 12
  },
  "featured": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Integration Examples

### React/Next.js Store

```typescript
// Fetch templates for your store
const response = await fetch('https://framify.com/api/templates/public?featured=true')
const { templates } = await response.json()

// Display in your store
templates.map(template => (
  <ProductCard
    key={template.id}
    title={template.title}
    price={template.price}
    preview={template.previewUrl}
    purchaseUrl={template.purchaseUrl}
  />
))
```

### WordPress Store

```php
// Fetch templates
$response = wp_remote_get('https://framify.com/api/templates/public?limit=12');
$data = json_decode(wp_remote_retrieve_body($response));

// Display products
foreach ($data->templates as $template) {
    echo '<div class="product">';
    echo '<h3>' . $template->title . '</h3>';
    echo '<p>$' . $template->price . '</p>';
    echo '<a href="' . $template->purchaseUrl . '">Buy Now</a>';
    echo '</div>';
}
```

### Static Site (HTML/JS)

```javascript
fetch('https://framify.com/api/templates/public')
  .then(res => res.json())
  .then(data => {
    data.templates.forEach(template => {
      // Render product card
      document.getElementById('products').innerHTML += `
        <div class="product-card">
          <h3>${template.title}</h3>
          <p>$${template.price}</p>
          <a href="${template.purchaseUrl}">Buy Now</a>
        </div>
      `
    })
  })
```

## What's Included in API Response

✅ **Product Info:**
- Title, description
- Style, category, tags
- Price, license type
- Thumbnail URL

✅ **Preview Links:**
- Framer preview URL (if auto-published)
- View URL (your site)
- Purchase URL (your site)

✅ **Stats:**
- Views, downloads, sales
- Featured status

❌ **Not Included (Protected):**
- Full code (requires purchase)
- User IDs
- Internal data

## Auto-Publish to Framer - What Gets Sent?

When `AUTO_PUBLISH_TO_FRAMER=true`:

**Currently Sends:**
- ✅ Template name/title
- ✅ Full code
- ✅ Component type
- ✅ Description (just added)
- ✅ Tags (just added)

**What Framer Receives:**
- Code component in your project
- Can be used immediately
- Can be shared/published

**What's Missing for Full Product Info:**
- ❌ Price (Framer doesn't support pricing via API)
- ❌ Thumbnail/preview image
- ❌ Full product description
- ❌ License information

**Solution:**
- Framer component = code only
- Your API = full product info
- Link Framer preview to your store page

## Recommended Setup

### Option 1: Your Site as Primary Store
1. Host templates on framify.com
2. Auto-publish code to Framer
3. Link Framer preview → your store page
4. Process purchases on your site
5. Customer gets code + license

### Option 2: Framer Marketplace + Your API
1. List on Framer Marketplace manually
2. Use your API to sync product info
3. Drive traffic from Framer → your site
4. Process purchases on your site

### Option 3: Both (Recommended)
1. Your site = primary store (100% revenue)
2. Framer = preview/demo (drive traffic)
3. API = sync data between both
4. Maximum exposure + revenue

## CORS Setup (if needed)

If calling from external domain, add CORS headers:

```typescript
// In your API routes
export async function GET(req: NextRequest) {
  // ... your code ...
  
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*', // Or specific domain
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}
```

## Authentication (Optional)

For private API access:

```typescript
// Add API key check
const apiKey = req.headers.get('x-api-key')
if (apiKey !== process.env.STUDIO_STORE_API_KEY) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

