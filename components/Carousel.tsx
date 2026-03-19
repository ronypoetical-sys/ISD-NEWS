import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { CATEGORIES } from '../constants';

interface CarouselProps {
  items: Article[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const validItems = items.slice(0, 5);
  const sideArticles = items.slice(1, 4);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, currentIndex]);

  const nextSlide = useCallback(() => {
    const next = currentIndex === validItems.length - 1 ? 0 : currentIndex + 1;
    goTo(next);
  }, [currentIndex, validItems.length, goTo]);

  const prevSlide = useCallback(() => {
    const prev = currentIndex === 0 ? validItems.length - 1 : currentIndex - 1;
    goTo(prev);
  }, [currentIndex, validItems.length, goTo]);

  // Auto-play with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [nextSlide, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    };
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (!validItems || validItems.length === 0) return null;

  const currentItem = validItems[currentIndex];
  const currentCat = CATEGORIES.find(c => c.id === currentItem.categoryId);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      aria-label="Berita utama pilihan"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[480px]">
        {/* Main Hero Carousel */}
        <div
          ref={carouselRef}
          className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-ink-900 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          role="region"
          aria-label={`Slide ${currentIndex + 1} dari ${validItems.length}: ${currentItem.title}`}
          aria-roledescription="carousel"
          tabIndex={0}
        >
          {/* Slides */}
          {validItems.map((item, index) => {
            const itemCat = CATEGORIES.find(c => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                aria-hidden={index !== currentIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1}: ${item.title}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/fallback-carousel-${item.id}/1200/800`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden="true" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  {itemCat && (
                    <Link
                      to={`/kategori/${itemCat.id}`}
                      className="inline-block bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-3 hover:bg-brand-600 transition-colors"
                      tabIndex={index === currentIndex ? 0 : -1}
                    >
                      {itemCat.name}
                    </Link>
                  )}
                  <Link
                    to={`/artikel/${item.slug}`}
                    tabIndex={index === currentIndex ? 0 : -1}
                  >
                    <h2 className="font-serif text-white text-2xl sm:text-3xl font-bold leading-tight hover:text-brand-200 transition-colors line-clamp-3 mb-3">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-white/70 text-sm line-clamp-2 hidden sm:block leading-relaxed">
                    {item.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                      {item.authorName.charAt(0)}
                    </div>
                    <span className="text-white/60 text-xs">{item.authorName}</span>
                    <span className="text-white/30" aria-hidden="true">·</span>
                    <time
                      dateTime={new Date(item.createdAt).toISOString()}
                      className="text-white/60 text-xs"
                    >
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Slide sebelumnya"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Slide berikutnya"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 z-20 flex gap-1.5" role="tablist" aria-label="Navigasi slide">
            {validItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Pergi ke slide ${index + 1}: ${item.title}`}
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
            <span className="w-6 h-px bg-brand-500 inline-block" aria-hidden="true"></span>
            Berita Pilihan
          </h3>
          {sideArticles.map(article => {
            const cat = CATEGORIES.find(c => c.id === article.categoryId);
            return (
              <Link
                key={article.id}
                to={`/artikel/${article.slug}`}
                className="flex gap-3 group bg-white rounded-xl p-3 border border-ink-100 hover:border-brand-200 transition-all article-card"
                aria-label={`Baca artikel: ${article.title}`}
              >
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden img-zoom">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={96}
                    height={80}
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/fallback-side-${article.id}/200/160`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {cat && (
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-wide">{cat.name}</span>
                  )}
                  <h4 className="font-serif text-sm font-bold text-ink-900 group-hover:text-brand-500 transition-colors line-clamp-3 leading-snug mt-1">
                    {article.title}
                  </h4>
                  <time
                    dateTime={new Date(article.createdAt).toISOString()}
                    className="text-xs text-ink-400 mt-1 block"
                  >
                    {new Date(article.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short',
                    })}
                  </time>
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
