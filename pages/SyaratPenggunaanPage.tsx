import React from 'react';
import { Link } from 'react-router-dom';

const SyaratPenggunaanPage: React.FC = () => {
  const lastUpdated = '19 Maret 2026';

  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Header */}
      <div className="bg-ink-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-ink-400 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink-300">Syarat Penggunaan</span>
          </nav>
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Dokumen Legal</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Syarat Penggunaan</h1>
          <p className="text-ink-400 text-sm">Terakhir diperbarui: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 mb-10">
          <p className="text-ink-700 text-sm leading-relaxed">
            Selamat datang di <strong>ISD NEWS</strong>. Dengan mengakses atau menggunakan website ini,
            Anda menyatakan telah membaca, memahami, dan menyetujui Syarat Penggunaan berikut.
            Jika Anda tidak setuju dengan syarat-syarat ini, harap tidak menggunakan layanan kami.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">1. Penerimaan Syarat</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Syarat Penggunaan ini merupakan perjanjian hukum yang mengikat antara Anda (pengguna) dan ISD NEWS sebagai pengelola portal berita isdnews.com. Penggunaan layanan kami berarti Anda menyetujui syarat ini secara penuh dan tanpa syarat.</p>
              <p>ISD NEWS berhak mengubah syarat ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan. Penggunaan berkelanjutan atas layanan kami merupakan penerimaan atas perubahan tersebut.</p>
            </div>
          </section>

          {/* 2 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">2. Penggunaan yang Diizinkan</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Anda diizinkan untuk:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'Mengakses dan membaca konten ISD NEWS untuk keperluan pribadi dan non-komersial',
                  'Berbagi tautan (link) artikel ISD NEWS di media sosial dengan menyebutkan sumber',
                  'Mengutip sebagian kecil konten artikel dengan menyebutkan nama penulis, judul, dan tautan sumber',
                  'Mendaftar sebagai kontributor dan mengirimkan artikel orisinal sesuai panduan editorial',
                  'Berlangganan newsletter dan layanan notifikasi yang kami sediakan',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">3. Penggunaan yang Dilarang</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Anda dilarang untuk:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'Menyalin, mereproduksi, mendistribusikan, atau menjual konten ISD NEWS tanpa izin tertulis',
                  'Menggunakan konten untuk tujuan komersial tanpa lisensi resmi dari ISD NEWS',
                  'Mengirimkan konten yang mengandung hoaks, fitnah, SARA, atau ujaran kebencian',
                  'Melakukan tindakan yang mengganggu operasional teknis website (DDoS, scraping massal)',
                  'Menyamar sebagai pihak lain atau memberikan informasi identitas yang palsu',
                  'Menggunakan robot, spider, atau alat otomatis untuk mengakses layanan tanpa izin',
                  'Mengunggah konten yang melanggar hak cipta, privasi, atau hak kekayaan intelektual pihak lain',
                  'Mengakses akun pengguna lain tanpa izin atau berupaya menembus sistem keamanan',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">4. Hak Kekayaan Intelektual</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p><strong className="text-ink-800">Konten ISD NEWS:</strong> Seluruh konten yang dipublikasikan oleh redaksi ISD NEWS — termasuk teks, foto, grafik, video, dan desain — merupakan hak milik ISD NEWS dan dilindungi oleh undang-undang hak cipta Indonesia.</p>
              <p><strong className="text-ink-800">Konten Kontributor:</strong> Dengan mengirimkan artikel, Anda memberikan ISD NEWS lisensi non-eksklusif, royalti-bebas, untuk menerbitkan, mendistribusikan, dan mengarsipkan konten tersebut. Anda tetap memiliki hak cipta atas karya Anda sendiri.</p>
              <p><strong className="text-ink-800">Merek Dagang:</strong> Nama "ISD NEWS", logo, dan identitas visual merupakan merek dagang ISD NEWS yang tidak boleh digunakan tanpa izin tertulis.</p>
            </div>
          </section>

          {/* 5 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">5. Tanggung Jawab Konten</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>ISD NEWS berupaya menyajikan informasi yang akurat dan berimbang. Namun, kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan atau ketergantungan pada konten kami.</p>
              <p>Artikel opini dan konten dari kontributor mencerminkan pendapat penulisnya dan tidak selalu mewakili pandangan resmi ISD NEWS. Setiap kontributor bertanggung jawab penuh atas kebenaran dan orisinalitas konten yang mereka kirimkan.</p>
              <p>ISD NEWS berhak menolak, mengedit, atau menghapus konten yang melanggar syarat penggunaan ini, panduan editorial, atau peraturan hukum yang berlaku di Indonesia, tanpa pemberitahuan sebelumnya.</p>
            </div>
          </section>

          {/* 6 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">6. Akun Pengguna</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Untuk menjadi kontributor, Anda harus mendaftarkan akun dengan informasi yang akurat dan terkini. Anda bertanggung jawab penuh atas kerahasiaan kata sandi dan semua aktivitas yang terjadi di bawah akun Anda.</p>
              <p>ISD NEWS berhak menangguhkan atau menghapus akun yang melanggar syarat penggunaan ini tanpa ganti rugi. Kami juga berhak menolak pendaftaran atau membatalkan akun atas kebijaksanaan kami sendiri.</p>
            </div>
          </section>

          {/* 7 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">7. Batasan Tanggung Jawab</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Sejauh diizinkan oleh hukum yang berlaku, ISD NEWS tidak bertanggung jawab atas: kerugian tidak langsung, insidental, atau konsekuensial; kehilangan data atau keuntungan; gangguan bisnis; atau kerugian lain yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.</p>
              <p>Layanan ISD NEWS disediakan "sebagaimana adanya" tanpa jaminan apa pun, baik tersurat maupun tersirat.</p>
            </div>
          </section>

          {/* 8 */}
          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">8. Hukum yang Berlaku</h2>
            </div>
            <div className="p-6 text-sm text-ink-600 leading-relaxed">
              <p>Syarat Penggunaan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau sehubungan dengan syarat ini akan diselesaikan melalui jalur musyawarah mufakat terlebih dahulu, dan jika tidak tercapai kesepakatan, akan diselesaikan melalui Pengadilan Negeri Jakarta Selatan.</p>
            </div>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link to="/kebijakan-privasi" className="px-4 py-2 bg-white border border-ink-200 text-ink-600 text-sm rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors">
            ← Kebijakan Privasi
          </Link>
          <Link to="/pedoman-media-siber" className="px-4 py-2 bg-white border border-ink-200 text-ink-600 text-sm rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors">
            Pedoman Media Siber →
          </Link>
          <Link to="/kontak" className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SyaratPenggunaanPage;
