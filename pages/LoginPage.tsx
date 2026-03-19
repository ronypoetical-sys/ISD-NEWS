import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (success) {
        navigate('/');
      } else {
        setError('Email atau password tidak valid. Periksa kembali dan coba lagi.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-ink-900 to-ink-900 pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-baseline gap-1.5 group">
            <span className="font-serif text-4xl text-brand-400 group-hover:text-brand-300 transition-colors">ISD</span>
            <span className="text-sm font-bold text-white tracking-[0.3em] uppercase">NEWS</span>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="font-serif text-2xl text-white/90 leading-relaxed mb-6">
            "Jurnalisme yang baik adalah ketika pembaca mengetahui kebenaran yang ingin mereka hindari."
          </blockquote>
          <cite className="text-ink-400 text-sm not-italic">— Prinsip Redaksi ISD NEWS</cite>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '100K+', label: 'Pembaca' },
            { value: '500+', label: 'Artikel' },
            { value: '24/7', label: 'Update' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl font-bold text-brand-400">{stat.value}</div>
              <div className="text-xs text-ink-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-baseline gap-1.5">
              <span className="font-serif text-3xl text-brand-500">ISD</span>
              <span className="text-sm font-bold text-ink-900 tracking-[0.3em] uppercase">NEWS</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-2">Masuk ke Akun</h2>
            <p className="text-ink-500 text-sm leading-relaxed">
              Portal kontributor dan redaksi ISD NEWS.
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-xl">
            <p className="text-xs font-semibold text-brand-700 mb-2">Demo Akses:</p>
            <div className="space-y-1 text-xs text-brand-600 font-mono">
              <div className="flex justify-between gap-4">
                <span className="text-ink-500">Admin:</span>
                <span>username: <strong>admin</strong> / pass: <strong>rony123A.@</strong></span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-ink-500">Kontributor:</span>
                <span>budi@isdnews.com / <strong>password</strong></span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Masukkan email atau username"
                  className="w-full pl-10 pr-4 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-ink-700">
                  Password
                </label>
                <a href="#" className="text-xs text-brand-500 hover:text-brand-700 transition-colors">Lupa password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-400 hover:text-ink-700"
                >
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Memverifikasi...
                </>
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-xs text-center text-ink-400 mt-8">
            &copy; {new Date().getFullYear()} ISD NEWS. Portal Berita Terpercaya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
