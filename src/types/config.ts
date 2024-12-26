export interface Config {
  mongoUri: string;
  port: number;
  env: 'development' | 'production' | 'test';
  logLevel: string;
  wsBaseUrl: string;
  apiBaseUrl: string;
  openaiApiKey?: string;
}
