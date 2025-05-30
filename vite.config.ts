import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

const isProduction = process.env.NODE_ENV === 'production';

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
      minify: isProduction,
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
    sourcemap: !isProduction,
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
    minify: isProduction ? 'terser' : false,
    terserOptions: isProduction ? {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    } : undefined
  },
    
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
});
