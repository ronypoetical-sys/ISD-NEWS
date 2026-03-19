import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import ArticleCard from '../components/ArticleCard';
import { ArticleStatus } from '../types';
import { CATEGORIES } from '../constants';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useArticles();

  const category = CATEGORIES.find(c => c.id === id);
  const categoryArticles = articles.filter(a => a.categoryId === id && a.status === ArticleStatus.PUBLISHED);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="text-6xl mb-4">🗂️</div>
        <h2 className="font-serif text-2xl font-bold text-ink-900 mb-2">Kategori tidak ditemukan</h2>
        <Link to="/" className="mt-4 inline-block px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const featured = categoryArticles[0];
  const rest = categoryArticles.slice(1);

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Category Header */}
      <div className="bg-ink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-ink-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-ink-300">Kategori</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-medium">{category.name}</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">Kategori</div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold">{category.name}</h1>
              <p className="text-ink-400 mt-2 text-sm">{categoryArticles.length} artikel tersedia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Categories */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.filter(c => c.id !== id).slice(0, 10).map(cat => (
            <Link
              key={cat.id}
              to={`/kategori/${cat.id}`}
              className="flex-shrink-0 px-3 py-1.5 bg-ink-100 text-ink-600 text-xs font-medium rounded-full hover:bg-brand-500 hover:text-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoryArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ink-100">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">Belum Ada Berita</h3>
            <p className="text-ink-500 mb-6">Belum ada berita yang diterbitkan di kategori ini.</p>
            <Link to="/" className="px-5 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
              Lihat Semua Berita
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <div className="mb-8">
                <ArticleCard article={featured} variant="featured" />
              </div>
            )}

            {/* Article Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
