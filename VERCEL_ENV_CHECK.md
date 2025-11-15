# Vercel Environment Variables Checklist

## Required Environment Variables for Production

Make sure ALL of these are set in Vercel:

1. **AUTH0_SECRET** - Random secret (32+ characters)
2. **APP_BASE_URL** - `https://framify-nine.vercel.app`
3. **AUTH0_DOMAIN** - `dev-lji2ti0xxkebshe2.auth0.com` (NO protocol, NO trailing slash)
4. **AUTH0_CLIENT_ID** - `oFVm4vy2hNm53uMeeUaUH88WHfElHJrV`
5. **AUTH0_CLIENT_SECRET** - Get from Auth0 Dashboard

## How to Check in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **framify** project
3. Go to **Settings** → **Environment Variables**
4. Make sure all 5 variables above are listed
5. Make sure they're set for **Production** environment (not just Preview/Development)

## Common Issues

### Issue: HTTP 500 Error on Login

**Cause:** Missing or incorrect environment variables

**Fix:**
1. Check all 5 variables are set in Vercel
2. Make sure `AUTH0_DOMAIN` is exactly: `dev-lji2ti0xxkebshe2.auth0.com`
   - ❌ Wrong: `https://dev-lji2ti0xxkebshe2.auth0.com`
   - ❌ Wrong: `dev-lji2ti0xxkebshe2.auth0.com/`
   - ✅ Correct: `dev-lji2ti0xxkebshe2.auth0.com`
3. Redeploy after adding/changing variables

### Issue: "Invalid client" error

**Cause:** Wrong Client ID or Client Secret

**Fix:**
1. Go to Auth0 Dashboard → Applications → framify → Settings
2. Copy Client ID and Client Secret fresh
3. Update in Vercel
4. Redeploy

### Issue: "Redirect URI mismatch"

**Cause:** Callback URLs not set in Auth0 Dashboard

**Fix:**
1. Go to Auth0 Dashboard → Applications → framify → Settings
2. Add to **Allowed Callback URLs:**
   ```
   https://framify-nine.vercel.app/auth/callback
   ```
3. Add to **Allowed Logout URLs:**
   ```
   https://framify-nine.vercel.app
   ```
4. Add to **Allowed Web Origins:**
   ```
   https://framify-nine.vercel.app
   ```

## Quick Test

After setting variables and redeploying:

1. Visit: `https://framify-nine.vercel.app`
2. Click "Login"
3. Should redirect to Auth0 login page
4. After login, should redirect back to your app

If step 3 fails → Environment variables issue
If step 4 fails → Callback URL mismatch

## Verify Variables Are Loaded

Add this temporarily to see if vars are loaded (remove after debugging):

```typescript
// In lib/auth0.ts (temporary)
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN)
console.log('APP_BASE_URL:', process.env.APP_BASE_URL)
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'SET' : 'MISSING')
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'MISSING')
```

Check Vercel logs to see these values.

