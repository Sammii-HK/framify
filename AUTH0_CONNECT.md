# Connect Auth0 to Framify App

## Your Auth0 Client ID
```
oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
```

## Step 1: Get Your Auth0 Credentials

You need these from Auth0 Dashboard:
1. **Client ID**: `oFVm4vy2hNm53uMeeUaUH88WHfElHJrV` ✅ (you have this)
2. **Client Secret**: Get from Auth0 Dashboard → Applications → framify → Settings
3. **Domain**: `dev-lji2ti0xxkebshe2.auth0.com` (from your Auth0 URL)

## Step 2: Generate AUTH0_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -hex 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Generated Secret**: `ArlGyVRSXH/o4WucpZGJj7rlnHCyE7FqJV80zElBlzM=` (or generate new one)

## Step 3: Local Development (.env.local)

Create `.env.local` in your project root:

```bash
# Auth0 Configuration (v4 SDK uses different env var names)
AUTH0_SECRET=<paste-generated-secret-here>
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<get-from-auth0-dashboard>

# Database (if not already set)
DATABASE_URL=postgresql://...

# OpenAI (required)
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Production (Vercel)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these for **Production** environment:

```bash
AUTH0_SECRET=<same-secret-as-local-or-different>
APP_BASE_URL=https://framify-nine.vercel.app
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<get-from-auth0-dashboard>
```

## Step 5: Update Auth0 Dashboard Settings

In Auth0 Dashboard → Applications → framify → Settings:

### Allowed Callback URLs:
```
https://framify-nine.vercel.app/auth/callback,http://localhost:3000/auth/callback
```

### Allowed Logout URLs:
```
https://framify-nine.vercel.app,http://localhost:3000
```

### Allowed Web Origins:
```
https://framify-nine.vercel.app,http://localhost:3000
```

**Note**: Auth0 SDK v4 uses `/auth/callback` (not `/api/auth/callback`)

## Step 6: Test

### Local:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000`
3. Click "Login"
4. Should redirect to Auth0 login

### Production:
1. Deploy to Vercel
2. Visit: `https://framify-nine.vercel.app`
3. Click "Login"
4. Should redirect to Auth0 login

## Quick Setup Commands

```bash
# 1. Generate secret
openssl rand -base64 32

# 2. Create .env.local (copy template above and fill in values)

# 3. Test locally
npm run dev

# 4. Deploy to Vercel (after adding env vars)
git push
```

## Troubleshooting

### "Invalid client" error
- Check Client ID is correct: `oFVm4vy2hNm53uMeeUaUH88WHfElHJrV`
- Verify Client Secret matches Auth0 dashboard

### "Redirect URI mismatch"
- Check callback URLs in Auth0 dashboard match exactly
- Include both production and localhost URLs

### "Invalid state" error
- Make sure `AUTH0_SECRET` is set correctly
- Use same secret for local and production (or different, but consistent)

## Your Auth0 Domain

Based on your Auth0 URL, your domain is:
```
https://dev-lji2ti0xxkebshe2.auth0.com
```

Use this for `AUTH0_ISSUER_BASE_URL`.

