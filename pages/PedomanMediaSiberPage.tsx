import React from 'react';
import { Link } from 'react-router-dom';

const PedomanMediaSiberPage: React.FC = () => {
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
            <span className="text-ink-300">Pedoman Media Siber</span>
          </nav>
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Dokumen Legal</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Pedoman Media Siber</h1>
          <p className="text-ink-400 text-sm">Terakhir diperbarui: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 mb-10">
          <p className="text-ink-700 text-sm leading-relaxed">
            ISD NEWS beroperasi berdasarkan <strong>Pedoman Pemberitaan Media Siber</strong> yang ditetapkan oleh
            Dewan Pers Indonesia. Pedoman ini merupakan acuan profesional dalam menjalankan kegiatan jurnalistik
            di ranah digital, sesuai dengan Undang-Undang No. 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik.
          </p>
        </div>

        <div className="space-y-8">

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">1. Definisi dan Ruang Lingkup</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p><strong className="text-ink-800">Media Siber</strong> adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan perusahaan pers sebagaimana diatur dalam Undang-Undang Pers.</p>
              <p><strong className="text-ink-800">ISD NEWS (isdnews.com)</strong> adalah media siber yang menjalankan fungsi jurnalistik dengan menyajikan berita, analisis, dan opini kepada publik melalui platform digital.</p>
              <p>Pedoman ini berlaku untuk seluruh konten yang dipublikasikan di ISD NEWS, termasuk berita, artikel opini, konten dari kontributor, kolom komentar, dan materi multimedia.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">2. Verifikasi dan Keberimbangan Berita</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p><strong className="text-ink-800">2.1 Prinsip Verifikasi:</strong> Setiap informasi yang akan dipublikasikan wajib diverifikasi terlebih dahulu melalui minimal dua sumber yang independen dan kredibel. Jurnalis dilarang mempublikasikan informasi yang belum terverifikasi kebenarannya.</p>
              <p><strong className="text-ink-800">2.2 Keberimbangan (Cover Both Sides):</strong> Pemberitaan yang menyangkut sengketa atau perbedaan pendapat wajib menampilkan pendapat dari kedua belah pihak secara berimbang. Jika satu pihak tidak dapat dihubungi, hal tersebut harus dijelaskan dalam berita.</p>
              <p><strong className="text-ink-800">2.3 Berita Segera (Breaking News):</strong> Dalam kondisi mendesak, berita dapat dipublikasikan berdasarkan satu sumber terpercaya, namun harus segera dilengkapi dan diverifikasi. Informasi sementara harus dicantumkan sebagai "sedang berkembang" atau "unconfirmed".</p>
              <p><strong className="text-ink-800">2.4 Koreksi:</strong> Apabila terdapat kesalahan dalam pemberitaan, ISD NEWS wajib menerbitkan koreksi secara transparan, menonjol, dan sesegera mungkin. Koreksi mencantumkan informasi yang salah dan yang benar.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">3. Konten yang Dilarang</h2>
            </div>
            <div className="p-6 text-sm text-ink-600 leading-relaxed">
              <p className="mb-4">ISD NEWS secara tegas melarang publikasi konten yang mengandung:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Berita bohong (hoaks) atau informasi yang menyesatkan',
                  'Fitnah, pencemaran nama baik, atau tuduhan tanpa bukti',
                  'Ujaran kebencian berbasis suku, agama, ras, atau antargolongan (SARA)',
                  'Pornografi atau konten seksual yang tidak pantas',
                  'Konten yang menghasut atau memprovokasi kekerasan',
                  'Pelanggaran privasi tanpa kepentingan publik yang jelas',
                  'Plagiarisme atau pelanggaran hak cipta',
                  'Konten yang melanggar asas praduga tak bersalah',
                  'Informasi teknis yang dapat digunakan untuk melakukan kejahatan',
                  'Pemberitaan yang mengeksploitasi korban kejahatan atau bencana',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg p-3">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span className="text-xs text-red-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">4. Perlindungan Narasumber</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p><strong className="text-ink-800">4.1 Kerahasiaan Identitas:</strong> ISD NEWS melindungi identitas narasumber yang meminta untuk dirahasiakan, terutama dalam kasus pelaporan pelanggaran (whistleblower). Permintaan anonimitas akan dihormati selama tidak bertentangan dengan kepentingan publik.</p>
              <p><strong className="text-ink-800">4.2 Narasumber Rentan:</strong> Pemberitaan yang melibatkan anak-anak, korban kekerasan seksual, penderita gangguan mental, dan kelompok rentan lainnya dilakukan dengan sensitivitas tinggi. Identitas mereka tidak akan diungkap tanpa persetujuan atau pertimbangan kepentingan publik yang kuat.</p>
              <p><strong className="text-ink-800">4.3 Hak Jawab:</strong> Setiap pihak yang dirugikan oleh pemberitaan ISD NEWS memiliki hak jawab. Tanggapan yang disampaikan dengan itikad baik dan relevan akan dipublikasikan secara proporsional.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">5. Independensi Editorial</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p><strong className="text-ink-800">5.1 Bebas dari Tekanan:</strong> Redaksi ISD NEWS beroperasi secara independen dari tekanan politik, kepentingan bisnis, atau intervensi pihak manapun yang dapat mempengaruhi objektivitas pemberitaan.</p>
              <p><strong className="text-ink-800">5.2 Pemisahan Konten:</strong> ISD NEWS secara jelas memisahkan antara konten berita (editorial), konten opini, dan konten iklan/sponsor. Konten berbayar atau bersponsor akan diberi label yang jelas.</p>
              <p><strong className="text-ink-800">5.3 Transparansi Kepemilikan:</strong> ISD NEWS berkomitmen untuk transparan mengenai kepemilikan dan sumber pendanaan yang dapat mempengaruhi kebijakan editorial.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
            <div className="bg-ink-900 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-white">6. Prosedur Pengaduan</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-ink-600 leading-relaxed">
              <p>Apabila Anda menemukan konten yang diduga melanggar pedoman ini atau Kode Etik Jurnalistik, Anda dapat:</p>
              <ol className="space-y-3 ml-4">
                {[
                  { step: '1', title: 'Hubungi Redaksi ISD NEWS', desc: 'Kirimkan pengaduan melalui email redaksi@isdnews.com atau formulir kontak di halaman Kontak kami. Sertakan URL artikel, penjelasan pelanggaran, dan identitas Anda.' },
                  { step: '2', title: 'Tindak Lanjut Internal', desc: 'Redaksi akan menindaklanjuti pengaduan dalam 3 hari kerja. Jika terbukti ada pelanggaran, koreksi atau klarifikasi akan diterbitkan.' },
                  { step: '3', title: 'Dewan Pers', desc: 'Jika tidak puas dengan respons ISD NEWS, Anda dapat mengajukan pengaduan ke Dewan Pers Indonesia melalui website dewanpers.or.id.' },
                ].map(item => (
                  <li key={item.step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
                    <div>
                      <p className="font-semibold text-ink-800 mb-0.5">{item.title}</p>
                      <p>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Dasar Hukum */}
          <section className="bg-ink-900 rounded-2xl p-6 text-white">
            <h2 className="font-serif text-lg font-bold mb-4">Dasar Hukum</h2>
            <ul className="space-y-2 text-sm text-ink-300">
              {[
                'Undang-Undang No. 40 Tahun 1999 tentang Pers',
                'Undang-Undang No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016 tentang Informasi dan Transaksi Elektronik (ITE)',
                'Kode Etik Jurnalistik (Dewan Pers, 2006)',
                'Pedoman Pemberitaan Media Siber (Dewan Pers, 2012)',
                'Peraturan Dewan Pers No. 01/P-DP/III/2012',
                'Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 mt-0.5" aria-hidden="true">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link to="/kebijakan-privasi" className="px-4 py-2 bg-white border border-ink-200 text-ink-600 text-sm rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors">
            ← Kebijakan Privasi
          </Link>
          <Link to="/syarat-penggunaan" className="px-4 py-2 bg-white border border-ink-200 text-ink-600 text-sm rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors">
            ← Syarat Penggunaan
          </Link>
          <Link to="/kontak" className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PedomanMediaSiberPage;
