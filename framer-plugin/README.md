# Framify Framer Plugin

Browse and insert Framify templates and components directly into Framer projects.

## Features

- Browse public templates and components from Framify
- Search and filter templates/components
- One-click insertion into Framer projects
- No API credentials required

## Development

### Prerequisites

- Node.js 18+
- Framer account

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the plugin:
```bash
npm run build
```

3. Run in development mode:
```bash
npm run dev
```

### Building

```bash
npm run build
```

This will compile the TypeScript code and prepare the plugin for use in Framer.

## Usage

1. Install the plugin in Framer
2. Open the plugin from the Framer plugins menu
3. Browse templates or components
4. Click on any item to insert it into your Framer project

## API Configuration

The plugin connects to your Framify API. Update the `API_BASE_URL` in:
- `src/utils/api.ts` - For UI components
- `src/code.tsx` - For plugin code

Default: `https://framify-nine.vercel.app`

## Project Structure

```
framer-plugin/
├── src/
│   ├── code.tsx          # Plugin code (runs in Framer context)
│   ├── ui.tsx            # Plugin UI (React component)
│   ├── components/       # React components
│   └── utils/            # API utilities
├── ui.html               # HTML wrapper for UI
├── plugin.json           # Plugin manifest
└── package.json          # Dependencies
```

## Notes

- The plugin requires network access to fetch templates/components
- Make sure your Framify API endpoints are accessible
- CORS must be configured on your API to allow Framer plugin origins

