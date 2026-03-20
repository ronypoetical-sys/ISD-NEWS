import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Trash2, LayoutDashboard, LogOut, FileText } from 'lucide-react';

const SUPABASE_URL = 'https://voukghjtxmlylqgxcep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWtnaGp0eG1sYnlscWd4Y2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk0MzUsImV4cCI6MjA4OTU2NTQzNX0.zdI2xhxXF-V6rMbi0TpuM90oldAbogrZxpBi7rt01Mc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AuthContext = createContext<any>(null);
const ArticleContext = createContext<any>(null);

// --- PROVIDERS ---
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

  const login = async (e: string, p: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
    if (error) { alert(error.message); return false; }
    return true;
  };

  return <AuthContext.Provider value={{ user, login, logout: () => supabase.auth.signOut(), loading }}>{!loading && children}</AuthContext.Provider>;
};

const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const fetchArticles = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data);
  }, []);
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  return <ArticleContext.Provider value={{ articles, fetchArticles }}>{children}</ArticleContext.Provider>;
};

// --- PAGES ---
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-white border-b p-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl text-red-600 font-bold">ISD NEWS</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex gap-3">
              <Link to="/dashboard" className="bg-gray-100 px-3 py-1 text-sm font-bold rounded flex items-center gap-1"><LayoutDashboard size={14}/> Dashboard</Link>
              <button onClick={logout} className="text-red-500"><LogOut size={18}/></button>
            </div>
          ) : <Link to="/login" className="bg-red-600 text-white px-4 py-1 text-sm font-bold rounded">Masuk</Link>}
        </div>
      </div>
    </header>
  );
};

const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((a: any) => (
        <Link key={a.id} to={`/artikel/${a.slug}`} className="bg-white rounded-xl overflow-hidden border shadow-sm group">
          <img src={a.image_url} className="h-48 w-full object-cover group-hover:scale-105 transition-transform" />
          <div className="p-4"><h3 className="font-bold text-lg leading-tight group-hover:text-red-600">{a.title}</h3></div>
        </Link>
      ))}
    </div>
  );
};

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center py-20 px-4">
      <form onSubmit={async (e: any) => { 
        e.preventDefault(); 
        if (await login(e.target.email.value, e.target.password.value)) navigate('/dashboard'); 
      }} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-4 border">
        <h2 className="text-2xl font-bold text-center font-serif">Masuk Redaksi</h2>
        <input name="email" type="email" placeholder="Email" required className="w-full border p-3 rounded-lg" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-3 rounded-lg" />
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold">Masuk</button>
      </form>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { articles, fetchArticles } = useContext(ArticleContext);
  if (!user) return <Navigate to="/login" />;
  const myArticles = articles.filter((a: any) => a.author_name === (user.email === 'rony.poetical@gmail.com' ? 'Imam Sahroni Darmawan' : user.email));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
        <Link to="/tulis" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">+ Tulis Berita</Link>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {myArticles.map((a: any) => (
          <div key={a.id} className="p-4 border-b last:border-0 flex justify-between items-center">
            <span className="font-medium">{a.title}</span>
            <button onClick={async () => { if(confirm("Hapus?")) { await supabase.from('articles').delete().eq('id', a.id); fetchArticles(); } }} className="text-red-500"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const { slug } = useParams();
  const { articles } = useContext(ArticleContext);
  const a = articles.find((art: any) => art.slug === slug);
  if (!a) return <div className="p-20 text-center font-bold">Berita tidak ditemukan.</div>;
  return (
    <div className="max-w-3xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-bold font-serif leading-tight mb-4">{a.title}</h1>
      <p className="text-sm text-gray-500 mb-8 border-l-4 border-red-600 pl-4 uppercase font-bold">{a.author_name} • {new Date(a.created_at).toLocaleDateString()}</p>
      <img src={a.image_url} className="w-full rounded-xl mb-10 shadow-lg" />
      <div className="prose prose-lg leading-relaxed whitespace-pre-line text-gray-800">{a.content}</div>
    </div>
  );
};

const SubmitPage = () => {
  const { user } = useContext(AuthContext);
  const { fetchArticles } = useContext(ArticleContext);
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = e.target.title.value;
    const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random()*1000);
    const { error } = await supabase.from('articles').insert([{
      title, slug, content: e.target.content.value, image_url: e.target.image.value,
      author_name: user.email === 'rony.poetical@gmail.com' ? 'Imam Sahroni Darmawan' : user.email,
      status: 'published', category_id: 'umum'
    }]);
    if (!error) { fetchArticles(); navigate('/dashboard'); }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 py-10">
      <h2 className="text-2xl font-bold mb-6 font-serif">Tulis Berita Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <input name="title" placeholder="Judul Berita" required className="w-full border p-3 rounded-lg font-bold text-xl" />
        <input name="image" placeholder="URL Gambar" required className="w-full border p-3 rounded-lg" />
        <textarea name="content" placeholder="Isi Berita..." required rows={15} className="w-full border p-4 rounded-lg"></textarea>
        <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold">Terbitkan Sekarang</button>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tulis" element={<SubmitPage />} />
              <Route path="/artikel/:slug" element={<ArticlePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
}
