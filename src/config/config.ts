interface Config {
  apiBaseUrl: string;
  wsBaseUrl: string;
  env: string;
}

const isDevelopment = import.meta.env.MODE === 'development';

export const config: Config = {
  apiBaseUrl: isDevelopment ? 'http://localhost:5000/api' : '/api',
  wsBaseUrl: isDevelopment ? 'ws://localhost:5000' : window.location.origin.replace(/^http/, 'ws'),
  env: import.meta.env.MODE || 'development',
};
