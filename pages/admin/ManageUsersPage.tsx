import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useArticles } from '../../contexts/ArticleContext';
import { UserRole, ArticleStatus } from '../../types';
import { Link } from 'react-router-dom';

const ManageUsersPage: React.FC = () => {
  const { users, addContributor } = useAuth();
  const { articles } = useArticles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage({ text: 'Semua kolom harus diisi.', type: 'error' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = addContributor(name, email, password);
    setLoading(false);
    if (success) {
      setMessage({ text: `Kontributor "${name}" berhasil ditambahkan.`, type: 'success' });
      setName(''); setEmail(''); setPassword('');
      setShowForm(false);
    } else {
      setMessage({ text: 'Gagal: Email mungkin sudah terdaftar.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const getUserStats = (userId: number) => {
    const userArticles = articles.filter(a => a.authorId === userId);
    return {
      total: userArticles.length,
      published: userArticles.filter(a => a.status === ArticleStatus.PUBLISHED).length,
    };
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="text-ink-400 hover:text-ink-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <h1 className="font-serif text-2xl font-bold text-ink-900">Kelola Pengguna</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Tambah Kontributor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Feedback */}
        {message.text && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'success'
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
            {message.text}
          </div>
        )}

        {/* Add Contributor Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-ink-100 p-6 animate-slide-up">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-5">Tambah Kontributor Baru</h2>
            <form onSubmit={handleAddContributor}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Nama Lengkap <span className="text-brand-500">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Email / Username <span className="text-brand-500">*</span></label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="email@domain.com"
                    className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Password <span className="text-brand-500">*</span></label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Min. 8 karakter"
                    className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60"
                >
                  {loading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : null}
                  Tambahkan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-ink-600 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Pengguna', value: users.length, icon: '👥' },
            { label: 'Admin', value: users.filter(u => u.role === UserRole.ADMIN).length, icon: '🛡️' },
            { label: 'Kontributor', value: users.filter(u => u.role === UserRole.USER).length, icon: '✍️' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-ink-100 p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-serif text-2xl font-bold text-ink-900">{s.value}</div>
              <div className="text-xs text-ink-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100">
            <h2 className="font-serif text-lg font-bold text-ink-900">Daftar Pengguna ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-100">
                  <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Pengguna</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Peran</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider hidden md:table-cell">Artikel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map(u => {
                  const stats = getUserStats(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-ink-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                            u.role === UserRole.ADMIN ? 'bg-purple-500' : 'bg-brand-500'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-ink-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-ink-500 font-mono text-xs">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.role === UserRole.ADMIN
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {u.role === UserRole.ADMIN ? '🛡️ Admin' : '✍️ Kontributor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-xs text-ink-500">
                          <span className="font-semibold text-ink-900">{stats.total}</span> total ·{' '}
                          <span className="text-green-600 font-semibold">{stats.published}</span> diterbitkan
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
