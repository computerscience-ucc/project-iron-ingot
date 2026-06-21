# UCC INGO — Maintenance Guide for CS Council Officers

## Quick Start

```bash
npm install              # Install front-end dependencies
cd studio && npm install # Install Sanity CMS dependencies
cd .. && npm run dev     # Start both front-end (localhost:3000) + CMS (localhost:3333)
```

## Project Structure

```
├── pages/            # Next.js routes (file-based routing)
│   ├── index.js      # Landing page
│   ├── council.js    # CS Council page
│   ├── thesis/       # Thesis listing + detail pages
│   ├── blog/         # Blog listing + detail pages
│   ├── bulletin/     # Bulletin listing + detail pages
│   ├── awards.js     # Awards page
│   └── about.js      # About / Dev Team page
├── components/       # Shared UI components (Navbar, Footer, ChatBot, etc.)
├── layouts/          # Page layout components (Council, DevTeam, etc.)
├── lib/
│   ├── sanity.js     # Sanity client (read-only data fetching)
│   └── groq/         # GROQ queries
├── studio/           # Sanity CMS (content management backend)
│   ├── sanity.config.js    # CMS configuration
│   ├── sanity.cli.js       # CLI config (project ID, dataset)
│   ├── deskStructure.js    # Custom admin panel sidebar
│   └── schemas/            # Content type definitions (blog, thesis, council, etc.)
├── public/           # Static assets (favicon, sitemap.xml, robots.txt)
├── vercel.json       # Vercel deployment config
├── AGENTS.md         # ← This file
└── .env              # Environment variables (API keys, etc.)
```

## Architecture Overview

- **Front-end**: Next.js 15 (React 18) — renders the public website
- **CMS**: Sanity Studio v3 — content editors manage data at `/studio`
- **Data flow**: Content editors → Sanity Studio → Sanity API → Next.js (GROQ queries) → Website
- **AI Chatbot**: Google Gemini API — provides thesis-aware Q&A via the ChatBot widget
- **Facebook Messenger**: Custom API-first integration via Meta Graph API — two-way messaging between website visitors and Facebook Page Inbox
- **Hosting**: Vercel (front-end) + Sanity Hosting (CMS) — separate deployments

## Common Maintenance Tasks

### Adding a New Page

1. Create a new file in `pages/` (e.g., `pages/events.js`)
2. Add a link in `components/Navbar.js`
3. If the page needs CMS data, add a GROQ query in `lib/groq/` or directly in the page file
4. Add the route to `public/sitemap.xml` for SEO

### Updating Content (via Sanity Studio)

The CMS is standalone at `studio/`. Start it with:

```bash
cd studio && sanity dev
```

Open http://localhost:3333 in your browser. Content editors log in with their Sanity account (invited via the Sanity Manage dashboard at https://manage.sanity.io).

**Schema types available**: Blog Posts, Bulletins, Theses, Awards, Gallery of Works, CS Council, Dev Team, Site Configuration.

### Adding a New Schema Type

1. Create a new file in `studio/schemas/` (e.g., `sponsors.js`)
2. Wrap the schema with `defineType()` like the existing schemas
3. Import and add it to the `schemaTypes` array in `studio/schemas/schema.js`
4. Restart the studio — the new type appears in the admin panel

### Deploying to Vercel

The `main` branch auto-deploys to Vercel. To deploy manually:

```bash
vercel --prod
```

Set these environment variables in the Vercel dashboard:
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gjvp776o` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2023-10-01` |
| `GEMINI_API_KEY` | _(your Gemini API key)_ |

### Deploying the CMS (Sanity Studio)

```bash
cd studio
npx sanity deploy
```

This deploys the CMS to a Sanity-managed URL. The first deploy will prompt you to choose a hostname (e.g., `ucc-ingo.sanity.studio`).

### Updating the AI Chatbot

The chatbot uses Google Gemini. Files involved:

- `components/ChatBot.js` — UI logic
- `lib/sanity.js` (`buildSiteContext` function) — builds the AI context from CMS data
- `pages/api/chat.js` — API route that calls Gemini

To change the AI model or system prompt, edit the **Site Configuration** document in the Sanity CMS (Chatbot fieldset).

### Facebook Messenger Integration

The Messenger widget replaces the deprecated Meta Customer Chat Plugin (deprecated May 2024). It uses an API-first architecture:

- `components/MessengerChat.js` — Floating chat widget UI (React)
- `components/MessengerChat.module.css` — Widget styles
- `components/messenger/MessageBubble.js` — Individual message bubble
- `components/messenger/TypingIndicator.js` — Animated typing dots
- `components/messenger/WelcomeMessage.js` — Empty state UI
- `pages/api/messenger/webhook.js` — Meta webhook (verification + incoming messages)
- `pages/api/messenger/send.js` — Send messages to Meta Graph API
- `pages/api/messenger/messages.js` — Poll for incoming messages
- `lib/messenger/messageStore.js` — In-memory message store
- `lib/messenger/session.js` — Client-side session ID generator

**Environment variables** (server-only, no `NEXT_PUBLIC_` prefix):

- `FB_PAGE_ID` — Facebook Page ID
- `FB_APP_SECRET` — Meta App Secret (for webhook signature verification)
- `FB_VERIFY_TOKEN` — Custom verification token (set in Meta Developer Console)
- `FB_PAGE_ACCESS_TOKEN` — Page Access Token with `pages_messaging` permission

### Smart Image Caching

The website uses a multi-layer image caching strategy to prevent redundant network requests:

- `lib/imageUrl.js` — Optimized Sanity image URL builder with width/quality/format transforms
- `lib/imagePlaceholders.js` — LQIP blur placeholder generator for instant blur-up effect
- `lib/imageCache.js` — LRU in-memory cache (50 images max) for lightbox components
- `hooks/useImagePreloader.js` — React hook for preload-on-hover patterns

**When adding new images**, use `getOptimizedUrl()` from `lib/imageUrl.js` instead of raw `urlFor().url()`. Always add `sizes` prop and `placeholder="blur"` with `blurDataURL` from `getBlurPlaceholder()`.

## Sanity Studio v3 Migration Notes

This project was migrated from Sanity v2 to v3 in June 2026. Key changes:

- `sanity.json` → `sanity.config.js` + `sanity.cli.js`
- All schemas use `defineType()` from the `sanity` package
- Desk structure uses `sanity/structure` instead of `@sanity/desk-tool/structure-builder`
- React upgraded from 17 → 18, styled-components from 5 → 6
- The global `@sanity/cli` was removed — use the local `sanity` package via `npx` or `npm run`

**Do not reinstall `@sanity/cli` globally.** Always use the local `sanity` bin (`node node_modules/sanity/bin/sanity` or `npx sanity` from the `studio/` directory).

## Troubleshooting

| Symptom                              | Cause                                   | Fix                                                              |
| ------------------------------------ | --------------------------------------- | ---------------------------------------------------------------- |
| `rxjs.shareReplay is not a function` | Old rxjs v6 in root `node_modules`      | Delete `../node_modules/rxjs` and reinstall                      |
| Studio blank page / white screen     | Schema has JS syntax error              | Check Vite devtools console — look for the specific schema file  |
| ChatBot returns errors               | Missing or expired Gemini API key       | Update `GEMINI_API_KEY` in `.env` or Vercel dashboard            |
| Images not loading in prod           | Vercel needs Sanity CDN whitelisted     | Already configured in `next.config.mjs` — check `remotePatterns` |
| `sanity start` not working           | Using v2 command with v3                | Use `sanity dev` instead                                         |
| Messenger not sending messages       | Missing or invalid FB_PAGE_ACCESS_TOKEN | Set the token in Vercel env vars                                 |
| Webhook verification fails           | FB_VERIFY_TOKEN mismatch                | Ensure token matches in Meta Developer Console                   |
| Messages not appearing in widget     | Polling endpoint not reachable          | Check CSP headers allow graph.facebook.com                       |

## Git Branch Strategy

- `main` — production-ready, auto-deploys to Vercel
- `feat/*` — feature branches
- `fix/*` — bug fix branches
- All changes merged via pull requests

## Environment Variables

| Variable                         | Required | Description                                        |
| -------------------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Yes      | Sanity project ID (`gjvp776o`)                     |
| `NEXT_PUBLIC_SANITY_DATASET`     | Yes      | Dataset name (`production`)                        |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No       | API date version                                   |
| `SANITY_API_TOKEN`               | No       | For private datasets (not needed for public)       |
| `GEMINI_API_KEY`                 | Yes      | Google Gemini API key                              |
| `FB_PAGE_ID`                     | Yes      | Facebook Page ID                                   |
| `FB_APP_SECRET`                  | Yes      | Meta App Secret (webhook signature verification)   |
| `FB_VERIFY_TOKEN`                | Yes      | Custom verification token (Meta Developer Console) |
| `FB_PAGE_ACCESS_TOKEN`           | Yes      | Page Access Token with pages_messaging permission  |

## Key Contacts

- **Sanity Manage**: https://manage.sanity.io (project: `gjvp776o`)
- **Google AI Studio**: https://aistudio.google.com/app/apikey
- **Vercel Dashboard**: https://vercel.com (ask the current CS Council president for access)

---

_Maintained by the UCC Computer Science Council. For questions, contact the current Dev Team lead or CS Council president._
