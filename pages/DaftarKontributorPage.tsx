import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DaftarKontributorPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    domicile: '',
    expertise: '',
    motivation: '',
    portfolio: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const expertiseOptions = [
    'Pilih bidang keahlian',
    'Politik & Pemerintahan',
    'Ekonomi & Bisnis',
    'Teknologi & Sains',
    'Olahraga',
    'Hiburan & Budaya',
    'Gaya Hidup & Kesehatan',
    'Pendidikan',
    'Hukum & Kriminal',
    'Internasional',
    'Lingkungan Hidup',
    'Opini & Analisis',
    'Lainnya',
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = 'Nama minimal 2 karakter.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Format email tidak valid.';
    if (!form.password || form.password.length < 8)
      newErrors.password = 'Password minimal 8 karakter.';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok.';
    if (!form.domicile.trim())
      newErrors.domicile = 'Domisili harus diisi.';
    if (!form.expertise || form.expertise === 'Pilih bidang keahlian')
      newErrors.expertise = 'Pilih bidang keahlian Anda.';
    if (!form.motivation.trim() || form.motivation.trim().length < 50)
      newErrors.motivation = 'Motivasi minimal 50 karakter.';
    if (!form.agreeTerms)
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulasi pengiriman form (backend belum ada, tampilkan halaman sukses)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-ink-200'
    }`;

  if (submitted) {
    return (
      <div className="bg-ink-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-ink-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">Pendaftaran Terkirim!</h2>
          <p className="text-ink-500 text-sm leading-relaxed mb-2">
            Terima kasih, <strong>{form.name}</strong>! Permohonan Anda sebagai kontributor ISD NEWS telah kami terima.
          </p>
          <p className="text-ink-500 text-sm leading-relaxed mb-6">
            Tim redaksi akan meninjau permohonan Anda dan menghubungi melalui email <strong>{form.email}</strong> dalam <strong>3–5 hari kerja</strong>.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full px-6 py-3 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              to="/login"
              className="block w-full px-6 py-3 border border-ink-200 text-ink-600 text-sm font-medium rounded-lg hover:bg-ink-50 transition-colors"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-ink-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-ink-400 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink-300">Daftar Kontributor</span>
          </nav>
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Bergabung Bersama Kami</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Daftar sebagai Kontributor</h1>
          <p className="text-ink-400 text-base leading-relaxed max-w-xl">
            Jadilah bagian dari ekosistem jurnalisme warga ISD NEWS. Bagikan cerita, analisis, dan perspektif Anda kepada ribuan pembaca di seluruh Indonesia.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '✍️', label: 'Tulis & Publikasi' },
              { icon: '👥', label: '100K+ Pembaca' },
              { icon: '🏆', label: 'Bangun Portofolio' },
              { icon: '🤝', label: 'Komunitas Penulis' },
            ].map(b => (
              <div key={b.label} className="text-center py-3">
                <div className="text-2xl mb-1">{b.icon}</div>
                <p className="text-xs font-semibold text-ink-700">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-ink-100 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Formulir Pendaftaran</h2>

          <form onSubmit={handleSubmit} noValidate aria-label="Formulir pendaftaran kontributor" className="space-y-6">

            {/* Data Diri */}
            <div>
              <h3 className="text-sm font-bold text-ink-700 uppercase tracking-wide mb-4 pb-2 border-b border-ink-100">
                Data Diri
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Nama Lengkap <span className="text-brand-500">*</span>
                  </label>
                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="Nama lengkap Anda" required className={inputClass('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Email <span className="text-brand-500">*</span>
                  </label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="email@Anda.com" required autoComplete="email" className={inputClass('email')} />
                  {errors.email && <p className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="08xxxxxxxxxx" autoComplete="tel" className={inputClass('phone')} />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Password <span className="text-brand-500">*</span>
                  </label>
                  <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
                    placeholder="Min. 8 karakter" required autoComplete="new-password" className={inputClass('password')} />
                  {errors.password && <p className="mt-1 text-xs text-red-600" role="alert">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Konfirmasi Password <span className="text-brand-500">*</span>
                  </label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword}
                    onChange={handleChange} placeholder="Ulangi password" required autoComplete="new-password"
                    className={inputClass('confirmPassword')} />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600" role="alert">{errors.confirmPassword}</p>}
                </div>

                {/* Domicile */}
                <div>
                  <label htmlFor="domicile" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Domisili <span className="text-brand-500">*</span>
                  </label>
                  <input id="domicile" name="domicile" type="text" value={form.domicile} onChange={handleChange}
                    placeholder="Kota, Provinsi" required className={inputClass('domicile')} />
                  {errors.domicile && <p className="mt-1 text-xs text-red-600" role="alert">{errors.domicile}</p>}
                </div>
              </div>
            </div>

            {/* Profil Kontributor */}
            <div>
              <h3 className="text-sm font-bold text-ink-700 uppercase tracking-wide mb-4 pb-2 border-b border-ink-100">
                Profil Kontributor
              </h3>
              <div className="space-y-4">
                {/* Expertise */}
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Bidang Keahlian <span className="text-brand-500">*</span>
                  </label>
                  <select id="expertise" name="expertise" value={form.expertise} onChange={handleChange}
                    required className={`${inputClass('expertise')} bg-white`}>
                    {expertiseOptions.map(opt => (
                      <option key={opt} value={opt === 'Pilih bidang keahlian' ? '' : opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.expertise && <p className="mt-1 text-xs text-red-600" role="alert">{errors.expertise}</p>}
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Motivasi Bergabung <span className="text-brand-500">*</span>
                  </label>
                  <textarea id="motivation" name="motivation" value={form.motivation} onChange={handleChange}
                    rows={4} required placeholder="Ceritakan mengapa Anda ingin menjadi kontributor ISD NEWS dan topik apa yang ingin Anda tulis... (min. 50 karakter)"
                    className={inputClass('motivation')} />
                  <p className="mt-1 text-xs text-ink-400">{form.motivation.length} karakter</p>
                  {errors.motivation && <p className="mt-1 text-xs text-red-600" role="alert">{errors.motivation}</p>}
                </div>

                {/* Portfolio */}
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-ink-700 mb-1.5">
                    Portofolio / Contoh Tulisan <span className="text-ink-400 font-normal">(opsional)</span>
                  </label>
                  <input id="portfolio" name="portfolio" type="url" value={form.portfolio} onChange={handleChange}
                    placeholder="https://blog.anda.com atau link artikel sebelumnya"
                    className={inputClass('portfolio')} />
                  <p className="mt-1 text-xs text-ink-400">Tautan blog, LinkedIn, atau karya tulis Anda</p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-ink-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 text-brand-500 border-ink-300 rounded focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-ink-600 leading-relaxed cursor-pointer">
                  Saya telah membaca dan menyetujui{' '}
                  <Link to="/syarat-penggunaan" className="text-brand-500 hover:underline" target="_blank">Syarat Penggunaan</Link>,{' '}
                  <Link to="/kebijakan-privasi" className="text-brand-500 hover:underline" target="_blank">Kebijakan Privasi</Link>, dan{' '}
                  <Link to="/pedoman-media-siber" className="text-brand-500 hover:underline" target="_blank">Pedoman Media Siber</Link> ISD NEWS.
                  Saya berkomitmen untuk menyajikan konten yang orisinal, faktual, dan bertanggung jawab.
                </label>
              </div>
              {errors.agreeTerms && <p className="mt-2 text-xs text-red-600 ml-7" role="alert">{errors.agreeTerms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Mengirim Permohonan...
                </>
              ) : (
                <>
                  Kirim Permohonan Kontributor
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-center text-ink-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-brand-500 hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DaftarKontributorPage;
