# Auth0 Login Error Troubleshooting

## Common Error: "An error occurred while trying to initiate the login request"

### Check 1: Environment Variables

Make sure these are set correctly:

**Local (.env.local):**
```bash
AUTH0_SECRET=<your-secret>
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<your-client-secret>
```

**Production (Vercel):**
```bash
AUTH0_SECRET=<your-secret>
APP_BASE_URL=https://framify-nine.vercel.app
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<your-client-secret>
```

### Check 2: Auth0 Dashboard URLs

Go to: https://manage.auth0.com → Applications → framify → Settings

**Allowed Callback URLs:**
```
https://framify-nine.vercel.app/auth/callback,http://localhost:3000/auth/callback
```

**Allowed Logout URLs:**
```
https://framify-nine.vercel.app,http://localhost:3000
```

**Allowed Web Origins:**
```
https://framify-nine.vercel.app,http://localhost:3000
```

⚠️ **Important:** Auth0 SDK v4 uses `/auth/callback` (NOT `/api/auth/callback`)

### Check 3: Domain Format

The `AUTH0_DOMAIN` should be:
- ✅ `dev-lji2ti0xxkebshe2.auth0.com` (correct)
- ❌ `https://dev-lji2ti0xxkebshe2.auth0.com` (wrong - no protocol)
- ❌ `dev-lji2ti0xxkebshe2.auth0.com/` (wrong - no trailing slash)

### Check 4: Verify Environment Variables

**Local:**
```bash
# Check if variables are loaded
npm run dev
# Check browser console and server logs for errors
```

**Production:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Make sure all 5 Auth0 variables are set
- Make sure they're set for **Production** environment
- Redeploy after adding/changing variables

### Check 5: Browser Console Errors

Open browser DevTools (F12) → Console tab
- Look for any Auth0-related errors
- Check Network tab for failed requests to `/auth/login`

### Check 6: Server Logs

**Local:**
```bash
npm run dev
# Watch terminal for errors
```

**Production:**
- Go to Vercel Dashboard → Your Project → Logs
- Look for Auth0-related errors

## Quick Fix Checklist

- [ ] All 5 Auth0 environment variables are set
- [ ] `AUTH0_DOMAIN` has no protocol or trailing slash
- [ ] Callback URLs in Auth0 Dashboard include `/auth/callback`
- [ ] Both production and localhost URLs are in Auth0 Dashboard
- [ ] Vercel environment variables are set for Production
- [ ] Redeployed after changing environment variables

## Still Not Working?

1. **Clear browser cache and cookies**
2. **Try incognito/private window**
3. **Check Auth0 Dashboard → Applications → framify → Logs** for errors
4. **Verify Client Secret is correct** (copy fresh from Auth0 Dashboard)

## Test Login Flow

1. Visit: `http://localhost:3000` (or production URL)
2. Click "Login" button
3. Should redirect to: `https://dev-lji2ti0xxkebshe2.auth0.com/authorize?...`
4. After login, should redirect back to your app

If step 3 fails → Environment variables issue
If step 4 fails → Callback URL mismatch
