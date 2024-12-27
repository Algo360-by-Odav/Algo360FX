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
    plugins: [react()],
    base: './',
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/ws': {
          target: env.VITE_WS_URL || 'ws://localhost:5000',
          ws: true,
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      port: 3000,
      host: true,
      strictPort: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor';
              }
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui';
              }
              if (id.includes('recharts') || id.includes('lightweight-charts') || id.includes('chart.js')) {
                return 'charts';
              }
              if (id.includes('mobx')) {
                return 'state';
              }
            } else {
              if (id.includes('/pages/Analytics/') || id.includes('/components/analytics/')) {
                return 'analytics';
              }
              if (id.includes('/pages/Trading/') || id.includes('/components/trading/')) {
                return 'trading';
              }
              if (id.includes('/pages/AutoTrading/') || id.includes('/components/autoTrading/')) {
                return 'autoTrading';
              }
            }
          }
        },
      },
      envDir: '.',
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
        'process.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@layouts': resolve(__dirname, './src/layouts'),
        '@stores': resolve(__dirname, './src/stores'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@utils': resolve(__dirname, './src/utils'),
        '@services': resolve(__dirname, './src/services'),
        '@assets': resolve(__dirname, './src/assets'),
        '@theme': resolve(__dirname, './src/theme'),
      }
    }
  };
});
