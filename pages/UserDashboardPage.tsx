import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useArticles } from '../contexts/ArticleContext';
import { Link } from 'react-router-dom';
import { ArticleStatus } from '../types';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { articles } = useArticles();

  if (!user) return null;

  const userArticles = articles.filter(a => a.authorId === user.id);
  const published = userArticles.filter(a => a.status === ArticleStatus.PUBLISHED).length;
  const pending = userArticles.filter(a => a.status === ArticleStatus.PENDING).length;
  const drafts = userArticles.filter(a => a.status === ArticleStatus.DRAFT).length;
  const rejected = userArticles.filter(a => a.status === ArticleStatus.REJECTED).length;

  const statusConfig: Record<ArticleStatus, { label: string; color: string; bg: string }> = {
    [ArticleStatus.PUBLISHED]: { label: 'Diterbitkan', color: 'text-green-700', bg: 'bg-green-100' },
    [ArticleStatus.PENDING]: { label: 'Menunggu', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    [ArticleStatus.DRAFT]: { label: 'Draf', color: 'text-ink-600', bg: 'bg-ink-100' },
    [ArticleStatus.REJECTED]: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-100' },
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-ink-900">Selamat Datang, {user.name.split(' ')[0]}!</h1>
                <p className="text-sm text-ink-500">{user.email} · Kontributor ISD NEWS</p>
              </div>
            </div>
            <Link
              to="/kirim-artikel"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Tulis Artikel Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Artikel', value: userArticles.length, icon: '📄', color: 'text-ink-700' },
            { label: 'Diterbitkan', value: published, icon: '✅', color: 'text-green-600' },
            { label: 'Menunggu Review', value: pending, icon: '⏳', color: 'text-yellow-600' },
            { label: 'Draf', value: drafts, icon: '📝', color: 'text-ink-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-ink-100 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/kirim-artikel" className="bg-white rounded-xl p-5 border border-ink-100 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Tulis Artikel Baru</div>
              <div className="text-xs text-ink-500">Buat konten baru</div>
            </div>
          </Link>
          <a href="#articles" className="bg-white rounded-xl p-5 border border-ink-100 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Artikel Saya</div>
              <div className="text-xs text-ink-500">{userArticles.length} total artikel</div>
            </div>
          </a>
          <Link to="/kontak" className="bg-white rounded-xl p-5 border border-ink-100 hover:border-brand-300 transition-all article-card flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">Hubungi Redaksi</div>
              <div className="text-xs text-ink-500">Pertanyaan & saran</div>
            </div>
          </Link>
        </div>

        {/* Articles Table */}
        <div id="articles" className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-ink-900">Artikel Saya</h2>
            <span className="text-xs text-ink-400">{userArticles.length} artikel</span>
          </div>

          {userArticles.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">Belum Ada Artikel</h3>
              <p className="text-ink-500 text-sm mb-5">Mulai berkontribusi dengan menulis artikel pertama Anda.</p>
              <Link to="/kirim-artikel" className="px-5 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
                Tulis Sekarang
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-ink-50 border-b border-ink-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Judul Artikel</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {userArticles.map(article => {
                    const st = statusConfig[article.status];
                    const canEdit = article.status === ArticleStatus.DRAFT || article.status === ArticleStatus.PENDING;
                    return (
                      <tr key={article.id} className="hover:bg-ink-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-ink-900 line-clamp-2 max-w-xs">{article.title}</div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-xs text-ink-500">
                            {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.color}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {canEdit && (
                              <Link to={`/edit-artikel/${article.id}`} className="text-xs font-medium text-brand-500 hover:text-brand-700 transition-colors">
                                Edit
                              </Link>
                            )}
                            {article.status === ArticleStatus.PUBLISHED && (
                              <Link to={`/artikel/${article.slug}`} className="text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors">
                                Lihat
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white">
          <h3 className="font-serif text-lg font-bold mb-2">Tips untuk Kontributor</h3>
          <ul className="space-y-1.5 text-sm text-white/80">
            <li className="flex items-start gap-2"><span className="text-brand-200 mt-0.5">→</span> Artikel dengan foto cover berkualitas tinggi lebih cepat disetujui</li>
            <li className="flex items-start gap-2"><span className="text-brand-200 mt-0.5">→</span> Pastikan konten minimal 300 kata dan dilengkapi sumber terpercaya</li>
            <li className="flex items-start gap-2"><span className="text-brand-200 mt-0.5">→</span> Pilih kategori yang paling relevan untuk jangkauan pembaca lebih luas</li>
            <li className="flex items-start gap-2"><span className="text-brand-200 mt-0.5">→</span> Proses review tim redaksi umumnya 1-2 hari kerja</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
