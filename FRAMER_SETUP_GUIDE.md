# Framer API Setup Guide - Step by Step

## What You Need

You need **3 things** to export templates to Framer:

1. **FRAMER_PROJECT_ID** - Your Framer project ID
2. **FRAMER_ACCESS_TOKEN** OR **FRAMER_CLIENT_ID + FRAMER_CLIENT_SECRET** - Authentication
3. **AUTO_PUBLISH_TO_FRAMER** - Set to `true` to auto-publish

---

## Step 1: Get Your Framer Project ID (Easiest - 2 minutes)

1. **Go to Framer**: https://framer.com
2. **Sign in** with your account
3. **Create a new project** (or open an existing one)
4. **Look at the URL**:
   ```
   https://framer.com/projects/YOUR_PROJECT_ID/edit
   ```
   The part after `/projects/` is your Project ID
5. **Copy it** - Example: `abc123xyz456`

---

## Step 2: Get Framer API Credentials

You have **2 options**:

### Option A: Direct Access Token (Easiest - if available)

1. **Go to Framer Developer Portal**:
   - Visit: https://framer.com/developers
   - Or: https://framer.com/settings/developer
   - Or check: https://framer.com/settings → Look for "API" or "Developer" section

2. **Look for "Personal Access Tokens" or "API Tokens"**
   - If you see this option, click "Generate Token"
   - Copy the token
   - **Use this**: `FRAMER_ACCESS_TOKEN=your_token_here`

### Option B: OAuth Credentials (If no direct token available)

1. **Go to Framer Developer Portal**:
   - Visit: https://framer.com/developers
   - Sign in with your Framer account

2. **Create an OAuth Application**:
   - Click "Create App" or "New Application" or "Register App"
   - Fill in:
     - **Name**: `Framify` (or your app name)
     - **Description**: `AI template generator`
     - **Redirect URI**: `http://localhost:3000/api/framer/callback` (for local)
     - **Scopes**: Select `code:write` and `code:read`

3. **Copy Your Credentials**:
   - **Client ID**: Copy this (public)
   - **Client Secret**: Copy this immediately - you may only see it once!
   - **Use these**: 
     ```
     FRAMER_CLIENT_ID=your_client_id
     FRAMER_CLIENT_SECRET=your_client_secret
     ```

---

## Step 3: Add to Your `.env.local` File

Open your `.env.local` file and add:

```bash
# Framer Project ID (REQUIRED)
FRAMER_PROJECT_ID=your_project_id_here

# Option A: Direct Access Token (if available)
FRAMER_ACCESS_TOKEN=your_access_token_here

# OR Option B: OAuth Credentials (if no direct token)
FRAMER_CLIENT_ID=your_client_id_here
FRAMER_CLIENT_SECRET=your_client_secret_here

# Auto-publish to Framer (set to true to enable)
AUTO_PUBLISH_TO_FRAMER=true
```

**Important**: 
- Use **EITHER** `FRAMER_ACCESS_TOKEN` **OR** `FRAMER_CLIENT_ID + FRAMER_CLIENT_SECRET`
- Don't use both!

---

## Step 4: Restart Your Dev Server

After adding the variables:

```bash
# Stop your server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 5: Test It

1. **Generate a template** in your app
2. **Check the terminal** - you should see logs about Framer export
3. **If AUTO_PUBLISH_TO_FRAMER=true**: Template auto-exports
4. **If false**: Click "Export to Framer" button

---

## Troubleshooting

### "Can't find Framer Developer Portal"

**Try these URLs:**
- https://framer.com/developers
- https://developers.framer.com  
- https://framer.com/settings/developer
- https://framer.com/settings → Look for "API" or "Developer" tab

### "No API Access Option"

Framer's API might be:
- **In beta** - May require waitlist or approval
- **Paid plan only** - Check if your account has API access
- **Different location** - Check your account settings

**Solution**: Contact Framer support or check their docs: https://framer.com/developers/reference

### "Invalid Credentials Error"

- Double-check you copied credentials correctly (no extra spaces)
- Verify Project ID is correct
- Make sure you're using EITHER access token OR client credentials (not both)
- Check if tokens expired (regenerate if needed)

### "Project Not Found"

- Verify Project ID is correct (check URL again)
- Make sure you have access to the project
- Project must exist before creating code components

---

## Quick Checklist

- [ ] Created/opened Framer project
- [ ] Got Project ID from URL
- [ ] Went to https://framer.com/developers
- [ ] Got access token OR client credentials
- [ ] Added to `.env.local`
- [ ] Restarted dev server
- [ ] Tested template export

---

## For Production (Vercel)

After testing locally, add the same variables to Vercel:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add the same variables:
   - `FRAMER_PROJECT_ID`
   - `FRAMER_ACCESS_TOKEN` (or `FRAMER_CLIENT_ID` + `FRAMER_CLIENT_SECRET`)
   - `AUTO_PUBLISH_TO_FRAMER=true`
4. Redeploy

---

## What Happens When It Works

✅ Template is generated
✅ Code is automatically pushed to your Framer project
✅ Creates a code component you can use in Framer
✅ Template URL is saved in database
✅ You can view/edit it in Framer immediately

---

## Need More Help?

- **Framer API Docs**: https://framer.com/developers/reference
- **Framer OAuth Docs**: https://framer.com/developers/oauth
- **Contact Framer Support**: If you can't find the developer portal

---

## Current Status

Your app supports:
- ✅ Direct Access Token (`FRAMER_ACCESS_TOKEN`)
- ✅ OAuth Client Credentials (`FRAMER_CLIENT_ID` + `FRAMER_CLIENT_SECRET`)
- ✅ Auto-publish toggle (`AUTO_PUBLISH_TO_FRAMER`)
- ✅ Manual export button

The app works **without Framer** - templates just won't export. Framer integration is optional!

