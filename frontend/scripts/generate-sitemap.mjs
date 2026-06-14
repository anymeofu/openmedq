#!/usr/bin/env node

/**
 * generate-sitemap.mjs
 * 
 * Post-build script that generates sitemap.xml from blog posts.json
 * and known static routes. Writes directly to dist/ so it's always
 * in sync with blog content.
 * 
 * Usage: node scripts/generate-sitemap.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DOMAIN = 'https://openmedq.com';

// Static routes with their metadata
const staticRoutes = [
  { path: '/',           changefreq: 'daily',   priority: '1.0' },
  { path: '/download',   changefreq: 'weekly',  priority: '0.9' },
  { path: '/blog',       changefreq: 'daily',   priority: '0.9' },
  { path: '/contribute', changefreq: 'monthly', priority: '0.8' },
  { path: '/roadmap',    changefreq: 'weekly',  priority: '0.8' },
  { path: '/privacy',    changefreq: 'monthly', priority: '0.5' },
  { path: '/terms',      changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.3' },
  { path: '/dmca',       changefreq: 'monthly', priority: '0.3' },
];

function generateSitemap() {
  // Read blog posts
  const postsPath = join(ROOT, 'public', 'blog', 'posts.json');
  let posts = [];
  try {
    posts = JSON.parse(readFileSync(postsPath, 'utf-8'));
  } catch (e) {
    console.warn('⚠️  Could not read posts.json, generating sitemap without blog posts');
  }

  const today = new Date().toISOString().split('T')[0];

  // Build URL entries
  let urls = '';

  // Static routes
  for (const route of staticRoutes) {
    urls += `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
  }

  // Blog post routes (auto-generated from posts.json)
  for (const post of posts) {
    const lastmod = post.date || today;
    urls += `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>
`;

  // Write to dist/
  const outputPath = join(DIST, 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated: ${posts.length} blog posts + ${staticRoutes.length} static routes → dist/sitemap.xml`);
}

generateSitemap();
