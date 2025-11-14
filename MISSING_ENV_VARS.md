# Missing Environment Variables

## What You Have ✅
- `APP_BASE_URL` ✅
- `AUTH0_DOMAIN` ✅  
- `AUTH0_CLIENT_ID` ✅
- `AUTH0_CLIENT_SECRET` ✅

## What's Missing ❌

### 1. AUTH0_SECRET (CRITICAL - Missing!)
This is required for session encryption. Generate it with:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

**Add to Vercel:**
- Name: `AUTH0_SECRET`
- Value: `<paste-generated-secret>`
- Environment: Production (and Preview/Development if needed)

### 2. Wrong Variable Names

The `@auth0/nextjs-auth0` SDK v4.x expects these exact names:

**You have:** `APP_BASE_URL`  
**SDK expects:** `AUTH0_BASE_URL`

**You have:** `AUTH0_DOMAIN`  
**SDK expects:** `AUTH0_ISSUER_BASE_URL` (and it must include `https://` prefix!)

## Quick Fix Options

### Option 1: Add Missing + Rename Variables (Recommended)

In Vercel, add/update these:

1. **Add AUTH0_SECRET:**
   ```
   Name: AUTH0_SECRET
   Value: <generate with: openssl rand -base64 32>
   ```

2. **Add AUTH0_BASE_URL** (copy value from APP_BASE_URL):
   ```
   Name: AUTH0_BASE_URL
   Value: <same value as APP_BASE_URL>
   ```

3. **Add AUTH0_ISSUER_BASE_URL** (update AUTH0_DOMAIN value):
   ```
   Name: AUTH0_ISSUER_BASE_URL
   Value: https://<your-auth0-domain>.auth0.com
   ```
   ⚠️ **Important:** Must include `https://` prefix!
   ⚠️ **Important:** Use your PRODUCTION Auth0 domain (not dev one!)

4. **Keep existing:**
   - `AUTH0_CLIENT_ID` ✅
   - `AUTH0_CLIENT_SECRET` ✅

### Option 2: Update Code to Support Your Variable Names

I can update the code to read from `APP_BASE_URL` and `AUTH0_DOMAIN` instead, but you still need to add `AUTH0_SECRET`.

## Current Issue

Your error shows:
```
issuer=https://dev-lji2ti0xxkebshe2.auth0.com/
status: 404
```

This means:
1. The SDK is reading `AUTH0_DOMAIN` but expects `AUTH0_ISSUER_BASE_URL`
2. The domain `dev-lji2ti0xxkebshe2.auth0.com` returns 404 - this might be a dev/test domain that doesn't exist in production
3. Missing `AUTH0_SECRET` will cause session encryption to fail

## Action Items

1. ✅ Generate `AUTH0_SECRET` and add to Vercel
2. ✅ Add `AUTH0_BASE_URL` (copy from `APP_BASE_URL`)
3. ✅ Add `AUTH0_ISSUER_BASE_URL` with `https://` prefix and your production Auth0 domain
4. ⚠️ Verify your Auth0 domain is correct (not a dev/test domain)
