import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useArticles } from '../../contexts/ArticleContext';
import { ArticleStatus, Article } from '../../types';
import { CATEGORIES } from '../../constants';

const ArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { addArticle, updateArticle, getArticleById } = useArticles();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [article, setArticle] = useState<Partial<Article>>({
    title: '', content: '', categoryId: CATEGORIES[0]?.id || '',
    imageUrl: '', status: ArticleStatus.DRAFT, tags: [], slug: '',
  });
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (id) {
      const existing = getArticleById(parseInt(id, 10));
      if (existing) {
        setArticle(existing);
        setTagsInput(existing.tags?.join(', ') || '');
        setIsEditMode(true);
      }
    }
  }, [id, getArticleById]);

  useEffect(() => {
    setWordCount(article.content?.trim() ? article.content.trim().split(/\s+/).length : 0);
  }, [article.content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setArticle(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setArticle(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setArticle(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const saveArticle = async (status: ArticleStatus) => {
    if (!user) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const articleData = {
      ...article,
      title: article.title || 'Tanpa Judul',
      content: article.content || '',
      categoryId: article.categoryId || '',
      imageUrl: article.imageUrl || `https://picsum.photos/seed/${Date.now()}/1200/800`,
      status,
      tags: article.tags || [],
    };

    if (isEditMode && article.id) {
      updateArticle(article.id, articleData);
    } else {
      addArticle({ ...articleData, authorId: user.id, authorName: user.name } as Omit<Article, 'id' | 'slug' | 'createdAt'>);
    }

    setSaving(false);
    setSaveMsg(status === ArticleStatus.DRAFT ? 'Tersimpan sebagai draf' : status === ArticleStatus.PUBLISHED ? 'Diterbitkan!' : 'Disimpan');
    setTimeout(() => setSaveMsg(''), 2000);

    if (status === ArticleStatus.PUBLISHED) {
      setTimeout(() => navigate('/admin/artikel'), 800);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/admin/artikel" className="text-ink-400 hover:text-ink-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Judul artikel..."
                className="font-semibold text-ink-900 text-base border-none focus:ring-0 bg-transparent focus:outline-none w-48 sm:w-80 placeholder-ink-400"
              />
              {saveMsg && (
                <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium animate-fade-in">
                  ✓ {saveMsg}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveArticle(ArticleStatus.DRAFT)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors disabled:opacity-60"
              >
                Draf
              </button>
              <button
                onClick={() => saveArticle(ArticleStatus.PUBLISHED)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60"
              >
                {saving ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : null}
                Publikasikan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Tulis judul yang kuat dan menarik perhatian..."
                className="w-full font-serif text-2xl font-bold text-ink-900 placeholder-ink-300 border-none focus:outline-none resize-none leading-tight"
              />
            </div>

            {/* Image */}
            {article.imageUrl ? (
              <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
                <div className="relative">
                  <img src={article.imageUrl} alt="Cover" className="w-full h-56 object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <button
                    onClick={() => setArticle(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <label className="block bg-white rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 cursor-pointer transition-colors">
                <div className="p-8 text-center">
                  <div className="w-10 h-10 bg-ink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm text-ink-600 font-medium">Unggah Foto Cover</p>
                  <p className="text-xs text-ink-400 mt-0.5">PNG, JPG, WEBP · 16:9 disarankan</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
              <div className="px-4 py-2 border-b border-ink-100 flex items-center justify-between">
                <span className="text-xs text-ink-400 font-medium">Konten Artikel</span>
                <span className={`text-xs font-medium ${wordCount < 100 ? 'text-ink-400' : 'text-green-600'}`}>{wordCount} kata</span>
              </div>
              <textarea
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Tulis konten artikel di sini. Gunakan paragraf yang jelas dan terstruktur..."
                rows={22}
                className="w-full px-6 py-5 text-ink-700 text-base leading-relaxed resize-none border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <h3 className="text-sm font-bold text-ink-900 mb-4">Publikasi</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Status</label>
                  <select
                    name="status"
                    value={article.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value={ArticleStatus.DRAFT}>Draf</option>
                    <option value={ArticleStatus.PUBLISHED}>Diterbitkan</option>
                    <option value={ArticleStatus.PENDING}>Menunggu Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Kategori</label>
                  <select
                    name="categoryId"
                    value={article.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white"
                  >
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Slug / URL</label>
                  <input
                    type="text"
                    name="slug"
                    value={article.slug || ''}
                    onChange={handleChange}
                    placeholder="otomatis-dari-judul"
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-xs font-mono text-ink-700 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Tag</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-ink-100 flex flex-col gap-2">
                <button
                  onClick={() => saveArticle(ArticleStatus.PUBLISHED)}
                  disabled={saving}
                  className="w-full py-2.5 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Publikasikan Sekarang'}
                </button>
                <button
                  onClick={() => saveArticle(ArticleStatus.DRAFT)}
                  disabled={saving}
                  className="w-full py-2 text-sm font-medium text-ink-600 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
                >
                  Simpan sebagai Draf
                </button>
              </div>
            </div>

            {/* Article Info */}
            {isEditMode && (
              <div className="bg-ink-50 rounded-xl border border-ink-200 p-4">
                <h4 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-3">Info Artikel</h4>
                <div className="space-y-2 text-xs text-ink-600">
                  <div className="flex justify-between"><span>Penulis</span><span className="font-medium">{article.authorName}</span></div>
                  <div className="flex justify-between"><span>Dibuat</span><span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('id-ID') : '-'}</span></div>
                  <div className="flex justify-between"><span>ID</span><span className="font-mono">#{article.id}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditorPage;
