import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { compression } from 'vite-plugin-compression2';
import legacy from '@vitejs/plugin-legacy';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Enable automatic runtime JSX transform
        jsxRuntime: 'automatic',
        // Babel options for better performance
        babel: {
          plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-transform-class-properties'
          ]
        }
      }),
      // Handle TypeScript path aliases
      tsconfigPaths(),
      // PWA configuration
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Algo360FX Trading Platform',
          short_name: 'Algo360FX',
          theme_color: '#1a1a1a',
          background_color: '#1a1a1a',
          display: 'standalone',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.algo360fx\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                }
              }
            }
          ]
        }
      }),
      // Bundle size analyzer (only in build mode)
      mode === 'production' && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      }),
      // HTML transformation
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'Algo360FX Trading Platform',
            description: 'Advanced algorithmic trading platform for forex markets'
          },
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'preconnect',
                href: env.VITE_API_URL || 'http://localhost:5000'
              }
            },
            {
              tag: 'meta',
              attrs: {
                name: 'theme-color',
                content: '#1a1a1a'
              }
            }
          ]
        }
      }),
      // Compression for production builds
      mode === 'production' && compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/, /\.(png|jpe?g|gif|webp)$/i],
        threshold: 1024,
        deleteOriginalAssets: false
      }),
      // Fallback for older browsers
      mode === 'production' && legacy({
        targets: ['defaults', 'not IE 11']
      }),
      // Image optimization
      imagetools({
        defaultDirectives: new URLSearchParams({
          format: 'webp',
          quality: '80',
          progressive: 'true'
        })
      })
    ].filter(Boolean),
    
    // Resolve path aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, 'client/src'),
        '@components': resolve(__dirname, 'client/src/components'),
        '@pages': resolve(__dirname, 'client/src/pages'),
        '@hooks': resolve(__dirname, 'client/src/hooks'),
        '@services': resolve(__dirname, 'client/src/services'),
        '@store': resolve(__dirname, 'client/src/store'),
        '@utils': resolve(__dirname, 'client/src/utils'),
        '@types': resolve(__dirname, 'client/src/types'),
        '@assets': resolve(__dirname, 'client/src/assets'),
        '@styles': resolve(__dirname, 'client/src/styles'),
        '@config': resolve(__dirname, 'client/src/config'),
        '@constants': resolve(__dirname, 'client/src/constants'),
        '@features': resolve(__dirname, 'client/src/features'),
        '@layouts': resolve(__dirname, 'client/src/layouts'),
        '@theme': resolve(__dirname, 'client/src/theme'),
        '/src': resolve(__dirname, 'client/src')
      }
    },
    
    // Server configuration
    server: {
      port: parseInt(env.PORT || '3000'),
      host: true, // Listen on all addresses
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: mode === 'production',
          ws: true // Enable WebSocket proxy
        }
      },
      // Development server headers
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    },
    
    // Build configuration
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      // Specify the entry point
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'client/index.html')
        },
        output: {
          manualChunks: (id) => {
            // Core vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui-vendor';
              }
              if (id.includes('mobx')) {
                return 'state-vendor';
              }
              if (id.includes('lightweight-charts') || id.includes('dayjs')) {
                return 'trading-vendor';
              }
              return 'vendor';
            }
            
            // Feature-based chunks
            if (id.includes('src/features')) {
              const feature = id.split('features/')[1].split('/')[0];
              return `feature-${feature}`;
            }
            
            // Page-based chunks
            if (id.includes('src/pages')) {
              const page = id.split('pages/')[1].split('/')[0];
              return `page-${page}`;
            }
          }
        }
      },
      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : []
        }
      },
      // CSS optimization
      cssCodeSplit: true,
      cssMinify: true,
      // Asset optimization
      assetsInlineLimit: 4096, // 4kb
      chunkSizeWarningLimit: 1000 // 1mb
    },
    
    // Optimization configuration
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'mobx',
        'mobx-react-lite',
        '@mui/material',
        '@emotion/react',
        '@emotion/styled',
        'lightweight-charts',
        'dayjs'
      ],
      exclude: ['@vite/client', '@vite/env']
    },
    
    // Preview configuration (for production builds)
    preview: {
      port: parseInt(env.PORT || '3000'),
      host: true
    },
    
    // Define environment variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    
    // Legacy browser support
    legacy: {
      targets: ['defaults', 'not IE 11'],
    },
  };
});
