import { User, Category, Article, GalleryImage, UserRole, ArticleStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Administrator', email: 'admin', password: 'rony123A.@', role: UserRole.ADMIN },
  { id: 2, name: 'Budi Santoso', email: 'budi@isdnews.com', password: 'password', role: UserRole.USER },
  { id: 3, name: 'Siti Rahayu', email: 'siti@isdnews.com', password: 'password', role: UserRole.USER },
];

export const CATEGORIES: Category[] = [
  { id: 'nasional', name: 'Nasional' },
  { id: 'internasional', name: 'Internasional' },
  { id: 'politik', name: 'Politik' },
  { id: 'ekonomi', name: 'Ekonomi & Bisnis' },
  { id: 'olahraga', name: 'Olahraga' },
  { id: 'teknologi', name: 'Teknologi' },
  { id: 'hiburan', name: 'Hiburan' },
  { id: 'gaya-hidup', name: 'Gaya Hidup' },
  { id: 'kesehatan', name: 'Kesehatan' },
  { id: 'pendidikan', name: 'Pendidikan' },
  { id: 'opini', name: 'Opini' },
  { id: 'otomotif', name: 'Otomotif' },
  { id: 'kriminal', name: 'Kriminal' },
  { id: 'hukum', name: 'Hukum' },
];

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Pemerintah Umumkan Paket Kebijakan Ekonomi Strategis untuk Mendorong Pertumbuhan 2025',
    slug: 'pemerintah-umumkan-kebijakan-ekonomi-strategis-2025',
    content: `Pemerintah Indonesia secara resmi mengumumkan serangkaian kebijakan ekonomi komprehensif yang dirancang untuk mendorong pertumbuhan ekonomi nasional melampaui target 5,5 persen pada tahun 2025.

Dalam konferensi pers yang digelar di Istana Negara, Menteri Koordinator Bidang Perekonomian memaparkan tiga pilar utama kebijakan tersebut: akselerasi investasi asing langsung, penguatan industri manufaktur berbasis teknologi tinggi, dan reformasi birokrasi untuk kemudahan berbisnis.

"Kami berkomitmen untuk menciptakan ekosistem bisnis yang kondusif bagi investor domestik maupun mancanegara," tegas Menteri dalam pernyataannya.

Paket kebijakan ini mencakup insentif pajak bagi perusahaan yang berinvestasi di sektor energi terbarukan, digitalisasi UMKM, serta pembangunan infrastruktur konektivitas di wilayah terpencil Indonesia Timur.

Para pengamat ekonomi dari berbagai lembaga riset internasional menyambut positif langkah pemerintah ini. Mereka menilai kebijakan ini relevan dengan dinamika ekonomi global yang tengah menghadapi ketidakpastian akibat perubahan geopolitik.

Namun, beberapa ekonom juga mengingatkan pentingnya implementasi yang konsisten dan transparan agar kebijakan ini benar-benar berdampak positif bagi masyarakat luas, khususnya kelompok menengah ke bawah.`,
    imageUrl: 'https://picsum.photos/seed/ekonomi-pol1/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'ekonomi',
    tags: ['ekonomi', 'kebijakan', 'pemerintah', 'investasi'],
    createdAt: '2025-03-19T07:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 2,
    title: 'Garuda Muda Melaju ke Semifinal: Kemenangan 3-0 atas Vietnam di Kualifikasi Piala Asia',
    slug: 'garuda-muda-melaju-semifinal-kemenangan-3-0-vietnam',
    content: `Tim Nasional U-23 Indonesia menorehkan sejarah gemilang dengan menumbangkan Vietnam tiga gol tanpa balas dalam laga mendebarkan di Stadion Gelora Bung Karno, semalam.

Kemenangan dramatis ini mengantarkan Skuad Garuda ke babak semifinal Kualifikasi Piala Asia U-23 untuk pertama kalinya dalam satu dekade terakhir. Puluhan ribu suporter yang memadati stadion larut dalam euforia tak terkira.

Gol pertama lahir dari kaki kapten tim pada menit ke-23 melalui sundulan kepala yang memanfaatkan umpan sudut terukur. Keunggulan bertambah di babak kedua lewat serangan balik kilat yang diselesaikan dengan dingin oleh penyerang muda berbakat.

Pencetak gol ketiga dan pamungkas adalah pemain berusia 20 tahun yang baru saja kembali dari studi di luar negeri, membuktikan bahwa program pembinaan jangka panjang PSSI mulai membuahkan hasil.

Pelatih kepala menyatakan kebanggannya atas performa tim yang dinilai jauh melampaui ekspektasi. "Ini bukan keberuntungan, ini hasil kerja keras selama dua tahun terakhir," ujarnya dalam sesi wawancara pascamatch.`,
    imageUrl: 'https://picsum.photos/seed/olahraga-garuda1/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'olahraga',
    tags: ['sepakbola', 'timnas', 'piala asia', 'u-23'],
    createdAt: '2025-03-19T05:30:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 3,
    title: 'Startup AI Indonesia Raih Pendanaan $50 Juta dari Investor Silicon Valley',
    slug: 'startup-ai-indonesia-raih-pendanaan-50-juta-silicon-valley',
    content: `Sebuah perusahaan rintisan kecerdasan buatan asal Jakarta berhasil menutup putaran pendanaan Seri B senilai 50 juta dolar AS dari konsorsium investor yang berbasis di Silicon Valley, menandai momen bersejarah bagi ekosistem teknologi Indonesia.

Perusahaan yang berdiri pada 2021 ini mengembangkan platform AI untuk analisis dokumen hukum dan keuangan yang menggunakan model bahasa besar (LLM) yang dioptimalkan untuk konteks Bahasa Indonesia dan berbagai bahasa daerah.

CEO dan ko-founder menyebut pendanaan ini akan digunakan untuk ekspansi ke pasar Asia Tenggara, rekrutmen talenta teknologi kelas dunia, serta penelitian dan pengembangan model bahasa yang lebih inklusif secara linguistik.

"Kami percaya bahwa AI bukan hanya milik negara maju. Indonesia, dengan kekayaan bahasa dan budayanya, memiliki keunggulan unik untuk memimpin revolusi AI di kawasan," kata sang CEO.

Keberhasilan ini mendapat sambutan meriah dari komunitas startup Indonesia dan dianggap sebagai sinyal kuat bahwa investor global semakin melirik ekosistem teknologi Nusantara.`,
    imageUrl: 'https://picsum.photos/seed/tech-ai-startup/1200/800',
    authorId: 2,
    authorName: 'Budi Santoso',
    categoryId: 'teknologi',
    tags: ['teknologi', 'ai', 'startup', 'pendanaan'],
    createdAt: '2025-03-18T10:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 4,
    title: 'KTT ASEAN 2025: Indonesia Pimpin Agenda Ketahanan Pangan Regional di Tengah Krisis Iklim',
    slug: 'ktt-asean-2025-indonesia-pimpin-agenda-ketahanan-pangan',
    content: `Indonesia tampil sebagai pemimpin diskusi dalam Konferensi Tingkat Tinggi ASEAN 2025 yang berlangsung di Bali, membawa agenda ketahanan pangan regional ke posisi sentral di tengah ancaman perubahan iklim yang semakin nyata.

Presiden dalam pidato pembukaannya menegaskan bahwa negara-negara ASEAN harus bersatu menghadapi tantangan food security yang tidak bisa diselesaikan sendiri-sendiri. Usulan Indonesia mencakup pembentukan cadangan pangan strategis bersama dan transfer teknologi pertanian presisi.

Para pemimpin dari 10 negara anggota ASEAN menyepakati deklarasi bersama yang menetapkan target pengurangan ketergantungan impor pangan sebesar 30 persen dalam lima tahun ke depan.

Beberapa ahli iklim yang turut hadir sebagai narasumber memaparkan proyeksi dampak El Niño terhadap produksi pertanian di kawasan, memperkuat urgensi kolaborasi regional yang lebih erat.`,
    imageUrl: 'https://picsum.photos/seed/intl-asean-bali/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'internasional',
    tags: ['asean', 'diplomasi', 'ketahanan pangan', 'bali'],
    createdAt: '2025-03-18T08:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 5,
    title: 'Revolusi Transportasi: Kereta Cepat Jakarta-Surabaya Resmi Mulai Konstruksi Fase Kedua',
    slug: 'kereta-cepat-jakarta-surabaya-mulai-konstruksi-fase-kedua',
    content: `Pemerintah secara resmi menandatangani kontrak konstruksi fase kedua proyek Kereta Cepat Jakarta-Surabaya senilai Rp 180 triliun, menandai babak baru dalam modernisasi infrastruktur transportasi Indonesia.

Proyek ambisius ini, yang akan menghubungkan dua kota terbesar di Jawa dalam waktu tempuh 3,5 jam, ditargetkan beroperasi penuh pada tahun 2030. Fase pertama yang sudah berjalan mencakup segmen Jakarta-Cirebon.

Teknologi yang digunakan merupakan kolaborasi antara konsorsium Jepang, Korea, dan kontraktor lokal Indonesia, dengan komitmen transfer teknologi yang akan memperkuat kapabilitas insinyur Indonesia.

Dampak ekonomi yang diproyeksikan mencakup penciptaan lebih dari 200.000 lapangan kerja selama masa konstruksi dan transformasi koridor ekonomi Jawa yang menghubungkan 60 persen populasi Indonesia.`,
    imageUrl: 'https://picsum.photos/seed/nasional-train/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'nasional',
    tags: ['infrastruktur', 'kereta cepat', 'transportasi', 'pembangunan'],
    createdAt: '2025-03-17T09:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 6,
    title: 'Film Animasi Indonesia "Nusantara Chronicles" Menangkan Penghargaan Cannes 2025',
    slug: 'film-animasi-nusantara-chronicles-menangkan-cannes-2025',
    content: `Film animasi Indonesia berjudul "Nusantara Chronicles" berhasil meraih penghargaan bergengsi di Festival Film Cannes 2025, sebuah pencapaian bersejarah yang pertama kali diraih oleh karya animasi asal Indonesia.

Diproduksi oleh studio animasi berbasis di Yogyakarta, film berdurasi 94 menit ini menggabungkan elemen mitologi Nusantara dengan teknik animasi 2D kontemporer yang memukau. Ceritanya berpusat pada seorang gadis muda yang menjelajahi dunia paralel bersama makhluk-makhluk dari berbagai folklore Indonesia.

Sutradara yang merupakan alumni Institut Kesenian Jakarta menyatakan bahwa penghargaan ini didedikasikan untuk para seniman dan pekerja kreatif Indonesia yang selama ini berjuang di bayangan industri hiburan global.

"Cerita kita layak untuk dunia. Keajaiban Nusantara tidak kalah dari dongeng Eropa maupun Asia Timur," ujarnya di atas panggung penerimaan penghargaan, disambut tepuk tangan meriah.`,
    imageUrl: 'https://picsum.photos/seed/hiburan-cannes/1200/800',
    authorId: 3,
    authorName: 'Siti Rahayu',
    categoryId: 'hiburan',
    tags: ['film', 'animasi', 'cannes', 'budaya'],
    createdAt: '2025-03-17T14:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 7,
    title: 'Opini: Ancaman Nyata "Brain Drain" dan Urgensi Ekosistem Talenta Digital Indonesia',
    slug: 'opini-ancaman-brain-drain-ekosistem-talenta-digital-indonesia',
    content: `Setiap tahun, ribuan lulusan terbaik perguruan tinggi Indonesia memilih untuk berkarier di luar negeri. Fenomena yang kerap disebut "brain drain" ini bukan sekadar statistik—ini adalah ancaman struktural terhadap cita-cita Indonesia sebagai negara maju.

Data terbaru menunjukkan bahwa sekitar 40 persen lulusan program teknik informatika universitas top Indonesia menerima tawaran kerja dari perusahaan teknologi multinasional dengan paket kompensasi yang sulit ditandingi oleh industri lokal.

Solusinya bukan menutup batas—itu mustahil dan kontraproduktif. Jawabannya ada pada pembangunan ekosistem yang membuat talenta terbaik merasa bahwa membangun Indonesia adalah pilihan yang tidak hanya bermakna, tetapi juga kompetitif secara finansial.

Ini memerlukan sinergi antara pemerintah, industri swasta, dan akademia—sebuah grand coalition yang berfokus pada satu hal: menjadikan Indonesia sebagai magnet talenta Asia, bukan sekadar eksportirnya.`,
    imageUrl: 'https://picsum.photos/seed/opini-talent/1200/800',
    authorId: 2,
    authorName: 'Budi Santoso',
    categoryId: 'opini',
    tags: ['opini', 'pendidikan', 'teknologi', 'talenta'],
    createdAt: '2025-03-16T08:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 8,
    title: 'Inovasi Kesehatan: Vaksin Dengue Lokal Indonesia Siap Memasuki Uji Klinis Fase Tiga',
    slug: 'vaksin-dengue-lokal-indonesia-uji-klinis-fase-tiga',
    content: `Tim peneliti dari Badan Penelitian dan Pengembangan Kesehatan mengumumkan bahwa vaksin dengue yang dikembangkan sepenuhnya oleh ilmuwan Indonesia telah memenuhi semua syarat untuk memasuki uji klinis fase tiga—tahap terakhir sebelum komersialisasi.

Vaksin bernama DenVax-ID ini dikembangkan selama tujuh tahun dengan dukungan BRIN dan beberapa universitas terkemuka. Hasil uji fase dua menunjukkan efikasi sebesar 87 persen dalam mencegah infeksi dengue berat pada anak-anak.

Jika berhasil, Indonesia akan menjadi negara berkembang pertama yang memproduksi vaksin dengue sendiri, mengurangi ketergantungan impor dan menurunkan biaya secara dramatis untuk program vaksinasi nasional.

Menteri Kesehatan menyebut ini sebagai "momen Sputnik" bagi riset biomedis Indonesia—sebuah lompatan yang membuktikan bahwa kemandirian farmasi bukan sekadar impian.`,
    imageUrl: 'https://picsum.photos/seed/kesehatan-vaksin/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'kesehatan',
    tags: ['kesehatan', 'vaksin', 'riset', 'dengue'],
    createdAt: '2025-03-16T11:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 9,
    title: 'Sekolah Masa Depan: Program "Guru Penggerak" Berhasil Transformasi 5.000 Sekolah di Pelosok',
    slug: 'program-guru-penggerak-berhasil-transformasi-5000-sekolah-pelosok',
    content: `Kementerian Pendidikan merilis laporan dampak program Guru Penggerak yang menunjukkan transformasi signifikan di lebih dari 5.000 sekolah di daerah terpencil, dengan peningkatan rata-rata nilai kompetensi siswa sebesar 23 persen dalam dua tahun.

Program yang melibatkan 15.000 guru terpilih ini menggabungkan pelatihan intensif dengan pendekatan "merdeka belajar" yang memberikan keleluasaan kepada guru untuk berinovasi dalam metode pengajaran sesuai konteks lokal.

Kisah sukses dari Nusa Tenggara Timur menjadi sorotan: sebuah sekolah dasar di desa terpencil kini memiliki laboratorium komputer bertenaga surya dan program coding untuk anak usia 8 tahun.

Para ahli pendidikan internasional dari UNESCO turut memuji model Guru Penggerak sebagai pendekatan yang layak diadaptasi oleh negara berkembang lainnya yang menghadapi tantangan pemerataan kualitas pendidikan.`,
    imageUrl: 'https://picsum.photos/seed/pendidikan-guru/1200/800',
    authorId: 3,
    authorName: 'Siti Rahayu',
    categoryId: 'pendidikan',
    tags: ['pendidikan', 'guru', 'sekolah', 'transformasi'],
    createdAt: '2025-03-15T09:30:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 10,
    title: 'Pemilu 2029: Partai-Partai Besar Mulai Pemetaan Kandidat Potensial di Tengah Dinamika Politik Baru',
    slug: 'pemilu-2029-partai-besar-pemetaan-kandidat-potensial',
    content: `Meski masih empat tahun lagi, mesin politik partai-partai besar di Indonesia sudah mulai berputar. Internal survey dan pemetaan kandidat potensial untuk Pemilu 2029 sudah menjadi agenda rutin di sejumlah markas partai besar.

Nama-nama baru bermunculan, mencerminkan pergeseran generasi dalam lanskap politik nasional. Generasi Y dan Z mulai mendominasi daftar kandidat yang dipertimbangkan, seiring meningkatnya kesadaran partai akan pentingnya wajah yang relevan bagi pemilih muda.

Analis politik menyoroti perubahan fundamental dalam cara partai membangun narasi: kini lebih berbasis data dan digital marketing ketimbang pendekatan konvensional berbasis mobilisasi massa.

"Pemilu 2029 akan menjadi yang paling digital dalam sejarah Indonesia," ujar seorang peneliti dari lembaga riset terkemuka. "Partai yang tidak mahir bermain di ruang digital akan tertinggal jauh."`,
    imageUrl: 'https://picsum.photos/seed/politik-pemilu/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'politik',
    tags: ['politik', 'pemilu', 'partai', '2029'],
    createdAt: '2025-03-15T07:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 11,
    title: 'Rupiah Menguat: Nilai Tukar Tembus Rp 15.200 per Dolar Didorong Surplus Neraca Perdagangan',
    slug: 'rupiah-menguat-nilai-tukar-rp-15200-surplus-neraca-perdagangan',
    content: `Nilai tukar Rupiah terhadap Dolar Amerika Serikat menguat signifikan ke level Rp 15.200 pada penutupan perdagangan kemarin, level terkuat dalam 18 bulan terakhir, didorong oleh data surplus neraca perdagangan yang melebihi ekspektasi pasar.

Bank Indonesia mempertahankan stance kebijakan moneter yang akomodatif sambil tetap waspada terhadap dinamika global. Gubernur BI menyebut penguatan Rupiah mencerminkan fundamental ekonomi Indonesia yang solid.

Surplus neraca perdagangan bulan Februari mencapai 3,8 miliar dolar, jauh di atas konsensus analis sebesar 2,5 miliar dolar, didorong oleh lonjakan ekspor nikel olahan dan produk manufaktur berteknologi tinggi.

Para pelaku pasar memandang penguatan ini sebagai momentum positif bagi pasar modal dan sektor riil, meski beberapa ekonom mengingatkan agar tidak terlena dan tetap mewaspadai volatilitas pasar global.`,
    imageUrl: 'https://picsum.photos/seed/ekonomi-rupiah/1200/800',
    authorId: 1,
    authorName: 'Redaksi ISD NEWS',
    categoryId: 'ekonomi',
    tags: ['rupiah', 'ekonomi', 'valuta asing', 'neraca perdagangan'],
    createdAt: '2025-03-14T15:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
  {
    id: 12,
    title: 'Gaya Hidup Sehat: Tren "Forest Bathing" Merambah Kota-Kota Besar Indonesia',
    slug: 'tren-forest-bathing-merambah-kota-besar-indonesia',
    content: `Praktik Shinrin-yoku atau "forest bathing" yang berakar dari tradisi Jepang kini semakin populer di kalangan urban Indonesia yang mendambakan ketenangan di tengah tekanan kehidupan kota.

Sejumlah taman kota dan kawasan hutan lindung di sekitar Jakarta, Bandung, dan Surabaya kini menawarkan program terstruktur yang dipandu oleh fasilitator terlatih. Harganya berkisar antara Rp 200.000 hingga Rp 800.000 per sesi, namun tetap diminati.

Penelitian dari Universitas Indonesia mendukung manfaat forest bathing: sesi dua jam di lingkungan berhutan terbukti menurunkan kadar kortisol (hormon stres) sebesar 15 persen dan meningkatkan aktivitas sel NK yang berperan dalam imunitas tubuh.

Para praktisi menjelaskan bahwa kunci forest bathing bukan sekadar berjalan di hutan, melainkan tentang keterlibatan penuh semua indera—mencium aroma tanah, mendengar suara angin, menyentuh tekstur kulit pohon.`,
    imageUrl: 'https://picsum.photos/seed/lifestyle-forest/1200/800',
    authorId: 3,
    authorName: 'Siti Rahayu',
    categoryId: 'gaya-hidup',
    tags: ['gaya hidup', 'kesehatan', 'alam', 'wellbeing'],
    createdAt: '2025-03-14T08:00:00Z',
    status: ArticleStatus.PUBLISHED,
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/gallery-news1/800/600', caption: 'Konferensi Pers Ekonomi Nasional' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/gallery-sport2/800/600', caption: 'Final Sepakbola Asian Games' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/gallery-tech3/800/600', caption: 'Pameran Teknologi Indonesia 2025' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/gallery-film4/800/600', caption: 'Gala Premier Film Nusantara' },
  { id: 5, imageUrl: 'https://picsum.photos/seed/gallery-edu5/800/600', caption: 'Program Beasiswa Nasional' },
  { id: 6, imageUrl: 'https://picsum.photos/seed/gallery-auto6/800/600', caption: 'Indonesia International Motor Show' },
  { id: 7, imageUrl: 'https://picsum.photos/seed/gallery-demo7/800/600', caption: 'Aksi Solidaritas Masyarakat' },
  { id: 8, imageUrl: 'https://picsum.photos/seed/gallery-eco8/800/600', caption: 'Penutupan Perdagangan Bursa Efek' },
  { id: 9, imageUrl: 'https://picsum.photos/seed/gallery-infra9/800/600', caption: 'Groundbreaking Infrastruktur IKN' },
  { id: 10, imageUrl: 'https://picsum.photos/seed/gallery-health10/800/600', caption: 'Peluncuran Program Kesehatan Nasional' },
  { id: 11, imageUrl: 'https://picsum.photos/seed/gallery-env11/800/600', caption: 'Festival Lingkungan Hidup 2025' },
  { id: 12, imageUrl: 'https://picsum.photos/seed/gallery-diplo12/800/600', caption: 'KTT ASEAN di Bali' },
];
