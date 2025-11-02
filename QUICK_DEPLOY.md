# Quick Deploy Steps (Database Already Set Up)

## 1. Push to Git

```bash
# Stage all changes
git add -A

# Commit (if not already committed)
git commit -m "feat: Complete Phase 3 and production setup"

# Push to remote
git push origin main
```

## 2. Run Database Migrations

Since your Neon database is already set up via Vercel, you just need to push the schema:

**Option A: Via Vercel CLI (Recommended)**
```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run Prisma migrations
npx prisma db push
```

**Option B: Via Vercel Remote Shell**
1. Go to Vercel Dashboard → Your Project → Settings → Remote Shell
2. Enable it if not already enabled
3. Run:
```bash
npx prisma db push
```

**Option C: If DATABASE_URL is already in your .env.local:**
```bash
# Just run locally (if you have the connection string)
npx prisma db push
```

## 3. Deploy to Vercel

If connected to GitHub:
- Push will trigger automatic deployment
- Or manually trigger from Vercel dashboard

If deploying manually:
```bash
vercel --prod
```

## 4. Verify Deployment

1. Check Vercel build logs for success
2. Visit your deployed URL
3. Test creating a template to verify database connection
4. Check that dashboard loads templates

## Environment Variables to Set in Vercel

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

✅ `DATABASE_URL` (should already be set from Neon integration)
✅ `OPENAI_API_KEY` (your OpenAI key)
✅ `NEXT_PUBLIC_APP_URL` (your Vercel app URL)

Optional:
- `FRAMER_ACCESS_TOKEN` (if using Framer export)
- `FRAMER_PROJECT_ID` (if using Framer export)

## Quick Checklist

- [ ] Code pushed to git
- [ ] Database migrations run (`prisma db push`)
- [ ] Environment variables configured in Vercel
- [ ] Deployment triggered
- [ ] Build succeeded
- [ ] App is live!

