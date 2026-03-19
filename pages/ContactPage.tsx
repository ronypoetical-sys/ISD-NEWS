import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const contacts = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
      title: 'Alamat Kantor',
      lines: ['Gedung ISD NEWS, Lt. 3', 'Jl. Jend. Sudirman No. 45', 'Jakarta Selatan, 12190'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      title: 'Email',
      lines: ['redaksi@isdnews.com', 'iklan@isdnews.com'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      ),
      title: 'Telepon',
      lines: ['(021) 555-0123', 'Senin – Jumat, 09.00–17.00 WIB'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      title: 'Jam Operasional',
      lines: ['Redaksi: 24 jam / 7 hari', 'Iklan & Kemitraan:', 'Senin – Jumat, 08.00–17.00'],
    },
  ];

  const subjects = [
    'Pilih topik pesan',
    'Pertanyaan Umum',
    'Koreksi Berita',
    'Pengiriman Artikel / Kontribusi',
    'Kerjasama Iklan & Media',
    'Pelaporan Konten',
    'Lainnya',
  ];

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-ink-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Hubungi Kami</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Kontak Redaksi</h1>
          <p className="text-ink-400 text-lg max-w-xl mx-auto leading-relaxed">
            Punya pertanyaan, masukan, atau ingin berkolaborasi? Tim kami siap mendengar dan merespons Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            {contacts.map(c => (
              <div key={c.title} className="bg-white rounded-xl p-5 border border-ink-100 article-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-ink-900 text-sm">{c.title}</h3>
                </div>
                {c.lines.map((line, i) => (
                  <p key={i} className="text-sm text-ink-500 leading-relaxed">{line}</p>
                ))}
              </div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-xl p-5 border border-ink-100">
              <h3 className="font-semibold text-ink-900 text-sm mb-3">Ikuti Kami</h3>
              <div className="flex flex-wrap gap-2">
                {['Twitter/X', 'Instagram', 'Facebook', 'YouTube', 'TikTok'].map(s => (
                  <a key={s} href="#" className="px-3 py-1.5 bg-ink-100 text-ink-600 text-xs font-medium rounded-full hover:bg-brand-500 hover:text-white transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-ink-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-ink-900 mb-3">Pesan Terkirim!</h3>
                <p className="text-ink-500 text-sm max-w-sm leading-relaxed mb-6">
                  Terima kasih telah menghubungi kami. Tim redaksi akan merespons pesan Anda dalam 1–2 hari kerja.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">Nama Lengkap <span className="text-brand-500">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">Alamat Email <span className="text-brand-500">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="email@Anda.com"
                        className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1.5">Topik Pesan</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-white"
                    >
                      {subjects.map(s => <option key={s} value={s === subjects[0] ? '' : s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-1.5">Pesan <span className="text-brand-500">*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tulis pesan Anda di sini..."
                      className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-ink-400 mt-1">{form.message.length} karakter</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-ink-400 leading-relaxed max-w-xs">
                      Dengan mengirim pesan, Anda menyetujui{' '}
                      <a href="#" className="text-brand-500 hover:underline">Kebijakan Privasi</a> kami.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          Kirim Pesan
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
