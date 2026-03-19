import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/profil', label: 'Tentang Kami' },
    { to: '/kegiatan', label: 'Kegiatan' },
    { to: '/galeri', label: 'Galeri Foto' },
    { to: '/kontak', label: 'Kontak Redaksi' },
    { to: '/daftar-kontributor', label: 'Daftar Kontributor' },
  ];

  const topCategories = CATEGORIES.slice(0, 7);

  const socialLinks = [
    {
      name: 'Twitter/X',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" />
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      href: '#',
    },
  ];

  return (
    <footer className="bg-ink-900 text-ink-300" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block group mb-4" aria-label="ISD NEWS - Beranda">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-brand-400 group-hover:text-brand-300 transition-colors leading-none">ISD</span>
                <span className="text-sm font-bold text-ink-200 tracking-[0.3em] uppercase">NEWS</span>
              </div>
              <div className="text-[9px] text-ink-500 tracking-widest uppercase font-light mt-0.5">Portal Berita Terpercaya</div>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed mt-4 mb-6">
              Menyajikan berita terkini, analisis mendalam, dan jurnalisme berkualitas untuk masyarakat Indonesia yang cerdas dan kritis.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  title={social.name}
                  aria-label={`Ikuti ISD NEWS di ${social.name}`}
                  className="w-9 h-9 bg-ink-700 hover:bg-brand-500 text-ink-300 hover:text-white rounded-md flex items-center justify-center transition-all duration-200"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-bold text-ink-100 uppercase tracking-widest mb-5">Navigasi</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-3 h-px bg-ink-600 group-hover:bg-brand-400 transition-all group-hover:w-4 inline-block" aria-hidden="true"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-xs font-bold text-ink-100 uppercase tracking-widest mb-5">Kategori</h3>
            <ul className="space-y-2.5">
              {topCategories.map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/kategori/${cat.id}`}
                    className="text-sm text-ink-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-3 h-px bg-ink-600 group-hover:bg-brand-400 transition-all group-hover:w-4 inline-block" aria-hidden="true"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-ink-100 uppercase tracking-widest mb-5">Newsletter Harian</h3>
            <p className="text-sm text-ink-400 leading-relaxed mb-4">
              Dapatkan rangkuman berita terpenting langsung di kotak masuk Anda setiap pagi.
            </p>
            <form onSubmit={e => e.preventDefault()} className="space-y-2" aria-label="Formulir berlangganan newsletter">
              <label htmlFor="footer-email" className="sr-only">Alamat email untuk newsletter</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Alamat email Anda"
                autoComplete="email"
                className="w-full px-3 py-2.5 bg-ink-800 border border-ink-700 text-white text-sm rounded-md placeholder-ink-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button type="submit" className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-md transition-colors">
                Langganan Gratis
              </button>
            </form>
            <p className="text-xs text-ink-600 mt-3">Tidak ada spam. Berhenti berlangganan kapan saja.</p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR — MOBILE: 2 baris, DESKTOP: tetap rapi ===== */}
      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Baris 1 — Copyright — FIX #4: Format diubah sesuai permintaan */}
          <p className="text-xs text-ink-500 text-center leading-relaxed">
            &copy; {year} ISD NEWS{' '}
            <span className="text-ink-600" aria-hidden="true">|</span>{' '}
            <span className="text-ink-300">By Imam Sahroni Darmawan, S.T</span>
          </p>
          {/* Baris 2 — Legal Links (selalu 2 baris di mobile karena flex-col di bawah sm) */}
          <nav
            aria-label="Tautan kebijakan"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-2.5"
          >
            <Link
              to="/kebijakan-privasi"
              className="text-xs text-ink-600 hover:text-ink-300 transition-colors whitespace-nowrap"
            >
              Kebijakan Privasi
            </Link>
            <span className="text-ink-700 text-xs hidden sm:inline" aria-hidden="true">|</span>
            <Link
              to="/syarat-penggunaan"
              className="text-xs text-ink-600 hover:text-ink-300 transition-colors whitespace-nowrap"
            >
              Syarat Penggunaan
            </Link>
            <span className="text-ink-700 text-xs hidden sm:inline" aria-hidden="true">|</span>
            <Link
              to="/pedoman-media-siber"
              className="text-xs text-ink-600 hover:text-ink-300 transition-colors whitespace-nowrap"
            >
              Pedoman Media Siber
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
