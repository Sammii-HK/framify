# How to Get Your Framer API Key/Credentials

## Step-by-Step Guide

### Step 1: Go to Framer Developer Portal

1. **Visit Framer Developers**
   - Go to: https://framer.com/developers
   - Or: https://developers.framer.com

2. **Sign In**
   - Use your Framer account credentials
   - If you don't have an account, create one at https://framer.com

---

### Step 2: Create an OAuth Application

1. **Navigate to Applications**
   - Look for "Applications", "OAuth Apps", or "API Keys" section
   - Click "Create New Application" or "New App"

2. **Fill in Application Details**
   - **Application Name**: `Framify` (or your app name)
   - **Description**: `AI-powered Framer template generator`
   - **Redirect URI**: 
     - For production: `https://framify-nine.vercel.app/api/framer/callback`
     - For local dev: `http://localhost:3000/api/framer/callback`
   - **Scopes/Permissions**: 
     - ✅ `code:write` (to create code components)
     - ✅ `code:read` (to read code components)

3. **Save/Create Application**

---

### Step 3: Get Your Credentials

After creating the app, you'll see:

1. **Client ID** (Public)
   - Looks like: `abc123xyz456` or `framer_client_...`
   - Copy this value

2. **Client Secret** (Private - keep secure!)
   - Looks like: `secret_abc123...` or `framer_secret_...`
   - ⚠️ **Copy this immediately** - you may only see it once!
   - Keep it secret, never commit to git

---

### Step 4: Get Your Project ID

You also need a Framer Project ID:

1. **Create or Open a Framer Project**
   - Go to: https://framer.com
   - Create a new project (or use existing)

2. **Find Project ID in URL**
   - Open your project
   - Look at the URL: `https://framer.com/projects/[PROJECT_ID]/...`
   - Example: `https://framer.com/projects/abc123xyz/edit`
   - The `abc123xyz` part is your Project ID

---

### Step 5: Add to Vercel

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/sammiis-projects/framify
   - Go to **Settings** → **Environment Variables**

2. **Add These Variables:**

   **For Production:**
   ```
   FRAMER_CLIENT_ID=your_client_id_here
   FRAMER_CLIENT_SECRET=your_client_secret_here
   FRAMER_PROJECT_ID=your_project_id_here
   AUTO_PUBLISH_TO_FRAMER=false
   ```

3. **Redeploy**
   - After adding variables, trigger a new deployment
   - Or wait for next git push

---

## Alternative: Direct Access Token (If Available)

Some Framer integrations support direct access tokens:

1. **Check Framer Account Settings**
   - Go to: https://framer.com/settings
   - Look for "API", "Integrations", or "Developer" section

2. **Generate Personal Access Token**
   - If available, click "Generate Token"
   - Copy the token

3. **Use Instead of OAuth**
   ```
   FRAMER_ACCESS_TOKEN=your_token_here
   FRAMER_PROJECT_ID=your_project_id_here
   ```

---

## Quick Checklist

- [ ] Signed in to Framer account
- [ ] Created OAuth application at https://framer.com/developers
- [ ] Copied Client ID
- [ ] Copied Client Secret (saved securely)
- [ ] Created/opened Framer project
- [ ] Got Project ID from URL
- [ ] Added all vars to Vercel
- [ ] Redeployed app

---

## Troubleshooting

### "Can't find Developer Portal"

**Try these URLs:**
- https://framer.com/developers
- https://developers.framer.com
- https://framer.com/settings/developer
- Check Framer's main site footer for "Developers" link

### "No OAuth App Option"

Framer's API might be:
- **In beta** - May require waitlist/approval
- **Limited access** - Check if your account has API access
- **Different method** - They might use different auth (check docs)

### "Invalid Credentials"

- Double-check Client ID and Secret are correct
- Make sure no extra spaces when copying
- Verify Project ID is correct
- Check if tokens expired (regenerate if needed)

### "Project Not Found"

- Verify Project ID is correct
- Make sure you have access to the project
- Project must exist before creating code components

---

## Testing Your Setup

After adding credentials:

1. **Generate a template** in your app
2. **Click "Export to Framer"**
3. **Should see success** with Framer URL

If it fails, check Vercel logs for specific error messages.

---

## Security Notes

⚠️ **Never commit these to git:**
- `FRAMER_CLIENT_SECRET`
- `FRAMER_ACCESS_TOKEN`

✅ **Safe to commit:**
- `FRAMER_PROJECT_ID` (if you want)
- `FRAMER_CLIENT_ID` (public anyway)

---

## Need Help?

If Framer's developer portal structure has changed:

1. **Check Framer Docs**
   - https://framer.com/developers/reference
   - https://framer.com/developers/oauth

2. **Contact Framer Support**
   - They can guide you to the right place

3. **Check Your Framer Account**
   - Some features may require paid plans
   - API access might need approval

---

## Current Status

Based on your code, Framify expects:
- ✅ OAuth 2.0 credentials (Client ID + Secret)
- ✅ OR Direct Access Token
- ✅ Project ID (required)

The app will work **without Framer integration** - users just won't be able to export to Framer. It's optional!



