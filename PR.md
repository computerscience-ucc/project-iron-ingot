# PR: dev → main — Full Stack Overhaul

> **Base:** `main` → **Head:** `dev`
> **Commits:** 245 | **Files changed:** 148 | **+25,548 / -23,522 lines**

## Visual Comparison

### Before

<img width="1920" height="1080" alt="Before" src="https://github.com/user-attachments/assets/1b9f45a2-12cd-4d2b-8d6b-5b686266e31a" />

### After

<img width="1920" height="1080" alt="After" src="https://github.com/user-attachments/assets/dfb1f72f-b6c2-4f77-a3ad-2e62cb6dbd53" />

> **Design Reference:** Every component, spacing decision, color value, and interaction pattern traces back to the [Figma design file](https://www.figma.com/design/vZJiO7krim20IjIl7LtVu9/UCC-INGO-2026?node-id=129-538&t=velKO5MvKICi0hMU-1). Refer to it when reviewing UI changes to understand the intent behind specific CSS values.

---

## What This PR Does

A ground-up overhaul of the UCC INGO website across five layers: **UI/UX redesign** (new homepage, council section, chatbot, navigation), **Sanity CMS v3 migration** (schema rewrite, live editing, on-demand ISR), **performance optimization** (SSR + ISR replacing client-side fetching), **security hardening** (API routes, CSP headers, CI/CD), and **accessibility compliance** (WCAG keyboard navigation, screen reader support, reduced motion).

---

## UI/UX — Architecture & Reasoning

### Why We Redesigned the Homepage

The original homepage was a static layout with no dynamic data. Every section was hardcoded. We restructured it into **8 independent layout components** (`layouts/Hero.js`, `layouts/CSBotSection.js`, `layouts/AwardGallery.js`, `layouts/Council.js`, `layouts/FAQ.js`, etc.) so each section owns its own Sanity query, animation state, and responsive behavior. This eliminates the monolithic `_app.js` pattern where all data lived in one place.

### Hero Section (`layouts/Hero.js`, `components/Home/Hero/`)

**Before:** Static hero with a single image and text.
**After:** Interactive mascot-driven carousel with 11 randomized bot illustrations, Minecraft pixel font branding (`public/fonts/`), ambient red glow backdrop, draggable image carousel with spring-animated dot pagination via `framer-motion`.

**Technical decisions:**

- Mascot images randomized on mount using `Math.random()` shuffle — avoids repetitive feel on repeat visits
- 3D Tech Stack Scene uses Three.js isometric wireframe boxes with elastic spin animations and orthographic camera — chosen over CSS transforms because Three.js handles z-depth correctly across viewports
- Custom cursor hover effect tracks global mouse position via `useRef` — CSS `cursor: pointer` doesn't provide the visual feedback we needed for the retro aesthetic

### Council Section (`layouts/Council.js`)

**Before:** Single-council display with no year navigation. Adviser photo had no interaction. Officers were static.
**After:** Full year-selector system, interactive lightbox, committee accordions, and scrollable officer carousel.

**Technical decisions:**

- **Year Selector** fetches ALL councils via `*[_type == 'council'] | order(academicYear desc)` and filters client-side. Why: Sanity queries are cheap, and this avoids N+1 requests when switching years.
- **Committee Accordion** uses `framer-motion` `AnimatePresence` with `initial={false}` to prevent mount animation on first render. Height animates via `height: "auto"` → explicit pixel values.
- **Person Lightbox** collects all people (adviser + executives + officers) into a single `allPeople` array, then finds the clicked person's index for `PersonLightbox`. This enables prev/next navigation across roles without separate state management.
- **Officer Carousel** uses native `overflow-x-auto` with `snap-x snap-mandatory` and custom scrollbar hiding via `[&::-webkit-scrollbar]:hidden`. Chosen over a carousel library because we needed exact snap behavior with custom prev/next buttons that disable at boundaries.

### ChatBot (`components/ChatBot.js`)

**Before:** Basic floating button with inline chat panel.
**After:** Dark-themed widget with mascot-driven FAB, guided menu-driven flow tree, typewriter streaming text reveal, inline thesis result cards, fullscreen toggle, and honeypot spam protection.

**Technical decisions:**

- Chatbot name now reads from CMS `siteConfig.chatbotName` — allows content editors to rebrand without code changes
- Typewriter effect uses `useState` with `setInterval` character-by-character reveal — simpler than `framer-motion` typewriter and avoids layout shift
- Messages limited to 600 chars and history capped at 10 turns — prevents Gemini context window overflow and reduces API costs
- Image `sizes` prop replaces `unoptimized` flag — Next.js Image component now handles responsive loading natively

### Navigation (`pages/_app.js`)

**Before:** Emoji-heavy banner text, broken mobile social links (pointed to generic `facebook.com` instead of project URL), search not keyboard accessible.
**After:** Clean text marquee, corrected URLs, full keyboard accessibility.

**Technical decisions:**

- Banner text changed from emoji-prefixed strings (`📅 Thesis Milestones →`) to plain text (`Thesis Milestones → Proposal → Implementation → Final Defense`) — emojis render inconsistently across OS and break the Minecraft pixel font aesthetic
- Search trigger: Added `role="button"`, `tabIndex={0}`, `onKeyDown` handler — previously only click worked, making the site unusable for keyboard-only users
- Removed redundant `<title>Ingo</title>` from `_app.js` — was overriding per-page titles set via `Head` component

### Error Pages & Document (`pages/404.js`, `pages/500.js`, `pages/_document.js`)

- **404/500**: Custom error pages with gradient header and back-to-home link — Next.js defaults show a plain white page which breaks the dark theme
- **\_document.js**: Adds `lang="en"` to `<Html>` — required for screen readers and SEO language detection; Next.js doesn't include this by default

### Scroll Animations (`components/SmoothScroll.js`, `layouts/CSBotSection.js`, `layouts/FAQ.js`)

- Integrated Lenis smooth scroll with RAF cleanup — provides buttery 60fps scroll without jank
- Scroll-triggered entrance animations on CSBotSection and FAQ using `framer-motion` `whileInView` — elements animate in as user scrolls, reducing initial page load complexity

### Responsive Overhaul

Every layout component was refactored for mobile-first responsive design:

- **Mobile filter dropdowns** replace horizontal pill rows on thesis/gallery/bulletin pages — pills overflow on small screens
- **Council section**: Adviser portrait scales from `max-w-[16rem]` (mobile) to `max-w-[28rem]` (desktop) using Tailwind responsive prefixes
- **Chatbot**: Message bubbles, card grids, and typography all have mobile-specific breakpoints
- **Footer**: 4-column grid collapses to stacked layout on mobile

---

## Performance — SSR, ISR & Real-Time

### Why ISR Over Pure CSR

The original site fetched ALL data client-side via the Prefetcher component, which meant:

1. Users saw a blank page or loading spinner until Sanity responded
2. Search engines couldn't index content (no server-rendered HTML)
3. First paint was delayed by 1-3 seconds depending on Sanity latency

**Solution:** Every list page (`awards`, `blog`, `bulletin`, `thesis`, `gallery`) now exports `getStaticProps` with `revalidate: 10`. Pages are pre-rendered at build time and automatically regenerated every 10 seconds when Sanity content changes. Search engines get fully rendered HTML; users get instant paint.

### Prefetcher Overhaul (`components/Prefetcher.js`)

**Before:** Blocking loading overlay with animated progress bar. Entire site hidden until all 6 Sanity queries resolved sequentially.
**After:** Transparent background hydration. Pages render immediately with SSR data. Prefetcher fetches remaining data silently and updates React state when ready.

**Technical details:**

- Sequential `await` calls replaced with `Promise.all` — 6 queries now run in parallel
- `AnimatePresence` / `motion` wrapper removed — was the direct cause of the blocking behavior
- Added `client.listen()` subscription for real-time updates — when content is published/unpublished in Sanity Studio, the affected data type is automatically re-fetched and React state updated without page reload

### GROQ Query Organization (`lib/groq/`)

**Before:** Every page had inline GROQ strings duplicated across files. Blog detail and list pages had the same query defined twice.
**After:** Queries extracted to `lib/groq/{blog,bulletin,thesis,awards,gallery}.js` with named exports (`BLOG_LIST_QUERY`, `BLOG_DETAIL_QUERY`, `BLOG_PATHS_QUERY`, etc.).

**Why:** Single source of truth. When we fixed the `awardRecipients` → `recipients` field rename, it was a one-line change in `lib/groq/awards.js` instead of hunting through 5 files.

### Caching Layer (`lib/cache.js`)

New `createCache()` utility with configurable TTL (default 5 min). Replaces the ad-hoc caching pattern (`let cached = null; let cacheTimestamp = 0`) that was duplicated in `siteConfig.js` and `chat.js`. Includes `invalidate(key)` for manual cache busting when webhook revalidation fires.

---

## Sanity CMS v3 Migration

### Why v3

Sanity v2 reached end-of-life. v3 provides:

- `defineType()` for TypeScript-safe schema definitions
- `@sanity/presentation` for visual live editing (editors see the live site alongside the CMS)
- Better plugin architecture and smaller bundle size

### Breaking Changes

| v2 Pattern                            | v3 Pattern                           | Why                               |
| ------------------------------------- | ------------------------------------ | --------------------------------- |
| `sanity.json`                         | `sanity.config.js` + `sanity.cli.js` | v3 uses ESM config, not JSON      |
| `createSchema()` in `schema.js`       | `export const schemaTypes = [...]`   | v3 auto-creates schema from array |
| `@sanity/desk-tool/structure-builder` | `sanity/structure`                   | Package restructured in v3        |
| React 17, styled-components 5         | React 18, styled-components 6        | v3 peer dependencies              |

### Schema Rewrite

Every schema was rewritten to use `defineType()` with field groups, orderings, and preview configs:

**`award.js`** — 296 lines → 41 lines. Removed verbose custom validators (regex checks, date range validation, cross-field badge/tag duplicate detection). Kept essential `Rule.required()` calls. **Why:** The custom validators were blocking content editors from saving drafts and provided no real security benefit — GROQ queries are read-only.

**`recipient.js`** — 149 lines → 77 lines. `fullName` changed from an object (`{firstName, middleInitial, lastName}`) to a plain string. **Why:** The object structure required complex nested GROQ projections and broke the `urlFor` slug source. A simple string is sufficient for display purposes and simplifies every query that touches recipients.

**`thesis.js`** — Reorganized into 5 field groups (basic, content, media, members, metadata). Added `imradContent` field for AI knowledge base. **Why:** The original flat structure made it hard for editors to find fields. Grouping by workflow stage (fill basic info → write content → upload media) matches how theses are actually created.

**All schemas** — Added `orderings` (newest-first default), `preview.prepare()` (shows title + subtitle + media), and `initialValue` templates. **Why:** Editors were seeing "Untitled" in the desk sidebar because there was no preview config.

### Desk Structure & Document Actions

- `deskStructure.js` — Restructured sidebar with logical groupings (Content → People → Configuration)
- `documentActions.js` — New `revalidateOnPublish` action: fires POST to `/api/revalidate` when any document is published/unpublished, triggering ISR revalidation on the affected pages

### Presentation Tool

`@sanity/presentation` installed — editors can now see a live preview of the page they're editing alongside the Sanity desk. Previously, editors had to manually open the site in a separate tab and hard-refresh to see changes.

---

## Security Hardening

### Chat API (`pages/api/chat.js`)

| Vulnerability                           | Fix                                                                                    | Why                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| IP spoofing via `x-real-ip`             | Removed fallback headers, trust only `x-forwarded-for` (Vercel proxy)                  | Attackers could spoof IP to bypass rate limits                |
| Prompt injection via oversized payloads | `MAX_MSG_LENGTH = 600`, `MAX_HISTORY_TURNS = 10`                                       | Large histories could inject instructions into Gemini context |
| Unvalidated quickAction                 | Whitelist against `["browse-thesis", "search-thesis", "about-ingo", "recent-updates"]` | Arbitrary action strings could manipulate chatbot behavior    |
| Missing Content-Type check              | Returns 415 if not `application/json`                                                  | Prevents form-encoded attacks                                 |
| Response caching                        | `Cache-Control: no-store, no-cache`                                                    | Prevents browser/proxy caching of chat responses              |

### Revalidation Endpoint (`pages/api/revalidate.js`)

- `crypto.timingSafeEqual` replaces `===` for token comparison — prevents timing attacks that could extract the token character-by-character
- `_type` validated as string, `slug` validated against `[a-zA-Z0-9\-/]` with 200-char limit — prevents injection via slug fields
- Returns structured error codes (401/400/405/500) instead of generic messages

### Security Headers (`next.config.mjs`)

Full CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, X-XSS-Protection, Referrer-Policy, Permissions-Policy (camera/microphone/geolocation disabled), X-Permitted-Cross-Domain-Policies none.

### CI/CD Workflow Security (16 workflows)

- **Template injection**: `${{ github.event.issue.body }}` replaced with `env:` variables in `monitoring-health`, `problem-detection-advisor`, `remediation-approval-gate` — prevents fork PRs from injecting arbitrary expressions
- **Permission hardening**: Added `contents: read` to all checkout-requiring workflows
- **Auto-approve**: Expression syntax fixed, restricted to same-repo PRs only

---

## Accessibility (a11y)

| Issue                                  | Fix                                                                                            | WCAG  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- | ----- |
| No skip navigation                     | Added `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>` | 2.4.1 |
| Social links unlabeled                 | Added `aria-label` to Facebook, Discord, GitHub links (desktop + mobile)                       | 4.1.2 |
| Search not keyboard accessible         | Added `role="button"`, `tabIndex={0}`, `onKeyDown` to search triggers                          | 2.1.1 |
| Chat messages not announced            | Added `role="log"`, `aria-live="polite"` to message container                                  | 4.1.3 |
| No focus indicators                    | Global `*:focus-visible { outline: 2px solid #ff5154 }` in `globals.css`                       | 2.4.7 |
| Animations cause discomfort            | `@media (prefers-reduced-motion: reduce)` disables all animations                              | 2.3.3 |
| FAQ not keyboard navigable             | Added `aria-expanded` to accordion buttons                                                     | 4.1.2 |
| Decorative SVGs confuse screen readers | Added `aria-hidden="true"` to non-informative SVGs                                             | 1.1.1 |
| Images missing alt text                | Added descriptive `alt` to ShowcaseGallery, HeroCarousel, council photos                       | 1.1.1 |
| `@axe-core/react` broke React 18       | Removed incompatible integration, replaced with `scripts/a11y-audit.js` build script           | —     |

---

## API Routes

| Endpoint          | Method | Purpose                                                                         |
| ----------------- | ------ | ------------------------------------------------------------------------------- |
| `/api/health`     | GET    | Verifies Sanity connectivity + Gemini API key (dev only, blocked in production) |
| `/api/revalidate` | POST   | Receives Sanity webhook → triggers ISR revalidation on affected pages           |
| `/api/chat`       | POST   | Gemini AI chatbot with rate limiting, input validation, CMS-driven config       |

---

## Error Handling

- All 5 detail pages (`[slug].js`): `try/catch` around `getStaticPaths` and `getStaticProps` → returns `{ notFound: true }` instead of crashing
- `lib/sanity.js` `buildSiteContext()`: `Promise.all` → `Promise.allSettled` — partial data failures no longer crash the entire AI context builder
- `lib/siteConfig.js`: `try/catch` around fetch with error logging and empty-object fallback
- `ErrorBoundary` component wraps entire app in `_app.js` — catches React rendering errors globally

---

## Files Changed

| Category           | Files | Key Changes                                                |
| ------------------ | ----- | ---------------------------------------------------------- |
| **Pages**          | 15    | ISR, error pages, GROQ extraction, components showcase     |
| **Components**     | 12    | Accessibility, ChatBot, Prefetcher, ErrorBoundary          |
| **Layouts**        | 8     | Council redesign, Hero, FAQ, CSBot, Footer                 |
| **Lib**            | 8     | Caching, GROQ org, Sanity client v7, siteConfig            |
| **Styles**         | 1     | `focus-visible`, `prefers-reduced-motion`                  |
| **Studio Schemas** | 10    | `defineType`, field groups, simplification                 |
| **Studio Config**  | 5     | v3 migration, presentation tool, document actions          |
| **API Routes**     | 3     | Health, revalidate, hardened chat                          |
| **CI/CD**          | 16    | Security scanning, build validation, deployment            |
| **GitHub Config**  | 8     | Templates, CODEOWNERS, dependabot                          |
| **Tests**          | 2     | Jest + SWC, utility tests                                  |
| **Root Config**    | 7     | .nvmrc, .gitignore, next.config, package.json, vercel.json |

---

## Deleted Files

| File                        | Why                                       |
| --------------------------- | ----------------------------------------- |
| `components/Navbar.js`      | Unused — navigation is in `_app.js`       |
| `components/Footer.js`      | Unused — footer is in `layouts/Footer.js` |
| `pages/_app-backup.js`      | Dead backup file                          |
| `pages/index-backup.js`     | Dead backup file                          |
| `studio/sanity.json`        | Replaced by `sanity.config.js` (v3)       |
| `studio/.eslintrc`          | Merged into root ESLint config            |
| `studio/tsconfig.json`      | Not needed in v3                          |
| `studio/config/*` (5 files) | Default v2 config, unused in v3           |

---

## New Dependencies

| Package                  | Purpose                         |
| ------------------------ | ------------------------------- |
| `jest` + `@swc/jest`     | Unit testing with SWC transform |
| `husky` + `lint-staged`  | Pre-commit hooks                |
| `@sanity/presentation`   | Visual live editing             |
| `@sanity/vision`         | GROQ query testing              |
| `@sanity/client` (v3→v7) | Upgraded Sanity client          |

---

## Testing Checklist

- [ ] `npm run build` passes
- [ ] All pages render at `localhost:3000`
- [ ] Sanity Studio v3 starts (`cd studio && npx sanity dev`)
- [ ] Council year selector switches between sets
- [ ] Officer lightbox opens on click with prev/next navigation
- [ ] ChatBot responds to messages
- [ ] `/api/health` returns status (dev only)
- [ ] `/api/revalidate` accepts POST with valid token
- [ ] Security headers visible in browser DevTools → Network → Response Headers
- [ ] Tab key navigates through all interactive elements (skip-to-content, search, nav links)
- [ ] Social links point to correct project URLs
- [ ] Custom 404/500 pages display correctly
- [ ] ISR pages show server-rendered content (view source → HTML contains data)

---

## Notes for Reviewers

1. **`recipient.fullName` changed from object to string.** Existing Sanity documents may need manual migration. Check that award recipient names still display correctly in `/awards/[slug]`.
2. **Prefetcher no longer shows a loading screen.** Pages may flash briefly with empty state before client-side data hydrates. This is expected — SSR provides the initial content, Prefetcher enhances it.
3. **Sanity v3 migration is the highest-risk area.** Test all 8 content types in the Studio before merging. Pay special attention to the `award` and `recipient` schemas which had the largest rewrites.
4. **CI workflows use `env:` for secrets.** No `${{ }}` expressions that could be exploited by fork PRs. Verify in the Actions tab that all workflows pass.
5. **The `vercel-deploy.yml` workflow** is included but should be reviewed against your Vercel project configuration.

---

## Acknowledgements

This PR builds on the foundational work of the UCC BSCS development team. Special thanks to the following collaborators for their contributions to the codebase:

| Contributor       | GitHub                                         | Contributions                                                                                                                                              |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ike Andrie        | [@aikhe](https://github.com/aikhe)             | Frontend lead — header, hero, 3D scene, awards gallery, council, chatbot, footer, search, pagination, responsive overhaul, Next.js v15 migration           |
| Genrey            | [@Genrei123](https://github.com/Genrei123)     | Gallery of Works, chatbot UI & icons, searchbar functionality, CMS integration (Dev Team, Thesis, Council), color theme system, accessibility improvements |
| Daniel Baladad    | [@dannnnnno-o](https://github.com/dannnnnno-o) | Navbar social icons, footer social links                                                                                                                   |
| Mary Joy Sembrero | [@mary-xn](https://github.com/mary-xn)         | Awards detail page, component refactoring, code cleanup                                                                                                    |
| Jack (jack040301) | [@jack040301](https://github.com/jack040301)   | Backend schemas — author, blog, bulletin, thesis                                                                                                           |
| Gerald Chavez     | [@million23](https://github.com/million23)     | Sanity vision setup, schema verification, sample data                                                                                                      |
