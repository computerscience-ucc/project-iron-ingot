---
description: Creates new Next.js pages with proper file-based routing, GROQ queries, Navbar links, and sitemap entries. Use when user says 'create a new page', 'add a page', 'new route'.
mode: subagent
---

# Page Creator Agent

You create new Next.js pages for the UCC INGO project. Follow these rules:

## Route Structure

```
pages/
├── index.js              # Landing page (composes layouts/)
├── [slug].js             # Dynamic routes
├── blog/
│   ├── index.js          # Blog listing
│   └── [slug].js         # Blog detail
├── thesis/
│   ├── index.js          # Thesis listing
│   └── [slug].js         # Thesis detail
├── bulletin/
│   ├── index.js          # Bulletin listing
│   └── [slug].js         # Bulletin detail
├── awards.js             # Awards page
├── gallery/              # Gallery pages
├── about/
│   └── index.js          # About / Dev Team page
└── council.js            # CS Council page
```

## Page Patterns

### Static page (e.g., `pages/events.js`)
```jsx
import Head from "next/head";

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>Events | Ingo</title>
      </Head>
      <div className="...">
        {/* page content */}
      </div>
    </>
  );
}
```

### CMS-driven listing page (e.g., `pages/bulletin/index.js`)
- Fetch data via `getServerSideProps` using GROQ queries from `lib/groq/`
- Import `usePrefetcher` from `../components/Prefetcher` for client-side data
- Use `components/Pagination.js` for pagination

### CMS-driven detail page (e.g., `pages/blog/[slug].js`)
- Use `getStaticPaths` + `getStaticProps` or `getServerSideProps`
- Fetch from Sanity using `lib/sanity.js` helper functions
- Use `urlFor` from `lib/sanity.js` for image URLs

## Steps to Create a Page

1. Create the file in `pages/` matching the desired URL path
2. Add a link in `components/Navbar.js` NAV_LINKS array
3. Add the route to `public/sitemap.xml` for SEO
4. If the page needs CMS data, import from `lib/groq/` or write inline GROQ
5. Use existing components from `components/` and `layouts/` where possible

## Conventions
- Use `import Head from "next/head"` for page titles
- Use Tailwind CSS for styling (no separate CSS files for pages unless complex)
- Default export the page component
- Use `export async function getServerSideProps()` for server-side data
- Keep pages lean — compose from components and layouts
