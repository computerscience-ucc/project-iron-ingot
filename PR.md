# Comprehensive Codebase Overhaul: UI/UX Redesign, Sanity v3 Migration, CI/CD Pipeline, Security & Accessibility Audit

> **Base:** `computerscience-ucc:main` → **Head:** `aikhe:dev`
> **Files changed:** 243 | **Additions:** 39,150 | **Deletions:** 25,151

---

## Summary

This is a comprehensive overhaul of the UCC INGO (BSCS Information Board) project covering **8 major workstreams** across 100+ commits. It includes a full UI/UX redesign with mascot-driven interactions, migration from Sanity v2 to v3, a complete CI/CD pipeline with security scanning, and a thorough accessibility/security audit.

---

## Contributors

| Contributor        | GitHub       | Focus Areas                                         |
| ------------------ | ------------ | --------------------------------------------------- |
| Jhon Keneth Namias | @aikhe       | Project lead, UI/UX design, Sanity migration, CI/CD |
|                    | @dannnnnno-o | Audit fixes, security hardening, accessibility      |

---

## 🎨 UI/UX Design Changes

### Homepage Redesign (`pages/index.js`, `layouts/*.js`)

- **Hero Section**: Interactive mascot carousel with 11 randomized bot illustrations, Minecraft pixel font branding, ambient red glow backdrop, draggable image carousel with spring-animated dot pagination
- **3D Tech Stack Scene**: Three.js isometric wireframe boxes with marquee text labels ("PUBLIC INFORMATION BOARD", "PROJECT DISCOVERY SHOWCASE", "STUDENT COLLABORATIVE NETWORK"), elastic spin animations, orthographic camera
- **Awards Gallery**: 3D robot-head spotlight carousel — mascot projects a downward ray illuminating the center card, drag/swipe support, spring-physics transitions, custom cursor, square-aspect-ratio cards
- **Meet the Council**: Parallax scrolling header, year-selector pills, dashed-border adviser portrait with red corner alignment markers, horizontally-scrollable officer cards, expandable committee accordions
- **Latest on Ingo**: 3 thematic rows of article cards with gradient masks, alternating layouts, multi-tag support
- **CS Bot Section**: Mascot-driven CTA section
- **FAQ Section**: Snappy accordion transitions with scroll-triggered animations
- **Footer**: 4-column grid with pixel-font "UCCINGO" SVG watermark, social icon links, contact CTA

### ChatBot Redesign (`components/ChatBot.js`)

- Dark-themed floating widget with **mascot-driven FAB** (animated red-gradient button)
- Guided menu-driven flow tree (thesis, blogs, bulletins, awards, about)
- Typewriter streaming text reveal with markdown parsing (bold/italic/code)
- Inline thesis result cards with banner images and tags
- Fullscreen toggle, honeypot spam protection, cooldown rate-limiting progress bar
- Rebranded to "Ingo Bot & Assistance on the Go!"

### Navigation & Search

- **Navbar**: Active page indicator, hover color transitions, desktop dropdown with 400ms z-index delay, mobile drawer with handle
- **Search Modal**: Command-palette style with blurred overlay, instant client-side filtering across all content types, categorized results with red type labels and tag chips, keyboard-dismiss
- **Pagination**: Centered UI with ellipsis signaling, instant scroll-to-top

### Design System

- Custom scrollbar styling applied globally
- Dashed border aesthetic with red corner alignment marks
- Minecraft pixel font for branding elements
- Responsive overhaul across all breakpoints (mobile → desktop)
- Spring-physics animations via framer-motion throughout

---

## 🔒 Security Fixes

### API Routes

- **`revalidate.js`**: Timing-safe token comparison (`crypto.timingSafeEqual`), slug validation, Cache-Control headers
- **`chat.js`**: Fixed IP spoofing (removed `x-real-ip` fallback), whitelisted quickAction values, Content-Type validation, chat history limited to 10 turns, prompt injection prevention
- **`health.js`**: Sanitized endpoint to remove configuration detail leakage, restricted to development mode

### Headers & Config (`next.config.mjs`)

- Content-Security-Policy with nonce-based script loading
- Strict-Transport-Security (HSTS) with includeSubDomains
- X-XSS-Protection, X-Permitted-Cross-Domain-Policies
- Clickjacking and MIME sniffing prevention

### CI/CD Security (16 workflow files)

- **Template injection fixes**: All `${{ }}` expressions replaced with `env:` variables in problem-detection-advisor, remediation-approval-gate, monitoring-health
- **Permission hardening**: Added `contents: read` to gitleaks, trivy-fs, osv-scanner, checkov, scorecard, security-compliance (CodeQL)
- **Auto-approve**: Fixed expression syntax, restricted to same-repo PRs only

---

## ♿ Accessibility (a11y) Fixes

- Skip-to-content link for keyboard navigation
- `aria-label` on all social icon links (desktop + mobile)
- `aria-expanded` on FAQ accordion
- `aria-hidden` on decorative SVG elements
- `role="log"` and `aria-live="polite"` on chat messages
- `focus-visible` outline styles for keyboard users
- `prefers-reduced-motion` media query to disable animations
- Keyboard-accessible search triggers
- `aria-label` on search modal input
- `aria-current` on pagination buttons
- Descriptive alt text on ShowcaseGallery images
- Removed broken `@axe-core/react` (incompatible with React 18)

---

## 🗄️ Sanity CMS v3 Migration

### Studio Overhaul (`studio/`)

- Migrated from `sanity.json` → `sanity.config.js` + `sanity.cli.js`
- All schemas use `defineType()` from `sanity` package
- Desk structure uses `sanity/structure` instead of `@sanity/desk-tool/structure-builder`
- Added field groups to blog, bulletin, gallery, thesis, award schemas
- Added production preview URLs for all content types
- Simplified award schema (117 → 35 lines) and recipient schema (273 → 80 lines)
- Added orderings and initial values to all schemas
- Added `documentActions.js` with webhook-triggered revalidation on publish/unpublish
- Added Authorization header to revalidation fetch (fixed 401 errors)

### Data Layer (`lib/`)

- Organized GROQ queries into `lib/groq/` directory (blog, bulletin, thesis, gallery, awards)
- Fixed broken GROQ queries (`awardRecipients` → `recipients`, `fullName` as string)
- Removed non-existent fields from gallery and thesis detail queries
- Refactored `buildSiteContext` to use `Promise.allSettled` for partial failure resilience
- Added try/catch to `fetchSiteConfig`
- Created `lib/cache.js` for SWR-based caching pattern
- Upgraded `@sanity/client` from v3 to v7

### ISR & Live Updates

- Created `/api/revalidate` webhook receiver for on-demand ISR
- Added `client.listen()` subscription for real-time content updates
- Added `@sanity/presentation` for visual live editing
- Added `getStaticProps` with ISR to all 5 list pages

---

## 🐛 Error Handling

- Custom `404.js` and `500.js` error pages
- `_document.js` with `lang="en"` attribute
- Try/catch wrappers on `getStaticPaths` and `getStaticProps` in all detail pages (blog, bulletin, thesis, gallery)
- `ErrorBoundary` component added
- `fetchSiteConfig` wrapped in try/catch with fallback

---

## ⚡ Performance

- Added `sizes` prop to HeroCarousel images for responsive loading
- Removed `unoptimized` flag from ChatBot images
- Replaced blocking Prefetcher with SWR pattern, removed loading overlay
- Added `getStaticProps` with ISR to all list pages

---

## 🧪 Testing & DevOps

### New Testing Infrastructure

- Jest configuration with SWC transform
- ESLint configured with Jest globals
- `__tests__/FacebookMessenger.test.jsx` and `__tests__/utils.test.js`
- Pre-commit hook via Husky with lint-staged

### CI/CD Pipeline (16 workflow files)

- `build.yml` — Production build validation
- `pr-validation.yml` — PR quality and security checks
- `auto-approve.yml` — Auto-approve for same-repo PRs
- `vercel-deploy.yml` — Vercel deployment
- Security scanning: gitleaks, trivy-fs, osv-scanner, checkov, scorecard, zizmor, security-compliance (CodeQL)
- Monitoring: daily-health-check, monitoring-health, problem-detection-advisor, remediation-approval-gate
- Dependabot configuration for automated dependency updates
- CODEOWNERS file for code review assignments

### Developer Experience

- 7 opencode agents for UCC INGO (code-reviewer, component-creator, deploy-agent, git-workflow, groq-writer, page-creator, sanity-schema)
- `.nvmrc` updated to Node 22
- `.gitignore` expanded to cover all env file variants
- `.env.example` with all required variables
- Components showcase page (`pages/dev/components.js`) for visual review
- A11y audit script (`scripts/a11y-audit.js`)

---

## 📦 New Features

- **Facebook Messenger Integration**: Customer Chat SDK component with CMS-driven configuration, z-index conflict resolution, env variable fallback
- **Search Modal**: Global command-palette search across all content types
- **Pagination System**: Blog, bulletin, thesis, and gallery pages
- **3D Tech Stack Scene**: Three.js isometric visualization
- **Mascot System**: 11 bot illustrations used throughout (hero, chatbot, council, footer)
- **Council Section**: Year-selector, committee accordions, adviser portrait, officer cards with lightbox
- **Awards Gallery**: 3D spotlight carousel with drag/swipe

---

## 🗂️ Code Quality

- Removed dead code: `Navbar.js`, `Footer.js`, `_app-backup.js`, `index-backup.js`
- Removed unused React imports across components
- Fixed trailing whitespace and lint errors
- Fixed schema typos ("searcheable" → "searchable")
- SmoothScroll RAF cleanup
- Reorganized component directory structure (Home/Awards, Home/Hero, Home/LatestOnIngo, Home/MeetCouncil)

---

## 📄 Documentation

- `AGENTS.md` — Comprehensive handoff documentation for future officers
- `README.md` — Complete rewrite with content management guide, screenshots, live links
- `prd.json` — Phase-by-phase PRD with status tracking
- `.github/` — Issue templates (bug, feature, custom, CI/CD, security), CODEOWNERS, CI_PR_GUIDE, HARDENING_PR_GUIDE
- `studio/README.md` — Updated for v3

---

## Merge Checklist

- [ ] All CI checks passing (build, lint, security scans)
- [ ] Vercel preview deployment successful
- [ ] Sanity Studio v3 running correctly
- [ ] ChatBot functional with Gemini API
- [ ] All pages rendering without console errors
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Accessibility audit passed (skip-to-content, keyboard nav, screen reader)
- [ ] Security headers present in production
