import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { CATEGORIES } from '../constants';

interface CarouselProps {
  items: Article[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goTo(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, items.length, goTo]);

  const prevSlide = useCallback(() => {
    goTo(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  }, [currentIndex, items.length, goTo]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (!items || items.length === 0) return null;

  const mainArticle = items[0];
  const sideArticles = items.slice(1, 4);

  const currentItem = items[currentIndex];
  const category = CATEGORIES.find(c => c.id === currentItem.categoryId);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[480px]">
        {/* Main Hero Carousel */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-ink-900 group">
          {/* Images */}
          {items.slice(0, 5).map((item, index) => {
            const itemCat = CATEGORIES.find(c => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  {itemCat && (
                    <Link
                      to={`/kategori/${itemCat.id}`}
                      className="inline-block bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-3 hover:bg-brand-600 transition-colors"
                    >
                      {itemCat.name}
                    </Link>
                  )}
                  <Link to={`/artikel/${item.slug}`}>
                    <h2 className="font-serif text-white text-2xl sm:text-3xl font-bold leading-tight hover:text-brand-200 transition-colors line-clamp-3 mb-3">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-white/70 text-sm line-clamp-2 hidden sm:block leading-relaxed">
                    {item.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {item.authorName.charAt(0)}
                    </div>
                    <span className="text-white/60 text-xs">{item.authorName}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/60 text-xs">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
            {items.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Side Articles */}
        <div className="flex flex-col gap-3 lg:overflow-hidden">
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-px bg-brand-500 inline-block"></span>
            Berita Pilihan
          </h3>
          {sideArticles.map(article => {
            const cat = CATEGORIES.find(c => c.id === article.categoryId);
            return (
              <Link
                key={article.id}
                to={`/artikel/${article.slug}`}
                className="flex gap-3 group bg-white rounded-xl p-3 border border-ink-100 hover:border-brand-200 transition-all article-card"
              >
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden img-zoom">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {cat && (
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-wide">{cat.name}</span>
                  )}
                  <h4 className="font-serif text-sm font-bold text-ink-900 group-hover:text-brand-500 transition-colors line-clamp-3 leading-snug mt-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-ink-400 mt-1">
                    {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
