#!/usr/bin/env node

/**
 * prerender.mjs
 * 
 * Build-time static HTML prerendering for SEO.
 * 
 * Strategy: Read the built dist/index.html as a template, then for each
 * public route, create a copy with:
 *   1. Route-specific <title>, <meta description>, <link canonical>, OG tags
 *   2. Semantic HTML content inside <div id="root"> for crawlers
 * 
 * When a user visits, React hydrates and replaces the static content.
 * When a crawler visits, it sees real content instead of an empty shell.
 * 
 * No Puppeteer needed — pure Node.js string manipulation.
 * 
 * Usage: node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DOMAIN = 'https://openmedq.com';

// Read blog posts for dynamic routes
let blogPosts = [];
try {
  blogPosts = JSON.parse(readFileSync(join(ROOT, 'public', 'blog', 'posts.json'), 'utf-8'));
} catch (e) {
  console.warn('⚠️  Could not read posts.json');
}

/**
 * Route definitions with SEO metadata and static HTML content.
 * The `content` field provides crawlable HTML that goes inside <div id="root">.
 */
const routes = [
  {
    path: '/',
    title: 'OpenMedQ - Free NEET PG, FMGE & INI-CET Prep',
    description: 'OpenMedQ is a 100% free, student-built open-source active-recall spaced repetition study bank for NEET PG, FMGE, and INI-CET medical post-graduate preparation.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header>
        <a href="/"><strong>OpenMedQ</strong></a>
        <nav>
          <a href="/blog">Blog</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/contribute">Contribute</a>
          <a href="/download">Download App</a>
        </nav>
      </header>
      <main>
        <h1>Free NEET PG, FMGE & INI-CET Preparation</h1>
        <p>190,000+ peer-reviewed MCQs. FSRS v6 spaced repetition. Offline-first. 100% free, forever.</p>
        <p>OpenMedQ is the open-source medical exam preparation platform built by a 3rd year medical student for the Indian PG medical community. Practice active-recall MCQs across all 19 MBBS subjects with a scientifically-backed spaced repetition scheduler.</p>
        <section>
          <h2>Features</h2>
          <ul>
            <li>190,000+ clinical MCQs across Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, Microbiology, and 13 more subjects</li>
            <li>FSRS v6 spaced repetition algorithm for optimized long-term retention</li>
            <li>Offline-first: study in hospital wards, hostels, and basements with zero internet</li>
            <li>Custom practice modules with subject and topic filtering</li>
            <li>Weak spot targeting for concepts with repeated memory slips</li>
            <li>Progress tracking with streaks, XP, and monthly leaderboards</li>
          </ul>
        </section>
        <section>
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt>How is OpenMedQ 100% free?</dt>
            <dd>There is no catch. It runs local-first in your browser with practically zero server costs.</dd>
            <dt>Are questions aligned with NEET PG, FMGE, and INI-CET patterns?</dt>
            <dd>Yes. All questions are from the peer-reviewed MedMCQA dataset with 186,000+ verified medical prep questions.</dd>
            <dt>Can I study offline?</dt>
            <dd>Yes. Question packs cache locally. Study in wards, lifts, or basements with zero signal.</dd>
            <dt>How does FSRS differ from Anki?</dt>
            <dd>FSRS v6 dynamically calculates Retrievability, Stability, and Difficulty for superior long-term retention with fewer reviews.</dd>
          </dl>
        </section>
      </main>
      <footer>
        <nav>
          <a href="/download">Download Mobile App</a>
          <a href="/blog">Blog</a>
          <a href="/roadmap">Product Roadmap</a>
          <a href="/contribute">Submit Corrections & Contribute</a>
          <a href="https://github.com/Riso19/openmedq">GitHub Repository</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/disclaimer">Legal Disclaimer</a>
          <a href="/dmca">DMCA & Copyright</a>
        </nav>
        <p>&copy; 2025 OpenMedQ. Open-source under MIT license.</p>
      </footer>
    `
  },
  {
    path: '/blog',
    title: 'Blog - OpenMedQ',
    description: 'Medical education insights, study strategies, and updates from the OpenMedQ team. Evidence-based preparation tips for NEET PG, FMGE, and INI-CET.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: () => {
      const postLinks = blogPosts.map(p =>
        `<li><a href="/blog/${p.slug}"><strong>${p.title}</strong></a> - ${p.description} <time datetime="${p.date}">${p.date}</time></li>`
      ).join('\n            ');
      return `
      <header><a href="/">OpenMedQ</a> / <a href="/blog">Blog</a></header>
      <main>
        <h1>OpenMedQ Blog</h1>
        <p>Medical education insights, study strategies, and platform updates.</p>
        <ul>
            ${postLinks}
        </ul>
      </main>
      <footer><a href="/">Back to Home</a></footer>
      `;
    }
  },
  {
    path: '/download',
    title: 'Download OpenMedQ App - Free NEET PG Prep',
    description: 'Download the OpenMedQ Android app or install the PWA. Free spaced repetition MCQ practice for NEET PG, FMGE, and INI-CET with offline support.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Download</header>
      <main>
        <h1>Download OpenMedQ</h1>
        <p>Get the free OpenMedQ app for Android or install it as a Progressive Web App (PWA) on any device.</p>
        <section>
          <h2>Android APK</h2>
          <p>Download the latest APK directly. No Play Store required. Offline-first with local data storage.</p>
        </section>
        <section>
          <h2>Web App (PWA)</h2>
          <p>Visit openmedq.com in Chrome or Edge, then click "Install" to add it to your home screen. Works on all platforms.</p>
        </section>
      </main>
    `
  },
  {
    path: '/contribute',
    title: 'Contribute to OpenMedQ - Open-Source Medical Question Bank',
    description: 'Help improve OpenMedQ by submitting question corrections, contributing new content, or joining the development effort. Open-source medical education for all.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Contribute</header>
      <main>
        <h1>Contribute to OpenMedQ</h1>
        <p>OpenMedQ is a community-driven, open-source project. Every correction, contribution, and suggestion makes medical education more accessible.</p>
        <h2>How to Contribute</h2>
        <ul>
          <li>Report incorrect answers or outdated clinical guidelines</li>
          <li>Submit new questions via GitHub pull requests</li>
          <li>Help translate content for wider accessibility</li>
          <li>Contribute code improvements to the platform</li>
        </ul>
        <p><a href="https://github.com/Riso19/openmedq">Visit our GitHub repository</a></p>
      </main>
    `
  },
  {
    path: '/roadmap',
    title: 'Product Roadmap - OpenMedQ',
    description: 'See what\'s coming next for OpenMedQ. Track our development progress on features like mock exams, PYQ papers, anatomy atlas, and mobile app improvements.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Roadmap</header>
      <main>
        <h1>OpenMedQ Product Roadmap</h1>
        <p>Transparent development roadmap showing planned features, ongoing work, and completed milestones.</p>
      </main>
    `
  },
  {
    path: '/privacy',
    title: 'Privacy Policy - OpenMedQ',
    description: 'OpenMedQ privacy policy. Learn how we handle your data, what information we collect, and your rights as a user of our free medical education platform.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Privacy Policy</header>
      <main><h1>Privacy Policy</h1><p>Your privacy matters. OpenMedQ stores study data locally in your browser. When you create an account, minimal data is synced securely via Clerk authentication.</p></main>
    `
  },
  {
    path: '/terms',
    title: 'Terms & Conditions - OpenMedQ',
    description: 'Terms and conditions for using OpenMedQ, the free open-source medical exam preparation platform.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Terms & Conditions</header>
      <main><h1>Terms & Conditions</h1><p>By using OpenMedQ, you agree to these terms. OpenMedQ is provided as-is for educational purposes.</p></main>
    `
  },
  {
    path: '/disclaimer',
    title: 'Legal Disclaimer - OpenMedQ',
    description: 'Legal disclaimer for OpenMedQ. This platform is for educational purposes only and does not constitute medical advice.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / Disclaimer</header>
      <main><h1>Legal Disclaimer</h1><p>OpenMedQ is an educational tool for exam preparation. Content is not intended as medical advice. Always consult qualified professionals.</p></main>
    `
  },
  {
    path: '/dmca',
    title: 'DMCA & Copyright - OpenMedQ',
    description: 'DMCA and copyright policy for OpenMedQ. Report copyright concerns and learn about our content licensing.',
    ogImage: `${DOMAIN}/og-preview.png`,
    content: `
      <header><a href="/">OpenMedQ</a> / DMCA & Copyright</header>
      <main><h1>DMCA & Copyright Policy</h1><p>OpenMedQ respects intellectual property rights. If you believe content infringes your copyright, contact us for prompt resolution.</p></main>
    `
  },
];

// Add blog post routes dynamically
for (const post of blogPosts) {
  const ogImage = `${DOMAIN}/og-preview.png`;

  let postHtmlContent = '';
  try {
    const mdPath = join(ROOT, 'public', 'blog', `${post.slug}.md`);
    const rawMarkdown = readFileSync(mdPath, 'utf-8');
    // Pre-process custom sub/superscript shorthand:
    const processed = rawMarkdown
      .replace(/~([^~]+)~/g, '<sub>$1</sub>')
      .replace(/\^([^^]+)\^/g, '<sup>$1</sup>');
    postHtmlContent = marked.parse(processed, { async: false });
  } catch (e) {
    console.warn(`⚠️  Could not read markdown for post ${post.slug}, using description fallback:`, e.message);
    postHtmlContent = `<p>${post.description}</p>`;
  }

  routes.push({
    path: `/blog/${post.slug}`,
    title: `${post.title} - OpenMedQ`,
    description: post.description,
    ogImage,
    content: `
      <header>
        <nav aria-label="breadcrumb">
          <a href="/">Home</a> / <a href="/blog">Blog</a> / ${post.title}
        </nav>
      </header>
      <main>
        <article class="markdown-content">
          <h1>${post.title}</h1>
          <div class="meta" style="margin-bottom: 2rem; color: #666;">
            <span>By ${post.author}</span> · 
            <time datetime="${post.date}">${post.date}</time> · 
            <span>${post.readingTime} min read</span>
          </div>
          <div>
            ${postHtmlContent}
          </div>
          <div class="tags" style="margin-top: 2rem;">
            ${post.tags.map(t => `<span class="tag" style="background: #eee; padding: 0.2rem 0.5rem; margin-right: 0.5rem; border-radius: 4px; font-size: 0.85rem;">${t}</span>`).join('')}
          </div>
        </article>
      </main>
      <footer><a href="/blog">← Back to all posts</a></footer>
    `
  });
}

/**
 * Transform the built index.html template for a specific route.
 */
function renderRoute(template, route) {
  let html = template;
  const canonicalUrl = route.path === '/' ? DOMAIN + '/' : DOMAIN + route.path;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${route.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${route.ogImage}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${route.ogImage}" />`
  );

  // Inject static HTML content into <div id="root">
  const content = typeof route.content === 'function' ? route.content() : route.content;
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${content}</div>`
  );

  return html;
}

function prerender() {
  // Read the built template
  const templatePath = join(DIST, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }
  const template = readFileSync(templatePath, 'utf-8');

  let count = 0;
  for (const route of routes) {
    const html = renderRoute(template, route);

    if (route.path === '/') {
      // Overwrite the root index.html
      writeFileSync(templatePath, html, 'utf-8');
    } else {
      // Create directory and write index.html
      const dir = join(DIST, route.path);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html, 'utf-8');
    }
    count++;
  }

  console.log(`✅ Prerendered ${count} routes with SEO content → dist/`);
}

prerender();
