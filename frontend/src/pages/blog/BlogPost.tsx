import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, ArrowRight } from 'lucide-react';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { ThemeToggle } from '../../components/ThemeToggle';

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: number;
  category: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface BlogPostProps {
  slug: string;
  onBack: () => void;
  onBackToHome: () => void;
  onStartPractice: () => void;
  isDark?: boolean;
}

export function BlogPost({ slug, onBack, onBackToHome, onStartPractice, isDark = false }: BlogPostProps) {
  const [meta, setMeta] = useState<PostMeta | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      try {
        // Fetch metadata
        const metaRes = await fetch('/blog/posts.json');
        if (!metaRes.ok) throw new Error('Failed to load posts index');
        const posts: PostMeta[] = await metaRes.json();
        const postMeta = posts.find(p => p.slug === slug);
        if (!postMeta) throw new Error('Post not found');

        // Fetch markdown content
        const mdRes = await fetch(`/blog/${slug}.md`);
        if (!mdRes.ok) throw new Error('Failed to load post content');
        const mdContent = await mdRes.text();

        if (!cancelled) {
          setMeta(postMeta);
          setContent(mdContent);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadPost();
    return () => { cancelled = true; };
  }, [slug]);

  // Inject JSON-LD structured data
  useEffect(() => {
    if (!meta) return;

    const origin = window.location.origin;
    const pageUrl = `${origin}/blog/${meta.slug}`;
    // Use default OG image: /og-preview.png
    const postOgImage = `${origin}/og-preview.png`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': meta.title,
      'description': meta.description,
      'image': postOgImage,
      'datePublished': meta.date,
      'dateModified': meta.date,
      'keywords': meta.tags.join(', '),
      'author': { '@type': 'Person', 'name': meta.author },
      'publisher': {
        '@type': 'Organization',
        'name': 'OpenMedQ',
        'logo': { '@type': 'ImageObject', 'url': `${origin}/logo.png` }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': pageUrl }
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': origin },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${origin}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': meta.title, 'item': pageUrl }
      ]
    };

    // Insert article schema
    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.id = 'blog-article-schema';
    articleScript.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    // Insert breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'blog-breadcrumb-schema';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // Update OG + Twitter meta tags with per-post image
    const ogImage = document.querySelector("meta[property='og:image']");
    if (ogImage) ogImage.setAttribute('content', postOgImage);
    const twitterImage = document.querySelector("meta[name='twitter:image']");
    if (twitterImage) twitterImage.setAttribute('content', postOgImage);

    return () => {
      document.getElementById('blog-article-schema')?.remove();
      document.getElementById('blog-breadcrumb-schema')?.remove();
      // Restore default OG image when leaving blog post
      if (ogImage) ogImage.setAttribute('content', `${origin}/og-preview.png`);
      if (twitterImage) twitterImage.setAttribute('content', `${origin}/og-preview.png`);
    };
  }, [meta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-clay-canvas flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-clay-hairline border-t-clay-pink rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="font-rubik text-2xl font-medium mb-4">Post Not Found</h1>
        <p className="text-clay-muted text-sm mb-6">The blog post you are looking for does not exist or has been moved.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay-ink hover:bg-neutral-800 text-white font-bold text-sm rounded-clay-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-x-hidden">
      {/* Ambient blur */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-clay-lavender/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-clay-canvas border-b border-clay-hairline py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onBackToHome}>
          <img src={logoSrc} className="w-10 h-10 rounded-clay-md shadow-sm group-hover:scale-105 transition-transform duration-300 object-contain" alt="OpenMedQ Logo" />
          <span className="text-xl font-bold tracking-tight text-clay-ink group-hover:text-clay-pink transition-colors duration-300">
            OpenMedQ
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Article */}
      <main className="flex-1 px-6 md:px-12 py-10 md:py-16 max-w-3xl mx-auto w-full relative z-10">
        {/* Back nav */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-clay-muted hover:text-clay-ink font-semibold text-sm mb-6 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </button>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[11px] text-clay-muted mb-6">
          <button onClick={onBackToHome} className="hover:text-clay-ink transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold text-[11px]">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={onBack} className="hover:text-clay-ink transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold text-[11px]">Blog</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-clay-ink font-semibold truncate max-w-[200px]">{meta.title}</span>
        </nav>

        <article className="blog-article">
          {/* Article header */}
          <header className="border-b border-clay-hairline pb-8 mb-8">
            {/* Category */}
            <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-3 block">
              {meta.category.replace('-', ' ')}
            </span>

            {/* Title */}
            <h1 className="font-rubik text-2xl sm:text-3xl md:text-4xl font-medium tracking-[-0.03em] text-clay-ink mb-5 leading-tight">
              {meta.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-clay-muted">
              <span className="font-semibold text-clay-ink">{meta.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(meta.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {meta.readingTime} min read
              </span>
            </div>
          </header>

          {/* Article body */}
          <div className="markdown-content blog-markdown">
            <MarkdownRenderer content={content} />
          </div>

          {/* Tags footer */}
          <footer className="mt-10 pt-8 border-t border-clay-hairline">
            <div className="flex flex-wrap gap-2 mb-8">
              {meta.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-clay-surface-soft border border-clay-hairline rounded-full text-xs font-semibold text-clay-muted"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-clay-surface-soft border border-clay-hairline rounded-clay-xl p-6 md:p-8 text-left">
              <h3 className="font-rubik text-lg font-medium text-clay-ink mb-2">
                Ready to start practicing?
              </h3>
              <p className="text-clay-body text-sm leading-relaxed mb-5 max-w-lg">
                OpenMedQ gives you instant access to 186,000+ verified MCQs across all 19 MBBS subjects with FSRS-powered spaced repetition. Zero cost, zero setup, full offline support.
              </p>
              <button
                onClick={onStartPractice}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay-ink hover:bg-neutral-800 text-white font-bold text-sm rounded-clay-md transition-colors cursor-pointer"
              >
                <span>Start Practicing Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </article>
      </main>

      {/* Page footer */}
      <footer className="border-t border-clay-hairline px-6 md:px-12 py-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-clay-muted">
          <span>© {new Date().getFullYear()} OpenMedQ</span>
          <span>Open Source MIT License</span>
        </div>
      </footer>
    </div>
  );
}
