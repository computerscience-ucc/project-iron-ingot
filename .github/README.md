# UCC INGO — BSCS Information Board

Production website for [uccingo.tech](https://uccingo.tech) — a Sanity-powered Next.js application serving as the central information hub for the University of Caloocan City Computer Science program.

---

## About

UCC INGO aggregates and presents thesis projects, blog posts, bulletins, awards, and gallery entries for the BSCS community. Content is managed through Sanity CMS and rendered via Next.js with real-time updates.

### Highlights

- **Multi-page architecture** — Dedicated pages for thesis, blog, bulletin, awards, gallery, council, and about
- **Sanity-powered content** — All runtime data served from Sanity CMS with GROQ queries and ISR caching
- **AI chatbot** — Gemini-driven assistant at `/api/chat` with thesis-aware Q&A
- **Real-time updates** — `client.listen()` subscription for live content synchronization
- **Presentation tool** — Visual live editing via Sanity Studio
- **Responsive design** — Mobile-first with sticky header, smooth scroll, and Framer Motion animations
- **CI/CD** — Automated lint, build, and Vercel deployment on merge to main

---

## Core stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (Pages Router) |
| **Language** | JavaScript (ES modules) |
| **Styling** | Tailwind CSS + CSS custom properties |
| **Animations** | Framer Motion / Motion React |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Content rendering** | Portable Text (`@portabletext/react`) |
| **Data fetching** | GROQ queries + in-memory TTL cache |
| **AI** | Google Gemini 2.5 Flash via `@google/generative-ai` |
| **Hosting** | Vercel (front-end) + Sanity Hosting (CMS) |

---

## Sanity CMS

The content layer lives at [Sanity Manage](https://manage.sanity.io) (project: `gjvp776o`).

| Feature | Details |
|---|---|
| **Studio** | Sanity v3 with deskTool, presentationTool, visionTool |
| **Schema types** | 11 document types (blog, bulletin, thesis, award, gallery, author, recipient, council, devTeam, heroCarousel, siteConfig) |
| **Field groups** | Thesis (5 groups), award (4 groups), blog/bulletin/gallery (3 groups each) |
| **Document actions** | Revalidation webhook on publish, view on site |
| **Visual editing** | Presentation tool for live preview |
| **Default ordering** | Newest-first on all content types |

The studio package lives in [`studio/`](./studio/) with its own `package.json`, 11 schema files, and custom desk structure.

---

## Getting started

```bash
git clone https://github.com/computerscience-ucc/project-iron-ingot.git
cd project-iron-ingot
npm install
cd studio && npm install
cd ..
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3333](http://localhost:3333) for Sanity Studio.

---

## Project structure

```
├── .github/                  # CI/CD workflows, templates, governance
├── pages/                    # Next.js routes (file-based routing)
│   ├── index.js              # Landing page
│   ├── council.js            # CS Council page
│   ├── thesis/               # Thesis listing + detail pages
│   ├── blog/                 # Blog listing + detail pages
│   ├── bulletin/             # Bulletin listing + detail pages
│   ├── awards.js             # Awards page
│   ├── gallery/              # Gallery listing + detail pages
│   ├── about.js              # About / Dev Team page
│   └── api/                  # API routes (chat, revalidate)
├── components/               # Shared UI components
├── layouts/                  # Page layout components
├── lib/                      # Utilities, Sanity client, GROQ queries
│   ├── sanity.js             # Sanity client (read-only)
│   ├── cache.js              # TTL cache utility
│   ├── siteConfig.js         # Site configuration fetcher
│   └── groq/                 # GROQ query files
├── studio/                   # Sanity Studio CMS
│   ├── sanity.config.js      # Studio configuration
│   ├── deskStructure.js      # Custom sidebar structure
│   ├── documentActions.js    # Custom document actions
│   └── schemas/              # Content type definitions
├── public/                   # Static assets
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

---

## Quality checks

```bash
npm run lint      # ESLint — 0 errors expected
npm run build     # Next.js production build
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID (`gjvp776o`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | API date version |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

---

## Deployment

- **Front-end**: Auto-deploys to Vercel on merge to `main`
- **CMS**: Deploy with `cd studio && npx sanity deploy`

---

## License

Licensed under the MIT License. See [LICENSE](../LICENSE).
