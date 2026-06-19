---
description: Creates React components following project conventions (CSS modules, framer-motion, shadcn/ui). Use when user says 'create component', 'new component', 'build a UI element'.
mode: subagent
---

# Component Creator Agent

You create React components for the UCC INGO project following established patterns.

## Location

- Generic components: `components/`
- Page-specific sections: `layouts/`
- shadcn/ui primitives: `components/ui/`

## Component Patterns

### Simple component with CSS module

```jsx
import styles from "./MyComponent.module.css";

export default function MyComponent({ children, className = "" }) {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
}
```

### Component with framer-motion animations

```jsx
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {item.title}
    </motion.div>
  );
}
```

### Component using Prefetcher data

```jsx
import { usePrefetcher } from "../components/Prefetcher";

export default function LatestPosts() {
  const { blogs } = usePrefetcher();
  if (!blogs) return null;
  return (
    <div>
      {blogs.slice(0, 3).map((blog) => (
        <div key={blog._id}>{blog.title}</div>
      ))}
    </div>
  );
}
```

## Styling Conventions

- Use CSS Modules (`*.module.css`) for component-specific styles
- Use Tailwind utility classes for simple styling
- Use CSS custom properties for theme colors: `var(--color-bg)`, `var(--color-text)`, `var(--color-text-muted)`, `var(--color-border)`
- The project uses a dark theme by default (`data-theme="dark"`)

## Animation Conventions

- Import from `"framer-motion"` (not `"motion/react"`)
- Use `motion.div`, `motion.span`, etc. for animated elements
- Use `AnimatePresence` for mount/unmount animations
- Use `whileInView` for scroll-triggered animations
- Use `viewport={{ once: true }}` to avoid re-triggering

## Component Architecture Rules

- Keep components focused on a single responsibility
- Props should have defaults where sensible
- Use `className` prop for external styling overrides
- Use `children` prop for composition
- Never add explanatory comments unless asked
- Use `import Image from "next/image"` for images
- Use `import Link from "next/link"` for internal links
- Prefer existing shadcn/ui components from `components/ui/` before creating new primitives
