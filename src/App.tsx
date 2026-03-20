import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Edit, Trash2, CheckCircle } from 'lucide-react';

const SUPABASE_URL = 'https://voukghjtxmlylqgxcep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWtnaGp0eG1sYnlscWd4Y2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk0MzUsImV4cCI6MjA4OTU2NTQzNX0.zdI2xhxXF-V6rMbi0TpuM90oldAbogrZxpBi7rt01Mc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { id: 'nasional', name: 'Nasional' },
  { id: 'ekonomi', name: 'Ekonomi & Bisnis' },
  { id: 'olahraga', name: 'Olahraga' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'hiburan', name: 'Hiburan' },
  { id: 'opini', name: 'Opini' }
];

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

  const addArticle = async (d: any) => {
    await supabase.from('articles').insert([{ title: d.title, slug: d.title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substr(2, 5), content: d.content, category_id: d.categoryId, image_url: d.imageUrl, status: d.status, author_name: d.authorName }]);
    fetchArticles();
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, getArticleBySlug: (s: string) => articles.find(a => a.slug === s) }}>
      {children}
    </ArticleContext.Provider>
  );
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-3xl text-brand-500 font-bold">ISD NEWS</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-bold text-brand-500">Dashboard</Link>
              <button onClick={logout} className="text-sm text-red-500">Keluar</button>
            </>
          ) : <Link to="/login" className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg">Masuk</Link>}
        </div>
      </div>
    </header>
  );
};

const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((a: any) => (
        <Link key={a.id} to={`/artikel/${a.slug}`} className="bg-white rounded-xl overflow-hidden border border-ink-100 shadow-sm">
          <img src={a.imageUrl} className="h-48 w-full object-cover" />
          <div className="p-4"><h3 className="font-bold text-lg">{a.title}</h3></div>
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
          <div className="min-h-screen bg-ink-50">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={
                <div className="flex justify-center py-20">
                  <form onSubmit={async (e: any) => { e.preventDefault(); if (await (useContext(AuthContext) as any).login(e.target.email.value, e.target.password.value)) window.location.href='/dashboard'; }} className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4">
                    <input name="email" placeholder="Email" className="w-full border p-2 rounded" />
                    <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" />
                    <button className="w-full bg-brand-500 text-white p-2 rounded font-bold">Masuk</button>
                  </form>
                </div>
              } />
              <Route path="/dashboard" element={<div className="p-10 text-center">Dashboard Siap. Gunakan email master untuk akses.</div>} />
            </Routes>
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
}
