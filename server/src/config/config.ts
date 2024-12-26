import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  env: string;
  metaApiToken: string;
  mt5AccountId: string;
  metaApiRetryAttempts: number;
  metaApiRetryDelay: number;
  redisUrl?: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000'),
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/algo360fx',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
  env: process.env.NODE_ENV || 'development',
  metaApiToken: process.env.META_API_TOKEN || '',
  mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
  metaApiRetryAttempts: 3,
  metaApiRetryDelay: 1000,
  redisUrl: process.env.REDIS_URL
};
