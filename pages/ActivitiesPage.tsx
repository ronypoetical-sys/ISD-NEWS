import React from 'react';
import { Link } from 'react-router-dom';

const activities = [
  {
    icon: '🔍',
    title: 'Liputan Investigatif',
    description: 'Tim jurnalis kami menggali fakta tersembunyi di balik isu-isu publik penting melalui riset mendalam, wawancara eksklusif, dan analisis data yang komprehensif.',
    highlight: 'Meraih Penghargaan Jurnalistik 2024',
  },
  {
    icon: '🎙️',
    title: 'Wawancara Eksklusif',
    description: 'Menghadirkan narasumber berkaliber—pemimpin negara, pengusaha, ilmuwan, hingga tokoh masyarakat—untuk berbagi perspektif langsung yang tidak ada di tempat lain.',
    highlight: '50+ tokoh diwawancarai tahun ini',
  },
  {
    icon: '⚡',
    title: 'Breaking News Real-Time',
    description: 'Redaksi aktif 24 jam memastikan setiap peristiwa penting tersaji kepada pembaca dalam hitungan menit dengan akurasi yang tidak dikompromikan.',
    highlight: 'Update setiap 15 menit',
  },
  {
    icon: '📊',
    title: 'Analisis Data & Infografis',
    description: 'Menyajikan data-data kompleks dalam format visual yang mudah dipahami—grafik interaktif, peta, dan infografis yang memperkaya pemahaman pembaca.',
    highlight: 'Visualisasi data premium',
  },
  {
    icon: '✍️',
    title: 'Jurnalisme Warga',
    description: 'Platform terbuka bagi masyarakat untuk berkontribusi: mengirimkan laporan dari lapangan, opini, dan sudut pandang yang memperkaya wacana publik nasional.',
    highlight: '200+ kontributor aktif',
  },
  {
    icon: '📸',
    title: 'Fotojurnalisme & Multimedia',
    description: 'Dokumentasi visual yang kuat dari setiap peristiwa penting—foto esai, video laporan, podcast, dan konten multimedia yang menghidupkan setiap cerita berita.',
    highlight: 'Studio produksi in-house',
  },
];

const timeline = [
  { year: '2020', event: 'ISD NEWS didirikan sebagai portal berita independen berbasis digital' },
  { year: '2021', event: 'Ekspansi ke 10 kota besar Indonesia dengan koresponden lokal' },
  { year: '2022', event: 'Peluncuran program Jurnalisme Warga dan platform kontributor' },
  { year: '2023', event: 'Meraih penghargaan portal berita terbaik kategori regional' },
  { year: '2024', event: 'Mencapai 100.000 pembaca aktif bulanan dan 500+ artikel' },
  { year: '2025', event: 'Peluncuran aplikasi mobile dan fitur newsletter harian' },
];

const ActivitiesPage: React.FC = () => {
  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Hero */}
      <div className="bg-ink-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Apa yang Kami Lakukan</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-5">
            Aktivitas & Program Kami
          </h1>
          <p className="text-ink-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Jurnalisme berkualitas memerlukan lebih dari sekadar menulis berita. Inilah ragam aktivitas yang kami lakukan setiap hari untuk menghadirkan informasi terbaik bagi Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Activities Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(activity => (
              <div key={activity.title} className="bg-white rounded-2xl p-7 border border-ink-100 article-card">
                <div className="text-4xl mb-5">{activity.icon}</div>
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">{activity.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed mb-4">{activity.description}</p>
                <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {activity.highlight}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-2xl border border-ink-100 p-8">
          <div className="text-center mb-10">
            <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">Sejarah Kami</div>
            <h2 className="font-serif text-3xl font-bold text-ink-900">Perjalanan ISD NEWS</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink-200 hidden sm:block"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={item.year} className={`flex gap-6 sm:gap-0 items-start ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right sm:pr-10' : 'sm:text-left sm:pl-10'}`}>
                    <div className="font-serif text-2xl font-bold text-brand-500 mb-1">{item.year}</div>
                    <p className="text-ink-600 text-sm leading-relaxed">{item.event}</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0 sm:hidden sm:block">
                    <div className="w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-md"></div>
                  </div>
                  <div className="flex-1 hidden sm:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-brand-500 to-brand-800 rounded-2xl p-10 text-center text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">Jadilah Bagian dari ISD NEWS</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Punya cerita yang layak didengar? Bergabunglah sebagai kontributor dan jadilah bagian dari ekosistem jurnalisme warga yang memberdayakan masyarakat.
          </p>
          {/*
           * FIX #6 — LINK TOMBOL "DAFTAR SEBAGAI KONTRIBUTOR"
           * MASALAH: href="/login" menyebabkan full page reload pada HashRouter.
           *          URL yang benar untuk HashRouter adalah /#/daftar-kontributor
           *          tapi cara terbaik adalah menggunakan komponen <Link> dari
           *          react-router-dom — otomatis menghasilkan /#/daftar-kontributor.
           * SOLUSI: Ganti <a href> → <Link to> sehingga routing internal,
           *         tidak ada reload, tidak ada broken route.
           */}
          <Link
            to="/daftar-kontributor"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-600 font-bold rounded-xl hover:bg-ink-50 transition-colors text-sm"
          >
            Daftar sebagai Kontributor
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ActivitiesPage;
