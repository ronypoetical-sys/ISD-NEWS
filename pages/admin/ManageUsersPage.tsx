import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useArticles } from '../../contexts/ArticleContext';
import { UserRole, ArticleStatus } from '../../types';
import { Link } from 'react-router-dom';

const MIN_PASSWORD_LENGTH = 8;

const ManageUsersPage: React.FC = () => {
  const { users, addContributor } = useAuth();
  const { articles } = useArticles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Nama minimal 2 karakter.';
    }
    if (!email.trim()) {
      errors.email = 'Email harus diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && !email.trim().match(/^[a-zA-Z0-9_]+$/)) {
      errors.email = 'Format email tidak valid.';
    }
    if (!password) {
      errors.password = 'Password harus diisi.';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const success = addContributor(name.trim(), email.trim(), password);
    setLoading(false);

    if (success) {
      setMessage({ text: `Kontributor "${name.trim()}" berhasil ditambahkan.`, type: 'success' });
      setName(''); setEmail(''); setPassword('');
      setValidationErrors({});
      setShowForm(false);
    } else {
      setMessage({ text: 'Gagal menambahkan: Email mungkin sudah terdaftar.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setName(''); setEmail(''); setPassword('');
    setValidationErrors({});
  };

  const getUserStats = (userId: number) => {
    const userArticles = articles.filter(a => a.authorId === userId);
    return {
      total: userArticles.length,
      published: userArticles.filter(a => a.status === ArticleStatus.PUBLISHED).length,
    };
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-brand-500 transition-colors ${
      validationErrors[field] ? 'border-red-400 bg-red-50' : 'border-ink-200'
    }`;

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="text-ink-400 hover:text-ink-700 transition-colors" aria-label="Kembali ke admin dashboard">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="font-serif text-2xl font-bold text-ink-900">Kelola Pengguna</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Kontributor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Feedback */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
            role="alert"
            aria-live="assertive"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            <form onSubmit={handleAddContributor} noValidate aria-label="Form tambah kontributor">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="contrib-name" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Nama Lengkap <span className="text-brand-500">*</span>
                  </label>
                  <input
                    id="contrib-name"
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setValidationErrors(prev => ({ ...prev, name: '' })); }}
                    required
                    placeholder="Nama lengkap"
                    className={inputClass('name')}
                    aria-describedby={validationErrors.name ? 'name-error' : undefined}
                    aria-invalid={!!validationErrors.name}
                  />
                  {validationErrors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600" role="alert">{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contrib-email" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Email / Username <span className="text-brand-500">*</span>
                  </label>
                  <input
                    id="contrib-email"
                    type="text"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setValidationErrors(prev => ({ ...prev, email: '' })); }}
                    required
                    placeholder="email@domain.com"
                    autoComplete="off"
                    className={inputClass('email')}
                    aria-describedby={validationErrors.email ? 'email-error' : undefined}
                    aria-invalid={!!validationErrors.email}
                  />
                  {validationErrors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contrib-password" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Password <span className="text-brand-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="contrib-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setValidationErrors(prev => ({ ...prev, password: '' })); }}
                      required
                      placeholder={`Min. ${MIN_PASSWORD_LENGTH} karakter`}
                      autoComplete="new-password"
                      className={`${inputClass('password')} pr-10`}
                      aria-describedby={validationErrors.password ? 'password-error' : 'password-hint'}
                      aria-invalid={!!validationErrors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-400 hover:text-ink-700"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {showPassword
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                  {validationErrors.password ? (
                    <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">{validationErrors.password}</p>
                  ) : (
                    <p id="password-hint" className="mt-1 text-xs text-ink-400">Minimal {MIN_PASSWORD_LENGTH} karakter</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60"
                  aria-busy={loading}
                >
                  {loading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  Tambahkan
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
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
              <div className="text-2xl mb-1" aria-hidden="true">{s.icon}</div>
              <div className="font-serif text-2xl font-bold text-ink-900">{s.value}</div>
              <div className="text-xs text-ink-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-100">
            <h2 className="font-serif text-lg font-bold text-ink-900">
              Daftar Pengguna ({users.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Daftar pengguna">
              <thead>
                <tr className="bg-ink-50 border-b border-ink-100">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Pengguna</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Peran</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-ink-500 uppercase tracking-wider hidden md:table-cell">Artikel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map(u => {
                  const stats = getUserStats(u.id);
                  return (
                    <tr key={u.id} className="hover:bg-ink-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                              u.role === UserRole.ADMIN ? 'bg-purple-500' : 'bg-brand-500'
                            }`}
                            aria-hidden="true"
                          >
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-ink-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-ink-500 font-mono">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.role === UserRole.ADMIN
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
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
