import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useArticles } from '../contexts/ArticleContext';
import { UserRole, ArticleStatus } from '../types';
import { CATEGORIES } from '../constants';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { articles } = useArticles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const latestHeadlines = articles
    .filter(a => a.status === ArticleStatus.PUBLISHED)
    .slice(0, 6)
    .map(a => a.title);

  // Duplikasi 3x → animasi gerak -33.333% = seamless loop
  const tickerItems = [...latestHeadlines, ...latestHeadlines, ...latestHeadlines];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setShowSearch(false); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [showSearch]);

  // FIX #5 — Kunci scroll body saat mobile menu terbuka
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) { navigate(`/kategori/nasional?q=${encodeURIComponent(q)}`); setShowSearch(false); setSearchQuery(''); }
  };

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const mainNavItems = [
    { to: '/', label: 'Beranda', exact: true },
    { to: '/profil', label: 'Profil' },
    { to: '/kegiatan', label: 'Kegiatan' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'header-scrolled' : ''}`} role="banner">

      {/* TOP BAR — Login/Daftar hanya tampil sm ke atas (hidden di mobile) */}
      <div className="bg-ink-900 text-ink-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <time dateTime={currentTime.toISOString()} className="hidden sm:block font-light">{formatDate(currentTime)}</time>
          <nav aria-label="Navigasi akun" className="hidden sm:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-ink-400">Halo, <span className="text-white font-medium">{user.name}</span></span>
                {user.role === UserRole.ADMIN && <Link to="/admin" className="bg-brand-500 text-white px-2 py-0.5 rounded text-xs font-medium hover:bg-brand-600 transition-colors">Admin Panel</Link>}
                {user.role === UserRole.USER && <Link to="/dashboard" className="text-ink-300 hover:text-white transition-colors">Dashboard</Link>}
                <button onClick={logout} className="text-ink-400 hover:text-white transition-colors">Keluar</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-white transition-colors">Masuk</Link>
                <span className="text-ink-600">|</span>
                <Link to="/daftar-kontributor" className="hover:text-white transition-colors">Daftar</Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* FIX #1 — NEWS TICKER
          PENYEBAB BUG: Header asli pakai class "ticker-inner" + inline style
          animation: 'tickerScroll 20s linear infinite' — nama tidak cocok dengan
          CSS global di index.html yang mendefinisikan .news-ticker-track +
          keyframe newsTickerScroll. Hasilnya: animasi tidak terpasang, ticker diam.

          SOLUSI: Ganti ke class "news-ticker-track" (sesuai CSS global).
          TIDAK ada inline style pada elemen track ini. */}
      {latestHeadlines.length > 0 && (
        <div className="bg-brand-500 text-white" style={{ height: '34px' }} aria-label="Berita terkini">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase" aria-hidden="true">
              <span className="breaking-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
              TERKINI
            </div>
            <div className="news-ticker-outer" aria-live="off">
              {/* class "news-ticker-track" — animasi dari CSS global, BUKAN inline style */}
              <div className="news-ticker-track">
                {tickerItems.map((headline, idx) => (
                  <span key={idx} className="news-ticker-item">
                    {headline}
                    <span className="news-ticker-sep" aria-hidden="true">●</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN HEADER */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex-shrink-0 group" aria-label="ISD NEWS - Beranda">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-brand-500 group-hover:text-brand-600 transition-colors leading-none tracking-tight">ISD</span>
                <span className="text-sm font-bold text-ink-800 tracking-[0.3em] uppercase leading-none">NEWS</span>
              </div>
              <div className="text-[9px] text-ink-400 tracking-widest uppercase font-light mt-0.5">Portal Berita Terpercaya</div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi utama">
              {mainNavItems.map(item => (
                <NavLink key={item.to} to={item.to} end={item.exact}
                  className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded transition-colors ${isActive ? 'text-brand-500 bg-brand-50' : 'text-ink-700 hover:text-brand-500 hover:bg-ink-50'}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {showSearch ? (
                  <form onSubmit={handleSearch} className="flex items-center" role="search">
                    <label htmlFor="header-search" className="sr-only">Cari berita</label>
                    <input ref={searchInputRef} id="header-search" type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Cari berita..." className="w-40 sm:w-56 px-3 py-1.5 text-sm border border-ink-200 rounded-l-md focus:outline-none focus:border-brand-500 transition-colors" />
                    <button type="submit" className="px-3 py-1.5 bg-brand-500 text-white rounded-r-md hover:bg-brand-600 transition-colors" aria-label="Cari">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <button type="button" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="ml-1 text-ink-400 hover:text-ink-700 p-1" aria-label="Tutup pencarian">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setShowSearch(true)} className="p-2 text-ink-500 hover:text-brand-500 hover:bg-ink-50 rounded-md transition-colors" aria-label="Buka pencarian">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                )}
              </div>

              {/* Masuk — desktop only */}
              {!user && (
                <Link to="/login" className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-md hover:bg-brand-600 transition-colors">
                  Masuk
                </Link>
              )}

              {/* Hamburger */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-ink-500 hover:text-ink-800 rounded-md"
                aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}>
                {isMenuOpen
                  ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY BAR — Desktop */}
      <nav className="bg-ink-900 hidden lg:block border-b border-ink-800" aria-label="Navigasi kategori">
        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar">
          {CATEGORIES.slice(0, 8).map(cat => (
            <Link key={cat.id} to={`/kategori/${cat.id}`}
              className="px-4 py-2.5 text-xs font-semibold text-ink-300 hover:text-white hover:bg-ink-700 whitespace-nowrap transition-colors tracking-wide uppercase">
              {cat.name}
            </Link>
          ))}
          <Link to="/kategori/nasional" className="ml-auto px-4 py-2.5 text-xs font-semibold text-brand-400 hover:text-brand-300 whitespace-nowrap transition-colors">
            Semua Kategori →
          </Link>
        </div>
      </nav>

      {/* FIX #5 — MOBILE MENU (SLIDE-IN DARI KANAN)
          Login & Daftar dipindah ke sini untuk pengalaman mobile yang lebih baik.
          Best practice: auth actions di bottom menu, mudah dijangkau ibu jari. */}
      {isMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMenu} aria-hidden="true" />
          <div id="mobile-menu" className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] sm:w-80 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto"
            role="dialog" aria-modal="true" aria-label="Menu navigasi">

            {/* Header sidebar */}
            <div className="flex items-center justify-between px-5 py-4 bg-ink-900 flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl text-brand-400">ISD</span>
                <span className="text-xs font-bold text-white tracking-[0.3em] uppercase">NEWS</span>
              </div>
              <button onClick={closeMenu} className="p-2 text-ink-400 hover:text-white rounded-md" aria-label="Tutup menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="px-3 py-3 space-y-0.5" aria-label="Navigasi utama">
              {mainNavItems.map(item => (
                <NavLink key={item.to} to={item.to} end={item.exact} onClick={closeMenu}
                  className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-500 font-semibold' : 'text-ink-700 hover:bg-ink-50'}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Kategori */}
            <div className="border-t border-ink-100 px-4 py-4">
              <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-3">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 8).map(cat => (
                  <Link key={cat.id} to={`/kategori/${cat.id}`} onClick={closeMenu}
                    className="px-3 py-1.5 bg-ink-100 text-ink-700 rounded-full text-xs font-medium hover:bg-brand-500 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* AUTH SECTION — di bawah (mt-auto) untuk mudah dijangkau ibu jari */}
            <div className="mt-auto border-t border-ink-100 px-4 py-5 bg-ink-50 flex-shrink-0">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{user.name}</p>
                      <p className="text-xs text-ink-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.role === UserRole.ADMIN && (
                    <Link to="/admin" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === UserRole.USER && (
                    <Link to="/dashboard" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
                      Dashboard Saya
                    </Link>
                  )}
                  <button onClick={() => { logout(); closeMenu(); }}
                    className="w-full px-4 py-2.5 border border-ink-200 text-ink-600 text-sm font-medium rounded-lg hover:bg-ink-100 transition-colors">
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-ink-500 text-center mb-3">Bergabung bersama ISD NEWS</p>
                  <Link to="/login" onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    Masuk ke Akun
                  </Link>
                  <Link to="/daftar-kontributor" onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-brand-500 text-brand-500 text-sm font-semibold rounded-lg hover:bg-brand-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Daftar Kontributor
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
