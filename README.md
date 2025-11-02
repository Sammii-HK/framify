# Framify - AI Framer Template Generator

Generate Framer-ready website templates from natural language prompts using AI.

## Features

- 🎨 **AI-Powered Generation**: Describe your template in plain English and get React + Framer Motion + Tailwind code
- 👀 **Live Preview**: See your generated template in real-time with Sandpack
- 💾 **Export**: Download templates as `.tsx` files
- 🎭 **Design Styles**: Choose from Minimal, Bold, Soft, or Dark design styles
- 🚀 **Framer Integration**: (Coming in Phase 2) Direct export to Framer projects

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

5. **Export**: Download the `.tsx` file or export to Framer (Phase 2)

## Project Structure

```
/framify
  /app
    /api
      /generate-template    # AI template generation endpoint
      /framer-upload        # Framer export endpoint (Phase 2)
    /layout.tsx             # Root layout
    /page.tsx               # Home page
  /components
    PromptForm.tsx          # Input form for prompts
    TemplatePreview.tsx     # Preview and export component
    Dashboard.tsx           # Dashboard (Phase 3)
  /lib
    openai.ts               # OpenAI integration
    framer.ts               # Framer API integration (stub)
    prisma.ts               # Prisma client
  /db
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

### 🔜 Phase 2 - Framer Integration
- [ ] Direct Framer project creation via API
- [ ] Framer share links
- [ ] Template management in Framer

### 🔜 Phase 3 - Dashboard & Marketplace
- [ ] Template dashboard
- [ ] Search and filter templates
- [ ] Marketplace integration
- [ ] User authentication

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

## License

MIT

