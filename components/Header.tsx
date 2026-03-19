import React, { useState, useEffect } from 'react';
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

  const latestHeadlines = articles
    .filter(a => a.status === ArticleStatus.PUBLISHED)
    .slice(0, 6)
    .map(a => a.title);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/kategori/nasional?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const mainNavItems = [
    { to: '/', label: 'Beranda', exact: true },
    { to: '/profil', label: 'Profil' },
    { to: '/kegiatan', label: 'Kegiatan' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/kontak', label: 'Kontak' },
  ];

  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="bg-ink-900 text-ink-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="hidden sm:block font-light">{formatDate(currentTime)}</span>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-ink-400">Halo, <span className="text-white font-medium">{user.name}</span></span>
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" className="bg-brand-500 text-white px-2 py-0.5 rounded text-xs font-medium hover:bg-brand-600 transition-colors">
                    Admin Panel
                  </Link>
                )}
                {user.role === UserRole.USER && (
                  <Link to="/dashboard" className="text-ink-300 hover:text-white transition-colors">Dashboard</Link>
                )}
                <button onClick={logout} className="text-ink-400 hover:text-white transition-colors">Keluar</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-white transition-colors">Masuk</Link>
                <span className="text-ink-600">|</span>
                <Link to="/login" className="hover:text-white transition-colors">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {latestHeadlines.length > 0 && (
        <div className="bg-brand-500 text-white py-1.5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase">
              <span className="breaking-dot w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
              TERKINI
            </div>
            <div className="ticker-wrap flex-1 overflow-hidden">
              <div className="ticker-content text-sm font-light">
                {latestHeadlines.join('  •  ')}
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
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-brand-500 group-hover:text-brand-600 transition-colors leading-none tracking-tight">ISD</span>
                <span className="text-sm font-bold text-ink-800 tracking-[0.3em] uppercase leading-none">NEWS</span>
              </div>
              <div className="text-[9px] text-ink-400 tracking-widest uppercase font-light mt-0.5">Portal Berita Terpercaya</div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
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
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Cari berita..."
                      className="w-48 sm:w-64 px-3 py-1.5 text-sm border border-ink-200 rounded-l-md focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-brand-500 text-white rounded-r-md hover:bg-brand-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <button type="button" onClick={() => setShowSearch(false)} className="ml-1 text-ink-400 hover:text-ink-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-ink-500 hover:text-brand-500 hover:bg-ink-50 rounded-md transition-colors"
                    title="Cari berita"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                )}
              </div>

              {!user && (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-md hover:bg-brand-600 transition-colors"
                >
                  Masuk
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-ink-500 hover:text-ink-800 rounded-md"
              >
                {isMenuOpen
                  ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-ink-900 hidden lg:block border-b border-ink-800">
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
          <Link
            to="/kategori/nasional"
            className="ml-auto px-4 py-2.5 text-xs font-semibold text-brand-400 hover:text-brand-300 whitespace-nowrap transition-colors"
          >
            Semua Kategori →
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-ink-100 shadow-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {mainNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-md text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-500' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-ink-100 px-4 py-3">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-1 bg-ink-100 text-ink-700 rounded-full text-xs font-medium hover:bg-brand-500 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          {user && (
            <div className="border-t border-ink-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-ink-600">{user.name}</span>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-sm text-brand-500 font-medium">Keluar</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
