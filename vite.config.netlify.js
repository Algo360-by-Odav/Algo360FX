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
        manualChunks: (id) => {
          // Vendor dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            if (id.includes('chart.js') || id.includes('chartjs-') || id.includes('x-charts')) {
              return 'vendor-charts';
            }
            return 'vendor-other';
          }
          
          // Application code
          if (id.includes('/components/chat/')) {
            return 'app-ai-features';
          }
          if (id.includes('/components/wallet/')) {
            return 'app-wallet-features';
          }
          if (id.includes('/components/trading/') || id.includes('/pages/advanced')) {
            return 'app-trading-features';
          }
          if (id.includes('/components/nft/')) {
            return 'app-nft-features';
          }
          if (id.includes('/components/marketplace/')) {
            return 'app-marketplace';
          }
          
          // Default chunk
          return null;
        }
      }
    },
  },
});
