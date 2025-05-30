import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    // Configure React plugin with specific options to avoid JSX detection issues
    react({
      // Disable automatic JSX runtime
      jsxRuntime: 'classic',
      // Disable babel for TypeScript files
      babel: {
        babelrc: false,
        configFile: false,
        plugins: [],
        presets: []
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer/',
      // Alias MobX-related packages to our mock implementations
      'mobx': path.resolve(__dirname, './src/utils/mobxMock.js'),
      'mobx-react-lite': path.resolve(__dirname, './src/utils/mobxMock.js')
    }
  },
  optimizeDeps: {
    include: ['buffer']
  },
  server: {
    port: 5174, // Frontend dev server port
    host: '0.0.0.0', // Allow access from other devices on the network
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend API server
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:3001', // Backend WebSocket server
        ws: true,
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  }
});
