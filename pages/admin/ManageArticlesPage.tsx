import React, { useState } from 'react';
import { useArticles } from '../../contexts/ArticleContext';
import { Link } from 'react-router-dom';
import { ArticleStatus } from '../../types';
import { CATEGORIES } from '../../constants';

type TabType = 'all' | 'published' | 'draft' | 'pending';

const ManageArticlesPage: React.FC = () => {
  const { articles, deleteArticle, approveArticle } = useArticles();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');

  const filtered = articles.filter(a => {
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'published' && a.status === ArticleStatus.PUBLISHED) ||
      (activeTab === 'draft' && a.status === ArticleStatus.DRAFT) ||
      (activeTab === 'pending' && a.status === ArticleStatus.PENDING);
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.authorName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const statusConfig: Record<ArticleStatus, { label: string; color: string; bg: string }> = {
    [ArticleStatus.PUBLISHED]: { label: 'Diterbitkan', color: 'text-green-700', bg: 'bg-green-100' },
    [ArticleStatus.PENDING]: { label: 'Menunggu', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    [ArticleStatus.DRAFT]: { label: 'Draf', color: 'text-ink-600', bg: 'bg-ink-100' },
    [ArticleStatus.REJECTED]: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-100' },
  };

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'Semua', count: articles.length },
    { id: 'published', label: 'Diterbitkan', count: articles.filter(a => a.status === ArticleStatus.PUBLISHED).length },
    { id: 'pending', label: 'Menunggu', count: articles.filter(a => a.status === ArticleStatus.PENDING).length },
    { id: 'draft', label: 'Draf', count: articles.filter(a => a.status === ArticleStatus.DRAFT).length },
  ];

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="text-ink-400 hover:text-ink-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <h1 className="font-serif text-2xl font-bold text-ink-900">Kelola Artikel</h1>
            </div>
            <Link
              to="/admin/artikel/baru"
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Artikel Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search + Tabs */}
        <div className="bg-white rounded-xl border border-ink-100 overflow-hidden mb-5">
          {/* Search */}
          <div className="px-4 py-3 border-b border-ink-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari berdasarkan judul atau penulis..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-ink-100 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-ink-500 hover:text-ink-800 hover:border-ink-300'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-ink-100 text-ink-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Article List */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-sm font-medium text-ink-700">Tidak ada artikel ditemukan</p>
              {search && <p className="text-xs text-ink-400 mt-1">Coba kata kunci yang berbeda</p>}
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {filtered.map(article => {
                const st = statusConfig[article.status];
                const cat = CATEGORIES.find(c => c.id === article.categoryId);
                return (
                  <li key={article.id} className="group hover:bg-ink-50 transition-colors">
                    <div className="flex gap-4 px-6 py-4 items-center">
                      {/* Thumbnail */}
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-16 h-12 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={`/admin/artikel/edit/${article.id}`}
                            className="text-sm font-semibold text-ink-900 hover:text-brand-500 transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${st.bg} ${st.color}`}>
                            {st.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-400">
                          <span>{article.authorName}</span>
                          <span>·</span>
                          {cat && <span className="text-brand-500">{cat.name}</span>}
                          <span>·</span>
                          <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Hover Actions */}
                        <div className="flex items-center gap-4 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {article.status === ArticleStatus.PENDING && (
                            <button
                              onClick={() => approveArticle(article.id)}
                              className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
                            >
                              ✓ Setujui
                            </button>
                          )}
                          <Link to={`/admin/artikel/edit/${article.id}`} className="text-xs font-medium text-ink-500 hover:text-ink-800 transition-colors">
                            Edit
                          </Link>
                          {article.status === ArticleStatus.PUBLISHED && (
                            <Link to={`/artikel/${article.slug}`} target="_blank" className="text-xs font-medium text-ink-500 hover:text-ink-800 transition-colors">
                              Lihat ↗
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Hapus artikel "${article.title}"?`)) deleteArticle(article.id);
                            }}
                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="text-xs text-ink-400 text-center">
          Menampilkan {filtered.length} dari {articles.length} artikel
        </p>
      </div>
    </div>
  );
};

export default ManageArticlesPage;
