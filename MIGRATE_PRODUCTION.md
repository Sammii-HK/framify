# How to Run Prisma Migrations for Production Database

## Option 1: Via Vercel Remote Shell (Recommended) ⭐

This runs the migration directly in your production environment:

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/sammiis-projects/framify
   - Go to **Settings** → **Remote Shell**
   - Click **Enable Remote Shell** (if not already enabled)

2. **Open Remote Shell**
   - Click **Open Remote Shell** button
   - This opens a browser-based terminal connected to your production environment

3. **Run Migration**
   ```bash
   npx prisma db push
   ```

4. **Verify**
   ```bash
   npx prisma db pull
   # Should show your updated schema
   ```

## Option 2: Get DATABASE_URL from Vercel Dashboard

Since `DATABASE_URL` is marked as sensitive, you need to get it manually:

1. **Get Production DATABASE_URL**
   - Go to: https://vercel.com/sammiis-projects/framify/settings/environment-variables
   - Find `DATABASE_URL` in the production environment
   - Click the eye icon to reveal it
   - Copy the value

2. **Run Migration Locally**
   ```bash
   # Set the production DATABASE_URL temporarily
   export DATABASE_URL="postgresql://your-production-url-here"
   
   # Run migration
   npx prisma db push
   
   # Verify
   npx prisma studio
   ```

3. **Clean Up**
   ```bash
   unset DATABASE_URL
   ```

## Option 3: Via Vercel CLI (If DATABASE_URL is accessible)

If `DATABASE_URL` is accessible via CLI:

```bash
# Pull all env vars (may not include sensitive ones)
vercel env pull .env.production.local --environment=production

# Check if DATABASE_URL is there
grep DATABASE_URL .env.production.local

# If it's there, run:
export $(grep -v '^#' .env.production.local | xargs)
npx prisma db push
```

## Safety Checklist

Before running production migration:

- [ ] Backup your database (if possible)
- [ ] Test migration locally first with same schema
- [ ] Verify `DATABASE_URL` points to production
- [ ] Check that schema changes are correct
- [ ] Have rollback plan ready

## What `prisma db push` Does

- ✅ Creates new tables (PromptTemplate)
- ✅ Adds new columns (baseTemplateId, etc.)
- ✅ Updates existing columns
- ✅ Creates indexes
- ⚠️ **Does NOT delete** data or columns (safe)

## After Migration

1. **Verify Tables Created**
   ```bash
   npx prisma studio
   # Check PromptTemplate table exists
   # Check Template table has new fields
   ```

2. **Test in Production**
   - Visit `/admin` - should load analytics
   - Visit `/style-bank` - should work
   - Create a prompt template
   - Generate all styles

3. **Monitor**
   - Check Vercel logs for errors
   - Verify app still works

## Troubleshooting

### Error: "Database connection failed"
- Check `DATABASE_URL` is correct
- Verify Neon database is running
- Check network/firewall settings

### Error: "Relation already exists"
- Schema already migrated
- Safe to ignore or run `prisma db pull` to sync

### Error: "Column already exists"
- Field already added
- Safe to ignore

## Recommended Approach

**For Production:**
1. ✅ Use Vercel Remote Shell (safest, runs in production environment)
2. Or get `DATABASE_URL` from Vercel Dashboard and run locally

**For Local Development:**
1. Use local `.env.local` with local database
2. Test migrations locally first
3. Then apply to production
