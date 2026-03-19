import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { CATEGORIES } from '../constants';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'featured' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const category = CATEGORIES.find(c => c.id === article.categoryId);
  const dateStr = new Date(article.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const timeStr = new Date(article.createdAt).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });

  if (variant === 'horizontal') {
    return (
      <article className="article-card bg-white rounded-xl overflow-hidden border border-ink-100 flex gap-0">
        <div className="w-36 sm:w-48 flex-shrink-0 img-zoom">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {category && (
            <Link
              to={`/kategori/${category.id}`}
              className="text-xs font-bold text-brand-500 uppercase tracking-wide hover:text-brand-700 mb-1 block"
            >
              {category.name}
            </Link>
          )}
          <Link to={`/artikel/${article.slug}`}>
            <h3 className="font-serif text-base font-bold text-ink-900 leading-snug hover:text-brand-500 transition-colors line-clamp-2 sm:line-clamp-3">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-ink-400 mt-2">{dateStr}</p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="flex items-start gap-3 py-3 border-b border-ink-100 last:border-0 group">
        <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden img-zoom">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/artikel/${article.slug}`}>
            <h4 className="text-sm font-semibold text-ink-800 group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </Link>
          <p className="text-xs text-ink-400 mt-1">{dateStr}</p>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="article-card relative h-80 rounded-xl overflow-hidden group cursor-pointer">
        <div className="img-zoom w-full h-full">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          {category && (
            <Link
              to={`/kategori/${category.id}`}
              className="inline-block text-xs font-bold text-brand-300 uppercase tracking-wider mb-2 hover:text-white transition-colors"
            >
              {category.name}
            </Link>
          )}
          <Link to={`/artikel/${article.slug}`}>
            <h3 className="font-serif text-white text-xl font-bold leading-tight hover:text-brand-200 transition-colors line-clamp-3">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-white/60 mt-2">{dateStr} · {timeStr} WIB</p>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="article-card bg-white rounded-xl overflow-hidden border border-ink-100 flex flex-col">
      <div className="img-zoom relative">
        <Link to={`/artikel/${article.slug}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
        </Link>
        {category && (
          <Link
            to={`/kategori/${category.id}`}
            className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide hover:bg-brand-700 transition-colors"
          >
            {category.name}
          </Link>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/artikel/${article.slug}`}>
          <h3 className="font-serif text-lg font-bold text-ink-900 leading-snug hover:text-brand-500 transition-colors line-clamp-3 mb-3">
            {article.title}
          </h3>
        </Link>
        <p className="text-ink-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {article.content.substring(0, 130)}...
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {article.authorName.charAt(0)}
            </div>
            <span className="text-xs text-ink-500 font-medium truncate max-w-[120px]">{article.authorName}</span>
          </div>
          <span className="text-xs text-ink-400">{dateStr}</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
