# How to Find Your Correct Auth0 Tenant URL

## The Problem

Your tenant `dev-lji2ti0xxkebshe2.auth0.com` returns 404, which means it either:
- Doesn't exist
- Was deleted
- Is in a different region
- Has a different name

## How to Find Your Correct Tenant URL

### Step 1: Check Your Application Settings

1. Go to your Auth0 application settings:
   https://manage.auth0.com/dashboard/uk/dev-lji2ti0xxkebshe2/applications/oFVm4vy2hNm53uMeeUaUH88WHfElHJrV/settings

2. Look for these fields:
   - **Domain** - This shows your tenant domain
   - **Allowed Callback URLs** - Check what domain is configured here
   - **Allowed Logout URLs** - Check what domain is configured here

### Step 2: Check Auth0 Dashboard Header

1. When logged into Auth0 dashboard, look at the top of the page
2. You should see your tenant name/domain displayed
3. It might show something like: `Your Tenant Name` or `your-tenant.auth0.com`

### Step 3: Check Your Auth0 Account Settings

1. Go to: https://manage.auth0.com/dashboard/uk/dev-lji2ti0xxkebshe2
2. Look at the URL - the tenant name is in the path
3. But also check Settings → General to see your tenant details

### Step 4: Check Application Domain Field

In your application settings page, there should be a **"Domain"** field that shows the exact domain to use.

## Common Scenarios

### Scenario 1: You're Using a Different Tenant

If you have multiple Auth0 tenants:
1. Check which tenant your application is actually configured in
2. The tenant name in the URL might not match the actual tenant domain

### Scenario 2: Custom Domain

If you've configured a custom domain:
1. Check Auth0 → Settings → Domains
2. You might need to use the custom domain instead

### Scenario 3: Wrong Region

Your URL shows `uk` region. Make sure:
1. You're using the tenant from the correct region
2. The tenant domain matches the region

## What to Look For

In your Auth0 application settings, you should see:

**Domain:** `your-tenant.auth0.com` or `your-tenant.us.auth0.com` (for US region)

This is what you need to use in Vercel.

## Quick Check

1. Open your Auth0 application settings
2. Look at the **"Domain"** field (usually at the top)
3. Copy that exact value
4. Test it: `https://[that-domain]/.well-known/openid-configuration`

If it returns JSON (not 404), that's your correct tenant URL!

## What to Set in Vercel

Once you find the correct domain, set in Vercel:

**AUTH0_DOMAIN:**
```
your-actual-tenant.auth0.com
```

(Just the domain, no `https://` - the code adds it automatically)

**Plus don't forget:**
- **AUTH0_SECRET** - Generate with `openssl rand -base64 32`
