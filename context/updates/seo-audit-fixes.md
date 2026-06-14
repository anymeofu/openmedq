# SEO Audit Fixes — 14 June 2026

## Changes Made

### index.html
- Added static `<link rel="canonical">` fallback for non-JS crawlers
- Added `<link rel="preconnect">` for Google Fonts (fonts.googleapis.com + fonts.gstatic.com)
- Fixed Twitter meta tags from `property` to `name` per spec
- Added `SoftwareApplication` JSON-LD (educational app entity with ₹0 price)
- Updated OG/Twitter image from logo.png (512x512) to og-preview.png (1200x630)

### App.tsx
- Fixed canonical URL generation: now strips query strings and hashes (clean path only) and preserves trailing slash for the root path (`/`) to ensure consistency with `index.html`.
- Twitter meta selectors updated for `name` attribute priority
- Dynamic OG/Twitter image now points to og-preview.png

### LandingPage.tsx
- **Critical**: All header nav and footer buttons converted from `<button onClick>` to `<a href>` with `e.preventDefault()` for SPA behavior. Crawlers can now discover `/blog`, `/roadmap`, `/contribute`, `/download`, `/privacy`, `/terms`, `/disclaimer`, `/dmca`.
- Added `<main>` landmark wrapping all page content
- Added `FAQPage` JSON-LD schema injection via useEffect (7 Q&A pairs)

### BlogPost.tsx
- Added `dateModified` and `keywords` to `BlogPosting` JSON-LD schema

### New Files
- `public/llms.txt` — AI/LLM-optimized site summary for Generative Engine Optimization
- `public/og-preview.png` — 1200x630 social preview image

### robots.txt
- Expanded disallow rules: added `/auth`, `/stats`, `/leaderboard`

### Prerendering & Sitemap Implementation
- **Prerendering (`scripts/prerender.mjs`)**: Statically generates HTML files for all public routes (Home, Download, Blog, Roadmap, dynamic blog posts, legal pages) at build-time. Injects route-specific meta tags, page titles, canonical links, and semantic body HTML inside `<div id="root">` so that non-JS crawlers and LLM user-agents see the full content. Client-side React hydrates normal application flow.
- **Sitemap (`scripts/generate-sitemap.mjs`)**: Automatically compiles `dist/sitemap.xml` after each build by reading static routes and parsing slugs from `posts.json`.
- **Simplifying OG images**: Replaced references to dynamic per-post social preview images (which are not generated) with the default `/og-preview.png` across `BlogPost.tsx` and `prerender.mjs` to ensure consistent and working social media cards.
- **Build Integration (`package.json`)**: Hooked scripts into the `"build"` pipeline: `tsc -b && vite build && node scripts/generate-sitemap.mjs && node scripts/prerender.mjs`.

### URL Canonicalization & Header Hierarchy (14 June 2026 Update)
- **H1 Tag Run-on Fix (`LandingPage.tsx`)**: Resolved a text concatenation issue where the SEO pre-header `<span>` and the main headline inside the `<h1>` tag ran together without spacing (`Question BankYour brain...`). Added a JSX space `{" "}` to ensure search engines and screen readers parse them as separate words/phrases (`Question Bank Your brain...`).
- **Index.html Redirect (`_redirects`)**: Added `/index.html / 301` at the top of the redirection rules. This forces a server-side HTTP 301 redirect from `/index.html` to the root `/`, consolidating SEO ranking authority (link equity) and preventing duplicate content indexing.

### SPA Fallback Rewrite Exclusions, Script Deferrals, & Prerender Enrichment (14 June 2026 Update)
- **SPA Fallback Rewrite Bypass (`_redirects`)**: Added explicit rules to `_redirects` to force bypass the catch-all `/* /index.html 200` rewrite for `/sitemap.xml`, `/robots.txt`, `/ads.txt`, `/assets/*`, and all prerendered page paths (like `/blog`, `/roadmap`, `/download`, etc.). This fixes the 404/duplicate indexing errors on subpages and ensures Google discovers and indexes subpages and the sitemap correctly.
- **Cache-Control Caching (`_headers`)**: Added custom `Cache-Control` rules for `/assets/*` (setting `public, max-age=31536000, immutable`) and key public folder assets (`/favicon.svg`, `/logo*.png`, `/og-preview.png`) to solve the "No Browser Caching Enabled" warning.
- **Render-Blocking Script Elimination (`index.html` + `vite.config.ts` + `prerender.mjs`)**:
  - Configured `VitePWA` to use `injectRegister: 'script-defer'` to load the service worker registration script (`registerSW.js`) with a `defer` attribute.
  - Added script post-processing in `prerender.mjs` to automatically rewrite the main React bundle script tags with a `defer` attribute.
- **JavaScript Disabled Fallback (`index.html`)**: Added a visually styled `<noscript>` banner in the `index.html` body (aligned with the Clay Design System's warm cream `#fffaf0` and ink `#0a0a0a` colors) to guide non-JS users and search engine crawlers.
- **Image Lazy Loading (`MarkdownRenderer.tsx` + `prerender.mjs`)**: Implemented a RegExp utility in the markdown parser that automatically adds `loading="lazy"` to all `<img>` tags parsed from question details and blog post markdown.
- **Homepage Prerender Enrichment (`prerender.mjs`)**: Significantly expanded the pre-rendered homepage `/` content block in `prerender.mjs`, adding descriptions of the 19 MBBS subjects, explaining FSRS v6 spaced repetition scheduling curves, and introducing the OpenMedQ manifesto.

