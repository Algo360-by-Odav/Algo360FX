export interface Config {
  mongoUri: string;
  port: number;
  env: 'development' | 'production' | 'test';
  logLevel: string;
  // Add other configuration properties as needed
}
