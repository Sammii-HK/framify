# Auth0 Setup Guide for Framify

## Quick Setup Steps

### 1. In Auth0 Dashboard

**Enable Authentication Methods:**
- ✅ **Username-Password-Authentication** (Database) - Toggle ON
- ✅ **Social Logins** (Optional):
  - Google
  - GitHub
  - Apple (if needed)

**Configure URLs (Production):**
```
Allowed Callback URLs:
https://framify-nine.vercel.app/api/auth/callback

Allowed Logout URLs:
https://framify-nine.vercel.app

Allowed Web Origins:
https://framify-nine.vercel.app
```

**For Local Development (add both):**
```
Allowed Callback URLs:
https://framify-nine.vercel.app/api/auth/callback,http://localhost:3000/api/auth/callback

Allowed Logout URLs:
https://framify-nine.vercel.app,http://localhost:3000

Allowed Web Origins:
https://framify-nine.vercel.app,http://localhost:3000
```

### 2. Copy Credentials

After setup, copy:
- **Domain**: `dev-lji2ti0xxkebshe2.auth0.com` (from your URL)
- **Client ID**: From Auth0 dashboard
- **Client Secret**: From Auth0 dashboard

### 3. Add to Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

**Production Environment:**
```bash
AUTH0_SECRET=<generate-random-secret-below>
AUTH0_BASE_URL=https://framify-nine.vercel.app
AUTH0_ISSUER_BASE_URL=https://dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=<your_client_id>
AUTH0_CLIENT_SECRET=<your_client_secret>
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Optional: Add Local Development Variables

If you want to test locally, add to `.env.local`:

```bash
AUTH0_SECRET=<same-as-production-or-different>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=<same-as-production>
AUTH0_CLIENT_SECRET=<same-as-production>
```

## Why Production URLs?

✅ **Production URLs work everywhere:**
- Works in production
- Works locally (if you add localhost to Auth0 allowed URLs)
- No need to change env vars between environments

✅ **Single configuration:**
- Set once in Vercel
- Use same credentials for all environments
- Just add localhost to Auth0 allowed URLs list

## Next Steps

After Auth0 is configured:

1. ✅ Add environment variables to Vercel
2. ✅ Install Auth0 Next.js SDK (if not already)
3. ✅ Set up auth routes in your Next.js app
4. ✅ Test login flow

## Note

Currently, Framify doesn't have Auth0 integration yet. You're setting it up for future use. Once configured, you can integrate it into your app.



