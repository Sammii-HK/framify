# Auth0 Login Error Troubleshooting

## Error: "An error occurred while trying to initiate the login request"

This usually means Auth0 environment variables are missing or incorrect.

## Quick Fix Checklist

### 1. Check Environment Variables

Make sure these are set in **both** `.env.local` (local) and **Vercel** (production):

```bash
AUTH0_SECRET=<your-secret>
APP_BASE_URL=http://localhost:3000  # or https://framify-nine.vercel.app for prod
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com  # NO https://, NO trailing slash
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<your-client-secret>
```

### 2. Verify Auth0 Domain Format

✅ **Correct:**
```
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
```

❌ **Wrong:**
```
AUTH0_DOMAIN=https://dev-lji2ti0xxkebshe2.auth0.com
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com/
```

### 3. Check Auth0 Dashboard URLs

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

### 4. Restart Dev Server

After changing `.env.local`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 5. Check Browser Console

Open browser DevTools → Console tab. Look for:
- Auth0 errors
- Network errors to `/auth/login`
- CORS errors

### 6. Check Server Logs

Look at terminal where `npm run dev` is running for:
- Auth0 initialization errors
- Missing environment variable warnings
- Middleware errors

## Common Issues

### Issue: Domain has protocol or trailing slash
**Fix:** Remove `https://` and trailing `/` from `AUTH0_DOMAIN`

### Issue: Missing AUTH0_SECRET
**Fix:** Generate one: `openssl rand -hex 32`

### Issue: Wrong APP_BASE_URL
**Fix:** Use exact URL (http://localhost:3000 for local, https://framify-nine.vercel.app for prod)

### Issue: Callback URL mismatch
**Fix:** Make sure Auth0 Dashboard URLs match exactly (including `/auth/callback` not `/api/auth/callback`)

## Test

1. Visit: `http://localhost:3000`
2. Click "Login"
3. Should redirect to Auth0 login page
4. After login, should redirect back to your app

## Still Not Working?

1. Check Vercel environment variables match `.env.local`
2. Verify Auth0 app is "Regular Web Application" type
3. Check Auth0 app is not disabled
4. Try clearing browser cookies/localStorage
5. Check Auth0 Status page: https://status.auth0.com/

