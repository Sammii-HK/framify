# Database Setup with Neon (via Vercel)

## Step-by-Step Guide

### 1. Deploy to Vercel (First Time)

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in and click "New Project"
   - Import your GitHub/GitLab/Bitbucket repository
   - Select the `framify` project

2. **Add Neon Database:**
   - In the Vercel project dashboard, go to **Storage** tab
   - Click **Create Database**
   - Select **Neon Postgres**
   - Follow the prompts to create a Neon account (if needed)
   - Vercel will automatically:
     - Create a Neon database
     - Add `DATABASE_URL` environment variable
     - Set up the connection

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Required:**
```
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=<automatically set by Neon integration>
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Optional (for Framer integration):**
```
FRAMER_ACCESS_TOKEN=your-token
FRAMER_PROJECT_ID=your-project-id
FRAMER_API_BASE_URL=https://api.framer.com/v1
```

### 3. Run Database Migrations

After your first deployment, you need to run Prisma migrations:

**Option A: Via Vercel Build Command (Recommended)**

Update your `package.json` to include database generation in build:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

**Option B: Via Vercel CLI (Alternative)**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Run migrations:
```bash
vercel env pull .env.local
npx prisma db push
```

**Option C: Via Vercel Remote Shell**

1. Go to Vercel Dashboard → Your Project → Settings → Remote Shell
2. Enable Remote Shell
3. Run:
```bash
npx prisma db push
```

### 4. Verify Database Setup

After deployment:
1. Check Vercel build logs to ensure Prisma client generated successfully
2. Test creating a template in your deployed app
3. Check Neon dashboard to verify tables were created

### 5. Production Database URL Format

Neon provides a connection string like:
```
postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

Vercel will automatically set this as `DATABASE_URL`.

## Troubleshooting

### Issue: Database tables not created
**Solution:** Run `npx prisma db push` via Vercel Remote Shell or update build command

### Issue: Connection timeout
**Solution:** Check Neon dashboard for connection limits. Neon free tier has connection limits.

### Issue: Prisma client not found in build
**Solution:** Add `prisma generate` to your build command or use `postinstall` script

## Next Steps

After database is set up:
1. ✅ Database connected via Vercel/Neon integration
2. ✅ Environment variables configured
3. ✅ Prisma migrations applied
4. ✅ Test template creation
5. 🚀 App is ready!

