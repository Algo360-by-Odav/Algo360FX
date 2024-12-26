import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    plugins: [react()],
    server: {
      port: parseInt(process.env.PORT || '5173'),
      host: process.env.HOST || 'localhost',
      strictPort: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        },
        '/ws': {
          target: process.env.VITE_WS_URL || 'ws://localhost:5000',
          ws: true,
          secure: false
        }
      }
    },
    preview: {
      port: parseInt(process.env.PORT || '5173'),
      host: process.env.HOST || 'localhost',
      strictPort: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'react-router-dom',
              '@mui/material',
              '@emotion/react',
              '@emotion/styled'
            ]
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1600
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  };
});
