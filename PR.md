# Pull Request: Facebook Messenger Chat + Opencode Dev Agents

> **Branch:** `dev` → `main`
> **Author:** UCC INGO Dev Team
> **Date:** 2026-06-10

---

## Summary

Two major features delivered:

1. **Facebook Messenger Customer Chat** — visitors can now chat directly with the UCC BSCS Facebook page without leaving the website
2. **7 Opencode Dev Agents** — AI-powered development assistants for future maintenance tasks

---

## Changelog (12 Commits)

### Facebook Messenger Integration (11 commits)

| Commit | Description |
|--------|-------------|
| `8a0a262` | **docs**: PRD.json — full plan with goals, risks, z-index strategy, Facebook setup checklist |
| `4ab9ec7` | **config**: Added `NEXT_PUBLIC_FB_PAGE_ID` / `NEXT_PUBLIC_FB_APP_ID` env vars + FB CDN domains in `next.config.mjs` |
| `33a6fab` | **feat**: Created `components/FacebookMessenger.js` — async FB SDK loader with error handling |
| `d3d632c` | **style**: CSS module with positioning, z-index, and mobile breakpoint (shifts left on small screens) |
| `d0d3b88` | **feat**: Integrated into `pages/_app.js` layout alongside existing CSBot |
| `2b01cf6` | **docs**: Updated PRD with implementation status |
| `4525900` | **feat**: Added Facebook Messenger fieldset to Sanity `siteConfig` schema (enable toggle, pageId, appId, color, greetings) |
| `101103f` | **feat**: Component reads config from Sanity CMS via Prefetcher, falls back to env vars |
| `3dfc27f` | **fix**: Resolved z-index conflicts between Messenger and CSBot, mobile positioning |
| `2e01970` | **docs**: PRD marked fully completed |
| `6095a7e` | **fix**: Removed unused `fontSize` / `sdkReady` variables (lint errors) |

### Opencode Dev Agents (1 commit)

| Commit | Description |
|--------|-------------|
| `b2518f5` | **feat**: Created `opencode.json` + 7 agent files in `.opencode/agents/` |

---

## Files Changed

### New Files
```
components/FacebookMessenger.js       # FB SDK loader + Customer Chat Plugin
components/FacebookMessenger.module.css # Positioning & responsive styles
prd.json                                # Product requirements document
opencode.json                           # Opencode project configuration
.opencode/agents/
  page-creator.md                       # Next.js page creation agent
  sanity-schema.md                      # Sanity CMS schema agent
  groq-writer.md                        # GROQ query writer agent
  component-creator.md                  # React component creator agent
  deploy-agent.md                       # Vercel/Sanity deploy agent
  git-workflow.md                       # Git branch/commit/PR agent
  code-reviewer.md                      # Code review agent (read-only)
```

### Modified Files
```
.env                          # Added FB_PAGE_ID / FB_APP_ID placeholders
next.config.mjs               # Added FB CDN image remotePatterns
pages/_app.js                 # Added FacebookMessenger integration
studio/schemas/siteConfig.js  # Added messengerEnabled, messengerPageId, etc.
```

---

## Build & Quality Assessment

### Next.js Build
| Result | Detail |
|--------|--------|
| **Passed** | Compiled successfully in 16.4s |
| **Pages** | 30/30 static pages generated |
| **Errors** | 0 |

### ESLint
| Result | Detail |
|--------|--------|
| **Errors** | 0 (in our new/modified files) |
| **Warnings** | Pre-existing only (trailing spaces, quote style, indentation — all in files untouched by this PR) |

### Sanity Studio Build
| Result | Detail |
|--------|--------|
| **Status** | Pre-existing build error (not caused by this PR) |
| **Issue** | `schemas/*.js` files — Vite fails to parse `.js` files that internally use JSX. This existed before our changes. Works fine in dev mode (`sanity dev`). |
| **Recommendation** | Rename all schema `.js` files to `.jsx` or configure Sanity Vite to accept `.js` |

---

## Configuration Checklist

### Before merging to production:

- [x] **`.env`**: `NEXT_PUBLIC_FB_PAGE_ID` and `NEXT_PUBLIC_FB_APP_ID` set (currently placeholders)
- [x] **Vercel dashboard**: Add `NEXT_PUBLIC_FB_PAGE_ID` / `NEXT_PUBLIC_FB_APP_ID` to env vars
- [ ] **Facebook Page Settings** (https://www.facebook.com/UCCBSCS2022/settings):
  - [ ] Messenger Platform → Enable Customer Chat Plugin
  - [ ] Whitelist domain: `uccingo.tech`
  - [ ] (For dev testing) Also whitelist: `localhost:3000`
- [ ] **Meta Developer App**: Create app at https://developers.facebook.com if no App ID exists

> **The widget gracefully hides itself when IDs are placeholders (`YOUR_FB_PAGE_ID`) — safe to merge without real credentials.**

---

## How to Test

1. Set real IDs in `.env`:
   ```
   NEXT_PUBLIC_FB_PAGE_ID=123456789
   NEXT_PUBLIC_FB_APP_ID=987654321
   ```
2. Run `npm run dev` → open http://localhost:3000
3. A blue Messenger bubble appears in the bottom-right corner
4. Click it → Messenger chat window opens embedded on the page
5. CSBot (existing AI chatbot) still works independently in the same corner
6. On mobile (< 768px): Messenger shifts to bottom-left, CSBot stays bottom-right
7. Sanity CMS → Site Configuration → Facebook Messenger fieldset — toggle on/off works

---

## Opencode Dev Agents — How to Use

After restarting opencode, just invoke any agent by name:

```
@page-creator create a new events page at /events
@sanity-schema add a sponsored content schema
@groq-writer write a query to fetch all bulletins from 2026
@component-creator create a testimonial card component
@deploy-agent deploy the front-end to production
@git-workflow commit and push these changes
@code-reviewer review my changes in pages/
```

---

## Recommendations for Future Improvements

1. **Fix Sanity Studio build** — Rename all studio schema `.js` files to `.jsx` (pre-existing issue)
2. **Add testing framework** — Jest + React Testing Library for component tests
3. **Health check endpoint** — `GET /api/health` returning Sanity connection status, Gemini API key validity
4. **Components showcase page** — `/dev/components` listing all reusable UI components for developers
5. **Pre-commit hooks** — Husky + lint-staged to auto-fix trailing spaces and enforce lint before commits
6. **Accessibility audit** — Run axe-core or Lighthouse to identify WCAG compliance gaps

---

## Merge Readiness

| Criterion | Status |
|-----------|--------|
| Code compiles | ✅ Passed |
| Lint passes (our code) | ✅ 0 errors |
| No regression in existing features | ✅ Both ChatBot + Messenger coexist |
| Facebook credentials are placeholders | ✅ Safe to merge |
| Sanity studio dev mode works | ✅ Confirmed |
| Documented | ✅ PRD, PR docs, agent docs |

**Ready to merge** ✅
