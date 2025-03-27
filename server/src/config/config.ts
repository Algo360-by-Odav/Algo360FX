import dotenv from 'dotenv';
import { cleanEnv, str, num, bool, url } from 'envalid';
dotenv.config();

interface RedisConfig {
  url: string;
  password: string;
  db: number;
  prefix: string;
}

// Validate environment variables
const env = cleanEnv(process.env, {
  // Server Configuration
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: num({ default: 3001 }),
  HOST: str({ default: 'localhost' }),

  // Database Configuration
  DATABASE_URL: url(),
  DATABASE_SSL: bool({ default: false }),
  DATABASE_MAX_CONNECTIONS: num({ default: 10 }),
  DATABASE_IDLE_TIMEOUT: num({ default: 10000 }),

  // JWT Authentication
  JWT_SECRET: str({ default: 'dev_jwt_secret' }),
  JWT_REFRESH_SECRET: str({ default: 'dev_refresh_secret' }),
  JWT_ACCESS_EXPIRES_IN: str({ default: '15m' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  JWT_ALGORITHM: str({ default: 'HS256' }),

  // Redis Configuration (optional in development)
  REDIS_URL: str({ default: '' }),
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_DB: num({ default: 0 }),
  REDIS_PREFIX: str({ default: 'algo360fx:' }),

  // CORS Configuration
  ALLOWED_ORIGINS: str({ default: 'http://localhost:3000' }),
  CORS_METHODS: str({ default: 'GET,POST,PUT,DELETE,OPTIONS' }),
  CORS_HEADERS: str({ default: 'Content-Type,Authorization,X-Requested-With' }),
  CORS_CREDENTIALS: bool({ default: true }),

  // Security
  ENABLE_SECURITY_HEADERS: bool({ default: true }),
  ENABLE_DETAILED_LOGGING: bool({ default: true }),
  LOG_LEVEL: str({ default: 'debug' }),
  BCRYPT_SALT_ROUNDS: num({ default: 12 }),
  SESSION_SECRET: str({ default: 'dev_session_secret' }),
  COOKIE_SECRET: str({ default: 'dev_cookie_secret' }),

  // Market Data APIs
  MARKET_DATA_API: url({ default: 'https://api.marketdata.com/v1' }),
  MARKET_API_KEY: str({ default: '' }),
  NEWS_API_URL: url({ default: 'https://api.newsdata.com/v1' }),
  NEWS_API_KEY: str({ default: '' }),

  // OpenAI Integration
  OPENAI_API_KEY: str({ default: '' }),

  // MT5 Configuration (optional in development)
  MT5_WS_PORT: env.NODE_ENV === 'development' ? num({ default: 6780, dev: true }) : num(),
  MT5_ACCOUNT_ID: env.NODE_ENV === 'development' ? str({ default: '' }) : str(),
  META_API_TOKEN: env.NODE_ENV === 'development' ? str({ default: '' }) : str(),

  // Email Configuration (optional in development)
  SMTP_HOST: env.NODE_ENV === 'development' ? str({ default: 'smtp.gmail.com' }) : str(),
  SMTP_PORT: env.NODE_ENV === 'development' ? num({ default: 587 }) : num(),
  SMTP_USER: env.NODE_ENV === 'development' ? str({ default: '' }) : str(),
  SMTP_PASS: env.NODE_ENV === 'development' ? str({ default: '' }) : str(),
  SMTP_FROM: env.NODE_ENV === 'development' ? str({ default: 'Algo360FX <noreply@algo360fx.com>' }) : str(),

  // Backup Configuration (optional in development)
  BACKUP_S3_BUCKET: env.NODE_ENV === 'development' ? str({ default: '' }) : str(),
  BACKUP_ENABLED: env.NODE_ENV === 'development' ? bool({ default: false }) : bool(),
  BACKUP_FREQUENCY: env.NODE_ENV === 'development' ? num({ default: 86400 }) : num(),
  BACKUP_RETENTION_DAYS: env.NODE_ENV === 'development' ? num({ default: 30 }) : num(),
});

// Export validated environment variables
export const config = {
  server: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST
  },
  database: {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL,
    maxConnections: env.DATABASE_MAX_CONNECTIONS,
    idleTimeout: env.DATABASE_IDLE_TIMEOUT
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    algorithm: env.JWT_ALGORITHM
  },
  redis: env.NODE_ENV === 'development' && !env.REDIS_URL ? null : {
    url: env.REDIS_URL || 'redis://localhost:6379',
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    prefix: env.REDIS_PREFIX
  } as RedisConfig | null,
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS.split(','),
    methods: env.CORS_METHODS,
    headers: env.CORS_HEADERS,
    credentials: env.CORS_CREDENTIALS
  },
  security: {
    enableSecurityHeaders: env.ENABLE_SECURITY_HEADERS,
    enableDetailedLogging: env.ENABLE_DETAILED_LOGGING,
    logLevel: env.LOG_LEVEL,
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
    sessionSecret: env.SESSION_SECRET,
    cookieSecret: env.COOKIE_SECRET,
  },
  marketData: {
    apiUrl: env.MARKET_DATA_API,
    apiKey: env.MARKET_API_KEY,
    newsApiUrl: env.NEWS_API_URL,
    newsApiKey: env.NEWS_API_KEY
  },
  openai: {
    apiKey: env.OPENAI_API_KEY
  },
  mt5: env.NODE_ENV === 'development' ? null : {
    wsPort: env.MT5_WS_PORT,
    accountId: env.MT5_ACCOUNT_ID,
    apiToken: env.META_API_TOKEN
  },
  email: env.NODE_ENV === 'development' ? null : {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM
  },
  backup: env.NODE_ENV === 'development' ? null : {
    enabled: env.BACKUP_ENABLED,
    frequency: env.BACKUP_FREQUENCY,
    retentionDays: env.BACKUP_RETENTION_DAYS,
    s3Bucket: env.BACKUP_S3_BUCKET
  }
} as const;

// Export type for the config
export type Config = typeof config;
