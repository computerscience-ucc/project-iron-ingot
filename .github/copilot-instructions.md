# Copilot Instructions — UCC INGO (BSCS Information Board)

> **Owner:** UCC Computer Science Council  
> **Domain:** https://uccingo.tech  
> **Model:** Use the best available model for all development tasks  
> **IDE:** VS Code with GitHub Copilot

---

## Core Architecture

### Multi-Page Application (Pages Router)

UCC INGO uses **Next.js 15 with Pages Router** (file-based routing). Each content type has its own page and detail route.

**Current Routes:**

| Route | Type | Purpose |
|---|---|---|
| `/` | Page | Landing page with hero carousel, featured content |
| `/council` | Page | CS Council members by academic year |
| `/thesis` | Page | Thesis project listing with filters |
| `/thesis/[slug]` | Page | Individual thesis detail page |
| `/blog` | Page | Blog post listing |
| `/blog/[slug]` | Page | Individual blog post detail |
| `/bulletin` | Page | Bulletin listing |
| `/bulletin/[slug]` | Page | Individual bulletin detail |
| `/awards` | Page | Awards listing |
| `/awards/[slug]` | Page | Individual award detail |
| `/gallery` | Page | Gallery of works listing |
| `/gallery/[slug]` | Page | Individual gallery project detail |
| `/about` | Page | About / Dev Team page |
| `/api/chat` | API | Gemini AI chatbot endpoint |
| `/api/revalidate` | API | ISR webhook receiver |

**Never create a new route type.** Use existing patterns: listing page + detail page per content type.

### Data Flow

```
Sanity Studio (CMS) → Sanity API → Next.js (GROQ queries) → Website
                 ↓
          Webhook → /api/revalidate → ISR cache purge
                 ↓
          client.listen() → Prefetcher → UI update
```

**Data fetching patterns:**

1. **Server-side (SSR/ISR):** `getServerSideProps` or `getStaticProps` for page data
2. **Client-side (Prefetcher):** `components/Prefetcher.js` fetches all list data on mount, provides via React Context
3. **Real-time:** `client.listen()` in Prefetcher subscribes to Sanity mutations
4. **GROQ queries:** All queries in `lib/groq/` organized by content type

### Sanity Studio

Studio lives in `studio/` with its own `package.json`. Start with `cd studio && npx sanity dev`.

**Schema types:** blog, bulletin, thesis, award, gallery, author, recipient, council, devTeam, heroCarousel, siteConfig

**Field groups:** Thesis (5 groups), award (4 groups), blog/bulletin/gallery (3 groups each)

**Desk structure:** Organized into Content / People / Structure sections

**Document actions:** `revalidateOnPublish` fires webhook on publish/unpublish

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (Pages Router) | SSR, ISR, routing |
| Language | JavaScript (ES modules) | No TypeScript |
| Styling | Tailwind CSS v3 | Utility-first CSS |
| Animations | Framer Motion / Motion React | Page transitions, scroll effects |
| CMS | Sanity v3 | Content management |
| Content rendering | Portable Text (`@portabletext/react`) | Rich text rendering |
| AI Chat | Google Gemini 2.5 Flash | Thesis-aware Q&A |
| Hosting | Vercel (front-end) + Sanity (CMS) | Deployment |
| CI/CD | GitHub Actions | Automated quality gates |

---

## Project Structure

```
├── pages/                    # Next.js routes
│   ├── index.js              # Landing page
│   ├── council.js            # CS Council page
│   ├── thesis/               # Thesis listing + detail
│   ├── blog/                 # Blog listing + detail
│   ├── bulletin/             # Bulletin listing + detail
│   ├── awards.js             # Awards page
│   ├── gallery/              # Gallery listing + detail
│   ├── about.js              # About / Dev Team
│   └── api/                  # API routes
├── components/               # Shared UI components
│   ├── Prefetcher.js         # Data fetching + real-time updates
│   ├── ErrorBoundary.js      # React error boundary
│   ├── ChatBot.js            # AI chatbot widget
│   ├── SearchModal.js        # Global search
│   └── Navbar.js             # Navigation bar
├── layouts/                  # Page layouts (Council, Footer, etc.)
├── lib/                      # Utilities
│   ├── sanity.js             # Sanity client + queries
│   ├── cache.js              # TTL cache utility
│   ├── siteConfig.js         # Site config fetcher
│   └── groq/                 # GROQ query files
├── studio/                   # Sanity Studio
├── public/                   # Static assets
└── package.json
```

---

## Development Workflow

### Commands

```bash
npm install              # Install front-end dependencies
cd studio && npm install # Install Sanity dependencies
cd .. && npm run dev     # Start both front-end + CMS
npm run build            # Production build
npm run lint             # ESLint check
```

### Quality Gates

1. **Lint:** `npm run lint` — must pass with 0 errors
2. **Build:** `npm run build` — must complete successfully
3. **Never commit code that fails lint or build**

### Commit Convention

Use conventional commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `chore:` — Maintenance tasks
- `docs:` — Documentation
- `style:` — CSS/style changes
- `test:` — Adding tests

---

## Key Components

### Prefetcher (`components/Prefetcher.js`)

Wraps the entire app and provides all content data via React Context:

- Fetches all list data on mount (blogs, bulletins, thesis, awards, gallery, siteConfig)
- Subscribes to Sanity mutations via `client.listen()`
- Updates individual content types when mutations occur
- Provides `usePrefetcher()` hook for components

### ChatBot (`components/ChatBot.js`)

Floating action button with chat interface:

- Uses Google Gemini for AI responses
- Fetches site context from Sanity for thesis-aware Q&A
- Rate limiting per IP (10 requests/min)
- Honeypot anti-bot protection

### ErrorBoundary (`components/ErrorBoundary.js`)

Catches rendering errors and logs them to Sanity:

- Wraps the entire app
- Falls back to friendly error UI
- Logs errors via `/api/log-error`

---

## Sanity CMS Rules

### Schema Changes

1. Create new schema in `studio/schemas/`
2. Import and add to `studio/schemas/schema.js`
3. Restart studio: `cd studio && npx sanity dev`
4. Add GROQ query in `lib/groq/` if needed
5. Create page in `pages/` if needed

### Content Editing

1. Open Studio at `localhost:3333`
2. Edit content — changes publish to Sanity API
3. Website updates via webhook (ISR) or real-time (Prefetcher)

### GROQ Queries

All queries live in `lib/groq/` organized by content type:
- `blog.js` — Blog list, paths, detail queries
- `bulletin.js` — Bulletin list, paths, detail queries
- `thesis.js` — Thesis list, paths, detail queries
- `awards.js` — Awards list, paths, detail queries
- `gallery.js` — Gallery list, paths, detail queries

---

## Gotchas

1. **No TypeScript** — This project uses plain JavaScript with ES modules
2. **Pages Router** — Not App Router. Use `getServerSideProps`, `getStaticProps`, `getStaticPaths`
3. **Windows paths** — Use `npx sanity dev` instead of `sanity dev` (not in PATH)
4. **Material Tailwind** — Some components break SSR; use dynamic imports if needed
5. **Framer Motion v12** — Import from `"framer-motion"` (not `"motion/react"`)
6. **Sanity client** — Use `client` from `lib/sanity.js` for read-only; `lib/sanity-admin.js` for writes
7. **Environment variables** — Sanity project ID is hardcoded in `next.config.mjs`
8. **ISR caching** — Revalidation happens via webhook from Sanity Studio on publish

---

## Branch Strategy

- `main` — production-ready, auto-deploys to Vercel
- `feat/*` — feature branches
- `fix/*` — bug fix branches
- All changes merged via pull requests
