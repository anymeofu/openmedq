import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: number;
  category: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'exam-strategy': { bg: 'bg-clay-pink/10', text: 'text-clay-pink', border: 'border-clay-pink/20' },
  'study-science': { bg: 'bg-clay-lavender/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-clay-lavender/40' },
  'brand': { bg: 'bg-clay-peach/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-clay-peach/40' },
  'subject-review': { bg: 'bg-clay-mint/15', text: 'text-clay-teal', border: 'border-clay-mint/30' },
};

const categoryLabels: Record<string, string> = {
  'exam-strategy': 'Exam Strategy',
  'study-science': 'Study Science',
  'brand': 'About OpenMedQ',
  'subject-review': 'Subject Review',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface BlogListProps {
  onBack: () => void;
  onViewPost: (slug: string) => void;
  isDark?: boolean;
}

export function BlogList({ onBack, onViewPost, isDark = false }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';

  useEffect(() => {
    fetch('/blog/posts.json')
      .then(res => res.json())
      .then((data) => {
        setPosts(data as BlogPost[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-x-hidden">
      {/* Ambient blur */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-clay-lavender/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-clay-canvas border-b border-clay-hairline py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onBack}>
          <img src={logoSrc} className="w-10 h-10 rounded-clay-md shadow-sm group-hover:scale-105 transition-transform duration-300 object-contain" alt="OpenMedQ Logo" />
          <span className="text-xl font-bold tracking-tight text-clay-ink group-hover:text-clay-pink transition-colors duration-300">
            OpenMedQ
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 md:px-12 py-10 md:py-16 max-w-4xl mx-auto w-full relative z-10">
        {/* Back nav */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-clay-muted hover:text-clay-ink font-semibold text-sm mb-8 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Page header */}
        <div className="border-b border-clay-hairline pb-6 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">
            Medical Education Blog
          </span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Study Smarter, Not Harder.
          </h1>
          <p className="text-clay-muted text-sm md:text-base leading-relaxed max-w-2xl">
            Evidence-based study strategies, exam preparation guides, and insights into the science of learning. Written by medical students, for medical students.
          </p>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-clay-hairline border-t-clay-pink rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-clay-muted text-sm">
            No blog posts yet. Check back soon.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post, index) => {
              const colors = categoryColors[post.category] || categoryColors['exam-strategy'];
              const label = categoryLabels[post.category] || post.category;

              return (
                <article
                  key={post.slug}
                  onClick={() => onViewPost(post.slug)}
                  className={`group bg-white dark:bg-neutral-900/50 border border-clay-hairline rounded-clay-xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-clay-pink/30 hover:shadow-sm relative overflow-hidden text-left ${
                    index === 0 ? 'md:p-10' : ''
                  }`}
                >
                  {/* Hover accent */}
                  <div className="absolute inset-y-0 left-0 w-0 group-hover:w-1 bg-clay-pink transition-all duration-300 rounded-l-clay-xl" />

                  {/* Category + metadata */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {label}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-clay-muted">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-clay-muted">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className={`font-rubik font-medium tracking-[-0.02em] text-clay-ink group-hover:text-clay-pink transition-colors duration-200 mb-3 ${
                    index === 0 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
                  }`}>
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-clay-body text-sm leading-relaxed mb-5 max-w-2xl">
                    {post.description}
                  </p>

                  {/* Tags + Read more */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-clay-surface-soft border border-clay-hairline rounded-full text-[10px] font-semibold text-clay-muted"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-clay-pink group-hover:gap-2 transition-all duration-200 shrink-0">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-clay-hairline px-6 md:px-12 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-clay-muted">
          <span>© {new Date().getFullYear()} OpenMedQ</span>
          <span>Open Source MIT License</span>
        </div>
      </footer>
    </div>
  );
}
