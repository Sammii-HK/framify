# Push Schema to Production Database

## Step 1: Push Schema via Vercel Remote Shell ⭐

1. **Go to Vercel Dashboard**

   - Navigate to: https://vercel.com/sammiis-projects/framify
   - Go to **Settings** → **Remote Shell**
   - Click **Enable Remote Shell** (if not already enabled)

2. **Open Remote Shell**

   - Click **Open Remote Shell** button
   - This opens a browser-based terminal

3. **Run Migration**

   ```bash
   npx prisma db push
   ```

4. **Verify Tables Created**
   ```bash
   npx prisma studio
   ```
   - Should show `Template` and `PromptTemplate` tables
   - Press `q` to quit

## Step 2: Test Your App

After pushing schema:

1. **Visit your deployed app**

   - Go to: https://framify.vercel.app (or your custom domain)

2. **Test Creating a Template**

   - Go to `/create` page
   - Generate a template
   - Should save to database successfully

3. **Check Admin Dashboard**

   - Go to `/admin`
   - Should show analytics (0 templates initially)

4. **Check Style Bank**
   - Go to `/style-bank`
   - Should load empty list

## Troubleshooting

### If `npx prisma db push` fails:

**Error: "Environment variable not found: DATABASE_URL"**

- Check Vercel Dashboard → Settings → Environment Variables
- Verify `DATABASE_URL` exists for Production environment
- Make sure Remote Shell is using Production environment

**Error: "Connection refused"**

- Check Neon dashboard - database should be running
- Verify `DATABASE_URL` format is correct
- Check if database is paused (Neon free tier pauses after inactivity)

**Error: "Schema already exists"**

- Safe to ignore - means tables already created
- Run `npx prisma studio` to verify

### If tables don't appear:

1. **Check Prisma Client**

   ```bash
   npx prisma generate
   ```

2. **Verify Schema**

   ```bash
   npx prisma db pull
   # Should show your schema
   ```

3. **Check Neon Dashboard**
   - Go to Neon dashboard
   - Check "Tables" section
   - Should see `Template` and `PromptTemplate`

## Next Steps After Schema Push

✅ Schema pushed
✅ Tables created
✅ App deployed
✅ Environment variables set

**You're ready to:**

- Create templates
- Use admin dashboard
- Use style bank
- Publish templates to marketplace


