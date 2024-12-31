import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  mongoUri?: string;  // Added for backward compatibility
  jwtSecret: string;
  env: string;
  metaApiToken: string;
  mt5AccountId: string;
  metaApiRetryAttempts: number;
  metaApiRetryDelay: number;
  redisUrl?: string;
  openaiApiKey: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000'),
  databaseUrl: process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
  env: process.env.NODE_ENV || 'development',
  metaApiToken: process.env.META_API_TOKEN || '',
  mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
  metaApiRetryAttempts: parseInt(process.env.META_API_RETRY_ATTEMPTS || '3'),
  metaApiRetryDelay: parseInt(process.env.META_API_RETRY_DELAY || '1000'),
  redisUrl: process.env.REDIS_URL,
  openaiApiKey: process.env.OPENAI_API_KEY || ''
};
