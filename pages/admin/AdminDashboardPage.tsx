import React from 'react';
import { useArticles } from '../../contexts/ArticleContext';
import { ArticleStatus } from '../../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { articles, approveArticle, deleteArticle } = useArticles();
  const { users } = useAuth();

  const total = articles.length;
  const published = articles.filter(a => a.status === ArticleStatus.PUBLISHED).length;
  const pending = articles.filter(a => a.status === ArticleStatus.PENDING);
  const drafts = articles.filter(a => a.status === ArticleStatus.DRAFT).length;

  const recentPublished = articles
    .filter(a => a.status === ArticleStatus.PUBLISHED)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total Artikel', value: total, icon: '📰', color: 'text-ink-700', bg: 'bg-ink-50', change: '+12%' },
    { label: 'Diterbitkan', value: published, icon: '✅', color: 'text-green-700', bg: 'bg-green-50', change: '+8%' },
    { label: 'Menunggu Review', value: pending.length, icon: '⏳', color: 'text-yellow-700', bg: 'bg-yellow-50', urgent: pending.length > 0 },
    { label: 'Total Pengguna', value: users.length, icon: '👥', color: 'text-blue-700', bg: 'bg-blue-50', change: '+2' },
  ];

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-1">Panel Admin</div>
              <h1 className="font-serif text-2xl font-bold text-ink-900">Dashboard Redaksi</h1>
            </div>
            <div className="flex items-center gap-2">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl border border-ink-100 p-5 ${stat.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center text-lg`}>{stat.icon}</div>
                {stat.urgent && (
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">Perlu Aksi</span>
                )}
              </div>
              <div className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
              {stat.change && <div className="text-xs text-green-500 font-medium mt-1">{stat.change} bulan ini</div>}
            </div>
          ))}
        </div>

        {/* Admin Quick Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/artikel" className="bg-white rounded-xl border border-ink-100 p-5 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Kelola Artikel</div>
              <div className="text-xs text-ink-500">{total} total · {drafts} draf</div>
            </div>
            <svg className="w-4 h-4 text-ink-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link to="/admin/pengguna" className="bg-white rounded-xl border border-ink-100 p-5 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Kelola Pengguna</div>
              <div className="text-xs text-ink-500">{users.length} pengguna terdaftar</div>
            </div>
            <svg className="w-4 h-4 text-ink-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link to="/" className="bg-white rounded-xl border border-ink-100 p-5 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Lihat Portal</div>
              <div className="text-xs text-ink-500">Tampilan publik</div>
            </div>
            <svg className="w-4 h-4 text-ink-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Articles */}
          <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-ink-900">Menunggu Persetujuan</h2>
                {pending.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-yellow-400 text-white text-xs font-bold flex items-center justify-center">
                    {pending.length}
                  </span>
                )}
              </div>
              <Link to="/admin/artikel?tab=pending" className="text-xs font-medium text-brand-500 hover:text-brand-700">
                Lihat Semua
              </Link>
            </div>

            {pending.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm font-medium text-ink-700">Semua artikel sudah ditinjau!</p>
                <p className="text-xs text-ink-400 mt-1">Tidak ada yang menunggu persetujuan.</p>
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {pending.map(article => (
                  <li key={article.id} className="px-6 py-4 hover:bg-ink-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900 line-clamp-1">{article.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">
                          oleh {article.authorName} · {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveArticle(article.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Published */}
          <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-ink-900">Terakhir Diterbitkan</h2>
              <Link to="/admin/artikel?tab=published" className="text-xs font-medium text-brand-500 hover:text-brand-700">
                Lihat Semua
              </Link>
            </div>
            <ul className="divide-y divide-ink-100">
              {recentPublished.map(article => (
                <li key={article.id} className="flex gap-3 px-6 py-4 hover:bg-ink-50 transition-colors">
                  <img src={article.imageUrl} alt="" className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/artikel/${article.slug}`} className="text-sm font-semibold text-ink-900 hover:text-brand-500 transition-colors line-clamp-1">
                      {article.title}
                    </Link>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {article.authorName} · {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Link to={`/admin/artikel/edit/${article.id}`} className="text-xs text-ink-400 hover:text-brand-500 flex-shrink-0 self-center">
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
