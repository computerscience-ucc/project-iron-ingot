# CI Fix PR Guide — UCC INGO

## PR setup

- **Branch:** `fix/ci-validation`
- **Base:** `main`

## Common CI failures and fixes

### 1. ESLint errors

```bash
# Run lint locally
npm run lint

# Fix auto-fixable issues
npx next lint --fix
```

**Common issues:**
- Unused variables → Remove or prefix with `_`
- Missing dependencies in useEffect → Add to dependency array
- Trailing spaces → Remove whitespace
- Indentation errors → Use 2-space indent

### 2. Build failures

```bash
# Run build locally
npm run build
```

**Common issues:**
- Missing imports → Check file paths and case sensitivity
- SSR/CSR mismatch → Use `useEffect` for client-only code
- Image optimization → Ensure images are in `public/` directory
- Sanity API errors → Check environment variables

### 3. Sanity Studio issues

```bash
# Restart studio
cd studio && npx sanity dev
```

**Common issues:**
- Schema errors → Check `studio/schemas/schema.js` imports
- Missing fields → Ensure all fields are defined in schema
- Desk structure errors → Check `studio/deskStructure.js`

### 4. Chat API failures

```bash
# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

**Common issues:**
- Missing `GEMINI_API_KEY` → Add to `.env`
- Rate limiting → Wait 3 seconds between requests
- Invalid requests → Check request body format

### 5. ISR/Revalidation issues

```bash
# Test revalidation endpoint
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"_type": "blog", "slug": "test"}'
```

**Common issues:**
- Missing `SANITY_API_TOKEN` → Add to `.env`
- Invalid slug → Check slug exists in Sanity
- Path not found → Verify route exists in `pages/`

## Validation steps

Before submitting PR:

1. `npm run lint` — Must pass with 0 errors
2. `npm run build` — Must complete successfully
3. Manual testing — Verify affected pages work correctly

## Commit message format

```
fix(scope): description

- Detail 1
- Detail 2
```

Example: `fix(blog): fix slug generation for special characters`
