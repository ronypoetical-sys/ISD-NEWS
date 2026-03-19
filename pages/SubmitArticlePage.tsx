import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useArticles } from '../contexts/ArticleContext';
import { ArticleStatus, Article, ContentMode } from '../types';
import { CATEGORIES } from '../constants';

const MAX_TITLE_LENGTH = 200;
const MAX_META_DESC_LENGTH = 160;
const MAX_IMAGE_SIZE_MB = 10;
const MIN_WORD_COUNT = 300;

/* ============================================================
   MINI TOOLBAR — tombol format untuk mode teks biasa
   ============================================================ */
const ToolbarButton: React.FC<{
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}> = ({ onClick, title, children, active }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
      active
        ? 'bg-brand-500 text-white'
        : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
    }`}
  >
    {children}
  </button>
);

/* ============================================================
   KOMPONEN UTAMA
   ============================================================ */
const SubmitArticlePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { addArticle, updateArticle, getArticleById } = useArticles();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentMode, setContentMode] = useState<ContentMode>('text'); // 'text' | 'html'
  const [categoryId, setCategoryId] = useState(CATEGORIES[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [imageError, setImageError] = useState('');
  const [htmlPreview, setHtmlPreview] = useState(false);

  /* Load artikel saat edit mode */
  useEffect(() => {
    if (id) {
      const articleId = parseInt(id, 10);
      if (isNaN(articleId)) { navigate('/dashboard'); return; }
      const existing = getArticleById(articleId);
      if (existing && existing.authorId === user?.id) {
        setTitle(existing.title);
        setContent(existing.content);
        setCategoryId(existing.categoryId);
        setImageUrl(existing.imageUrl);
        setImageCaption(existing.imageCaption || '');
        setMetaDescription(existing.metaDescription || '');
        setTagsInput(existing.tags?.join(', ') || '');
        setIsEditMode(true);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, getArticleById, user, navigate]);

  /* Hitung kata */
  useEffect(() => {
    const plain = content.replace(/<[^>]*>/g, ' ').trim();
    setWordCount(plain ? plain.split(/\s+/).filter(Boolean).length : 0);
  }, [content]);

  /* Auto-generate meta description dari konten jika kosong */
  useEffect(() => {
    if (!metaDescription && content.trim()) {
      const plain = content.replace(/<[^>]*>/g, ' ').trim();
      setMetaDescription(plain.substring(0, MAX_META_DESC_LENGTH));
    }
  }, []);

  /* ---- Upload gambar ---- */
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setImageError('Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Ukuran melebihi ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.onerror = () => setImageError('Gagal membaca file.');
    reader.readAsDataURL(file);
  }, []);

  /* ---- Sisipkan tag HTML ke posisi kursor (mode HTML) ---- */
  const insertHtmlTag = (openTag: string, closeTag: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      openTag + selected + closeTag +
      content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selected.length
      );
    }, 0);
  };

  /* ---- Simpan artikel ---- */
  const saveArticle = async (status: ArticleStatus) => {
    if (!user) return;
    if (status === ArticleStatus.PENDING) {
      if (!title.trim()) { alert('Judul artikel harus diisi.'); return; }
      if (!content.trim()) { alert('Isi artikel harus diisi.'); return; }
      if (wordCount < MIN_WORD_COUNT) {
        alert(`Isi artikel minimal ${MIN_WORD_COUNT} kata. Saat ini: ${wordCount} kata.`);
        return;
      }
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0).slice(0, 10);
    const autoMeta = metaDescription.trim() ||
      content.replace(/<[^>]*>/g, ' ').trim().substring(0, MAX_META_DESC_LENGTH);

    const articleData = {
      title: title.trim() || 'Tanpa Judul',
      content: content.trim(),
      categoryId,
      imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/1200/800`,
      imageCaption: imageCaption.trim(),
      metaDescription: autoMeta,
      status,
      tags,
    };

    if (isEditMode && id) {
      updateArticle(parseInt(id, 10), articleData);
    } else {
      addArticle({ ...articleData, authorId: user.id, authorName: user.name } as Omit<Article, 'id' | 'slug' | 'createdAt'>);
    }
    setSaving(false);
    navigate('/dashboard');
  };

  /* ---- Kualitas artikel ---- */
  const qualityScore = Math.min(100, Math.round(
    (title.trim() ? 20 : 0) +
    (imageUrl ? 15 : 0) +
    (imageCaption.trim() ? 5 : 0) +
    (metaDescription.trim() ? 10 : 0) +
    (tagsInput.trim() ? 10 : 0) +
    Math.min(40, Math.round((wordCount / MIN_WORD_COUNT) * 40))
  ));

  const tagsList = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const metaLeft = MAX_META_DESC_LENGTH - metaDescription.length;

  /* ---- HTML toolbar items ---- */
  const htmlTools = [
    { label: 'B', title: 'Bold', open: '<strong>', close: '</strong>' },
    { label: 'I', title: 'Italic', open: '<em>', close: '</em>' },
    { label: 'U', title: 'Underline', open: '<u>', close: '</u>' },
    { label: 'H2', title: 'Heading 2', open: '<h2>', close: '</h2>' },
    { label: 'H3', title: 'Heading 3', open: '<h3>', close: '</h3>' },
    { label: 'P', title: 'Paragraf', open: '<p>', close: '</p>' },
    { label: '🔗', title: 'Link', open: '<a href="URL">', close: '</a>' },
    { label: 'UL', title: 'Daftar bullet', open: '<ul>\n  <li>', close: '</li>\n</ul>' },
    { label: 'OL', title: 'Daftar nomor', open: '<ol>\n  <li>', close: '</li>\n</ol>' },
    { label: '❝', title: 'Kutipan', open: '<blockquote>', close: '</blockquote>' },
    { label: 'IMG', title: 'Gambar', open: '<img src="URL" alt="', close: '" />' },
    { label: 'HR', title: 'Garis pemisah', open: '<hr />', close: '' },
  ];

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* ===== TOP BAR ===== */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-ink-400 hover:text-ink-700 transition-colors" aria-label="Kembali ke dashboard">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-sm font-medium text-ink-700">
                {isEditMode ? 'Edit Artikel' : 'Artikel Baru'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => saveArticle(ArticleStatus.DRAFT)} disabled={saving}
                className="px-4 py-2 text-sm font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors disabled:opacity-60">
                Simpan Draf
              </button>
              <button type="button" onClick={() => saveArticle(ArticleStatus.PENDING)}
                disabled={saving || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={saving}>
                {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                {isEditMode ? 'Kirim Ulang' : 'Kirim untuk Review'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== KOLOM KIRI: EDITOR ===== */}
          <main className="lg:col-span-2 space-y-5">

            {/* -- JUDUL -- */}
            <div className="bg-white rounded-xl border border-ink-100 p-6">
              <label htmlFor="article-title" className="block text-xs font-bold text-ink-500 uppercase tracking-wider mb-2">
                Judul Artikel <span className="text-brand-500">*</span>
              </label>
              <input
                id="article-title"
                type="text"
                value={title}
                onChange={e => { if (e.target.value.length <= MAX_TITLE_LENGTH) setTitle(e.target.value); }}
                placeholder="Tulis judul yang menarik dan deskriptif..."
                maxLength={MAX_TITLE_LENGTH}
                className="w-full font-serif text-2xl font-bold text-ink-900 placeholder-ink-300 border-none focus:outline-none focus:ring-0 resize-none leading-tight"
              />
              <div className="mt-2 flex items-center gap-3 text-xs text-ink-400">
                <span>{title.length}/{MAX_TITLE_LENGTH} karakter</span>
                {title.length > 150 && <span className="text-yellow-600">⚠ Judul mungkin terlalu panjang</span>}
              </div>
            </div>

            {/* -- FOTO COVER + CAPTION -- */}
            {imageUrl ? (
              <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
                <div className="relative">
                  <img src={imageUrl} alt="Cover artikel" className="w-full h-60 object-cover"
                    onError={() => { setImageUrl(''); setImageError('Gambar tidak dapat dimuat.'); }} />
                  <button onClick={() => { setImageUrl(''); setImageCaption(''); setImageError(''); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    aria-label="Hapus foto cover">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Caption gambar */}
                <div className="px-4 py-3 border-t border-ink-100">
                  <label htmlFor="image-caption" className="block text-xs font-bold text-ink-500 uppercase tracking-wider mb-1.5">
                    Caption / Keterangan Foto
                  </label>
                  <input
                    id="image-caption"
                    type="text"
                    value={imageCaption}
                    onChange={e => setImageCaption(e.target.value)}
                    placeholder="Contoh: Presiden Jokowi saat meresmikan proyek kereta cepat di Jakarta. (Foto: Humas Istana)"
                    maxLength={200}
                    className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500 transition-colors placeholder-ink-400"
                  />
                  <p className="text-xs text-ink-400 mt-1">{imageCaption.length}/200 karakter · Sertakan nama fotografer/sumber foto</p>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="cover-upload"
                  className="block bg-white rounded-xl border-2 border-dashed border-ink-200 hover:border-brand-400 transition-colors cursor-pointer">
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                      <svg className="w-6 h-6 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink-700">Klik untuk unggah foto cover</p>
                    <p className="text-xs text-ink-400 mt-1">JPG, PNG, WEBP hingga {MAX_IMAGE_SIZE_MB}MB · Rasio 16:9 direkomendasikan</p>
                  </div>
                  <input id="cover-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload} className="hidden" />
                </label>
                {imageError && <p className="mt-2 text-xs text-red-600" role="alert">{imageError}</p>}
              </div>
            )}

            {/* -- EDITOR ISI ARTIKEL -- */}
            <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
              {/* Header editor: tabs mode + word count */}
              <div className="px-4 py-2.5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setContentMode('text'); setHtmlPreview(false); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${contentMode === 'text' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}
                  >
                    ✏️ Teks Biasa
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContentMode('html'); setHtmlPreview(false); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${contentMode === 'html' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}
                  >
                    {'</>'} HTML
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {contentMode === 'html' && (
                    <button
                      type="button"
                      onClick={() => setHtmlPreview(!htmlPreview)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${htmlPreview ? 'bg-brand-500 text-white border-brand-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}
                    >
                      {htmlPreview ? '✕ Tutup Preview' : '👁 Preview HTML'}
                    </button>
                  )}
                  <span className={`text-xs font-medium ${wordCount < MIN_WORD_COUNT ? 'text-yellow-600' : 'text-green-600'}`}>
                    {wordCount} kata {wordCount < MIN_WORD_COUNT ? `(min. ${MIN_WORD_COUNT})` : '✓'}
                  </span>
                </div>
              </div>

              {/* Toolbar HTML */}
              {contentMode === 'html' && !htmlPreview && (
                <div className="px-4 py-2 border-b border-ink-100 bg-ink-50 flex flex-wrap gap-1.5">
                  {htmlTools.map(tool => (
                    <ToolbarButton key={tool.label} onClick={() => insertHtmlTag(tool.open, tool.close)} title={tool.title}>
                      {tool.label}
                    </ToolbarButton>
                  ))}
                </div>
              )}

              {/* Textarea atau Preview */}
              {htmlPreview ? (
                <div className="px-6 py-5 min-h-[420px]">
                  <p className="text-xs text-ink-400 mb-3 font-medium">Preview tampilan HTML:</p>
                  <div
                    className="article-body text-ink-700 text-base leading-relaxed border border-ink-100 rounded-lg p-4 min-h-[340px] bg-ink-50"
                    dangerouslySetInnerHTML={{ __html: content || '<p class="text-ink-400 italic">Belum ada konten...</p>' }}
                  />
                </div>
              ) : (
                <div>
                  {contentMode === 'html' && (
                    <div className="px-4 pt-2 pb-0">
                      <p className="text-xs text-ink-400 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                        💡 <strong>Mode HTML:</strong> Anda dapat menggunakan tag HTML seperti{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;p&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;h2&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;strong&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;blockquote&gt;</code>, dll.
                        Klik tombol di toolbar untuk menyisipkan tag secara otomatis.
                      </p>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    id="article-content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={
                      contentMode === 'html'
                        ? `<p>Tulis paragraf pertama di sini...</p>\n\n<h2>Sub Judul</h2>\n<p>Lanjutkan penjelasan di sini...</p>\n\n<blockquote>Kutipan narasumber atau pernyataan penting.</blockquote>`
                        : `Mulai tulis isi artikel Anda di sini...\n\nGunakan paragraf yang jelas dan terstruktur. Setiap paragraf idealnya memiliki satu gagasan utama.\n\nSertakan fakta, data, atau kutipan dari sumber terpercaya.`
                    }
                    rows={22}
                    className={`w-full px-6 py-5 text-ink-700 leading-relaxed resize-none border-none focus:outline-none focus:ring-0 ${contentMode === 'html' ? 'font-mono text-sm' : 'text-base'}`}
                  />
                </div>
              )}
            </div>
          </main>

          {/* ===== KOLOM KANAN: SIDEBAR ===== */}
          <aside className="space-y-5">

            {/* -- SKOR KELENGKAPAN -- */}
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <h3 className="text-sm font-semibold text-ink-900 mb-3">Skor Kelengkapan</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-ink-100 rounded-full h-2.5 overflow-hidden"
                  role="progressbar" aria-valuenow={qualityScore} aria-valuemin={0} aria-valuemax={100}
                  aria-label={`Kelengkapan artikel: ${qualityScore}%`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${qualityScore >= 80 ? 'bg-green-500' : qualityScore >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`}
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
                <span className={`text-sm font-bold min-w-[3rem] text-right ${qualityScore >= 80 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {qualityScore}%
                </span>
              </div>
              <ul className="space-y-1.5">
                {[
                  { done: !!title.trim(), label: 'Judul artikel' },
                  { done: wordCount >= MIN_WORD_COUNT, label: `Konten min. ${MIN_WORD_COUNT} kata (${wordCount})` },
                  { done: !!imageUrl, label: 'Foto cover' },
                  { done: !!imageCaption.trim(), label: 'Caption foto' },
                  { done: !!metaDescription.trim(), label: 'Meta deskripsi SEO' },
                  { done: !!tagsInput.trim(), label: 'Tag / label' },
                ].map(item => (
                  <li key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? 'text-green-600' : 'text-ink-400'}`}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

            {/* -- SETELAN ARTIKEL -- */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-ink-900">Setelan Artikel</h3>

              {/* Kategori */}
              <div>
                <label htmlFor="article-category" className="block text-xs font-medium text-ink-600 mb-1.5">
                  Kategori <span className="text-brand-500">*</span>
                </label>
                <select id="article-category" value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="meta-description" className="block text-xs font-medium text-ink-600 mb-1.5">
                  Meta Deskripsi SEO
                  <span className="ml-1 text-ink-400 font-normal">(untuk Google)</span>
                </label>
                <textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={e => {
                    if (e.target.value.length <= MAX_META_DESC_LENGTH)
                      setMetaDescription(e.target.value);
                  }}
                  placeholder="Deskripsi singkat artikel ini untuk ditampilkan di hasil pencarian Google..."
                  rows={3}
                  maxLength={MAX_META_DESC_LENGTH}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-brand-500 resize-none transition-colors ${
                    metaDescription.length > 140 ? 'border-yellow-400 bg-yellow-50' : 'border-ink-200'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-ink-400">Idealnya 120–160 karakter</p>
                  <span className={`text-xs font-medium ${metaLeft < 20 ? 'text-yellow-600' : 'text-ink-400'}`}>
                    {metaDescription.length}/{MAX_META_DESC_LENGTH}
                  </span>
                </div>
                {/* Preview Google snippet */}
                {metaDescription.trim() && (
                  <div className="mt-2 p-2.5 bg-ink-50 rounded-lg border border-ink-200">
                    <p className="text-xs text-ink-400 font-medium mb-1">Preview Google:</p>
                    <p className="text-xs text-blue-600 font-medium truncate">{title || 'Judul Artikel'} — ISD NEWS</p>
                    <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">{metaDescription}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="article-tags" className="block text-xs font-medium text-ink-600 mb-1.5">Tag / Label</label>
                <input
                  id="article-tags"
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="ekonomi, kebijakan, nasional..."
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
                />
                <p className="text-xs text-ink-400 mt-1">Pisahkan dengan koma (maks. 10 tag)</p>
              </div>

              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5" aria-label="Tag yang dipilih">
                  {tagsList.slice(0, 10).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* -- PANDUAN -- */}
            <div className="bg-ink-900 rounded-xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3">📋 Panduan Kontributor</h3>
              <ul className="space-y-2 text-xs text-ink-400 leading-relaxed">
                <li>• Artikel ditinjau redaksi 1–2 hari kerja</li>
                <li>• Semua fakta harus dapat diverifikasi</li>
                <li>• Hindari konten provokatif atau hoaks</li>
                <li>• Foto harus bebas hak cipta atau milik sendiri</li>
                <li>• Sertakan caption & sumber foto</li>
                <li>• Mode HTML: gunakan tag semantik yang benar</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SubmitArticlePage;
