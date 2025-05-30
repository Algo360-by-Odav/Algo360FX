import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  root: resolve(__dirname, 'client'),
  
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Algo360FX Trading Platform',
        short_name: 'Algo360FX',
        description: 'Advanced algorithmic trading platform for forex markets',
        theme_color: '#1a1a1a',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    imagetools(),
    createHtmlPlugin({
      minify: false,
      inject: {
        data: {
          title: 'Algo360FX',
          description: 'Advanced algorithmic trading platform for forex markets'
        }
      }
    }),
    visualizer({
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
    
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src')
    }
  },

  publicDir: resolve(__dirname, 'client/public'),
  base: '/',

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
        }
      }
    },
    minify: false
  },
    
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    headers: {
      // Disable Content-Security-Policy for development
      'Content-Security-Policy': ''
    }
  }
});
