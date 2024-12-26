import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  PORT: number;
  HOST: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGIN: string | string[];
  WS_ENABLED: boolean;
  WS_PATH: string;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  CACHE_TTL: number;
  SSL_ENABLED: boolean;
  SECURITY_HEADERS_ENABLED: boolean;
  HSTS_MAX_AGE: number;
  CSP_ENABLED: boolean;
  MARKET_DATA_API: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '8080'),
  HOST: process.env.HOST || '0.0.0.0',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/algo360fx',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  NODE_ENV: (process.env.NODE_ENV || 'development') as Config['NODE_ENV'],
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  WS_ENABLED: process.env.WS_ENABLED === 'true',
  WS_PATH: process.env.WS_PATH || '/ws',
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600'),
  SSL_ENABLED: process.env.SSL_ENABLED === 'true',
  SECURITY_HEADERS_ENABLED: process.env.SECURITY_HEADERS_ENABLED === 'true',
  HSTS_MAX_AGE: parseInt(process.env.HSTS_MAX_AGE || '31536000'),
  CSP_ENABLED: process.env.CSP_ENABLED === 'true',
  MARKET_DATA_API: process.env.MARKET_DATA_API || 'https://api.marketdata.com',
};
