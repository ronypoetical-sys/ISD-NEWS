import React from 'react';
import { Link } from 'react-router-dom';

const KebijakanPrivasiPage: React.FC = () => {
  const lastUpdated = '19 Maret 2026';

  const sections = [
    {
      id: '1',
      title: '1. Informasi yang Kami Kumpulkan',
      content: [
        {
          subtitle: '1.1 Informasi yang Anda Berikan Langsung',
          text: 'Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk: nama lengkap, alamat email, dan kata sandi saat mendaftar sebagai kontributor; informasi profil yang Anda tambahkan; artikel, konten, dan komentar yang Anda kirimkan; serta pesan yang Anda kirim melalui formulir kontak.',
        },
        {
          subtitle: '1.2 Informasi yang Dikumpulkan Secara Otomatis',
          text: 'Saat Anda mengakses website ISD NEWS, sistem kami secara otomatis mengumpulkan: alamat IP perangkat Anda, jenis browser dan sistem operasi, halaman yang dikunjungi dan durasi kunjungan, sumber referral (dari mana Anda datang ke situs kami), serta data perangkat mobile jika Anda mengakses melalui smartphone atau tablet.',
        },
        {
          subtitle: '1.3 Informasi dari Pihak Ketiga',
          text: 'Kami dapat menerima informasi tentang Anda dari pihak ketiga seperti platform media sosial apabila Anda memilih untuk menghubungkan akun Anda, serta dari mitra analitik yang membantu kami memahami pola penggunaan website.',
        },
      ],
    },
    {
      id: '2',
      title: '2. Cara Kami Menggunakan Informasi',
      content: [
        {
          subtitle: '2.1 Operasional Layanan',
          text: 'Informasi Anda digunakan untuk: menyediakan, mengoperasikan, dan meningkatkan layanan ISD NEWS; memverifikasi identitas dan mengelola akun kontributor; memproses dan menerbitkan artikel yang Anda kirimkan; mengirimkan newsletter harian apabila Anda berlangganan.',
        },
        {
          subtitle: '2.2 Komunikasi',
          text: 'Kami menggunakan informasi kontak Anda untuk: mengirimkan pemberitahuan penting terkait akun; merespons pertanyaan dan permintaan dukungan; menginformasikan perubahan pada kebijakan atau layanan kami; mengirimkan materi pemasaran (hanya jika Anda telah memberikan persetujuan).',
        },
        {
          subtitle: '2.3 Analitik dan Peningkatan',
          text: 'Data agregat dan anonim digunakan untuk menganalisis tren penggunaan, memahami konten yang paling diminati pembaca, meningkatkan performa dan pengalaman pengguna website, serta mencegah penyalahgunaan dan aktivitas penipuan.',
        },
      ],
    },
    {
      id: '3',
      title: '3. Berbagi Informasi',
      content: [
        {
          subtitle: '3.1 Kami Tidak Menjual Data Anda',
          text: 'ISD NEWS tidak pernah dan tidak akan menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga untuk keperluan komersial mereka.',
        },
        {
          subtitle: '3.2 Pengungkapan Terbatas',
          text: 'Kami hanya membagikan informasi Anda dalam keadaan berikut: kepada penyedia layanan teknis yang membantu operasional website (hosting, analitik) dengan perjanjian kerahasiaan yang ketat; untuk mematuhi kewajiban hukum, perintah pengadilan, atau proses hukum yang sah; untuk melindungi hak, properti, atau keselamatan ISD NEWS, pengguna kami, atau publik.',
        },
        {
          subtitle: '3.3 Informasi Publik',
          text: 'Nama penulis dan artikel yang Anda publikasikan di ISD NEWS bersifat publik dan dapat dilihat oleh semua pengunjung website. Pertimbangkan hal ini sebelum mengirimkan konten.',
        },
      ],
    },
    {
      id: '4',
      title: '4. Keamanan Data',
      content: [
        {
          subtitle: '4.1 Langkah Keamanan',
          text: 'ISD NEWS menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi informasi Anda, termasuk enkripsi data saat transmisi (HTTPS/SSL), pembatasan akses data hanya kepada personel yang berwenang, dan pemantauan sistem secara berkala.',
        },
        {
          subtitle: '4.2 Batasan Keamanan',
          text: 'Meskipun kami berupaya keras melindungi data Anda, tidak ada sistem yang sepenuhnya aman. Kami tidak dapat menjamin keamanan mutlak dari informasi yang ditransmisikan melalui internet. Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda.',
        },
      ],
    },
    {
      id: '5',
      title: '5. Hak Anda',
      content: [
        {
          subtitle: '5.1 Hak Akses dan Koreksi',
          text: 'Anda berhak mengakses informasi pribadi yang kami simpan tentang Anda dan meminta koreksi jika ada ketidakakuratan. Hubungi kami melalui halaman Kontak untuk mengajukan permintaan.',
        },
        {
          subtitle: '5.2 Hak Penghapusan',
          text: 'Anda dapat meminta penghapusan akun dan data pribadi Anda. Perlu dicatat bahwa artikel yang telah diterbitkan atas nama Anda mungkin tetap tersedia dalam arsip kami untuk kepentingan rekam jurnalistik.',
        },
        {
          subtitle: '5.3 Hak Berhenti Berlangganan',
          text: 'Anda dapat berhenti berlangganan newsletter kapan saja dengan mengklik tautan "Berhenti Berlangganan" di bagian bawah setiap email yang kami kirim, atau menghubungi kami langsung.',
        },
      ],
    },
    {
      id: '6',
      title: '6. Cookie dan Teknologi Pelacakan',
      content: [
        {
          subtitle: '6.1 Penggunaan Cookie',
          text: 'ISD NEWS menggunakan cookie dan teknologi pelacakan serupa untuk: menjaga sesi login Anda, mengingat preferensi Anda, menganalisis traffic website, dan meningkatkan pengalaman pengguna secara keseluruhan.',
        },
        {
          subtitle: '6.2 Pengelolaan Cookie',
          text: 'Anda dapat mengatur browser Anda untuk menolak semua cookie atau memberikan notifikasi saat cookie dikirim. Namun, beberapa fitur website mungkin tidak berfungsi dengan benar jika cookie dinonaktifkan.',
        },
      ],
    },
    {
      id: '7',
      title: '7. Perubahan Kebijakan',
      content: [
        {
          subtitle: '7.1 Pembaruan Kebijakan',
          text: 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui pemberitahuan menonjol di website atau melalui email kepada pengguna terdaftar. Tanggal "Terakhir Diperbarui" di bagian atas kebijakan ini akan selalu mencerminkan versi terbaru.',
        },
        {
          subtitle: '7.2 Kelanjutan Penggunaan',
          text: 'Penggunaan berkelanjutan atas layanan ISD NEWS setelah perubahan kebijakan diterbitkan menandakan penerimaan Anda terhadap kebijakan yang diperbarui.',
        },
      ],
    },
    {
      id: '8',
      title: '8. Hubungi Kami',
      content: [
        {
          subtitle: 'Pertanyaan tentang Privasi',
          text: 'Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau pengelolaan data pribadi Anda, silakan hubungi kami melalui: Email: redaksi@isdnews.com | Formulir Kontak: isdnews.com/kontak | Alamat: Gedung ISD NEWS, Lt. 3, Jl. Jend. Sudirman No. 45, Jakarta Selatan 12190',
        },
      ],
    },
  ];

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
            <span className="text-ink-300">Kebijakan Privasi</span>
          </nav>
          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">Dokumen Legal</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Kebijakan Privasi</h1>
          <p className="text-ink-400 text-sm">Terakhir diperbarui: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-6 mb-10">
          <p className="text-ink-700 text-sm leading-relaxed">
            ISD NEWS ("<strong>kami</strong>", "<strong>kita</strong>", atau "<strong>ISD NEWS</strong>") berkomitmen untuk melindungi privasi Anda.
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
            saat menggunakan layanan portal berita kami di <strong>isdnews.com</strong>.
            Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map(section => (
            <section key={section.id} className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
              <div className="bg-ink-900 px-6 py-4">
                <h2 className="font-serif text-lg font-bold text-white">{section.title}</h2>
              </div>
              <div className="p-6 space-y-6">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-bold text-ink-900 mb-2">{item.subtitle}</h3>
                    <p className="text-sm text-ink-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link to="/syarat-penggunaan" className="px-4 py-2 bg-white border border-ink-200 text-ink-600 text-sm rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors">
            Syarat Penggunaan →
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

export default KebijakanPrivasiPage;
