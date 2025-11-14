# How to Find Your Auth0 Tenant URL

## From Your Current URL

Your Auth0 dashboard URL shows:
```
https://manage.auth0.com/dashboard/uk/dev-lji2ti0xxkebshe2/applications/...
```

Your tenant identifier is: `dev-lji2ti0xxkebshe2`

So your tenant URL should be:
```
https://dev-lji2ti0xxkebshe2.auth0.com
```

## But It's Returning 404 - Here's How to Verify

### Method 1: Check Auth0 Dashboard Settings

1. Go to: https://manage.auth0.com/dashboard/uk/dev-lji2ti0xxkebshe2/applications/oFVm4vy2hNm53uMeeUaUH88WHfElHJrV/settings
2. Look at the **"Domain"** field in the application settings
3. It should show your tenant domain

### Method 2: Check Auth0 Dashboard URL

1. When you're logged into Auth0, look at the URL
2. The format is: `https://manage.auth0.com/dashboard/{region}/{tenant-name}/...`
3. Your tenant name is: `dev-lji2ti0xxkebshe2`
4. Your tenant URL is: `https://dev-lji2ti0xxkebshe2.auth0.com`

### Method 3: Test the Discovery Endpoint

Try visiting this URL in your browser:
```
https://dev-lji2ti0xxkebshe2.auth0.com/.well-known/openid-configuration
```

If it returns JSON (not 404), your tenant exists and is accessible.

## Possible Issues

### Issue 1: Tenant Doesn't Exist
If the discovery endpoint returns 404, the tenant might:
- Have been deleted
- Be in a different region
- Have a different name

### Issue 2: Wrong Region
Your URL shows `uk` region. Make sure you're using the correct tenant for your region.

### Issue 3: Custom Domain
If you have a custom domain configured, you might need to use that instead.

## What to Set in Vercel

Based on your tenant identifier `dev-lji2ti0xxkebshe2`, set:

**AUTH0_DOMAIN:**
```
dev-lji2ti0xxkebshe2.auth0.com
```

(No `https://` - the code will add it automatically)

**Or if you want to be explicit, set AUTH0_ISSUER_BASE_URL:**
```
https://dev-lji2ti0xxkebshe2.auth0.com
```

## Still Getting 404?

1. **Check if tenant exists**: Try logging into Auth0 dashboard - if you can access it, the tenant exists
2. **Check region**: Your URL shows `uk` - make sure you're using the correct tenant for your region
3. **Contact Auth0 support**: If the tenant should exist but returns 404, there might be an Auth0 service issue

## Quick Test

Run this command to test if your tenant is accessible:

```bash
curl https://dev-lji2ti0xxkebshe2.auth0.com/.well-known/openid-configuration
```

If it returns JSON, your tenant is accessible. If it returns 404, there's an issue with the tenant.
