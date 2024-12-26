import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string[];
  WS_ENABLED: boolean;
  WS_PATH: string;
  SSL_ENABLED: boolean;
  OPENAI_API_KEY?: string;
  META_API_TOKEN?: string;
  MT5_ACCOUNT_ID?: string;
  env: {
    MARKET_API?: string;
    NEWS_API_KEY?: string;
    MARKET_API_KEY?: string;
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Parse CORS_ORIGIN from environment variable
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : ['http://localhost:3000'];

export const config: Config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://localhost:5432/algo360fx',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  CORS_ORIGIN: corsOrigins,
  WS_ENABLED: process.env.WS_ENABLED === 'true',
  WS_PATH: process.env.WS_PATH || '/ws',
  SSL_ENABLED: process.env.SSL_ENABLED === 'true',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  META_API_TOKEN: process.env.META_API_TOKEN,
  MT5_ACCOUNT_ID: process.env.MT5_ACCOUNT_ID,
  env: {
    MARKET_API: process.env.MARKET_API,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    MARKET_API_KEY: process.env.MARKET_API_KEY
  }
};

export const isDevMode = isDevelopment;
export const isProdMode = isProduction;
