import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  env: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  openai: {
    apiKey: string;
  };
  rateLimits: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  bcryptRounds: number;
  csrfProtection: boolean;
  xssProtection: boolean;
  noSqlInjectionProtection: boolean;
  parameterPollutionProtection: boolean;
  metaApiToken: string;
  mt5AccountId: string;
  metaApiRetryAttempts: number;
  metaApiRetryDelay: number;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '10000', 10),
  database: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  rateLimits: {
    windowMs: parseInt(process.env.RATE_LIMITING_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMITING_MAX || '100', 10)
  },
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    credentials: process.env.CORS_ENABLED === 'true'
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  csrfProtection: process.env.CSRF_PROTECTION === 'true',
  xssProtection: process.env.XSS_PROTECTION === 'true',
  noSqlInjectionProtection: process.env.NOSQL_INJECTION_PROTECTION === 'true',
  parameterPollutionProtection: process.env.PARAMETER_POLLUTION_PROTECTION === 'true',
  metaApiToken: process.env.MT5_API_TOKEN || '',
  mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
  metaApiRetryAttempts: parseInt(process.env.META_API_RETRY_ATTEMPTS || '3', 10),
  metaApiRetryDelay: parseInt(process.env.META_API_RETRY_DELAY || '1000', 10)
};
