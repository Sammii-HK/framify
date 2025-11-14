# CORS Configuration

## Current Status

✅ **CORS is now enabled** for public API endpoints:
- `/api/templates/public` - Public templates list
- `/api/templates/[id]/public` - Single public template

## Allowed Origins

Currently configured to allow:
- `https://framify-nine.vercel.app` (your production domain)
- `http://localhost:3000` (local development)

## Adding More Domains

To allow additional domains (e.g., your studio store), edit `lib/cors.ts`:

```typescript
const ALLOWED_ORIGINS = [
  'https://framify-nine.vercel.app',
  'http://localhost:3000',
  'https://your-studio-store.com', // Add your domains here
  'https://another-domain.com',
]
```

## Security Notes

✅ **Whitelist Only** - Only explicitly allowed origins can access your API
✅ **Public Endpoints Only** - CORS is only enabled for public template endpoints
✅ **No Sensitive Data** - Public endpoints don't expose code or user data

## CORS Headers Set

- `Access-Control-Allow-Origin`: Your domain or allowed origin
- `Access-Control-Allow-Methods`: `GET, OPTIONS`
- `Access-Control-Allow-Headers`: `Content-Type, Authorization`
- `Access-Control-Max-Age`: `86400` (24 hours)

## Testing CORS

### From Browser Console:
```javascript
fetch('https://framify-nine.vercel.app/api/templates/public')
  .then(r => r.json())
  .then(console.log)
```

### From cURL:
```bash
curl -H "Origin: https://your-domain.com" \
  https://framify-nine.vercel.app/api/templates/public
```

### Check Headers:
```bash
curl -I -X OPTIONS \
  -H "Origin: https://your-domain.com" \
  https://framify-nine.vercel.app/api/templates/public
```

## Protected Endpoints

**No CORS** on these endpoints (require same-origin):
- `/api/generate-template` - Requires authentication
- `/api/templates` - User-specific templates
- `/api/admin/*` - Admin endpoints
- `/api/framer-upload` - Requires authentication

These endpoints should only be called from your own domain.

## Environment Variables

No additional env vars needed for CORS. The allowed origins are hardcoded in `lib/cors.ts` for security.

## Production Checklist

- [x] CORS enabled for public endpoints
- [x] Only whitelisted origins allowed
- [x] Protected endpoints remain same-origin only
- [ ] Add your studio store domain to `ALLOWED_ORIGINS` when ready



