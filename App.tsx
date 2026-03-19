import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
        <HashRouter>
          <Routes>
            {/* Login — full screen, no header/footer */}
            <Route path="/login" element={<LoginPage />} />

            {/* Public routes — with header/footer */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/profil" element={<AppLayout><ProfilePage /></AppLayout>} />
            <Route path="/kegiatan" element={<AppLayout><ActivitiesPage /></AppLayout>} />
            <Route path="/galeri" element={<AppLayout><GalleryPage /></AppLayout>} />
            <Route path="/kontak" element={<AppLayout><ContactPage /></AppLayout>} />
            <Route path="/artikel/:slug" element={<AppLayout><ArticleDetailPage /></AppLayout>} />
            <Route path="/kategori/:id" element={<AppLayout><CategoryPage /></AppLayout>} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <PrivateRoute>
                    <UserDashboardPage />
                  </PrivateRoute>
                </AppLayout>
              }
            />
            <Route
              path="/kirim-artikel"
              element={
                <AppLayout>
                  <PrivateRoute>
                    <SubmitArticlePage />
                  </PrivateRoute>
                </AppLayout>
              }
            />
            <Route
              path="/edit-artikel/:id"
              element={
                <AppLayout>
                  <PrivateRoute>
                    <SubmitArticlePage />
                  </PrivateRoute>
                </AppLayout>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AppLayout>
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                </AppLayout>
              }
            />
            <Route
              path="/admin/artikel"
              element={
                <AppLayout>
                  <AdminRoute>
                    <ManageArticlesPage />
                  </AdminRoute>
                </AppLayout>
              }
            />
            {/* Article editor has its own full layout */}
            <Route
              path="/admin/artikel/baru"
              element={
                <AdminRoute>
                  <ArticleEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/artikel/edit/:id"
              element={
                <AdminRoute>
                  <ArticleEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pengguna"
              element={
                <AppLayout>
                  <AdminRoute>
                    <ManageUsersPage />
                  </AdminRoute>
                </AppLayout>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <AppLayout>
                  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <div className="text-8xl font-serif font-bold text-ink-200 mb-4" aria-hidden="true">404</div>
                    <h1 className="font-serif text-2xl font-bold text-ink-900 mb-2">Halaman Tidak Ditemukan</h1>
                    <p className="text-ink-500 mb-6 max-w-sm">
                      Halaman yang Anda cari tidak ada atau sudah dipindahkan.
                    </p>
                    <a
                      href="/"
                      className="px-6 py-3 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                    >
                      Kembali ke Beranda
                    </a>
                  </div>
                </AppLayout>
              }
            />
          </Routes>
        </HashRouter>
      </ArticleProvider>
    </AuthProvider>
  );
};

export default App;
