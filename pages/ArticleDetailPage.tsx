import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticleContext';
import { CATEGORIES } from '../constants';
import ArticleCard from '../components/ArticleCard';
import { ArticleStatus } from '../types';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug, articles } = useArticles();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [slug]);

  if (!slug) return null;

  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <main id="main-content" className="max-w-2xl mx-auto py-24 px-4 text-center" role="main">
        <div className="text-6xl mb-4" aria-hidden="true">📰</div>
        <h1 className="font-serif text-2xl font-bold text-ink-900 mb-2">Artikel tidak ditemukan</h1>
        <p className="text-ink-500 mb-6">Artikel yang Anda cari mungkin sudah dipindahkan atau dihapus.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </main>
    );
  }

  const category = CATEGORIES.find(c => c.id === article.categoryId);
  const relatedArticles = articles
    .filter(a => a.categoryId === article.categoryId && a.id !== article.id && a.status === ArticleStatus.PUBLISHED)
    .slice(0, 4);
  const moreArticles = articles
    .filter(a => a.id !== article.id && a.status === ArticleStatus.PUBLISHED)
    .slice(0, 3);

  const publishDate = new Date(article.createdAt);
  const dateStr = publishDate.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr = publishDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const isoDate = publishDate.toISOString();

  // Article structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.imageUrl],
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISD NEWS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://isdnews.com/logo.png',
      },
    },
    description: article.content.substring(0, 160),
    articleSection: category?.name || '',
    keywords: article.tags?.join(', ') || '',
    url: `https://isdnews.com/artikel/${article.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://isdnews.com/artikel/${article.slug}`,
    },
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="bg-ink-50 min-h-screen">
        {/* Article Hero */}
        <header className="bg-white border-b border-ink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-ink-400 mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-brand-500 transition-colors">Beranda</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {category && (
                <>
                  <Link to={`/kategori/${category.id}`} className="hover:text-brand-500 transition-colors">
                    {category.name}
                  </Link>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              <span className="text-ink-500 line-clamp-1" aria-current="page">
                {article.title.substring(0, 50)}{article.title.length > 50 ? '...' : ''}
              </span>
            </nav>

            <div className="max-w-3xl">
              {category && (
                <Link
                  to={`/kategori/${category.id}`}
                  className="inline-block bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-4 hover:bg-brand-700 transition-colors"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-6">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-ink-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold"
                    aria-hidden="true"
                  >
                    {article.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{article.authorName}</p>
                    <p className="text-xs text-ink-400">Penulis</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-ink-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={isoDate} className="text-xs">
                    {dateStr} · {timeStr} WIB
                  </time>
                </div>
                {/* Share */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-ink-400 font-medium">Bagikan:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://isdnews.com/artikel/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-bold"
                    aria-label="Bagikan ke Twitter"
                  >
                    X
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://isdnews.com/artikel/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity text-xs font-bold"
                    aria-label="Bagikan ke Facebook"
                  >
                    f
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + `https://isdnews.com/artikel/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="Bagikan ke WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article Content */}
            <div className="lg:col-span-2">
              {/* Featured Image */}
              {/* FIX #3 — CAPTION GAMBAR SEMANTIK
                  Tampilkan article.imageCaption jika ada, fallback ke default.
                  alt text menggunakan caption untuk aksesibilitas & SEO. */}
              <figure className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={article.imageUrl}
                  alt={article.imageCaption || article.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                  loading="eager"
                  width={800}
                  height={500}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/fallback-${article.id}/1200/800`;
                  }}
                />
                <figcaption className="bg-ink-900 text-ink-400 text-xs px-4 py-2.5 text-center">
                  {article.imageCaption
                    ? article.imageCaption
                    : `Foto: ${article.authorName} / ISD NEWS`}
                </figcaption>
              </figure>

              {/* Article Body */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ink-100">
                <div className="article-body text-ink-700 text-lg leading-relaxed">
                  {article.content.split('\n\n').map((para, idx) =>
                    para.trim() ? <p key={idx} className="mb-5">{para.trim()}</p> : null
                  )}
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-ink-100 flex flex-wrap items-center gap-2">
                    <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div className="flex flex-wrap gap-2" aria-label="Tag artikel">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-ink-100 text-ink-600 text-xs rounded-full font-medium hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Card */}
                <div className="mt-8 pt-6 border-t border-ink-100 bg-ink-50 -mx-8 -mb-8 px-8 pb-8 rounded-b-2xl">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                      aria-hidden="true"
                    >
                      {article.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-0.5">Ditulis oleh</p>
                      <p className="font-serif text-lg font-bold text-ink-900">{article.authorName}</p>
                      <p className="text-xs text-ink-500">Jurnalis &amp; Kontributor ISD NEWS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-10" aria-labelledby="related-heading">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-5 bg-brand-500 rounded-full" aria-hidden="true"></div>
                    <h2 id="related-heading" className="font-serif text-xl font-bold text-ink-900">Berita Terkait</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedArticles.map(related => (
                      <ArticleCard key={related.id} article={related} variant="horizontal" />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Sidebar konten tambahan">
              <div className="bg-white rounded-xl border border-ink-100 p-5 sticky top-36">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-brand-500 rounded-full" aria-hidden="true"></div>
                  <h3 className="font-serif text-lg font-bold text-ink-900">Berita Lainnya</h3>
                </div>
                <div className="space-y-0">
                  {moreArticles.map(a => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
                <Link
                  to="/"
                  className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
                >
                  Lihat Semua Berita
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default ArticleDetailPage;
