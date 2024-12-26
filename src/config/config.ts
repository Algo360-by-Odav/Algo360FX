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

export const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://algo360fx-frontend.onrender.com',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://algo360fx-frontend.onrender.com',
  wsPath: import.meta.env.VITE_WS_PATH || '/ws',
  appName: import.meta.env.VITE_APP_NAME || 'Algo360FX',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENV || 'production',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
};
