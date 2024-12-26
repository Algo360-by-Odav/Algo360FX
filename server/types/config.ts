export interface Config {
  port: number;
  mongoUri: string;
  env: 'development' | 'production' | 'test';
  logLevel: string;
  wsBaseUrl: string;
  apiBaseUrl: string;
  openaiApiKey?: string;
  corsOrigin: string | string[];
}
