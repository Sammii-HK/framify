# Framify - AI Framer Template Generator

Generate Framer-ready website templates from natural language prompts using AI.

## Features

- 🎨 **AI-Powered Generation**: Describe your template in plain English and get React + Framer Motion + Tailwind code
- 👀 **Live Preview**: See your generated template in real-time with Sandpack
- 💾 **Export**: Download templates as `.tsx` files
- 🎭 **Design Styles**: Choose from Minimal, Bold, Soft, or Dark design styles
- 🚀 **Framer Integration**: Direct export to Framer projects with share links

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Animations**: Framer Motion
- **AI**: OpenAI GPT-4-turbo via Vercel AI SDK
- **Database**: Prisma + Supabase (PostgreSQL)
- **Code Preview**: Sandpack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd framify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Your app URL (default: `http://localhost:3000`)
- `FRAMER_ACCESS_TOKEN`: Your Framer OAuth access token (recommended), OR
- `FRAMER_CLIENT_ID` and `FRAMER_CLIENT_SECRET`: OAuth client credentials for token generation
- `FRAMER_PROJECT_ID`: Your existing Framer project ID (required - create a project manually first)
- `FRAMER_API_BASE_URL`: Optional - Framer API base URL (default: `https://api.framer.com/v1`)

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Describe Your Template**: Enter a prompt describing what you want (e.g., "A minimalist landing page for an astrology coach")

2. **Choose a Style**: Select from Minimal, Bold, Soft, or Dark design styles

3. **Generate**: Click "Generate Template" and wait for AI to create your template

4. **Preview**: View your template in the preview pane with live rendering

5. **Export**: Download the `.tsx` file or export directly to Framer

## Project Structure

```
/framify
  /app
    /api
      /generate-template    # AI template generation endpoint
      /framer-upload        # Framer export endpoint
      /plugin               # Plugin-specific endpoints (with code access)
      /components           # Components API endpoints
      /templates            # Templates API endpoints
    /layout.tsx             # Root layout
    /page.tsx               # Home page
  /components
    PromptForm.tsx          # Input form for prompts
    TemplatePreview.tsx     # Preview and export component
    Dashboard.tsx           # Dashboard
  /framer-plugin            # Framer plugin (Phase 4)
    /src
      /code.tsx             # Plugin code (runs in Framer)
      /ui.tsx               # Plugin UI (React)
      /components           # UI components
      /utils                 # API utilities
  /lib
    openai.ts               # OpenAI integration
    framer.ts               # Framer API integration
    prisma.ts               # Prisma client
    cors.ts                 # CORS configuration
  /prisma
    schema.prisma           # Database schema
  /styles
    globals.css             # Global styles
```

## Development Roadmap

### ✅ Phase 1 - MVP (Current)
- [x] AI template generation
- [x] Live preview with Sandpack
- [x] Export to `.tsx` files
- [x] Design style selection

### ✅ Phase 2 - Framer Integration (Complete)
- [x] Direct Framer project creation via API
- [x] Framer share links
- [x] Database integration for Framer URLs

### ✅ Phase 3 - Dashboard (Complete)
- [x] Template dashboard
- [x] Search and filter templates
- [x] Template detail view
- [x] Dashboard navigation

### ✅ Phase 4 - Framer Plugin (Complete)
- [x] Framer plugin for browsing templates/components
- [x] Plugin-specific API endpoints with code access
- [x] Components support (database model and API)
- [x] One-click insertion into Framer projects

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## Environment Variables

See `.env.local.example` for all required environment variables.

### Framer API Setup (Phase 2)

To enable Framer export functionality:

1. **Create a Framer Project**: Since Framer doesn't provide an API to create projects, you'll need to create one manually:
   - Go to [framer.com](https://framer.com) and create a new project
   - Copy the project ID from the URL: `https://framer.com/projects/[PROJECT_ID]/...`
   - Add `FRAMER_PROJECT_ID` to your `.env.local` file

2. **Set up OAuth Authentication** (choose one method):
   
   **Method A - Direct Access Token**:
   - Get your access token from [Framer Developer Settings](https://framer.com/developers/oauth)
   - Add `FRAMER_ACCESS_TOKEN=your_token_here` to `.env.local`
   
   **Method B - OAuth Client Credentials**:
   - Register your app at [Framer Developer Settings](https://framer.com/developers/oauth)
   - Get your `FRAMER_CLIENT_ID` and `FRAMER_CLIENT_SECRET`
   - Add both to `.env.local`

3. **Optional**: Set `FRAMER_API_BASE_URL` if Framer uses a different API endpoint

**Note**: This implementation uses Framer's CodeFile API to create code components within an existing project. The generated templates will be added as code components that you can use in your Framer project. See [Framer API Documentation](https://framer.com/developers/reference) for more details.

## License

MIT

