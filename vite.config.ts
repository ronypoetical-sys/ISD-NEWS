import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // ─────────────────────────────────────────────────────────────────────
    // publicDir: folder 'public' akan disalin apa adanya ke folder dist/
    // Taruh file _redirects (Netlify) di folder public/
    // Taruh file .htaccess (Apache) di folder public/
    // ─────────────────────────────────────────────────────────────────────
    publicDir: 'public',
    build: {
      outDir: 'dist',
      // Pastikan semua aset referensi menggunakan path relatif
      // sehingga bisa dihosting di subdomain atau subfolder
      assetsDir: 'assets',
    },
  };
});
