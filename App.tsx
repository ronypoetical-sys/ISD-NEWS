import React, { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate, NavLink } from 'react-router-dom';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Menu, Search, X, Edit, Trash2, CheckCircle, User as UserIcon, LayoutDashboard, FileText, Image as ImageIcon, Phone, Info } from 'https://esm.sh/lucide-react@0.359.0';

// ============================================================================
// 1. SUPABASE INITIALIZATION
// Kunci Supabase Anda di-inject langsung di sini agar langsung berjalan.
// ============================================================================
const SUPABASE_URL = 'https://voukghjtxmlylqgxcep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWtnaGp0eG1sYnlscWd4Y2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODk0MzUsImV4cCI6MjA4OTU2NTQzNX0.zdI2xhxXF-V6rMbi0TpuM90oldAbogrZxpBi7rt01Mc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// 2. CONSTANTS & TYPES
// ============================================================================
const CATEGORIES = [
  { id: 'nasional', name: 'Nasional' },
  { id: 'ekonomi', name: 'Ekonomi & Bisnis' },
  { id: 'olahraga', name: 'Olahraga' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'hiburan', name: 'Hiburan' },
  { id: 'opini', name: 'Opini' }
];

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 1000);
};

// ============================================================================
// 3. CONTEXTS (AUTH & ARTICLES VIA SUPABASE)
// ============================================================================
const AuthContext = createContext(null);
const ArticleContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi aktif saat dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    // Dengarkan perubahan status login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login gagal: " + error.message);
      return false;
    }
    return true;
  };

  const logout = async () => await supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  
  // Fallback Data MOCK jika tabel Supabase belum ada
  const MOCK_ARTICLES = [
    { id: 1, title: 'Inovasi AI Mengubah Industri Digital di 2026', slug: 'inovasi-ai-2026', content: 'Kecerdasan buatan semakin mendominasi pasar...', imageUrl: 'https://picsum.photos/seed/tech/800/500', categoryId: 'teknologi', status: 'published', authorName: 'Redaksi ISD', createdAt: new Date().toISOString() },
    { id: 2, title: 'IHSG Ditutup Menguat Seiring Sentimen Positif Global', slug: 'ihsg-menguat-sentimen-positif', content: 'Indeks Harga Saham Gabungan (IHSG) Bursa Efek Indonesia...', imageUrl: 'https://picsum.photos/seed/eco/800/500', categoryId: 'ekonomi', status: 'published', authorName: 'Tim Ekonomi', createdAt: new Date().toISOString() }
  ];

  const fetchArticles = useCallback(async () => {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      setArticles(MOCK_ARTICLES); // Fallback ke mock jika tabel kosong/error
    } else {
      setArticles(data.map(a => ({...a, createdAt: a.created_at, authorName: a.author_name, imageUrl: a.image_url, categoryId: a.category_id})));
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const addArticle = async (articleData) => {
    const payload = {
      title: articleData.title,
      slug: articleData.slug || generateSlug(articleData.title),
      content: articleData.content,
      category_id: articleData.categoryId,
      image_url: articleData.imageUrl,
      status: articleData.status,
      author_name: articleData.authorName,
    };
    const { error } = await supabase.from('articles').insert([payload]);
    if (!error) fetchArticles();
  };

  const getArticleBySlug = (slug) => articles.find(a => a.slug === slug);
  const deleteArticle = async (id) => { await supabase.from('articles').delete().eq('id', id); fetchArticles(); };
  const approveArticle = async (id) => { await supabase.from('articles').update({ status: 'published' }).eq('id', id); fetchArticles(); };

  return (
    <ArticleContext.Provider value={{ articles, getArticleBySlug, addArticle, deleteArticle, approveArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

// ============================================================================
// 4. SHARED COMPONENTS
// ============================================================================
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-50 shadow-sm">
      <div className="bg-brand-500 text-white py-1 px-4 text-center text-xs tracking-widest">
        <span className="font-bold">BREAKING NEWS</span> — ISD NEWS Beralih ke Infrastruktur Cloud Cepat
      </div>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-1 group">
          <span className="font-serif text-3xl text-brand-500 group-hover:text-brand-600 transition-colors">ISD</span>
          <span className="text-sm font-bold text-ink-800 tracking-[0.3em]">NEWS</span>
        </Link>
        <nav className="hidden lg:flex gap-6">
          <Link to="/" className="text-sm font-medium text-ink-700 hover:text-brand-500">Beranda</Link>
          {CATEGORIES.slice(0, 4).map(c => (
            <Link key={c.id} to={`/kategori/${c.id}`} className="text-sm font-medium text-ink-700 hover:text-brand-500">{c.name}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-bold text-brand-500 hover:text-brand-700">Dashboard</Link>
              <button onClick={logout} className="text-sm text-ink-500 hover:text-red-500">Keluar</button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600">Masuk</Link>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-ink-800"><Menu /></button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-xl flex flex-col p-4">
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-4 text-ink-500"><X /></button>
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-ink-800 font-medium">Beranda</Link>
              {CATEGORIES.map(c => <Link key={c.id} to={`/kategori/${c.id}`} onClick={() => setIsMenuOpen(false)} className="text-ink-800 font-medium">{c.name}</Link>)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-ink-900 text-ink-300 py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-serif text-2xl text-brand-400 mb-4">ISD <span className="text-white text-sm tracking-[0.2em]">NEWS</span></h3>
        <p className="text-sm leading-relaxed">Portal berita independen dan terpercaya untuk masyarakat Indonesia.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Kategori</h4>
        <div className="flex flex-col gap-2">
          {CATEGORIES.slice(0,4).map(c => <Link key={c.id} to={`/kategori/${c.id}`} className="hover:text-brand-400 text-sm">{c.name}</Link>)}
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Kontak Redaksi</h4>
        <p className="text-sm">Email: redaksi@isdnews.com</p>
        <p className="text-sm">Telepon: (021) 555-0123</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-ink-800 text-center text-xs">
      &copy; {new Date().getFullYear()} ISD NEWS | By Imam Sahroni Darmawan, S.T
    </div>
  </footer>
);

const ArticleCard = ({ article }) => {
  const cat = CATEGORIES.find(c => c.id === article.categoryId);
  return (
    <Link to={`/artikel/${article.slug}`} className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-ink-100">
      <div className="relative h-48 overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {cat && <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded">{cat.name}</span>}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-ink-900 group-hover:text-brand-500 line-clamp-2 mb-2">{article.title}</h3>
        <p className="text-xs text-ink-500 line-clamp-2 mb-4">{article.content}</p>
        <div className="flex justify-between text-xs text-ink-400">
          <span className="font-medium">{article.authorName}</span>
          <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    </Link>
  );
};

// ============================================================================
// 5. PAGES
// ============================================================================
const HomePage = () => {
  const { articles } = useContext(ArticleContext);
  const published = articles.filter(a => a.status === 'published');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Headline */}
      {published[0] && (
        <div className="mb-12 relative rounded-2xl overflow-hidden h-[400px] group cursor-pointer border border-ink-100">
          <Link to={`/artikel/${published[0].slug}`}>
            <img src={published[0].imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Headline" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-0 p-8">
              <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 inline-block">BERITA UTAMA</span>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-2">{published[0].title}</h1>
              <p className="text-white/80 text-sm line-clamp-2 max-w-2xl">{published[0].content}</p>
            </div>
          </Link>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
        <h2 className="font-serif text-2xl font-bold text-ink-900">Berita Terkini</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {published.slice(1, 10).map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { getArticleBySlug } = useContext(ArticleContext);
  const article = getArticleBySlug(slug);

  if (!article) return <div className="text-center py-20 text-xl font-bold">Artikel Tidak Ditemukan</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink-900 leading-tight mb-6">{article.title}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-ink-500">
          <span className="font-bold text-brand-500">{article.authorName}</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
        </div>
      </div>
      <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-md mb-10" />
      <div className="prose prose-lg max-w-none text-ink-800 leading-relaxed bg-white p-8 rounded-2xl border border-ink-100">
        {article.content.split('\n\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { id } = useParams();
  const { articles } = useContext(ArticleContext);
  const cat = CATEGORIES.find(c => c.id === id);
  const filtered = articles.filter(a => a.categoryId === id && a.status === 'published');

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-4xl font-bold text-ink-900 mb-8 border-b-4 border-brand-500 inline-block pb-2">Kategori: {cat?.name || id}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-ink-100 max-w-md w-full">
        <h2 className="font-serif text-3xl font-bold text-center mb-2">ISD NEWS</h2>
        <p className="text-center text-ink-500 text-sm mb-8">Login Redaksi / Kontributor</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Anda" required className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500" />
          <button type="submit" className="w-full bg-brand-500 text-white font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors">Masuk Sistem</button>
        </form>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { articles, deleteArticle, approveArticle } = useContext(ArticleContext);
  if (!user) return <Navigate to="/login" />;

  const myArticles = articles.filter(a => a.authorName === (user.user_metadata?.full_name || user.email));
  const pending = articles.filter(a => a.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink-900">Dashboard Kontributor</h1>
        <Link to="/tulis-artikel" className="bg-brand-500 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-600 flex items-center gap-2"><Edit size={18}/> Tulis Artikel Baru</Link>
      </div>

      {/* ADMIN SECTION (Tampil jika email admin) */}
      {user.email?.includes('admin') && (
        <div className="mb-10 bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
          <h2 className="font-bold text-yellow-800 mb-4 flex items-center gap-2"><CheckCircle /> Antrean Persetujuan (Menunggu Publikasi)</h2>
          <div className="space-y-3">
            {pending.length === 0 ? <p className="text-sm text-yellow-600">Tidak ada artikel yang menunggu persetujuan.</p> : null}
            {pending.map(a => (
              <div key={a.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div><p className="font-bold text-sm">{a.title}</p><p className="text-xs text-ink-500">Oleh: {a.authorName}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => approveArticle(a.id)} className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">Setujui</button>
                  <button onClick={() => deleteArticle(a.id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Tolak</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAFTAR ARTIKEL SAYA */}
      <h2 className="font-bold text-xl mb-4">Artikel Saya</h2>
      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ink-50 text-ink-500 text-xs uppercase">
            <tr><th className="p-4">Judul</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr>
          </thead>
          <tbody>
            {myArticles.length === 0 ? <tr><td colSpan="3" className="p-4 text-center text-ink-500">Anda belum menulis artikel.</td></tr> : null}
            {myArticles.map(a => (
              <tr key={a.id} className="border-b border-ink-100">
                <td className="p-4 font-medium text-sm">{a.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {a.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4"><button onClick={() => { if(confirm("Hapus artikel ini?")) deleteArticle(a.id) }} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SubmitArticlePage = () => {
  const { user } = useContext(AuthContext);
  const { addArticle } = useContext(ArticleContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', categoryId: 'nasional' });

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    addArticle({
      ...form,
      authorName: user.user_metadata?.full_name || user.email.split('@')[0],
      status: user.email?.includes('admin') ? 'published' : 'pending'
    });
    alert("Artikel berhasil dikirim!");
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Tulis Artikel</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-ink-100 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-ink-700 mb-2">Judul Artikel</label>
          <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500 font-serif text-xl" placeholder="Judul berita..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-700 mb-2">Kategori</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none bg-white">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-700 mb-2">URL Foto Cover (Link Gambar)</label>
            <input type="url" required value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none" placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700 mb-2">Isi Berita</label>
          <textarea required rows="15" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none leading-relaxed" placeholder="Tulis paragraf pertama di sini..."></textarea>
        </div>
        <button type="submit" className="w-full bg-brand-500 text-white font-bold py-4 rounded-lg hover:bg-brand-600 text-lg">Kirim Artikel</button>
      </form>
    </div>
  );
};

// ============================================================================
// 6. MAIN APP ROUTER
// ============================================================================
const App = () => {
  return (
    <AuthProvider>
      <ArticleProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-ink-50 font-sans text-ink-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
                <Route path="/kategori/:id" element={<CategoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tulis-artikel" element={<SubmitArticlePage />} />
                {/* Fallback rute lainnya untuk mencegah error 404 pada menu lama */}
                <Route path="*" element={<div className="py-20 text-center text-xl font-bold">Halaman Dalam Pembangunan</div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
};

export default App;
