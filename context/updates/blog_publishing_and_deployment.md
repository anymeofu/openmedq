# Blog Publishing & Deployment Checklist

This document details the step-by-step standard operating procedure (SOP) for drafting, registering, building, and deploying a new blog post to the OpenMedQ production environment on Cloudflare Pages.

---

## 📝 Phase 1: Drafting the Post

### 1. Create the Markdown File
Create a new Markdown file at `/frontend/public/blog/{slug}.md`:
- Replace `{slug}` with a URL-friendly, lowercase string (e.g. `spaced-repetition-science-for-medical-students.md`).
- Ensure there are no spaces or special characters in the filename.
- **SEO Tip**: Keep the slug short, descriptive, and keyword-focused. Avoid unnecessary stop words (like "and", "the", "a") where possible.

### 2. Write the Content
Draft the post in standard Markdown. Keep the following parsing rules and SEO/GEO (Generative Engine Optimization) guidelines in mind:
- **Superscript Shorthand**: Use caret wrappers for superscript (e.g. `2^nd^` renders as 2<sup>nd</sup>).
- **Subscript Shorthand**: Use tilde wrappers for subscript (e.g. `H~2~O` renders as H<sub>2</sub>O).
- **Image Alt Text**: Always provide descriptive alt text for images (e.g. `![FSRS vs SM2 forgetting curve algorithm comparison graph](/blog/fsrs-algorithm.png)`) to assist search crawlers and screen readers.
- **Semantic Hierarchy**: Organize the article using logical heading structures (use `##` for main sections, `###` for subsections). Never skip heading levels (e.g. do not jump from `#` directly to `###`).
- **AI Overview/GEO Optimization**:
  - **Question-based Headings**: Frame H2/H3 headings as natural questions that users search for (e.g. `## Why is spaced repetition effective?` instead of `## Effectiveness`).
  - **Answer-First Style**: Start each section with a direct, clear 1–2 sentence answer to the heading's question, then elaborate. This structure makes it easy for AI models (like Gemini, Google Search AI Overviews, and Perplexity) to extract and cite your content.

---

## 📂 Phase 2: Metadata & Directory Registration

### 3. Register in `posts.json`
Open [posts.json](file:///Users/sain/development/openmedq/frontend/public/blog/posts.json) and add a new entry to the array. 
> [!IMPORTANT]
> The posts array is chronological. Insert new posts at the **top** of the list.

- **SEO Title**: Keep the title under 60 characters to prevent truncation in search engine result pages (SERPs).
- **SEO Meta Description**: Keep the description between 140 and 160 characters. It should be a clear, high-yield summary that encourages search clicks.

```json
{
  "slug": "spaced-repetition-science-for-medical-students",
  "title": "The Science of Spaced Repetition: Why It Works for Medical Students",
  "description": "Deep dive into active recall, the forgetting curve, and why Spaced Repetition algorithms (like FSRS) are essential for MBBS exam prep.",
  "author": "Dr. Aditya R.",
  "date": "2026-06-14",
  "tags": ["Spaced Repetition", "Active Recall", "Study Science"],
  "readingTime": 6,
  "category": "study-methodology"
}
```

### 4. Update AI Overview Directory (`llms.txt`)
Open [llms.txt](file:///Users/sain/development/openmedq/frontend/public/llms.txt) and add the link of the new post under the `## Blog Posts` section to make sure AI engines and search crawlers index it correctly:
```markdown
- [The Science of Spaced Repetition: Why It Works for Medical Students](https://openmedq.com/blog/spaced-repetition-science-for-medical-students)
```

---

## 🧪 Phase 3: Build & Local Validation

### 5. Compile and Prerender Locally
From the root workspace directory, run the frontend build:
```bash
npm run build:frontend
```
This script automates four build actions under the hood:
1. Compiles TypeScript without emitting output (`tsc -b`).
2. Compiles Vite assets for production (`vite build`).
3. Executes `scripts/generate-sitemap.mjs` to update `dist/sitemap.xml`.
4. Executes `scripts/prerender.mjs` to statically generate HTML for SEO crawlers at `dist/blog/{slug}/index.html`.

### 6. Verify Outputs
Before committing, inspect the built outputs:
- **Sitemap**: Verify [dist/sitemap.xml](file:///Users/sain/development/openmedq/frontend/dist/sitemap.xml) contains the new `<url>` entry pointing to `https://openmedq.com/blog/{slug}`.
- **HTML Prerender**: Verify the folder [dist/blog/{slug}/index.html](file:///Users/sain/development/openmedq/frontend/dist/blog/) exists and contains correct pre-baked SEO title and description tags.

---

## 🚀 Phase 4: Git Push & Cloudflare Deployment

### 7. Commit changes to Git
Stage and commit the new post and registry modifications:
```bash
git add .
git commit -m "feat: publish new blog post - {slug}"
git push origin main
```

### 8. Automated Cloudflare Pages Deployment
- The repository’s `main` branch is wired directly to **Cloudflare Pages**.
- On push, Cloudflare Pages runs the build command (`npm run build:frontend`) in the monorepo root.
- The build targets `frontend/dist` as the build output directory.
- The deploy will go live automatically in 1-2 minutes. Verify the post at `https://openmedq.com/blog/{slug}`.
