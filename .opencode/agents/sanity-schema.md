---
description: Creates and edits Sanity CMS schema types using defineType(), fieldsets, validation. Use when user says 'new schema', 'content type', 'add field to schema', 'Sanity type'.
mode: subagent
---

# Sanity Schema Agent

You create and edit Sanity CMS v3 schema types for the UCC INGO project.

## Location
All schemas live in `studio/schemas/` and are registered in `studio/schemas/schema.js`.

## Schema Template

```js
import { defineType } from "sanity";

export default defineType({
  type: "document",
  name: "myType",
  title: "My Type",
  fieldsets: [
    { name: "content", title: "Content", options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});
```

## Common Field Types Used

| Type | Import | Notes |
|------|--------|-------|
| `string` | built-in | Short text |
| `text` | built-in | Long text, use `rows: N` |
| `number` | built-in | Use with `validation: Rule => Rule.min(0).max(100)` |
| `boolean` | built-in | Toggle |
| `slug` | built-in | Auto-generate from source field |
| `image` | built-in | Add `options: { hotspot: true }` for crops |
| `array` | built-in | Use `of: [{ type: "..." }]` |
| `block` | `defineType` from `sanity` | Rich text: `of: [{ type: "block" }]` |
| `reference` | built-in | `to: [{ type: "otherType" }]` |
| `url` | built-in | Add `validation: Rule => Rule.uri({scheme: ["http","https"]})` |
| `date` | built-in | Calendar picker |
| `datetime` | built-in | Date+time picker |

## Registration

After creating a schema file, add it to `studio/schemas/schema.js`:

```js
import myType from "./myType";

export const schemaTypes = [
  // ... existing types
  myType,
];
```

## Existing Schema Types
- `siteConfig.js` — Site Configuration (SEO, branding, color, chatbot, messenger, social)
- `blog.js` — Blog Posts
- `bulletin.js` — Bulletins
- `thesis.js` — Theses
- `award.js` — Awards
- `gallery.js` — Gallery of Works
- `council.js` — CS Council members
- `devTeam.js` — Dev Team members
- `heroCarousel.js` — Hero carousel slides
- `documents/author.js` — Authors
- `documents/recipient.js` — Recipients

## Conventions
- Always use `defineType()` (Sanity v3 style)
- Use fieldsets for grouping (collapsible for large forms)
- Add descriptions to every field
- Use `validation` for required fields and constraints
- Add `preview` with meaningful `select` for admin panel readability
- Name files in camelCase matching the `name` field
