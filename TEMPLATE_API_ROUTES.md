# Template API Routes Reference

## Base URL

```
https://framify-nine.vercel.app/api/templates
```

## Available Routes

### 1. Get All Templates (User Dashboard)

**GET** `/api/templates`

Get templates for a specific user (for dashboard).

**Query Parameters:**

- `userId` (optional, default: "anonymous") - Filter by user ID
- `search` (optional) - Search in title
- `style` (optional) - Filter by style: `Minimal`, `Bold`, `Soft`, `Dark`

**Example:**

```bash
GET /api/templates?userId=anonymous&style=Minimal&search=landing
```

**Response:**

```json
{
  "templates": [
    {
      "id": "clx123...",
      "title": "Landing Page Template",
      "prompt": "Create a landing page...",
      "style": "Minimal",
      "framerUrl": "https://framer.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Public Templates (Studio Store API)

**GET** `/api/templates/public`

Get public templates formatted for external consumption (studio store integration).

**Query Parameters:**

- `style` (optional) - Filter by style
- `category` (optional) - Filter by category
- `limit` (optional, default: 20) - Number of results
- `offset` (optional, default: 0) - Pagination offset
- `featured` (optional) - Filter featured templates (`true`/`false`)

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
      "title": "Landing Page Template",
      "description": "A beautiful landing page...",
      "style": "Minimal",
      "category": "landing-page",
      "tags": ["landing", "minimal"],
      "price": 29.99,
      "licenseType": "commercial",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://framer.com/...",
      "viewUrl": "https://your-domain.com/template/clx123",
      "purchaseUrl": "https://your-domain.com/template/clx123?purchase=true",
      "stats": {
        "views": 150,
        "downloads": 25,
        "sales": 10
      },
      "featured": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
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

---

### 3. Get Single Public Template

**GET** `/api/templates/[id]/public`

Get a single public template by ID.

**Example:**

```bash
GET /api/templates/clx123abc/public
```

**Response:**

```json
{
  "id": "clx123abc",
  "title": "Landing Page Template",
  "description": "...",
  "style": "Minimal",
  "category": "landing-page",
  "tags": ["landing", "minimal"],
  "price": 29.99,
  "licenseType": "commercial",
  "thumbnailUrl": "https://...",
  "previewUrl": "https://framer.com/...",
  "viewUrl": "https://your-domain.com/template/clx123abc",
  "purchaseUrl": "https://your-domain.com/template/clx123abc?purchase=true",
  "stats": {
    "views": 150,
    "downloads": 25,
    "sales": 10
  },
  "featured": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Marketplace Templates

**GET** `/api/templates/marketplace`

Get templates for marketplace page (similar to public, but different formatting).

**Query Parameters:**

- Same as `/api/templates/public`

---

### 5. Link Template Variation

**POST** `/api/templates/link-variation`

Link a template as a variation of another template.

**Body:**

```json
{
  "templateId": "clx123...",
  "baseTemplateId": "clx456..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Template linked as variation"
}
```

---

## Generate Template

### Create New Template

**POST** `/api/generate-template`

Generate a new template using AI.

**Body:**

```json
{
  "prompt": "Create a landing page for a SaaS product",
  "style": "Minimal",
  "baseTemplateId": "clx456..." // optional
}
```

**Response:**

```json
{
  "id": "clx789...",
  "title": "SaaS Landing Page Template",
  "code": "import { motion } from 'framer-motion'...",
  "style": "Minimal",
  "framerUrl": "https://framer.com/...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Usage Examples

### Fetch user templates

```javascript
const response = await fetch("/api/templates?userId=anonymous&style=Minimal");
const data = await response.json();
console.log(data.templates);
```

### Fetch public templates for store

```javascript
const response = await fetch("/api/templates/public?limit=20&featured=true");
const data = await response.json();
console.log(data.templates);
console.log(data.pagination);
```

### Generate template

```javascript
const response = await fetch("/api/generate-template", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Create a portfolio website",
    style: "Bold",
  }),
});
const template = await response.json();
```

---

## CORS & Authentication

- **Public routes** (`/public`) - No authentication required
- **User routes** (`/api/templates`) - Currently uses `userId` query param (will need auth later)
- **Generate routes** - No authentication (will need auth later)

---

## Response Status Codes

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `500` - Server Error

---

## Notes

- All dates are in ISO 8601 format
- Public API only returns templates where `isPublic: true`
- Code is NOT included in public API responses (for security)
- Use `/api/templates/public` for studio store integration
- Use `/api/templates` for internal dashboard
