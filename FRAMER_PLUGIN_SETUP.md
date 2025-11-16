# Framer Plugin Setup Guide

This guide explains how to set up and use the Framify Framer plugin to browse and insert templates/components directly into Framer projects.

## Overview

The Framify Framer plugin allows you to:
- Browse public templates and components from Framify
- Search and filter items
- Insert code directly into Framer projects with one click
- No API credentials required

## Plugin Architecture

The plugin consists of two parts:

1. **Backend API Endpoints** (in `/app/api/plugin/`)
   - `/api/plugin/templates/[id]` - Returns template WITH code
   - `/api/plugin/components/[id]` - Returns component WITH code
   - These endpoints are plugin-only and include full code (unlike public endpoints)

2. **Framer Plugin** (in `/framer-plugin/`)
   - React UI for browsing templates/components
   - Plugin code that inserts components into Framer
   - API utilities for fetching data

## Backend Setup

### 1. API Endpoints

The plugin-specific endpoints are already created:
- ✅ `/app/api/plugin/templates/[id]/route.ts`
- ✅ `/app/api/plugin/components/[id]/route.ts`

These endpoints:
- Return full code (unlike public endpoints)
- Only accessible to plugins (CORS configured)
- Increment view counts

### 2. Components Support

Components are already supported:
- ✅ Component model in Prisma schema
- ✅ `/app/api/components/public/route.ts` - List public components
- ✅ `/app/api/components/route.ts` - CRUD operations

### 3. CORS Configuration

CORS is configured in `/lib/cors.ts` to allow:
- `https://framer.com`
- `https://*.framer.com`
- Your Framify domain

## Plugin Development

### Prerequisites

- Node.js 18+
- Framer account
- Framify API running (local or deployed)

### Setup

1. **Navigate to plugin directory:**
```bash
cd framer-plugin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL:**
   
   Update the API base URL in:
   - `src/utils/api.ts` - For UI components
   - `src/code.tsx` - For plugin code
   
   Default: `https://framify-nine.vercel.app`
   
   For local development:
   ```typescript
   const API_BASE_URL = 'http://localhost:3000';
   ```

4. **Build the plugin:**
```bash
npm run build
```

5. **Development mode:**
```bash
npm run dev
```

### Plugin Structure

```
framer-plugin/
├── src/
│   ├── code.tsx              # Plugin code (runs in Framer context)
│   ├── ui.tsx                # Plugin UI (React component)
│   ├── components/
│   │   ├── TemplateList.tsx  # Template browser
│   │   ├── ComponentList.tsx # Component browser
│   │   └── ItemCard.tsx      # Item card component
│   └── utils/
│       └── api.ts            # API utilities
├── ui.html                   # HTML wrapper
├── plugin.json               # Plugin manifest
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## Installing the Plugin in Framer

### Development

1. Build the plugin:
```bash
cd framer-plugin
npm run build
```

2. In Framer:
   - Open a project
   - Go to Plugins menu
   - Click "Import Plugin"
   - Select the `framer-plugin` directory
   - Or use the development URL if running `npm run dev`

### Production

1. Build for production:
```bash
cd framer-plugin
npm run build
```

2. Package the plugin:
   - The built files should be in the plugin directory
   - Follow Framer's plugin submission guidelines

3. Submit to Framer Marketplace (optional):
   - See [Framer Plugin Marketplace Guide](https://www.framer.com/help/articles/how-to-submit-a-plugin-to-the-marketplace/)

## Usage

1. **Open Plugin:**
   - In Framer, go to Plugins menu
   - Select "Framify"

2. **Browse:**
   - Switch between Templates and Components tabs
   - Use search to filter items
   - Click on any item to see details

3. **Insert:**
   - Click on a template or component card
   - The code will be fetched and inserted into your Framer project
   - A success message will appear

## API Endpoints Reference

### Public Endpoints (Metadata Only)

- `GET /api/templates/public` - List public templates (no code)
- `GET /api/components/public` - List public components (no code)

### Plugin Endpoints (With Code)

- `GET /api/plugin/templates/[id]` - Get template with code
- `GET /api/plugin/components/[id]` - Get component with code

## Troubleshooting

### Plugin can't fetch templates/components

- Check that your Framify API is running
- Verify CORS configuration allows Framer origins
- Check browser console for errors
- Ensure API_BASE_URL is correct in plugin code

### Code insertion fails

- Verify Framer Plugin API is available
- Check that the code format is valid React/TypeScript
- Check Framer console for errors

### CORS errors

- Ensure `/lib/cors.ts` includes Framer origins
- Check that API endpoints handle OPTIONS requests
- Verify network access in `plugin.json`

## Development Notes

### Framer Plugin API

The actual Framer Plugin API may vary. The current implementation includes:
- Fallback methods for code insertion
- Message passing between UI and plugin code
- Error handling

You may need to adjust the code insertion method based on the actual Framer Plugin API documentation.

### Testing

1. Test API endpoints directly:
```bash
curl http://localhost:3000/api/plugin/templates/[template-id]
```

2. Test plugin UI:
- Run `npm run dev` in plugin directory
- Open plugin in Framer
- Check browser console for errors

3. Test code insertion:
- Insert a template/component
- Verify it appears in Framer
- Check for any errors

## Next Steps

- [ ] Test plugin in Framer
- [ ] Adjust Framer Plugin API calls if needed
- [ ] Add more features (favorites, categories, etc.)
- [ ] Publish to Framer Marketplace (optional)

## Support

For issues or questions:
- Check Framer Plugin documentation
- Review API endpoint logs
- Check browser/Framer console for errors

