# Production Auth0 Login Fix

## Issue

Production login is failing with a 404 error when trying to access the Auth0 discovery endpoint:

```
issuer=https://dev-lji2ti0xxkebshe2.auth0.com/
error: [ye: "response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)]
status: 404
```

## Root Cause

1. **Missing Auth0 API Route Handler**: The `/api/auth/[...auth0]/route.ts` file was missing, which is required by `@auth0/nextjs-auth0` SDK v4.x
2. **Incorrect Route References**: Code was using `/auth/login` instead of `/api/auth/login`
3. **Wrong Auth0 Domain**: Production environment is using a dev Auth0 domain (`dev-lji2ti0xxkebshe2.auth0.com`) which returns 404

## Fixes Applied

### ✅ 1. Created Auth0 API Route Handler
- Created `/app/api/auth/[...auth0]/route.ts` with `handleAuth()` from the SDK
- This handles all Auth0 routes: `/api/auth/login`, `/api/auth/callback`, `/api/auth/logout`, etc.

### ✅ 2. Updated All Route References
Updated all references from `/auth/*` to `/api/auth/*`:
- `/app/login/page.tsx` - Login links
- `/components/Navigation.tsx` - Login/Logout links
- `/components/PromptForm.tsx` - 401 redirect
- `/app/dashboard/page.tsx` - Auth redirects
- `/app/admin/page.tsx` - Auth redirects

### ✅ 3. Updated Auth0 Configuration Documentation
- Updated `/lib/auth0.ts` comments to reflect correct environment variable names for SDK v4.x

## Required Production Environment Variables

You **MUST** set these in your Vercel production environment:

```bash
# Required: Session encryption secret (generate with: openssl rand -base64 32)
AUTH0_SECRET=<your-random-secret>

# Required: Your app's base URL
AUTH0_BASE_URL=https://your-production-domain.vercel.app

# Required: Your Auth0 tenant domain (with https://)
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# Required: Auth0 application credentials
AUTH0_CLIENT_ID=<your-client-id>
AUTH0_CLIENT_SECRET=<your-client-secret>
```

## Critical: Fix Your Auth0 Domain

The error shows production is trying to use `dev-lji2ti0xxkebshe2.auth0.com`, which returns 404. You need to:

1. **Check your Auth0 tenant**: Verify your production Auth0 tenant domain exists
2. **Update Vercel environment variables**: Set `AUTH0_ISSUER_BASE_URL` to your **production** Auth0 domain (not the dev one)
3. **Format**: Must include `https://` prefix (e.g., `https://your-tenant.auth0.com`)

## Auth0 Dashboard Configuration

Make sure your Auth0 application has these URLs configured:

**Allowed Callback URLs:**
```
https://your-production-domain.vercel.app/api/auth/callback
```

**Allowed Logout URLs:**
```
https://your-production-domain.vercel.app
```

**Allowed Web Origins:**
```
https://your-production-domain.vercel.app
```

## Testing

After deploying these fixes and updating environment variables:

1. Visit your production site
2. Click "Login"
3. Should redirect to Auth0 login page (not 404)
4. After login, should redirect back to your app

## Next Steps

1. ✅ Code fixes are complete (route handler + route updates)
2. ⚠️ **YOU MUST**: Update Vercel production environment variables with correct Auth0 domain
3. ⚠️ **YOU MUST**: Verify Auth0 dashboard URLs match your production domain
4. Deploy and test

## Troubleshooting

If still getting 404:
- Check Vercel environment variables are set correctly
- Verify `AUTH0_ISSUER_BASE_URL` includes `https://` prefix
- Verify Auth0 tenant domain exists and is accessible
- Check Auth0 dashboard callback URLs match exactly
- Clear browser cookies and try again
