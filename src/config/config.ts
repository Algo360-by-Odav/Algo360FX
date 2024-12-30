interface Config {
  apiBaseUrl: string;
  wsBaseUrl: string;
  env: string;
}

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:5000' : 'https://api.algo360fx.com');

export const config: Config = {
  apiBaseUrl: `${apiUrl}/api`,
  wsBaseUrl: isDevelopment ? 'ws://localhost:5000' : apiUrl.replace(/^http/, 'ws'),
  env: import.meta.env.MODE || 'development',
};
