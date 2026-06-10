# Phase 5: Quality & Developer Experience

## Overview
Six enhancements to harden the UCC INGO project: fix Sanity build, add testing, health check, components showcase, pre-commit hooks, and accessibility audit.

---

## Slice Plan

| # | Task | Files | Est. Commits |
|---|------|-------|-------------|
| 1a | **Sanity Fix** — rename `.js` → `.jsx` for all schema files | 12 files + imports | 1 |
| 1b | **Sanity Fix** — verify build passes | — | 1 |
| 2 | **Health Check API** — `GET /api/health` with Sanity, Gemini, FB status | `pages/api/health.js` | 1 |
| 3a | **Testing Setup** — Install Jest, RTL, create config | `jest.config.js`, `package.json` | 1 |
| 3b | **Tests** — Write unit tests for FacebookMessenger | `__tests__/FacebookMessenger.test.jsx` | 1 |
| 4 | **Pre-commit Hooks** — Husky + lint-staged | `.husky/`, `package.json` | 1 |
| 5 | **Components Showcase** — `/dev/components` page | `pages/dev/components.js` | 1 |
| 6a | **Accessibility Audit** — Scan + identify issues | `a11y-report.md` | 1 |
| 6b | **Accessibility Fixes** — Fix issues found | multiple components | 1 |
| 7 | **Final Verification** — Build+Lint+Test+PR update | `PR.md` | 1 |

---

## Implementation Order

1. **Sanity Fix** — unblocks the only failing build
2. **Health Check** — simple standalone API route
3. **Testing** — setup + write tests
4. **Pre-commit Hooks** — lock in code quality
5. **Components Showcase** — developer utility page
6. **Accessibility** — audit then fix
7. **Final Verification** — build, lint, test all pass

---

## Commit Strategy
One commit per meaningful change. Each commit message follows:
```
type(scope): description
```
Examples:
```
fix(studio): rename schema .js files to .jsx for Vite compatibility
feat(api): add /api/health endpoint for monitoring
test: set up Jest and React Testing Library
test: add unit tests for FacebookMessenger component
chore(hooks): add Husky pre-commit hooks with lint-staged
feat(dev): create /dev/components showcase page
a11y: audit and fix accessibility issues
docs: update PR.md with Phase 5 changes
```
