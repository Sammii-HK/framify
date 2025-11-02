# Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set in your production environment:

```bash
# Required
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...

# Optional but recommended
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Framer Integration (optional, for Phase 2)
FRAMER_ACCESS_TOKEN=... # OR
FRAMER_CLIENT_ID=... # AND
FRAMER_CLIENT_SECRET=...
FRAMER_PROJECT_ID=...
FRAMER_API_BASE_URL=https://api.framer.com/v1
```

### 2. Database Setup
1. Run Prisma migrations:
```bash
npm run db:generate
npm run db:push
```

2. Verify database connection in production environment

### 3. Build & Test Locally
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Build for production
npm run build

# Test production build locally
npm run start
```

### 4. TypeScript & Linting
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## Deployment Options

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set environment variables:**
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL`
   - (Optional) Framer API variables
4. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Deploy!** Vercel will automatically deploy on every push to main

### Other Platforms

#### Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Configure Prisma: Add build hook to run `npm run db:generate`

#### Railway
1. Connect repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy (automatically detects Next.js)

#### Self-Hosted
1. Build the application: `npm run build`
2. Start the server: `npm run start`
3. Use a process manager (PM2, systemd)
4. Configure reverse proxy (Nginx, Caddy)
5. Set up SSL certificates

## Post-Deployment

1. **Verify database connection** - Check that Prisma can connect
2. **Test API endpoints** - Verify `/api/generate-template` works
3. **Test UI** - Create a test template
4. **Monitor logs** - Check for any runtime errors
5. **Set up monitoring** - Consider using Sentry or similar

## Production Optimizations

The project includes:
- ✅ SWC minification (enabled in `next.config.js`)
- ✅ Compression (enabled)
- ✅ React Strict Mode
- ✅ Powered-by header removed

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Run `npm run db:generate` before building
- Check Node.js version (18+ required)

### Runtime Errors
- Verify database connection string
- Check API key validity
- Review server logs for details

### Database Issues
- Ensure DATABASE_URL is correct
- Run `npm run db:push` to sync schema
- Check database permissions

