import React from 'react';
// ─────────────────────────────────────────────────────────────────────────────
// PENTING: Ganti HashRouter → BrowserRouter
//
// HashRouter menghasilkan URL: beritakini.online/#/artikel/slug
//   → Bagian setelah # TIDAK dikirim ke server
//   → Mesin pencari dan crawler bot tidak bisa mengindeks halaman individual
//   → Share link di WhatsApp/Telegram tidak menampilkan preview artikel
//
// BrowserRouter menghasilkan URL: beritakini.online/artikel/slug
//   → URL bersih, bisa diindeks Googlebot
//   → og:image per artikel muncul saat share ke WA/Telegram/FB
//   → SYARAT: server harus dikonfigurasi fallback ke index.html
//             (lihat file _redirects / vercel.json / nginx.conf)
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ArticleProvider } from './contexts/ArticleContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ActivitiesPage from './pages/ActivitiesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoryPage from './pages/CategoryPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageArticlesPage from './pages/admin/ManageArticlesPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SubmitArticlePage from './pages/SubmitArticlePage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Halaman Legal & Kontributor
import KebijakanPrivasiPage from './pages/KebijakanPrivasiPage';
import SyaratPenggunaanPage from './pages/SyaratPenggunaanPage';
import PedomanMediaSiberPage from './pages/PedomanMediaSiberPage';
import DaftarKontributorPage from './pages/DaftarKontributorPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-ink-50">
      <Header />
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ArticleProvider>
        {/* BrowserRouter — URL bersih, SEO-friendly, crawlable */}
        <BrowserRouter>
          <Routes>
            {/* Login — full screen */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public routes */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/profil" element={<AppLayout><ProfilePage /></AppLayout>} />
            <Route path="/kegiatan" element={<AppLayout><ActivitiesPage /></AppLayout>} />
            <Route path="/galeri" element={<AppLayout><GalleryPage /></AppLayout>} />
            <Route path="/kontak" element={<AppLayout><ContactPage /></AppLayout>} />
            <Route path="/artikel/:slug" element={<AppLayout><ArticleDetailPage /></AppLayout>} />
            <Route path="/kategori/:id" element={<AppLayout><CategoryPage /></AppLayout>} />

            {/* Halaman Legal */}
            <Route path="/kebijakan-privasi" element={<AppLayout><KebijakanPrivasiPage /></AppLayout>} />
            <Route path="/syarat-penggunaan" element={<AppLayout><SyaratPenggunaanPage /></AppLayout>} />
            <Route path="/pedoman-media-siber" element={<AppLayout><PedomanMediaSiberPage /></AppLayout>} />

            {/* Daftar Kontributor — halaman publik */}
            <Route path="/daftar-kontributor" element={<AppLayout><DaftarKontributorPage /></AppLayout>} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={<AppLayout><PrivateRoute><UserDashboardPage /></PrivateRoute></AppLayout>}
            />
            <Route
              path="/kirim-artikel"
              element={<AppLayout><PrivateRoute><SubmitArticlePage /></PrivateRoute></AppLayout>}
            />
            <Route
              path="/edit-artikel/:id"
              element={<AppLayout><PrivateRoute><SubmitArticlePage /></PrivateRoute></AppLayout>}
            />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AppLayout><AdminRoute><AdminDashboardPage /></AdminRoute></AppLayout>} />
            <Route path="/admin/artikel" element={<AppLayout><AdminRoute><ManageArticlesPage /></AdminRoute></AppLayout>} />
            <Route path="/admin/artikel/baru" element={<AdminRoute><ArticleEditorPage /></AdminRoute>} />
            <Route path="/admin/artikel/edit/:id" element={<AdminRoute><ArticleEditorPage /></AdminRoute>} />
            <Route path="/admin/pengguna" element={<AppLayout><AdminRoute><ManageUsersPage /></AdminRoute></AppLayout>} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <AppLayout>
                  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <div className="text-8xl font-serif font-bold text-ink-200 mb-4" aria-hidden="true">404</div>
                    <h1 className="font-serif text-2xl font-bold text-ink-900 mb-2">Halaman Tidak Ditemukan</h1>
                    <p className="text-ink-500 mb-6 max-w-sm">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
                    <a href="/" className="px-6 py-3 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
                      Kembali ke Beranda
                    </a>
                  </div>
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ArticleProvider>
    </AuthProvider>
  );
};

export default App;
