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
        <p><strong>190,000+ peer-reviewed MCQs. FSRS v6 spaced repetition. Offline-first. 100% free, forever.</strong></p>
        <p>OpenMedQ is the open-source medical exam preparation platform built by a 3rd year medical student for the Indian PG medical community. Practice active-recall MCQs across all 19 MBBS subjects with a scientifically-backed spaced repetition scheduler.</p>
        
        <section>
          <h2>The OpenMedQ Manifesto: Unlocking Medical Education</h2>
          <p>Medical school is hard enough. The exhaustion of night duties, the constant clinical rotations, and the imposter syndrome are heavy burdens. Yet, commercial prep platforms treat medical students as cash cows. They block standard clinical explanations behind massive paywalls, lock you out of your own bookmarks the moment your plan expires, and flood your phone with aggressive sales calls. We refuse to be locked out of our own education. OpenMedQ is a student-built alternative. It has zero subscription fees, zero corporate boards, and is built by a fellow peer who understands what clinical study looks like in the trenches.</p>
        </section>

        <section>
          <h2>Core Features of the Spaced Repetition Practice Suite</h2>
          <ul>
            <li><strong>190,000+ Clinical MCQs</strong>: Practice high-yield, clinical case-based questions across all 19 MBBS subjects, peer-vetted to exclude outdated guidelines and formatted to mirror modern PG medical entrance patterns.</li>
            <li><strong>FSRS v6 Optimization Engine</strong>: Integrates the state-of-the-art Free Spaced Repetition Scheduler algorithm directly on the client to dynamically calculate retrievability, stability, and difficulty, optimizing your study intervals.</li>
            <li><strong>Offline-First Architecture</strong>: Question packs are locally cached using Dexie IndexedDB, enabling you to solve questions, view high-yield explanations, and track reviews in hospital wards, elevators, or basements with zero internet.</li>
            <li><strong>Custom Practice Modules</strong>: Create customized revision sessions filtered by academic year phase, subject, specific topics, and question status (Unattempted, Incorrect, Correct, Bookmarked).</li>
            <li><strong>Weak Spot Isolation</strong>: Detects concepts with repeated memory slips (3+ slips) to isolate and schedule them for focused active recall review.</li>
            <li><strong>Gamified Learning Loops</strong>: Track your progress with study streaks, experience points (XP), levels, and monthly dopamine leaderboards.</li>
          </ul>
        </section>

        <section>
          <h2>19 MBBS Subjects Covered</h2>
          <p>Practice customized modules covering all subjects from pre-clinical to final-year rotations:</p>
          <ul>
            <li><strong>Pre-Clinical Phase (1st Year)</strong>: Anatomy, Physiology, Biochemistry</li>
            <li><strong>Para-Clinical Phase (2nd & 3rd Year)</strong>: Pathology, Microbiology, Pharmacology, Forensic Medicine, Social and Preventive Medicine (SPM)</li>
            <li><strong>Short Subjects</strong>: Ophthalmology, Otorhinolaryngology (ENT), Orthopedics, Dermatology, Psychiatry, Radiology, Anesthesiology</li>
            <li><strong>Clinical Core (Final Year)</strong>: General Medicine, General Surgery, Obstetrics & Gynecology (OBGY), Pediatrics</li>
          </ul>
        </section>

        <section>
          <h2>Why the FSRS Algorithm Outperforms Traditional SM-2/Anki</h2>
          <p>Traditional spaced repetition engines (like the SM-2 algorithm used in older versions of Anki) rely on simple fixed multipliers. This often leads to massive card build-ups (review backlogs) and rigid study intervals that do not adjust to your actual recall rate. FSRS (Free Spaced Repetition Scheduler) v6 uses modern optimization curves based on three key metrics: Stability (how long you will remember the card), Difficulty (how complex the concept is), and Retrievability (the probability of successfully recalling the information right now). By grading your responses (Again, Hard, Good, Easy), FSRS dynamically adapts the intervals so you study less while retaining more information long-term.</p>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt>How is OpenMedQ 100% free?</dt>
            <dd>There is no catch. It runs local-first in your browser with practically zero server costs. Static question packs are served directly from Cloudflare R2, bypassing expensive database queries.</dd>
            <dt>Are questions aligned with NEET PG, FMGE, and INI-CET patterns?</dt>
            <dd>Yes. All questions are compiled from the open MedMCQA clinical research dataset (originally published on Hugging Face by OpenLifeScienceAI), consisting of over 186,000 verified medical prep questions.</dd>
            <dt>Can I study offline?</dt>
            <dd>Yes. OpenMedQ is designed to be Local-First. When you load a subject pack, it caches locally. You can solve questions, view detailed explanations, and track your revision shelf life in clinical wards, lifts, or basements with zero cellular signal.</dd>
            <dt>How does FSRS differ from Anki?</dt>
            <dd>FSRS v6 dynamically calculates Retrievability, Stability, and Difficulty for superior long-term retention with fewer reviews compared to the legacy SM-2 algorithm.</dd>
            <dt>How can I submit corrections or contribute?</dt>
            <dd>OpenMedQ is a peer-supported open-source platform. If you find a typo, an outdated clinical guideline, or a wrong reference explanation, you can click the GitHub link in the footer to submit corrections or open a pull request directly.</dd>
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
        <p>&copy; 2026 OpenMedQ. Open-source under MIT license.</p>
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
    // Add lazy loading to images
    postHtmlContent = postHtmlContent.replace(/<img\s(?![^>]*loading=)/g, '<img loading="lazy" ');
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

  // Ensure the main script has defer for strict SEO compliance
  html = html.replace(
    /<script type="module" crossorigin src="([^"]*)"><\/script>/,
    '<script type="module" crossorigin defer src="$1"></script>'
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
