import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Edit, Trash2, CheckCircle, FileText, LayoutDashboard, LogOut } from 'lucide-react';

const SUPABASE_URL = 'https://voukghjtxmlylqgxcep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWtnaGp0eG1sYnlscWd4Y2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk0MzUsImV4cCI6MjA4OTU2NTQzNX0.zdI2xhxXF-V6rMbi0TpuM90oldAbogrZxpBi7rt01Mc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { id: 'nasional', name: 'Nasional' },
  { id: 'ekonomi', name: 'Ekonomi' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'opini', name: 'Opini' }
];

const AuthContext = createContext<any>(null);
const ArticleContext = createContext<any>(null);

// --- PROVIDERS ---
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  return <AuthContext.Provider value={{ user, login, logout: () => supabase.auth.signOut(), loading }}>{!loading && children}</AuthContext.Provider>;
};

export const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const fetchArticles = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data);
  }, []);
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  return (
    <ArticleContext.Provider value={{ articles, fetchArticles, deleteArticle: async (id: any) => { await supabase.from('articles').delete().eq('id', id); fetchArticles(); } }}>
      {children}
    </ArticleContext.Provider>
  );
};

// --- COMPONENTS ---
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-white border-b sticky top-0 z-50 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl text-red-600 font-bold tracking-tighter">ISD NEWS</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-sm font-medium hidden sm:block">Beranda</Link>
          {user ? (
            <div className="flex gap-3">
              <Link to="/dashboard" className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1"><LayoutDashboard size={16}/> Panel</Link>
              <button onClick={logout} className="text-red-500"><LogOut size={18}/></button>
            </div>
          ) : <Link to="/login" className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold">Masuk</Link>}
        </div>
      </div>
    </header>
  );
};

// --- PAGES ---
const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((a: any) => (
        <Link key={a.id} to={`/artikel/${a.slug}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="h-48 overflow-hidden bg-gray-200">
            <img src={a.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div className="p-4">
            <span className="text-red-600 text-[10px] font-bold uppercase tracking-widest">{a.category_id}</span>
            <h3 className="font-bold text-lg leading-tight mt-1 group-hover:text-red-600 transition-colors">{a.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSumbit = async (e: any) => {
    e.preventDefault();
    if (await login(e.target.email.value, e.target.password.value)) navigate('/dashboard');
  };
  return (
    <div className="flex justify-center py-20 px-4">
      <form onSubmit={handleSumbit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4 border">
        <h2 className="text-2xl font-bold text-center font-serif">Masuk Redaksi</h2>
        <input name="email" type="email" placeholder="Email" required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
        <input name="password" type="password" placeholder="Password" required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700">Masuk</button>
      </form>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { articles, deleteArticle } = useContext(ArticleContext);
  if (!user) return <Navigate to="/login" />;
  
  const myArticles = articles.filter((a: any) => a.author_name === (user.email === 'rony.poetical@gmail.com' ? 'Imam Sahroni Darmawan' : user.email));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
        <Link to="/tulis" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">+ Berita Baru</Link>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-xs uppercase font-bold text-gray-500">
            <tr><th className="p-4">Judul Berita</th><th className="p-4 text-center">Aksi</th></tr>
          </thead>
          <tbody>
            {myArticles.map((a: any) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => { if(confirm("Hapus berita ini?")) deleteArticle(a.id) }} className="text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { articles } = useContext(ArticleContext);
  const article = articles.find((a: any) => a.slug === slug);
  if (!article) return <div className="text-center py-20 font-bold">Berita tidak ditemukan.</div>;
  return (
    <div className="max-w-3xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-bold font-serif leading-tight mb-6">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-8 border-l-4 border-red-600 pl-4 uppercase font-bold tracking-widest">{article.author_name} • {new Date(article.created_at).toLocaleDateString('id-ID')}</div>
      <img src={article.image_url} className="w-full rounded-2xl mb-10 shadow-lg" />
      <div className="prose prose-lg text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</div>
    </div>
  );
};

const SubmitPage = () => {
  const { user } = useContext(AuthContext);
  const { fetchArticles } = useContext(ArticleContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const title = e.target.title.value;
    const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random()*1000);
    const { error } = await supabase.from('articles').insert([{
      title, slug, content: e.target.content.value, image_url: e.target.image.value,
      author_name: user.email === 'rony.poetical@gmail.com' ? 'Imam Sahroni Darmawan' : user.email,
      status: 'published', category_id: e.target.category.value
    }]);
    if (!error) { fetchArticles(); navigate('/dashboard'); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 py-10">
      <h2 className="text-2xl font-bold mb-6 font-serif">Tulis Berita Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
        <input name="title" placeholder="Judul Berita" required className="w-full border p-3 rounded-lg font-bold text-xl outline-none" />
        <div className="grid grid-cols-2 gap-4">
          <select name="category" className="border p-3 rounded-lg bg-white outline-none">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="image" placeholder="URL Gambar (Link)" required className="border p-3 rounded-lg outline-none" />
        </div>
        <textarea name="content" placeholder="Isi Berita Lengkap..." required rows={15} className="w-full border p-4 rounded-lg outline-none leading-relaxed"></textarea>
        <button disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors">
          {loading ? 'Mengirim...' : 'Publikasikan Berita'}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tulis" element={<SubmitPage />} />
                <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
              </Routes>
            </main>
            <footer className="p-10 bg-white border-t text-center text-xs text-gray-400 font-medium">
              &copy; 2026 ISD NEWS | By Imam Sahroni Darmawan, S.T
            </footer>
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
}
