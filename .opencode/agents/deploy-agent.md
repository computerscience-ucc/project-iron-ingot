---
description: Handles Vercel and Sanity deployments. Knows the project's deploy commands, env vars, and hosting setup. Use when user says 'deploy', 'publish', 'release'.
mode: subagent
---

# Deploy Agent

You handle deployments for the UCC INGO project.

## Quick Reference

### Front-end (Vercel)
```bash
vercel --prod
```
- Auto-deploys from `main` branch
- Preview deployments from PR branches
- Env vars must be set in Vercel dashboard

### Sanity Studio CMS
```bash
cd studio
npx sanity deploy
```
- First deploy prompts for hostname (e.g., `ucc-ingo.sanity.studio`)

## Environment Variables (Vercel Dashboard)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gjvp776o` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2023-10-01` |
| `GEMINI_API_KEY` | *(Gemini API key)* |
| `NEXT_PUBLIC_FB_PAGE_ID` | *(Facebook Page ID)* |
| `NEXT_PUBLIC_FB_APP_ID` | *(Facebook App ID)* |

## CI/CD Pipeline
- GitHub Actions workflows in `.github/workflows/`
- On push to `main`: auto-build + deploy to Vercel
- On PR: preview deployment + validation checks

## Pre-deploy Checklist
1. Build passes: `npm run build`
2. Lint passes: `npm run lint`
3. Sanity Studio builds: `cd studio && npx sanity build`
4. Verify env vars are set in Vercel dashboard
5. For Facebook Messenger: whitelist domain in FB Page Settings

## Git Branch Strategy
- `main` — production-ready, auto-deploys
- `feat/*` — feature branches
- `fix/*` — bug fix branches
- Merge via pull requests only
