import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  openaiApiKey: string;
  allowedOrigins: string[];
  corsEnabled: boolean;
  rateLimiting: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
  security: {
    bcryptRounds: number;
    csrfProtection: boolean;
    xssProtection: boolean;
    noSqlInjection: boolean;
    parameterPollution: boolean;
  };
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-jwt-refresh-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
  corsEnabled: process.env.CORS_ENABLED === 'true',
  rateLimiting: {
    enabled: process.env.RATE_LIMITING_ENABLED === 'true',
    windowMs: parseInt(process.env.RATE_LIMITING_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMITING_MAX || '100', 10),
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    csrfProtection: process.env.CSRF_PROTECTION === 'true',
    xssProtection: process.env.XSS_PROTECTION === 'true',
    noSqlInjection: process.env.NOSQL_INJECTION_PROTECTION === 'true',
    parameterPollution: process.env.PARAMETER_POLLUTION_PROTECTION === 'true',
  },
};
