interface Config {
  apiUrl: string;
  wsUrl: string;
  wsPath: string;
  appName: string;
  appVersion: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Default production URLs for Render deployment
const defaultProductionApiUrl = 'https://algo360fx-server.onrender.com';
const defaultProductionWsUrl = 'wss://algo360fx-server.onrender.com';
const defaultWsPath = '/ws';

export const config: Config = {
  apiUrl: isLocalhost 
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_API_URL || defaultProductionApiUrl),
  wsUrl: isLocalhost
    ? 'ws://localhost:5000'
    : (import.meta.env.VITE_WS_URL || defaultProductionWsUrl),
  wsPath: import.meta.env.VITE_WS_PATH || defaultWsPath,
  appName: import.meta.env.VITE_APP_NAME || 'Algo360FX',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.MODE || 'production',
  isProduction: import.meta.env.MODE === 'production',
  isDevelopment: import.meta.env.MODE === 'development' || isLocalhost,
};
