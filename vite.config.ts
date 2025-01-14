import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import { imagetools } from 'vite-imagetools';
import type { ConfigEnv, UserConfig } from 'vite';

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      // React plugin
      react({
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-transform-class-properties'
          ]
        }
      }),

      // TypeScript paths
      tsconfigPaths(),

      // PWA plugin
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

      // Image optimization
      imagetools(),

      // Compression configuration
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
        deleteOriginalAssets: false,
        threshold: 10240 // Only compress files > 10KB
      }),

      // HTML plugin
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: 'Algo360FX Trading Platform'
          }
        }
      }),

      // Bundle visualization in production
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      }),

      // Legacy browsers support
      isProduction && legacy({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true,
        renderLegacyChunks: true
      })
    ].filter(Boolean),
    
    // Public assets configuration
    publicDir: resolve(__dirname, 'client/public'),
    base: '/',

    // Resolve path aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'client/src'),
        '@components': resolve(__dirname, 'client/src/components'),
        '@pages': resolve(__dirname, 'client/src/pages'),
        '@services': resolve(__dirname, 'client/src/services'),
        '@utils': resolve(__dirname, 'client/src/utils'),
        '@hooks': resolve(__dirname, 'client/src/hooks'),
        '@store': resolve(__dirname, 'client/src/store'),
        '@assets': resolve(__dirname, 'client/src/assets'),
        '@styles': resolve(__dirname, 'client/src/styles'),
        '@config': resolve(__dirname, 'client/src/config')
      }
    },

    // Build configuration
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      rollupOptions: {
        input: resolve(__dirname, 'client/index.html'),
        output: {
          manualChunks: (id: string): string | undefined => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui-vendor';
              }
              return 'vendor';
            }
            return undefined;
          }
        }
      },
      copyPublicDir: true,
      minify: isProduction,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined
    },
    
    // Optimization configuration
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@mui/material'],
      exclude: ['@aws-amplify/ui-react']
    },

    // Server configuration
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/ws': {
          target: 'ws://localhost:4000',
          ws: true
        }
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  };
}
