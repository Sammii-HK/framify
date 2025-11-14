# Framer Environment Variables Setup

## Required Variables

### Option 1: Direct Access Token (Easiest)

If you have a Framer access token:

```bash
FRAMER_ACCESS_TOKEN=your_access_token_here
FRAMER_PROJECT_ID=your_project_id_here
```

### Option 2: OAuth Credentials (Recommended for Production)

If using OAuth 2.0:

```bash
FRAMER_CLIENT_ID=your_client_id
FRAMER_CLIENT_SECRET=your_client_secret
FRAMER_PROJECT_ID=your_project_id_here
```

## Optional Variables

```bash
# Auto-publish templates to Framer when generated
AUTO_PUBLISH_TO_FRAMER=true  # or false

# Custom API base URL (defaults to https://api.framer.com/v1)
FRAMER_API_BASE_URL=https://api.framer.com/v1
```

## How to Get Framer Credentials

### 1. Get Framer Project ID

1. **Create a Framer project** (or use existing one)
   - Go to https://framer.com
   - Create a new project or open existing one

2. **Find Project ID in URL**
   - Open your project in Framer
   - Look at the URL: `https://framer.com/projects/[PROJECT_ID]/...`
   - Copy the `PROJECT_ID` part

3. **Add to Vercel**
   ```bash
   FRAMER_PROJECT_ID=abc123xyz456
   ```

### 2. Get OAuth Credentials (For Production)

1. **Go to Framer Developer Settings**
   - Visit: https://framer.com/developers
   - Sign in with your Framer account

2. **Create OAuth App**
   - Click "Create App" or "New Application"
   - Fill in:
     - **Name**: Framify (or your app name)
     - **Redirect URI**: `https://your-domain.com/api/framer/callback` (if using callback flow)
     - **Scopes**: `code:write` (for creating code components)

3. **Copy Credentials**
   - You'll get `Client ID` and `Client Secret`
   - Add to Vercel:
     ```bash
     FRAMER_CLIENT_ID=your_client_id_here
     FRAMER_CLIENT_SECRET=your_client_secret_here
     ```

### 3. Get Direct Access Token (Alternative)

If Framer provides personal access tokens:

1. Go to Framer account settings
2. Look for "API Tokens" or "Access Tokens"
3. Generate a new token
4. Copy and add to Vercel:
   ```bash
   FRAMER_ACCESS_TOKEN=your_token_here
   ```

## Setting Up in Vercel

### Step 1: Add Environment Variables

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable:

**For Production:**
```
FRAMER_PROJECT_ID=your_project_id
FRAMER_CLIENT_ID=your_client_id
FRAMER_CLIENT_SECRET=your_client_secret
AUTO_PUBLISH_TO_FRAMER=false  # Set to true when ready
```

**For Development (local `.env.local`):**
```bash
FRAMER_PROJECT_ID=your_project_id
FRAMER_CLIENT_ID=your_client_id
FRAMER_CLIENT_SECRET=your_client_secret
AUTO_PUBLISH_TO_FRAMER=false
```

### Step 2: Verify Setup

After adding variables, redeploy your app:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## How It Works

### Manual Export (Current)

1. User generates template
2. User clicks "Export to Framer" button
3. App calls `/api/framer-upload`
4. Creates code component in your Framer project
5. Returns Framer URL

### Auto-Publish (When Enabled)

1. Set `AUTO_PUBLISH_TO_FRAMER=true`
2. When template is generated, automatically:
   - Creates code component in Framer
   - Saves Framer URL to database
   - Template ready to view in Framer

## Testing

### Test Manual Export

1. Generate a template
2. Click "Export to Framer"
3. Should see success message with Framer URL

### Test Auto-Publish

1. Set `AUTO_PUBLISH_TO_FRAMER=true`
2. Generate a new template
3. Check template details page - should have Framer URL

## Troubleshooting

### Error: "FRAMER_PROJECT_ID is required"

**Solution:** Add `FRAMER_PROJECT_ID` to environment variables

### Error: "Framer authentication required"

**Solution:** Add either:
- `FRAMER_ACCESS_TOKEN`, OR
- Both `FRAMER_CLIENT_ID` and `FRAMER_CLIENT_SECRET`

### Error: "Project not found" or "404"

**Solution:**
- Verify `FRAMER_PROJECT_ID` is correct
- Check you have access to the project
- Project must exist before creating code components

### Error: "Unauthorized" or "401/403"

**Solution:**
- Check OAuth credentials are correct
- Verify token hasn't expired
- Check API permissions/scopes

## Minimal Setup (Just Testing)

If you just want to test without Framer integration:

**Don't add any Framer env vars** - the app will work fine, just without Framer export functionality.

## Production Checklist

- [ ] Created Framer project
- [ ] Got `FRAMER_PROJECT_ID` from URL
- [ ] Created OAuth app in Framer Developer Portal
- [ ] Got `FRAMER_CLIENT_ID` and `FRAMER_CLIENT_SECRET`
- [ ] Added all vars to Vercel (Production environment)
- [ ] Tested manual export
- [ ] Set `AUTO_PUBLISH_TO_FRAMER=true` (when ready)

## Notes

- **Framer doesn't create projects via API** - you must create the project manually first
- **Code components** are created within existing projects
- **Auto-publish** is optional - templates work fine without it
- **OAuth tokens** may expire - you may need to refresh them periodically



