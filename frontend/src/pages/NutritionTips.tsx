import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, RefreshCw, Newspaper } from 'lucide-react';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY as string | undefined;

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
}

const CATEGORIES = [
  { label: 'All', query: 'nutrition health diet' },
  { label: 'Diet', query: 'diet weight loss healthy eating' },
  { label: 'Fitness', query: 'fitness exercise workout' },
  { label: 'Wellness', query: 'wellness mental health mindfulness' },
  { label: 'Nutrition Science', query: 'nutrition science research food' },
];

const STATIC_ARTICLES: Article[] = [
  {
    title: 'The Science Behind a Balanced Diet',
    description: 'Learn how macronutrients and micronutrients work together to fuel your body and support long-term health.',
    url: '#',
    urlToImage: null,
    source: { name: 'NutriCare Editorial' },
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Exercise and Nutrition: The Perfect Pair',
    description: 'Discover how combining the right nutrition with exercise maximizes performance, recovery, and body composition.',
    url: '#',
    urlToImage: null,
    source: { name: 'NutriCare Editorial' },
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Mindful Eating: Building a Healthy Relationship with Food',
    description: 'Practical techniques for mindful eating that help reduce overeating, improve digestion, and create healthier habits.',
    url: '#',
    urlToImage: null,
    source: { name: 'NutriCare Editorial' },
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Understanding Inflammation and Anti-Inflammatory Foods',
    description: 'New research into how diet influences chronic inflammation and which foods offer the best protection.',
    url: '#',
    urlToImage: null,
    source: { name: 'NutriCare Editorial' },
    publishedAt: new Date().toISOString(),
  },
];

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-white/10" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-white/10 rounded w-1/3" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-4/5" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
    </div>
  </div>
);

// Gradient placeholder for missing images
const ImagePlaceholder = ({ index }: { index: number }) => {
  const gradients = [
    'from-emerald-500/30 to-teal-700/20',
    'from-blue-500/30 to-indigo-700/20',
    'from-orange-500/30 to-red-700/20',
    'from-purple-500/30 to-pink-700/20',
    'from-cyan-500/30 to-blue-700/20',
    'from-yellow-500/30 to-orange-700/20',
  ];
  const emojis = ['🥗', '🏋️', '🧘', '🔬', '🫀', '🌿'];
  const g = gradients[index % gradients.length];
  const e = emojis[index % emojis.length];
  return (
    <div className={`h-44 bg-gradient-to-br ${g} flex items-center justify-center`}>
      <span className="text-4xl">{e}</span>
    </div>
  );
};

const ArticleCard = ({ article, index }: { article: Article; index: number }) => {
  const [imgError, setImgError] = useState(false);
  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col group">
      {article.urlToImage && !imgError ? (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      ) : (
        <ImagePlaceholder index={index} />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium text-gray-400">{article.source.name}</span>
          <span>{date}</span>
        </div>
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 flex-1">
            {article.description}
          </p>
        )}
        <div className="mt-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-fitness-primary text-xs font-medium hover:underline"
          >
            Read More <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

const NutritionTips = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const noApiKey = !NEWS_API_KEY;

  const fetchArticles = useCallback(async (query: string) => {
    if (noApiKey) {
      setArticles(STATIC_ARTICLES);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch articles');
      setArticles(data.articles || []);
    } catch (err) {
      setError('Could not load articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [noApiKey]);

  useEffect(() => {
    fetchArticles(CATEGORIES[activeCategory].query);
  }, [activeCategory, fetchArticles]);

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Nutrition Tips &amp; Articles</h1>
          <p className="text-gray-400 mt-1">Stay up-to-date with the latest in health and nutrition.</p>
        </div>

        {noApiKey && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-400">
            <Newspaper className="w-4 h-4 flex-shrink-0" />
            Add <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-xs">VITE_NEWS_API_KEY</code> to your .env to enable live articles
          </div>
        )}

        {/* Category tabs */}
        <Tabs
          value={String(activeCategory)}
          onValueChange={(v) => setActiveCategory(Number(v))}
          className="mb-8"
        >
          <TabsList className="bg-white/5 border border-white/10 h-auto flex-wrap gap-1 p-1.5">
            {CATEGORIES.map((cat, idx) => (
              <TabsTrigger
                key={cat.label}
                value={String(idx)}
                className="data-[state=active]:bg-fitness-primary data-[state=active]:text-white text-gray-400"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-gray-400 mb-4">{error}</p>
            <Button
              variant="outline"
              className="border-fitness-border text-gray-300"
              onClick={() => fetchArticles(CATEGORIES[activeCategory].query)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Articles grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <ArticleCard key={`${article.url}-${i}`} article={article} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center max-w-sm mx-auto">
            <Newspaper className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-white font-semibold mb-1">No articles found</p>
            <p className="text-gray-400 text-sm">Try a different category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutritionTips;
