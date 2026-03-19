import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useArticles } from '../contexts/ArticleContext';
import { ArticleStatus, Article } from '../types';
import { CATEGORIES } from '../constants';

const SubmitArticlePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { addArticle, updateArticle, getArticleById } = useArticles();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (id) {
      const articleId = parseInt(id, 10);
      const existingArticle = getArticleById(articleId);
      if (existingArticle && existingArticle.authorId === user?.id) {
        setTitle(existingArticle.title);
        setContent(existingArticle.content);
        setCategoryId(existingArticle.categoryId);
        setImageUrl(existingArticle.imageUrl);
        setTagsInput(existingArticle.tags?.join(', ') || '');
        setIsEditMode(true);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, getArticleById, user, navigate]);

  useEffect(() => {
    setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
  }, [content]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveArticle = async (status: ArticleStatus) => {
    if (!user) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const articleData = {
      title: title || 'Tanpa Judul',
      content,
      categoryId,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/1200/800`,
      status,
      tags: tagsArray,
    };

    if (isEditMode && id) {
      updateArticle(parseInt(id, 10), articleData);
    } else {
      addArticle({ ...articleData, authorId: user.id, authorName: user.name } as Omit<Article, 'id' | 'slug' | 'createdAt'>);
    }

    setSaving(false);
    navigate('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveArticle(ArticleStatus.PENDING);
  };

  const qualityScore = Math.min(100, Math.round(
    (title ? 20 : 0) +
    (imageUrl ? 20 : 0) +
    (tagsInput ? 15 : 0) +
    Math.min(45, Math.round((wordCount / 300) * 45))
  ));

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-ink-400 hover:text-ink-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <span className="text-sm font-medium text-ink-700">
                {isEditMode ? 'Edit Artikel' : 'Artikel Baru'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => saveArticle(ArticleStatus.DRAFT)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors disabled:opacity-60"
              >
                Simpan Draf
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || !title || !content}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                ) : null}
                {isEditMode ? 'Kirim Ulang' : 'Kirim untuk Review'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Judul artikel yang menarik dan deskriptif..."
                className="w-full font-serif text-2xl font-bold text-ink-900 placeholder-ink-300 border-none focus:outline-none focus:ring-0 resize-none leading-tight"
              />
              <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
                <span>{title.length} karakter</span>
                {title.length > 100 && <span className="text-yellow-600">⚠ Judul mungkin terlalu panjang</span>}
              </div>
            </div>

            {/* Cover Image */}
            {imageUrl ? (
              <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
                <div className="relative">
                  <img src={imageUrl} alt="Cover" className="w-full h-60 object-cover" />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="px-4 py-2 flex items-center gap-2 text-xs text-ink-500">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Foto cover terpasang
                </div>
              </div>
            ) : (
              <label className="block bg-white rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 transition-colors cursor-pointer">
                <div className="p-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm font-medium text-ink-700">Klik untuk unggah foto cover</p>
                  <p className="text-xs text-ink-400 mt-1">PNG, JPG, WEBP hingga 10MB · Rasio 16:9 direkomendasikan</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
              <div className="px-4 py-2 border-b border-ink-100 flex items-center gap-2">
                <span className="text-xs font-medium text-ink-400">Isi Artikel</span>
                <span className={`ml-auto text-xs ${wordCount < 300 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {wordCount} kata {wordCount < 300 ? `(minimal 300)` : '✓'}
                </span>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Mulai tulis isi artikel Anda di sini...

Gunakan paragraf yang jelas dan terstruktur. Setiap paragraf idealnya memiliki satu gagasan utama.

Sertakan fakta, data, atau kutipan dari sumber terpercaya untuk memperkuat artikel Anda."
                rows={20}
                className="w-full px-6 py-5 text-ink-700 text-base leading-relaxed resize-none border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quality Score */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <h3 className="text-sm font-semibold text-ink-900 mb-3">Skor Kelengkapan</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-ink-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      qualityScore >= 80 ? 'bg-green-500' : qualityScore >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${qualityScore >= 80 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {qualityScore}%
                </span>
              </div>
              <ul className="space-y-1.5">
                {[
                  { done: !!title, label: 'Judul artikel' },
                  { done: wordCount >= 300, label: `Konten minimal 300 kata (${wordCount})` },
                  { done: !!imageUrl, label: 'Foto cover' },
                  { done: !!tagsInput, label: 'Tag / label' },
                ].map(item => (
                  <li key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? 'text-green-600' : 'text-ink-400'}`}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.done
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      }
                    </svg>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-ink-900">Setelan Artikel</h3>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">Kategori <span className="text-brand-500">*</span></label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white"
                >
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">Tag / Label</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="ekonomi, kebijakan, nasional..."
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                />
                <p className="text-xs text-ink-400 mt-1">Pisahkan dengan koma</p>
              </div>

              {/* Tags preview */}
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5">
                  {tagsInput.split(',').filter(t => t.trim()).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded-full font-medium">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-ink-900 rounded-xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3">📋 Panduan Kontributor</h3>
              <ul className="space-y-2 text-xs text-ink-400 leading-relaxed">
                <li>• Artikel akan ditinjau redaksi dalam 1-2 hari kerja</li>
                <li>• Pastikan semua fakta dapat diverifikasi</li>
                <li>• Hindari konten provokatif atau hoaks</li>
                <li>• Sertakan sumber dan referensi bila ada</li>
                <li>• Foto harus bebas hak cipta atau milik sendiri</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitArticlePage;
