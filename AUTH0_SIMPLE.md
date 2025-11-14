# Auth0 Setup - Super Simple Guide

## What You Need (3 Things)

1. **Client Secret** from Auth0 Dashboard
2. **Add 5 environment variables**
3. **Update 3 URLs in Auth0 Dashboard**

That's it! The code is already done.

---

## Step 1: Get Your Client Secret

1. Go to https://manage.auth0.com
2. Applications → framify → Settings
3. Copy the **Client Secret** (click "Show" to reveal it)

---

## Step 2: Add Environment Variables

### Local (.env.local)
Create or edit `.env.local` in your project root:

```bash
AUTH0_SECRET=ArlGyVRSXH/o4WucpZGJj7rlnHCyE7FqJV80zElBlzM=
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<paste-your-client-secret-here>
```

### Production (Vercel)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these 5 variables (same as above, but change `APP_BASE_URL`):

```bash
AUTH0_SECRET=ArlGyVRSXH/o4WucpZGJj7rlnHCyE7FqJV80zElBlzM=
APP_BASE_URL=https://framify-nine.vercel.app
AUTH0_DOMAIN=dev-lji2ti0xxkebshe2.auth0.com
AUTH0_CLIENT_ID=oFVm4vy2hNm53uMeeUaUH88WHfElHJrV
AUTH0_CLIENT_SECRET=<paste-your-client-secret-here>
```

---

## Step 3: Update Auth0 Dashboard URLs

1. Go to https://manage.auth0.com
2. Applications → framify → Settings
3. Scroll to "Application URIs"
4. Paste these URLs:

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

5. Click "Save Changes"

---

## Done! 🎉

Now test it:
1. Run `npm run dev`
2. Visit http://localhost:3000
3. Click "Login"
4. You should see Auth0 login page

---

## That's It!

The middleware handles everything automatically:
- `/auth/login` → redirects to Auth0
- `/auth/logout` → logs out
- `/auth/callback` → handles return from Auth0
- Protected routes → require login automatically

No more API routes to manage. It just works! ✨

