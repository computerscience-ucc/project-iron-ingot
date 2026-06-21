# Platform Hardening PR Guide — UCC INGO

## Summary

This PR hardens platform reliability, security posture, and maintainability for the UCC INGO BSCS Information Board.

## What changed

### 1) Dependency and supply-chain hardening

- Updated Next.js and related packages to latest stable versions
- Refreshed `package-lock.json` via `npm install`
- Applied safe transitive updates via `npm audit fix`
- Updated Sanity dependencies to latest v3

### 2) CI and workflow optimization

- Consolidated duplicate PR triggers in build workflow
- Updated monitoring endpoints for UCC INGO deployment
- Fixed Windows compatibility issues in studio dev scripts

### 3) Chat API security

- Added rate limiting per IP (10 requests/minute)
- Added honeypot anti-bot protection
- Added environment variable validation for Gemini API key
- Added request body size limits

### 4) Environment hygiene

- Updated `.env.example` with required variables
- Documented Sanity project configuration
- Added Vercel deployment environment variables

### 5) Error handling

- Added ErrorBoundary component for rendering errors
- Added error logging to Sanity via `/api/log-error`
- Added per-section error boundaries for graceful degradation

### 6) Content delivery

- Implemented stale-while-revalidate in Prefetcher
- Added real-time subscription via `client.listen()`
- Added ISR webhook receiver for on-demand cache invalidation

## Validation run

- `npm run lint` — 0 errors
- `npm run build` — Successful production build

## Reviewer checklist

- [ ] Confirm lint passes with 0 errors
- [ ] Confirm build completes successfully
- [ ] Confirm chatbot functionality works
- [ ] Confirm content updates propagate correctly
- [ ] Confirm error boundaries catch rendering errors
- [ ] Confirm ISR cache invalidation works via webhook
