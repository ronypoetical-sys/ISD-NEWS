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

  // Duplikasi 3x untuk ticker yang mulus di semua ukuran layar
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
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowSearch(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/kategori/nasional?q=${encodeURIComponent(q)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const mainNavItems = [
    { to: '/', label: 'Beranda', exact: true },
    { to: '/profil', label: 'Profil' },
    { to: '/kegiatan', label: 'Kegiatan' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/kontak', label: 'Kontak' },
  ];

  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'header-scrolled' : ''}`} role="banner">
      {/* Top Bar */}
      <div className="bg-ink-900 text-ink-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <time dateTime={currentTime.toISOString()} className="hidden sm:block font-light">
            {formatDate(currentTime)}
          </time>
          <nav aria-label="Navigasi akun pengguna">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-ink-400">
                    Halo, <span className="text-white font-medium">{user.name}</span>
                  </span>
                  {user.role === UserRole.ADMIN && (
                    <Link to="/admin" className="bg-brand-500 text-white px-2 py-0.5 rounded text-xs font-medium hover:bg-brand-600 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  {user.role === UserRole.USER && (
                    <Link to="/dashboard" className="text-ink-300 hover:text-white transition-colors">Dashboard</Link>
                  )}
                  <button onClick={logout} className="text-ink-400 hover:text-white transition-colors" aria-label="Keluar dari akun">
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="hover:text-white transition-colors">Masuk</Link>
                  <span className="text-ink-600" aria-hidden="true">|</span>
                  <Link to="/daftar-kontributor" className="hover:text-white transition-colors">Daftar</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ===== BREAKING NEWS TICKER — Fixed untuk Mobile & Desktop ===== */}
      {latestHeadlines.length > 0 && (
        <div className="bg-brand-500 text-white overflow-hidden" style={{ height: '32px' }} aria-label="Berita terkini">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-3">
            {/* Badge TERKINI */}
            <div
              className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase z-10"
              aria-hidden="true"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span className="breaking-dot w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
              TERKINI
            </div>
            {/* Ticker wrapper */}
            <div className="flex-1 overflow-hidden relative" style={{ height: '32px' }}>
              <div
                className="ticker-inner absolute top-0 left-0 h-full flex items-center"
                style={{
                  /* Kecepatan: semakin kecil angka detik = semakin cepat */
                  animation: 'tickerScroll 20s linear infinite',
                  whiteSpace: 'nowrap',
                  willChange: 'transform',
                }}
                aria-live="off"
              >
                {tickerItems.map((headline, idx) => (
                  <span key={idx} className="inline-flex items-center text-sm font-light">
                    <span className="px-5">{headline}</span>
                    <span className="text-white/40 text-base" aria-hidden="true">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group" aria-label="ISD NEWS - Beranda">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-brand-500 group-hover:text-brand-600 transition-colors leading-none tracking-tight">ISD</span>
                <span className="text-sm font-bold text-ink-800 tracking-[0.3em] uppercase leading-none">NEWS</span>
              </div>
              <div className="text-[9px] text-ink-400 tracking-widest uppercase font-light mt-0.5">Portal Berita Terpercaya</div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi utama">
              {mainNavItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded transition-colors ${
                      isActive ? 'text-brand-500 bg-brand-50' : 'text-ink-700 hover:text-brand-500 hover:bg-ink-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {showSearch ? (
                  <form onSubmit={handleSearch} className="flex items-center" role="search">
                    <label htmlFor="header-search" className="sr-only">Cari berita</label>
                    <input
                      ref={searchInputRef}
                      id="header-search"
                      type="search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Cari berita..."
                      className="w-40 sm:w-56 px-3 py-1.5 text-sm border border-ink-200 rounded-l-md focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-brand-500 text-white rounded-r-md hover:bg-brand-600 transition-colors" aria-label="Cari">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button type="button" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="ml-1 text-ink-400 hover:text-ink-700 p-1" aria-label="Tutup pencarian">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setShowSearch(true)} className="p-2 text-ink-500 hover:text-brand-500 hover:bg-ink-50 rounded-md transition-colors" aria-label="Buka pencarian">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {!user && (
                <Link to="/login" className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-md hover:bg-brand-600 transition-colors">
                  Masuk
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-ink-500 hover:text-ink-800 rounded-md"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar — Desktop only */}
      <nav className="bg-ink-900 hidden lg:block border-b border-ink-800" aria-label="Navigasi kategori berita">
        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar">
          {topCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/kategori/${cat.id}`}
              className="px-4 py-2.5 text-xs font-semibold text-ink-300 hover:text-white hover:bg-ink-700 whitespace-nowrap transition-colors tracking-wide uppercase"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/kategori/nasional" className="ml-auto px-4 py-2.5 text-xs font-semibold text-brand-400 hover:text-brand-300 whitespace-nowrap transition-colors">
            Semua Kategori →
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-white border-b border-ink-100 shadow-xl animate-slide-up" role="navigation" aria-label="Menu mobile">
          <div className="px-4 py-4 space-y-1">
            {mainNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-md text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-500' : 'text-ink-700 hover:bg-ink-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-ink-100 px-4 py-3">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 8).map(cat => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.id}`}
                  onClick={closeMenu}
                  className="px-3 py-1 bg-ink-100 text-ink-700 rounded-full text-xs font-medium hover:bg-brand-500 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          {!user && (
            <div className="border-t border-ink-100 px-4 py-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
              >
                Masuk / Daftar
              </Link>
            </div>
          )}
          {user && (
            <div className="border-t border-ink-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-ink-600 font-medium">{user.name}</span>
              <button onClick={() => { logout(); closeMenu(); }} className="text-sm text-brand-500 font-medium hover:text-brand-700">
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
