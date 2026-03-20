import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Trash2, LayoutDashboard, LogOut, PlusCircle, FileText, ChevronRight, AlertCircle } from 'lucide-react';

// Kunci Supabase Anda (Langsung ditanam agar tidak ada masalah .env)
const SUPABASE_URL = 'https://voukghjtxmlbylqgxcep.supabase.co';
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
    if (error) { alert("Masalah Login: " + error.message); return false; }
    return true;
  };

  return <AuthContext.Provider value={{ user, login, logout: () => supabase.auth.signOut(), loading }}>{!loading && children}</AuthContext.Provider>;
};

const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setArticles(data);
    } catch (err) {
      console.error("Database Error:", err);
    }
  }, []);
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  return <ArticleContext.Provider value={{ articles, fetchArticles }}>{children}</ArticleContext.Provider>;
};

// --- COMPONENTS ---
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="bg-white border-b p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-3xl text-red-600 font-bold tracking-tighter">ISD NEWS</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex gap-4 items-center">
              <Link to="/dashboard" className="text-sm font-bold bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><LayoutDashboard size={16}/> Dashboard</Link>
              <button onClick={logout} className="text-red-500 font-medium text-sm"><LogOut size={18}/></button>
            </div>
          ) : <Link to="/login" className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-red-100">Masuk</Link>}
        </div>
      </div>
    </header>
  );
};

// --- PAGES ---
const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  const published = articles.filter(a => a.status === 'published');
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-serif font-bold mb-8 border-b-2 border-red-600 inline-block pb-1 italic">Berita Terkini</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {published.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <AlertCircle className="mx-auto text-gray-300 mb-2" size={40}/>
             <p className="text-gray-400">Belum ada berita. Sila masuk dan tulis berita pertama Anda!</p>
          </div>
        )}
        {published.map((a: any) => (
          <Link key={a.id} to={`/artikel/${a.slug}`} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden"><img src={a.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
            <div className="p-5">
              <h3 className="font-bold text-lg leading-tight group-hover:text-red-600 transition-colors h-14 overflow-hidden">{a.title}</h3>
              <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>{a.author_name}</span>
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(e.target.email.value, e.target.password.value);
    if (success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="flex justify-center py-20 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm space-y-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-center font-serif text-gray-800">Redaksi ISD NEWS</h2>
        <div className="space-y-4">
          <input name="email" type="email" placeholder="Email" required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" />
          <input name="password" type="password" placeholder="Password" required className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
          {loading ? "Menghubungkan..." : "Masuk Sistem"}
        </button>
      </form>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { articles, fetchArticles } = useContext(ArticleContext);
  if (!user) return <Navigate to="/login" />;

  const myArticles = articles.filter((a: any) => a.author_name?.includes('Imam') || a.author_name === user.email);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif">Panel Kontributor</h1>
        <Link to="/tulis" className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 hover:bg-red-700"><PlusCircle size={20}/> Tulis Berita</Link>
      </div>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <tr><th className="p-5">Judul</th><th className="p-5">Status</th><th className="p-5 text-center">Aksi</th></tr>
          </thead>
          <tbody>
            {myArticles.length === 0 && <tr><td colSpan={3} className="p-10 text-center text-gray-400 italic">Anda belum menulis berita.</td></tr>}
            {myArticles.map((a: any) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-5 font-bold text-gray-700">{a.title}</td>
                <td className="p-5"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.status}</span></td>
                <td className="p-5 flex justify-center gap-2">
                  <button onClick={async () => { if(confirm("Hapus berita ini?")) { await supabase.from('articles').delete().eq('id', a.id); fetchArticles(); } }} className="p-2 text-red-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>
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
  const a = articles.find((art: any) => art.slug === slug);

  if (!a) return <div className="p-20 text-center">Berita tidak ditemukan. <br/><Link to="/" className="text-red-600 underline">Kembali</Link></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 py-12 bg-white">
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-8">{a.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-b py-4 uppercase font-bold tracking-widest">
          <span>{a.author_name}</span> • <span>{new Date(a.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <img src={a.image_url} className="w-full rounded-[2rem] shadow-2xl mb-12" />
      <div className="max-w-3xl mx-auto prose prose-xl text-gray-800 leading-relaxed whitespace-pre-line font-serif italic">
        {a.content}
      </div>
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
    const slug = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ /g, '-') + '-' + Math.floor(Math.random()*1000);
    const { error } = await supabase.from('articles').insert([{
      title, slug, content: e.target.content.value, image_url: e.target.image.value,
      author_name: user.email === 'rony.poetical@gmail.com' ? 'Imam Sahroni Darmawan' : user.email,
      status: 'published', category_id: 'Berita'
    }]);
    if (!error) { fetchArticles(); navigate('/dashboard'); } else { alert(error.message); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 py-10">
      <h2 className="text-3xl font-bold mb-8 font-serif">Tulis Berita Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 rounded-[2.5rem] border shadow-xl shadow-gray-100">
        <input name="title" required className="w-full border-b-4 border-gray-100 p-2 text-2xl font-bold outline-none focus:border-red-500" placeholder="Judul Berita" />
        <input name="image" required className="w-full border-b-2 border-gray-100 p-2 outline-none focus:border-red-500" placeholder="Link Gambar (https://...)" />
        <textarea name="content" required rows={12} className="w-full border-2 border-gray-50 p-6 rounded-3xl outline-none focus:border-red-500" placeholder="Tulis isi berita..."></textarea>
        <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-3xl font-bold text-xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all">
          {loading ? "Sedang Mengirim..." : "Publikasikan Sekarang"}
        </button>
      </form>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tulis" element={<SubmitPage />} />
                <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <footer className="p-16 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.5em]">
              &copy; 2026 ISD NEWS | BY IMAM SAHRONI DARMAWAN, S.T
            </footer>
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
}
