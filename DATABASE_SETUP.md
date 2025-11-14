# Database Setup for Vercel

## Recommended: Neon (Serverless PostgreSQL) ⭐

**Why Neon?**

- ✅ Serverless PostgreSQL - scales automatically
- ✅ Excellent Vercel integration (one-click setup)
- ✅ Generous free tier (3 projects, 0.5GB storage)
- ✅ Perfect for Prisma
- ✅ Auto-scaling, no connection pooling needed
- ✅ Built-in branching (dev/staging/prod databases)

## Setup Steps

### Option 1: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**

   - Navigate to: https://vercel.com/sammiis-projects/framify
   - Go to **Storage** tab (or **Settings** → **Storage**)

2. **Add Neon Database**

   - Click **Create Database**
   - Select **Neon Postgres**
   - Sign in with GitHub (if prompted)
   - Choose a database name (e.g., `framify-prod`)
   - Select region closest to your users
   - Click **Create**

3. **Environment Variable**

   - Vercel automatically adds `DATABASE_URL` to your environment variables
   - It's already configured for production!

4. **Verify**
   - Go to **Settings** → **Environment Variables**
   - You should see `DATABASE_URL` with a Neon connection string

### Option 2: Manual Neon Setup

1. **Create Neon Account**

   - Go to: https://neon.tech
   - Sign up with GitHub
   - Create a new project

2. **Get Connection String**

   - In Neon dashboard, go to your project
   - Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

3. **Add to Vercel**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add new variable:
     - **Name**: `DATABASE_URL`
     - **Value**: Your Neon connection string
     - **Environment**: Production (and Preview/Development if needed)

## Alternative Options

### Supabase (PostgreSQL + Extras)

**Good if you need:**

- Authentication built-in
- Real-time subscriptions
- Storage buckets
- Edge functions

**Setup:**

1. Create account at https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy connection string (use "URI" format)
5. Add to Vercel as `DATABASE_URL`

**Free Tier:** 500MB database, 2GB bandwidth

### Vercel Postgres (If Available)

**Note:** Vercel Postgres is in beta and may not be available in all regions.

**Setup:**

1. Vercel Dashboard → Storage → Create Database
2. Select "Postgres" (Vercel's own)
3. Auto-configured, no manual setup needed

## After Setup: Push Schema

Once `DATABASE_URL` is set in Vercel:

### Via Vercel Remote Shell (Recommended)

```bash
# 1. Go to Vercel Dashboard → Settings → Remote Shell
# 2. Open Remote Shell
# 3. Run:
npx prisma db push
```

### Via Local Machine

```bash
# 1. Pull production env vars
vercel env pull .env.production.local --environment=production

# 2. Get DATABASE_URL (may need to get manually from Vercel dashboard)
export DATABASE_URL="postgresql://..."

# 3. Push schema
npx prisma db push

# 4. Clean up
unset DATABASE_URL
```

## Verify Database Connection

After pushing schema:

1. **Check Tables Created**

   ```bash
   npx prisma studio
   # Should show Template and PromptTemplate tables
   ```

2. **Test in Production**
   - Visit your app
   - Try creating a template
   - Check admin dashboard loads

## Database URL Format

Your `DATABASE_URL` should look like:

```
postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

**Important:**

- ✅ Always use `?sslmode=require` for production
- ✅ Never commit `DATABASE_URL` to git (it's in `.gitignore`)
- ✅ Use different databases for dev/staging/prod

## Free Tier Limits

### Neon Free Tier

- 3 projects
- 0.5GB storage per project
- Unlimited databases per project
- Auto-scaling
- No credit card required

### Supabase Free Tier

- Unlimited projects
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users

## Recommended Setup

**For Production:**

- ✅ Neon (via Vercel integration)
- ✅ Production environment variable
- ✅ Auto-scaling, no connection limits

**For Development:**

- ✅ Local `.env.local` with Neon dev database
- ✅ Or use Neon branching feature

## Troubleshooting

### "Connection refused"

- Check `DATABASE_URL` is correct
- Verify database is running in Neon dashboard
- Check firewall/network settings

### "Too many connections"

- Neon handles this automatically (serverless)
- If using Supabase, check connection pooling settings

### "Schema not found"

- Run `npx prisma db push` to create tables
- Check Prisma schema matches database

## Next Steps

1. ✅ Set up Neon via Vercel Dashboard
2. ✅ Push schema: `npx prisma db push` (via Remote Shell)
3. ✅ Test creating a template
4. ✅ Verify admin dashboard works


