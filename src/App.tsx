import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Edit, Trash2, CheckCircle } from 'lucide-react';

const SUPABASE_URL = 'https://voukghjtxmlylqgxcep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWtnaGp0eG1sYnlscWd4Y2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk0MzUsImV4cCI6MjA4OTU2NTQzNX0.zdI2xhxXF-V6rMbi0TpuM90oldAbogrZxpBi7rt01Mc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AuthContext = createContext<any>(null);
const ArticleContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert("Login gagal: " + error.message); return false; }
    return true;
  };
  const logout = async () => await supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const fetchArticles = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data.map(a => ({...a, authorName: a.author_name, imageUrl: a.image_url, categoryId: a.category_id})));
  }, []);
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  return (
    <ArticleContext.Provider value={{ articles, fetchArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

// --- COMPONENTS ---

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-50 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-3xl text-brand-500 font-bold">ISD NEWS</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-bold text-brand-500">Dashboard</Link>
              <button onClick={logout} className="text-sm text-red-500 font-medium">Keluar</button>
            </>
          ) : <Link to="/login" className="px-5 py-2 bg-brand-500 text-white text-sm rounded-lg font-bold">Masuk</Link>}
        </div>
      </div>
    </header>
  );
};

// --- PAGES ---

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const success = await login(e.target.email.value, e.target.password.value);
    if (success) navigate('/dashboard');
  };
  return (
    <div className="flex justify-center py-20 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border border-ink-100">
        <h2 className="text-2xl font-bold text-center text-ink-900 font-serif">Masuk Redaksi</h2>
        <input name="email" type="email" placeholder="Email" required className="w-full border border-ink-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
        <input name="password" type="password" placeholder="Password" required className="w-full border border-ink-200 p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
        <button type="submit" className="w-full bg-brand-500 text-white py-3 rounded-lg font-bold hover:bg-brand-600 transition-colors">Masuk Sekarang</button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.length === 0 && <div className="col-span-full text-center py-20 text-ink-400 font-medium">Belum ada berita yang dipublikasikan.</div>}
      {articles.map((a: any) => (
        <Link key={a.id} to={`/artikel/${a.slug}`} className="bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-52 overflow-hidden bg-ink-200">
            <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div className="p-5">
            <h3 className="font-bold text-xl leading-tight text-ink-900 group-hover:text-brand-500 transition-colors">{a.title}</h3>
            <p className="text-xs text-ink-400 mt-3 font-medium uppercase tracking-wider">{a.authorName} • {new Date(a.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-ink-50 font-sans">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <div className="max-w-4xl mx-auto p-10 text-center space-y-4">
                  <h1 className="text-3xl font-bold text-ink-900">Dashboard Siap</h1>
                  <p className="text-ink-500">Gunakan email master <b>rony.poetical@gmail.com</b> untuk akses penuh mengelola berita.</p>
                  <Link to="/" className="text-brand-500 font-bold hover:underline inline-block">← Kembali ke Beranda</Link>
                </div>
              } />
              <Route path="*" element={<div className="text-center py-20">Halaman tidak ditemukan. <Link to="/" className="text-brand-500 font-bold">Kembali ke Beranda</Link></div>} />
            </Routes>
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
}
