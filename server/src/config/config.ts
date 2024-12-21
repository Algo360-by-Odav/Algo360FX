import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number | string;
  mongoUri: string;
  jwtSecret: string;
  env: string;
  metaApiToken: string;
  mt5AccountId: string;
  metaApiRetryAttempts: number;
  metaApiRetryDelay: number;
}

export const config: Config = {
  port: process.env.PORT || 3004,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
  env: process.env.NODE_ENV || 'development',
  metaApiToken: process.env.META_API_TOKEN || '',
  mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
  metaApiRetryAttempts: 3,
  metaApiRetryDelay: 1000, // 1 second
};
