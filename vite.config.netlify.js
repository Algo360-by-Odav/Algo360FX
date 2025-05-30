// vite.config.netlify.js - Special configuration for Netlify builds
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    rollupOptions: {
      // Externalize problematic dependencies
      external: [
        'chartjs-adapter-date-fns',
        '@stripe/stripe-js',
        'file-saver',
        '@ethersproject/providers',
        '@ethersproject/contracts',
        '@microsoft/signalr',
        'react-lazy-load-image-component',
        'react-lazy-load-image-component/src/effects/blur.css',
      ],
    },
  },
});
