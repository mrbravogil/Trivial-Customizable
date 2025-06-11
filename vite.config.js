import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr()               // ⬅️ permite importar SVG como componentes
  ],

  server: {
    proxy: {
      /* ---------- Proxy ElevenLabs (TTS) ---------- */
      '/api/elevenlabs': {
        target: 'https://api.elevenlabs.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/elevenlabs/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        }
      },

      /* ---------- Proxy para uploads locales ---------- */
      '/upload': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});