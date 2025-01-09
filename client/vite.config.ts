import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@mui/material': resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': resolve(__dirname, 'node_modules/@mui/icons-material'),
      'aws-amplify': resolve(__dirname, 'node_modules/aws-amplify')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      VITE_AWS_REGION: JSON.stringify(process.env.VITE_AWS_REGION),
      VITE_API_GATEWAY_URL: JSON.stringify(process.env.VITE_API_GATEWAY_URL),
      VITE_COGNITO_USER_POOL_ID: JSON.stringify(process.env.VITE_COGNITO_USER_POOL_ID),
      VITE_COGNITO_CLIENT_ID: JSON.stringify(process.env.VITE_COGNITO_CLIENT_ID),
      VITE_COGNITO_CLIENT_SECRET: JSON.stringify(process.env.VITE_COGNITO_CLIENT_SECRET)
    }
  },
  server: {
    port: 5173,
    host: true,
    fs: {
      strict: false,
      allow: ['..']
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'aws-amplify',
      'notistack'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
