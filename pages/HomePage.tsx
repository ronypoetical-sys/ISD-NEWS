import React from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import Carousel from '../components/Carousel';
import ArticleCard from '../components/ArticleCard';
import { ArticleStatus } from '../types';
import { CATEGORIES } from '../constants';

const SectionHeader: React.FC<{ title: string; link?: string; linkLabel?: string }> = ({ title, link, linkLabel }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 bg-brand-500 rounded-full"></div>
      <h2 className="font-serif text-2xl font-bold text-ink-900">{title}</h2>
    </div>
    {link && (
      <Link to={link} className="text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors flex items-center gap-1">
        {linkLabel || 'Selengkapnya'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </Link>
    )}
  </div>
);

const HomePage: React.FC = () => {
  const { articles } = useArticles();

  const published = articles.filter(a => a.status === ArticleStatus.PUBLISHED);
  const featuredArticles = published.slice(0, 5);
  const latestArticles = published.slice(0, 9);
  const opiniArticles = published.filter(a => a.categoryId === 'opini').slice(0, 2);
  const popularArticles = published.slice(2, 8);

  const categoryHighlights = ['nasional', 'ekonomi', 'olahraga', 'teknologi'];
  const highlightedCats = categoryHighlights
    .map(id => ({ cat: CATEGORIES.find(c => c.id === id), articles: published.filter(a => a.categoryId === id).slice(0, 3) }))
    .filter(h => h.cat && h.articles.length > 0);

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Hero Carousel */}
      <Carousel items={featuredArticles} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14">

        {/* Latest News Grid */}
        <section>
          <SectionHeader title="Berita Terbaru" link="/kategori/nasional" linkLabel="Lihat Semua" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Divider with Ad Placeholder */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-ink-200"></div>
          <span className="text-xs text-ink-400 tracking-widest uppercase font-light">Iklan</span>
          <div className="flex-1 h-px bg-ink-200"></div>
        </div>

        {/* Two Column: Category Highlights + Popular */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {highlightedCats.map(({ cat, articles: catArticles }) => (
              <section key={cat!.id}>
                <SectionHeader
                  title={cat!.name}
                  link={`/kategori/${cat!.id}`}
                  linkLabel="Lihat Semua"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catArticles.map((article, i) => (
                    i === 0
                      ? <div key={article.id} className="sm:col-span-2 lg:col-span-2"><ArticleCard article={article} variant="featured" /></div>
                      : <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Most Read */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <SectionHeader title="Terpopuler" />
              <ol className="space-y-0">
                {popularArticles.map((article, index) => (
                  <li key={article.id} className="flex gap-3 py-3 border-b border-ink-100 last:border-0 group">
                    <span className="text-3xl font-serif font-bold text-ink-200 leading-none w-8 flex-shrink-0">{index + 1}</span>
                    <div>
                      <Link to={`/artikel/${article.slug}`}>
                        <h4 className="text-sm font-semibold text-ink-800 group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-ink-400 mt-1">
                        {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Opini */}
            {opiniArticles.length > 0 && (
              <div className="bg-ink-900 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-brand-400 rounded-full"></div>
                  <h3 className="font-serif text-lg font-bold">Opini</h3>
                </div>
                <div className="space-y-4">
                  {opiniArticles.map(article => (
                    <Link key={article.id} to={`/artikel/${article.slug}`} className="block group">
                      <div className="flex gap-3">
                        <img src={article.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0 opacity-80" />
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 group-hover:text-brand-300 transition-colors line-clamp-3 leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-xs text-white/40 mt-1">{article.authorName}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/kategori/opini" className="mt-4 inline-block text-xs text-brand-300 hover:text-brand-200 font-medium transition-colors">
                  Baca semua opini →
                </Link>
              </div>
            )}

            {/* Category Shortcuts */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Jelajahi Kategori</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/kategori/${cat.id}`}
                    className="cat-pill px-3 py-1.5 bg-ink-100 text-ink-700 rounded-full text-xs font-medium border border-ink-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Sidebar */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-5 text-white">
              <h3 className="font-serif text-lg font-bold mb-2">Newsletter Harian</h3>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">Jangan lewatkan berita penting. Langganan gratis sekarang.</p>
              <form onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-full px-3 py-2 text-sm text-ink-900 bg-white rounded-lg mb-2 focus:outline-none"
                />
                <button type="submit" className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors border border-white/30">
                  Berlangganan
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
