// vite.config.netlify.js - Special configuration for Netlify builds
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 4000, // 4MB
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
      output: {
        // Manual chunking for better performance
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'material-ui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'charts': ['chart.js', 'react-chartjs-2', '@mui/x-charts'],
          'ai-features': ['client/src/components/chat'],
          'wallet-features': ['client/src/components/wallet'],
          'trading-features': ['client/src/components/trading'],
        }
      }
    },
  },
});
