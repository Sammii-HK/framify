# Using Vercel Remote Shell for Database Migration

## Step-by-Step Instructions

### 1. Enable Vercel Remote Shell

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your **framify** project
3. Go to **Settings** → **Remote Shell**
4. Click **Enable Remote Shell**
5. You'll get a command like:
   ```bash
   vercel shell
   ```

### 2. Run the Shell Command

Run this in your terminal:
```bash
vercel shell
```

This will connect you to a shell in your Vercel deployment environment.

### 3. Run Database Migration

Once you're in the Vercel shell, run:

```bash
npx prisma db push
```

This will:
- Connect to your Neon database (DATABASE_URL is already set)
- Create the `Template` table with all the fields
- Set up indexes and constraints

### 4. Verify Migration

After it completes, you can verify by running:

```bash
npx prisma db pull
```

Or test in your app by creating a template!

### 5. Exit Shell

Type `exit` when done.

## What This Does

The `prisma db push` command will create this table in your Neon database:

```sql
CREATE TABLE "Template" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "style" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "framerUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

**If you get "command not found":**
- Make sure you're in the Vercel shell environment
- Prisma should be installed (it's in package.json)

**If connection fails:**
- Check that DATABASE_URL is set in Vercel environment variables
- Verify Neon database is running

**If migration fails:**
- Check the error message
- Make sure you have permissions on the Neon database

