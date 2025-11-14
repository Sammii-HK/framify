# Auth0 Setup via CLI - Super Easy! 🚀

## Option 1: Use Our Setup Script (Easiest)

Just run one command:

```bash
npm run setup:auth0
```

This will:
- ✅ Prompt you for your Auth0 credentials
- ✅ Generate a secure AUTH0_SECRET automatically
- ✅ Create `.env.local` with all variables
- ✅ Show you exactly what URLs to add to Auth0 Dashboard

**That's it!** Then just copy/paste the URLs it shows you.

---

## Option 2: Use Official Auth0 CLI

### Install Auth0 CLI

**macOS:**
```bash
brew tap auth0/auth0-cli && brew install auth0
```

**Linux:**
```bash
curl -sSfL https://raw.githubusercontent.com/auth0/auth0-cli/main/install.sh | sh -s -- -b .
```

**Windows:**
```powershell
scoop bucket add auth0 https://github.com/auth0/scoop-auth0-cli.git
scoop install auth0
```

### Login to Auth0

```bash
auth0 login
```

This opens your browser to authenticate.

### Get Your App Info

```bash
# List your applications
auth0 apps list

# Get details for your framify app
auth0 apps show framify
```

This will show you:
- Client ID
- Client Secret
- Domain

### Update Application URLs

```bash
# Update callback URLs
auth0 apps update framify \
  --callback-urls "https://framify-nine.vercel.app/auth/callback,http://localhost:3000/auth/callback" \
  --logout-urls "https://framify-nine.vercel.app,http://localhost:3000" \
  --web-origins "https://framify-nine.vercel.app,http://localhost:3000"
```

---

## Option 3: Push to Vercel via CLI

After running `npm run setup:auth0`, push env vars to Vercel:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Push environment variables
npm run setup:vercel
```

This reads your `.env.local` and pushes all Auth0 variables to Vercel automatically!

---

## Quick Start (Recommended)

1. **Run setup script:**
   ```bash
   npm run setup:auth0
   ```

2. **Copy the URLs it shows you** → Paste into Auth0 Dashboard

3. **Push to Vercel (optional):**
   ```bash
   npm run setup:vercel
   ```

4. **Test locally:**
   ```bash
   npm run dev
   ```

Done! 🎉

---

## What Each Script Does

### `npm run setup:auth0`
- Interactive prompts for credentials
- Auto-generates secure secret
- Creates `.env.local`
- Shows you what to do next

### `npm run setup:vercel`
- Reads `.env.local`
- Pushes all Auth0 vars to Vercel
- Sets production `APP_BASE_URL`
- One command, done!

---

## Troubleshooting

**"Client Secret not found"**
- Go to Auth0 Dashboard → Applications → framify → Settings
- Click "Show" next to Client Secret
- Copy it

**"Vercel CLI not found"**
```bash
npm i -g vercel
```

**"Permission denied"**
```bash
chmod +x scripts/setup-auth0.js scripts/setup-vercel-env.sh
```

---

## Manual Setup (If Scripts Don't Work)

See `AUTH0_SIMPLE.md` for manual step-by-step instructions.

