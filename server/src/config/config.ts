import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  host: string;
  mongoUri: string;
  redisUrl: string;
  jwtSecret: string;
  env: 'development' | 'production' | 'test';
  corsOrigin: string | string[];
  wsEnabled: boolean;
  wsPath: string;
  rateLimitWindow: number;
  rateLimitMaxRequests: number;
  cacheTtl: number;
  sslEnabled: boolean;
  securityHeadersEnabled: boolean;
  hstsMaxAge: number;
  cspEnabled: boolean;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8080'),
  host: process.env.HOST || '0.0.0.0',
  mongoUri: process.env.DATABASE_URL || 'mongodb://localhost:27017/algo360fx',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  env: (process.env.NODE_ENV || 'development') as Config['env'],
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  wsEnabled: process.env.WS_ENABLED === 'true',
  wsPath: process.env.WS_PATH || '/ws',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600'),
  sslEnabled: process.env.SSL_ENABLED === 'true',
  securityHeadersEnabled: process.env.SECURITY_HEADERS_ENABLED === 'true',
  hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE || '31536000'),
  cspEnabled: process.env.CSP_ENABLED === 'true',
};
