import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    hmr: true,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' ws://localhost:* http://localhost:*",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
      ].join('; ')
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3001'),
    'import.meta.env.VITE_WS_URL': JSON.stringify('ws://localhost:3001/ws'),
    'import.meta.env.VITE_MT5_BRIDGE_URL': JSON.stringify('ws://localhost:5000'),
  },
});
