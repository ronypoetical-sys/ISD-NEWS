import React from 'react';

const values = [
  { icon: '⚖️', title: 'Akurasi & Keberimbangan', desc: 'Setiap fakta diverifikasi dari minimal dua sumber independen. Tidak ada tempat bagi spekulasi atau keberpihakan.' },
  { icon: '🔍', title: 'Jurnalisme Investigatif', desc: 'Kami menggali di balik permukaan peristiwa untuk mengungkap realitas yang sesungguhnya kepada publik.' },
  { icon: '⚡', title: 'Kecepatan & Ketepatan', desc: 'Informasi terbaru tersaji dalam hitungan menit tanpa mengorbankan akurasi dan integritas editorial.' },
  { icon: '🌐', title: 'Digital-First', desc: 'Platform digital modern yang mudah diakses dari perangkat apa pun, kapan pun, dan di mana pun Anda berada.' },
  { icon: '🤝', title: 'Independensi Editorial', desc: 'Bebas dari tekanan politik dan kepentingan bisnis. Kami hanya bertanggung jawab kepada kebenaran dan publik.' },
  { icon: '💡', title: 'Inovasi Berkelanjutan', desc: 'Terus beradaptasi dengan perkembangan teknologi untuk menyampaikan berita dengan cara yang paling efektif.' },
];

const team = [
  { name: 'Rony Hermawan', role: 'Pemimpin Redaksi', avatar: 'R' },
  { name: 'Dewi Putri', role: 'Editor Senior Nasional', avatar: 'D' },
  { name: 'Ahmad Fauzi', role: 'Jurnalis Investigatif', avatar: 'A' },
  { name: 'Siti Rahayu', role: 'Kontributor Gaya Hidup', avatar: 'S' },
];

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-ink-50 min-h-screen">
      {/* Hero */}
      <div className="bg-ink-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-baseline gap-1.5 mb-4">
            <span className="font-serif text-5xl text-brand-400">ISD</span>
            <span className="text-xl font-bold text-white tracking-[0.3em] uppercase">NEWS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Portal Berita untuk<br />
            <span className="text-brand-400">Indonesia yang Lebih Cerdas</span>
          </h1>
          <p className="text-ink-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Didirikan dengan satu misi: menyajikan jurnalisme berkualitas tinggi yang memberdayakan masyarakat untuk memahami dunia secara lebih mendalam.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '12+', label: 'Kategori Berita' },
            { value: '100K+', label: 'Pembaca Bulanan' },
            { value: '500+', label: 'Artikel Diterbitkan' },
            { value: '24/7', label: 'Pembaruan Berita' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 text-center border border-ink-100 shadow-sm">
              <div className="font-serif text-3xl font-bold text-brand-500">{stat.value}</div>
              <div className="text-xs text-ink-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">
        {/* About */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-3">Tentang Kami</div>
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-5 leading-tight">
              Jurnalisme adalah Pilar Demokrasi
            </h2>
            <div className="space-y-4 text-ink-600 leading-relaxed">
              <p>
                ISD NEWS adalah portal berita independen yang lahir dari keyakinan bahwa informasi yang akurat, berimbang, dan bebas adalah fondasi masyarakat yang demokratis dan berdaya.
              </p>
              <p>
                Kami hadir untuk masyarakat Indonesia yang tidak puas dengan berita permukaan—pembaca yang ingin memahami konteks, implikasi, dan makna di balik setiap peristiwa yang terjadi.
              </p>
              <p>
                Dengan tim jurnalis dan kontributor yang tersebar di seluruh penjuru Nusantara, kami memastikan setiap sudut Indonesia mendapat suara yang layak di ranah informasi publik.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-500 to-brand-800 rounded-2xl p-8 text-white">
            <h3 className="font-serif text-2xl font-bold mb-4">Visi Kami</h3>
            <p className="text-white/90 leading-relaxed mb-6">
              Menjadi media informasi digital terdepan yang mencerahkan, mencerdaskan, dan menjadi rujukan utama masyarakat Indonesia dalam mencari kebenaran.
            </p>
            <div className="border-t border-white/20 pt-6">
              <h3 className="font-serif text-xl font-bold mb-3">Misi Kami</h3>
              <ul className="space-y-2">
                {[
                  'Menyajikan berita faktual, objektif, dan bebas dari hoaks',
                  'Mengedepankan jurnalisme beretika dan bertanggung jawab',
                  'Memberikan ruang bagi perspektif yang beragam',
                  'Mendorong partisipasi masyarakat melalui informasi edukatif',
                  'Berinovasi dalam penyampaian informasi digital',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <svg className="w-4 h-4 text-brand-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-10">
            <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">Nilai-Nilai Kami</div>
            <h2 className="font-serif text-3xl font-bold text-ink-900">Yang Membuat Kami Berbeda</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(val => (
              <div key={val.title} className="bg-white rounded-xl p-6 border border-ink-100 hover:border-brand-200 transition-all article-card">
                <div className="text-3xl mb-4">{val.icon}</div>
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-2">{val.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-10">
            <div className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-2">Tim Redaksi</div>
            <h2 className="font-serif text-3xl font-bold text-ink-900">Orang-Orang di Balik Berita</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map(member => (
              <div key={member.name} className="bg-white rounded-xl p-6 text-center border border-ink-100">
                <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-ink-900 text-sm">{member.name}</h3>
                <p className="text-xs text-ink-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
