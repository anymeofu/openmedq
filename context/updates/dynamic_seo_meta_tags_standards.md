# Dynamic SEO Meta Tag Standards for SPAs

This document establishes the patterns and standards for managing search engine optimization (SEO) and social preview metadata in a client-side routed Single Page Application (SPA).

## 🚨 The Challenge
By default, an SPA served from a static hosting provider (like Cloudflare Pages) uses a single physical `index.html` entry point. 
* **The Problem**: When crawlers (such as Googlebot) or social parser scrapers (such as Twitter, Discord, or WhatsApp) inspect subpage links (e.g. `/download` or `/contribute`), they only read the static default metadata inside the initial `index.html` if it isn't dynamically rewritten during rendering.
* **Remediation**: While Server-Side Rendering (SSR) is the ideal strategy, for client-only SPAs, the application must use React hooks to rewrite browser metadata (`document.title`, description tags, and Open Graph attributes) immediately upon route/view transition.

---

## 🛠️ Standards and Remediation

Implement a global `useEffect` monitoring the primary `view` state inside the root controller [App.tsx](file:///Users/sain/development/openmedq/frontend/src/App.tsx):

### 1. Document Title Updates
Directly assign the contextual subpage title:
```typescript
document.title = pageTitle;
```

### 2. Description Metadata (Standard SEO & Social Previews)
Query and update the document head metadata:
* **Standard Description**: `<meta name="description">`
* **Open Graph (Facebook/LinkedIn)**: `<meta property="og:description">`
* **Twitter Card**: `<meta name="twitter:description">`

### 3. Canonical and Social Titles
Ensure that:
* The dynamic canonical link `<link rel="canonical">` points precisely to the active URL (e.g. `window.location.origin + window.location.pathname`).
* OG and Twitter title tags match the resolved page title.
