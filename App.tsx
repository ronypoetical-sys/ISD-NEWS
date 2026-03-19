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

// Pages that need full-screen layout (no header/footer)
const FULLSCREEN_ROUTES = ['/login'];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-ink-50">
      <Header />
      <main className="flex-grow">
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

            {/* All other routes — with header/footer */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/profil" element={<AppLayout><ProfilePage /></AppLayout>} />
            <Route path="/kegiatan" element={<AppLayout><ActivitiesPage /></AppLayout>} />
            <Route path="/galeri" element={<AppLayout><GalleryPage /></AppLayout>} />
            <Route path="/kontak" element={<AppLayout><ContactPage /></AppLayout>} />
            <Route path="/artikel/:slug" element={<AppLayout><ArticleDetailPage /></AppLayout>} />
            <Route path="/kategori/:id" element={<AppLayout><CategoryPage /></AppLayout>} />

            {/* User Routes */}
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

            {/* Admin Routes — editor has its own layout */}
            <Route path="/admin" element={<AppLayout><AdminRoute><AdminDashboardPage /></AdminRoute></AppLayout>} />
            <Route path="/admin/artikel" element={<AppLayout><AdminRoute><ManageArticlesPage /></AdminRoute></AppLayout>} />
            <Route path="/admin/artikel/baru" element={<AdminRoute><ArticleEditorPage /></AdminRoute>} />
            <Route path="/admin/artikel/edit/:id" element={<AdminRoute><ArticleEditorPage /></AdminRoute>} />
            <Route path="/admin/pengguna" element={<AppLayout><AdminRoute><ManageUsersPage /></AdminRoute></AppLayout>} />
          </Routes>
        </HashRouter>
      </ArticleProvider>
    </AuthProvider>
  );
};

export default App;
