import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useArticles } from '../../contexts/ArticleContext';
import { ArticleStatus, Article, ContentMode } from '../../types';
import { CATEGORIES } from '../../constants';

/*
 * FIX #2 — EDITOR KONTEN (SEPERTI BLOGGER)
 * Menambahkan dual-mode editor: Teks Biasa & HTML dengan toolbar.
 *
 * FIX #3 — CAPTION GAMBAR
 * Menambahkan field imageCaption setelah upload foto cover.
 *
 * Pendekatan: Custom HTML editor dengan toolbar (tanpa library eksternal)
 * Alasan: App berjalan via importmap CDN tanpa npm install, sehingga TinyMCE/Quill
 * tidak bisa di-import. Solusi custom ini:
 *   - Zero dependency
 *   - Toolbar insert-tag via selectionStart/End
 *   - Preview HTML dengan dangerouslySetInnerHTML (aman krn admin-only)
 *   - Konten disimpan sebagai HTML string di article.content
 */

const ToolbarButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
  <button type="button" onClick={onClick} title={title}
    className="px-2.5 py-1.5 rounded text-xs font-medium bg-ink-100 text-ink-700 hover:bg-ink-200 transition-colors">
    {children}
  </button>
);

const ArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { addArticle, updateArticle, getArticleById } = useArticles();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [article, setArticle] = useState<Partial<Article>>({
    title: '', content: '', categoryId: CATEGORIES[0]?.id || '',
    imageUrl: '', imageCaption: '', status: ArticleStatus.DRAFT, tags: [], slug: '',
  });
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [contentMode, setContentMode] = useState<ContentMode>('text');
  const [htmlPreview, setHtmlPreview] = useState(false);

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
    const plain = (article.content || '').replace(/<[^>]*>/g, ' ').trim();
    setWordCount(plain ? plain.split(/\s+/).filter(Boolean).length : 0);
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

  /* FIX #2 — Sisipkan tag HTML ke posisi kursor */
  const insertHtmlTag = (openTag: string, closeTag: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = (article.content || '').substring(start, end);
    const newContent = (article.content || '').substring(0, start) + openTag + selected + closeTag + (article.content || '').substring(end);
    setArticle(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

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
    { label: 'HR', title: 'Garis pemisah', open: '<hr />', close: '' },
  ];

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
      imageCaption: article.imageCaption || '',
      status,
      tags: article.tags || [],
    };

    if (isEditMode && article.id) {
      updateArticle(article.id, articleData);
    } else {
      addArticle({ ...articleData, authorId: user.id, authorName: user.name } as Omit<Article, 'id' | 'slug' | 'createdAt'>);
    }

    setSaving(false);
    setSaveMsg(status === ArticleStatus.DRAFT ? 'Tersimpan sebagai draf' : 'Diterbitkan!');
    setTimeout(() => setSaveMsg(''), 2000);
    if (status === ArticleStatus.PUBLISHED) setTimeout(() => navigate('/admin/artikel'), 800);
  };

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/admin/artikel" className="text-ink-400 hover:text-ink-700 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
              <input type="text" name="title" value={article.title} onChange={handleChange}
                placeholder="Judul artikel..." className="font-semibold text-ink-900 text-base border-none focus:ring-0 bg-transparent focus:outline-none w-48 sm:w-80 placeholder-ink-400 truncate" />
              {saveMsg && <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium flex-shrink-0">✓ {saveMsg}</span>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => saveArticle(ArticleStatus.DRAFT)} disabled={saving}
                className="px-3 py-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors disabled:opacity-60">
                Draf
              </button>
              <button onClick={() => saveArticle(ArticleStatus.PUBLISHED)} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60">
                {saving && <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
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
              <input type="text" name="title" value={article.title} onChange={handleChange}
                placeholder="Tulis judul yang kuat dan menarik perhatian..."
                className="w-full font-serif text-2xl font-bold text-ink-900 placeholder-ink-300 border-none focus:outline-none resize-none leading-tight" />
            </div>

            {/* FIX #3 — IMAGE + CAPTION
                Setelah upload foto, tampilkan field caption & alt text di bawahnya.
                Data disimpan ke article.imageCaption dan dikirim ke ArticleContext. */}
            {article.imageUrl ? (
              <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
                <div className="relative">
                  <img src={article.imageUrl} alt={article.imageCaption || 'Cover artikel'} className="w-full h-56 object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <button onClick={() => setArticle(prev => ({ ...prev, imageUrl: '', imageCaption: '' }))}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Hapus foto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {/* Caption field */}
                <div className="px-5 py-3 border-t border-ink-100 space-y-2">
                  <div>
                    <label htmlFor="admin-caption" className="block text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">
                      Caption / Keterangan Foto
                    </label>
                    <input id="admin-caption" type="text" name="imageCaption" value={article.imageCaption || ''} onChange={handleChange}
                      placeholder="Contoh: Menteri X saat meresmikan proyek Y. (Foto: Dok. Humas)"
                      maxLength={200}
                      className="w-full px-3 py-2 text-sm border border-ink-200 rounded-lg focus:outline-none focus:border-brand-500 transition-colors" />
                    <p className="text-xs text-ink-400 mt-1">{(article.imageCaption || '').length}/200 · Sertakan sumber/fotografer</p>
                  </div>
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

            {/* FIX #2 — EDITOR KONTEN DUAL MODE
                Mode "Teks Biasa": textarea biasa
                Mode "HTML": textarea + toolbar HTML + preview */}
            <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
              {/* Mode toggle + word count */}
              <div className="px-4 py-2.5 border-b border-ink-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-lg">
                  <button type="button" onClick={() => { setContentMode('text'); setHtmlPreview(false); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${contentMode === 'text' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                    ✏️ Teks Biasa
                  </button>
                  <button type="button" onClick={() => { setContentMode('html'); setHtmlPreview(false); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${contentMode === 'html' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
                    {'</>'} HTML
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {contentMode === 'html' && (
                    <button type="button" onClick={() => setHtmlPreview(!htmlPreview)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${htmlPreview ? 'bg-brand-500 text-white border-brand-500' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
                      {htmlPreview ? '✕ Tutup Preview' : '👁 Preview HTML'}
                    </button>
                  )}
                  <span className={`text-xs font-medium ${wordCount < 100 ? 'text-ink-400' : 'text-green-600'}`}>
                    {wordCount} kata
                  </span>
                </div>
              </div>

              {/* HTML Toolbar */}
              {contentMode === 'html' && !htmlPreview && (
                <div className="px-4 py-2 border-b border-ink-100 bg-ink-50 flex flex-wrap gap-1.5">
                  {htmlTools.map(tool => (
                    <ToolbarButton key={tool.label} onClick={() => insertHtmlTag(tool.open, tool.close)} title={tool.title}>
                      {tool.label}
                    </ToolbarButton>
                  ))}
                </div>
              )}

              {/* Preview atau Textarea */}
              {htmlPreview ? (
                <div className="px-6 py-5 min-h-[380px]">
                  <p className="text-xs text-ink-400 mb-3 font-medium">Preview tampilan artikel:</p>
                  <div className="article-body text-ink-700 text-base leading-relaxed border border-ink-100 rounded-lg p-4 min-h-[300px] bg-ink-50"
                    dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-ink-400 italic">Belum ada konten...</p>' }} />
                </div>
              ) : (
                <div>
                  {contentMode === 'html' && (
                    <div className="px-4 pt-2">
                      <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                        💡 <strong>Mode HTML:</strong> Gunakan tag{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;p&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;h2&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;strong&gt;</code>,{' '}
                        <code className="bg-blue-100 px-1 rounded">&lt;blockquote&gt;</code>.
                        Klik toolbar untuk sisipkan otomatis.
                      </p>
                    </div>
                  )}
                  <textarea ref={textareaRef} name="content" value={article.content} onChange={handleChange}
                    placeholder={contentMode === 'html'
                      ? `<p>Tulis paragraf pertama di sini...</p>\n\n<h2>Sub Judul</h2>\n<p>Lanjutkan penjelasan di sini...</p>`
                      : `Tulis konten artikel di sini. Gunakan paragraf yang jelas dan terstruktur...`}
                    rows={22}
                    className={`w-full px-6 py-5 text-ink-700 leading-relaxed resize-none border-none focus:outline-none focus:ring-0 ${contentMode === 'html' ? 'font-mono text-sm' : 'text-base'}`} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-ink-100 p-5">
              <h3 className="text-sm font-bold text-ink-900 mb-4">Publikasi</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Status</label>
                  <select name="status" value={article.status} onChange={handleChange}
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white">
                    <option value={ArticleStatus.DRAFT}>Draf</option>
                    <option value={ArticleStatus.PUBLISHED}>Diterbitkan</option>
                    <option value={ArticleStatus.PENDING}>Menunggu Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Kategori</label>
                  <select name="categoryId" value={article.categoryId} onChange={handleChange}
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 bg-white">
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Slug / URL</label>
                  <input type="text" name="slug" value={article.slug || ''} onChange={handleChange}
                    placeholder="otomatis-dari-judul"
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-xs font-mono text-ink-700 focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-600 mb-1.5">Tag</label>
                  <input type="text" value={tagsInput} onChange={handleTagsChange} placeholder="tag1, tag2, tag3"
                    className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
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
                <button onClick={() => saveArticle(ArticleStatus.PUBLISHED)} disabled={saving}
                  className="w-full py-2.5 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60">
                  {saving ? 'Menyimpan...' : 'Publikasikan Sekarang'}
                </button>
                <button onClick={() => saveArticle(ArticleStatus.DRAFT)} disabled={saving}
                  className="w-full py-2 text-sm font-medium text-ink-600 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors">
                  Simpan sebagai Draf
                </button>
              </div>
            </div>

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
