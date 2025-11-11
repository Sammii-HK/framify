# Production Readiness Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Quality ✅

- [x] No TypeScript errors
- [x] No linting errors
- [x] All imports resolved
- [x] Type safety throughout

### 2. Database Schema ✅

- [x] Prisma schema updated with monetization fields
- [ ] **TODO: Run migration after deployment**

### 3. Environment Variables Required

**Required:**

```bash
OPENAI_API_KEY=sk-...                    # Required for AI generation
DATABASE_URL=postgresql://...            # Required - Neon database
NEXT_PUBLIC_APP_URL=https://your-domain.com  # Required for API URLs
```

**Optional (but recommended):**

```bash
# Framer Integration
AUTO_PUBLISH_TO_FRAMER=false             # Set to true for auto-publish
FRAMER_PROJECT_ID=...                    # If using Framer export
FRAMER_ACCESS_TOKEN=...                  # If using Framer export
FRAMER_CLIENT_ID=...                     # Alternative to access token
FRAMER_CLIENT_SECRET=...                 # Alternative to access token
FRAMER_API_BASE_URL=https://api.framer.com/v1

# Future: Stripe (for payments)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Build & Test Locally

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Test build
npm run build

# 4. Test production build locally
npm run start
```

### 5. Database Migration

**After deploying to Vercel:**

```bash
# Option A: Via Vercel Remote Shell (Recommended)
# 1. Go to Vercel Dashboard → Project → Settings → Remote Shell
# 2. Enable Remote Shell
# 3. Run:
npx prisma db push

# Option B: Via Vercel CLI
vercel env pull .env.local
npx prisma db push
```

### 6. Verify Deployment

- [ ] Build completes successfully
- [ ] App loads at your domain
- [ ] Database connection works
- [ ] Generate a test template
- [ ] Check marketplace page loads
- [ ] Verify API endpoints work

## 🚀 Deployment Steps

### Step 1: Push to Git

```bash
git add -A
git commit -m "feat: Production-ready with monetization and API"
git push origin main
```

### Step 2: Deploy to Vercel

**If connected to GitHub:**

- Auto-deploys on push
- Or trigger manually in Vercel dashboard

**If deploying manually:**

```bash
vercel --prod
```

### Step 3: Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Add:**

- `OPENAI_API_KEY`
- `DATABASE_URL` (from Neon integration)
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)

**Optional:**

- `AUTO_PUBLISH_TO_FRAMER=true` (if you want auto-publish)
- Framer API credentials (if using Framer export)

### Step 4: Run Database Migration

After first deployment, push schema:

```bash
# Via Vercel Remote Shell
npx prisma db push
```

### Step 5: Test Everything

1. ✅ Visit your site
2. ✅ Generate a template
3. ✅ Check dashboard loads
4. ✅ Check marketplace loads
5. ✅ Test API: `GET /api/templates/public`

## 🔒 Security Checklist

- [x] Environment variables not committed
- [x] API routes validate input
- [x] Database queries use Prisma (SQL injection safe)
- [ ] **TODO: Add rate limiting** (optional, for production scale)
- [ ] **TODO: Add CORS if needed** (for studio store API)

## 📊 Features Status

### ✅ Complete

- AI template generation
- Live preview
- Dashboard
- Marketplace
- Public API endpoints
- Framer integration
- Style variations
- Download functionality

### ⏳ Optional (Can add later)

- Stripe payments (for purchases)
- User authentication (currently using 'anonymous')
- Rate limiting
- Analytics dashboard
- Email notifications

## 🐛 Known Limitations

1. **User Authentication**: Currently uses 'anonymous' - can add auth later
2. **Payments**: Not implemented yet - templates show prices but no checkout
3. **Thumbnails**: Not auto-generated - can add later
4. **Rate Limiting**: Not implemented - add if you get high traffic

## 📝 Post-Deployment Tasks

### Immediate

1. Test template generation
2. Mark a template as public
3. Verify marketplace shows it
4. Test API endpoints

### This Week

1. Generate 5-10 templates
2. Mark best ones as public
3. Set prices
4. Share marketplace link

### This Month

1. Add Stripe integration
2. Process first sale
3. Add analytics
4. Optimize based on data

## 🎯 Quick Start Commands

```bash
# Local development
npm install
npm run db:generate
npm run dev

# Production build test
npm run build
npm run start

# Database
npm run db:push        # Push schema to database
npm run db:studio      # Open Prisma Studio (GUI)

# Deployment
git push origin main   # Auto-deploys if connected to Vercel
```

## ✅ You're Ready!

Your app is production-ready! Just need to:

1. Deploy to Vercel
2. Set environment variables
3. Run database migration
4. Start generating templates! 🚀
