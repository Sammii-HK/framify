# How to Get Your Auth0 Client Secret

## Step-by-Step Guide

### 1. Go to Auth0 Dashboard
Visit: **https://manage.auth0.com**

### 2. Navigate to Your Application
- Click **"Applications"** in the left sidebar
- Find and click on **"framify"** (or your app name)

### 3. Go to Settings
- Click the **"Settings"** tab at the top

### 4. Find the Client Secret
- Scroll down to the **"Basic Information"** section
- Look for **"Client Secret"**
- Click the **"Show"** button (eye icon) next to it
- **Copy** the secret (it's a long string of characters)

### 5. Use It
- Paste it into the setup script when prompted
- Or add it to your `.env.local` file as `AUTH0_CLIENT_SECRET`

---

## Visual Guide

```
Auth0 Dashboard
├── Applications (click)
│   └── framify (click)
│       └── Settings (click)
│           └── Basic Information
│               └── Client Secret [Show] ← Click here!
```

---

## Quick Copy Locations

**Direct URL:**
```
https://manage.auth0.com/#/applications/[YOUR_APP_ID]/settings
```

Replace `[YOUR_APP_ID]` with your app's ID (you can find it in the URL when viewing your app).

---

## Important Notes

⚠️ **Security:**
- Never commit your Client Secret to git
- It's already in `.gitignore` (`.env.local` is ignored)
- Keep it private and secure

💡 **Tip:**
- If you can't see the "Show" button, make sure you have the right permissions
- You might need to be an admin or have application management permissions

---

## Alternative: Use Auth0 CLI

If you prefer CLI:

```bash
# Install Auth0 CLI (if not already installed)
brew tap auth0/auth0-cli && brew install auth0

# Login
auth0 login

# Get app details (includes client secret)
auth0 apps show framify
```

---

## Still Can't Find It?

1. **Check permissions** - Make sure you're logged in as an admin
2. **Check the app** - Make sure you're looking at the right application
3. **Try refreshing** - Sometimes the page needs a refresh
4. **Check application type** - Make sure it's a "Regular Web Application" (not SPA)

---

## Once You Have It

Run the setup script:

```bash
npm run setup:auth0
```

When it asks for the Client Secret, paste it in!

