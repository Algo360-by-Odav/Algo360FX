import dotenv from 'dotenv';
import { cleanEnv, str, num, bool, url, email, json } from 'envalid';
dotenv.config();

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
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES_IN: str({ default: '15m' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  JWT_ALGORITHM: str({ default: 'HS256' }),

  // MT5 Configuration
  MT5_WS_PORT: num({ default: 6780 }),
  MT5_ACCOUNT_ID: str(),
  META_API_TOKEN: str(),
  META_API_URL: url({ default: 'https://mt-manager-api.metaapi.cloud/v1' }),

  // Market Data API
  MARKET_API_KEY: str(),
  MARKET_API_URL: url({ default: 'https://finnhub.io/api/v1' }),
  MARKET_API_TIMEOUT: num({ default: 5000 }),
  MARKET_DATA_CACHE_TTL: num({ default: 300 }),

  // WebSocket Settings
  WS_PORT: num({ default: 3002 }),
  WS_HEARTBEAT_INTERVAL: num({ default: 30000 }),
  WS_RECONNECT_DELAY: num({ default: 5000 }),
  WS_MAX_CONNECTIONS: num({ default: 1000 }),

  // OpenAI Configuration
  OPENAI_API_KEY: str(),
  OPENAI_MODEL: str({ default: 'gpt-4' }),
  OPENAI_MAX_TOKENS: num({ default: 2000 }),
  OPENAI_TEMPERATURE: num({ default: 0.7 }),
  OPENAI_TIMEOUT: num({ default: 30000 }),

  // AI Model Settings
  AI_CONFIDENCE_THRESHOLD: num({ default: 0.7 }),
  AI_UPDATE_INTERVAL: num({ default: 300000 }),
  AI_MAX_RETRIES: num({ default: 3 }),
  AI_BATCH_SIZE: num({ default: 50 }),

  // Rate Limiting
  RATE_LIMIT_WINDOW: num({ default: 900000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  RATE_LIMIT_MESSAGE: str({ default: 'Too many requests from this IP, please try again later' }),
  RATE_LIMIT_STORE: str({ default: 'redis' }),

  // Redis Configuration
  REDIS_URL: url({ default: 'redis://localhost:6379' }),
  REDIS_PASSWORD: str(),
  REDIS_DB: num({ default: 0 }),
  REDIS_PREFIX: str({ default: 'algo360fx:' }),

  // CORS Configuration
  ALLOWED_ORIGINS: str({
    default: 'http://localhost:3000'
  }),
  CORS_METHODS: str({ default: 'GET,POST,PUT,DELETE,OPTIONS' }),
  CORS_HEADERS: str({ default: 'Content-Type,Authorization,X-Requested-With' }),
  CORS_CREDENTIALS: bool({ default: true }),

  // Security
  ENABLE_SECURITY_HEADERS: bool({ default: true }),
  ENABLE_DETAILED_LOGGING: bool({ default: true }),
  LOG_LEVEL: str({ default: 'debug' }),
  BCRYPT_SALT_ROUNDS: num({ default: 12 }),
  SESSION_SECRET: str(),
  COOKIE_SECRET: str(),

  // Monitoring and Analytics
  SENTRY_DSN: str({ default: '' }),
  NEW_RELIC_LICENSE_KEY: str({ default: '' }),
  ENABLE_PERFORMANCE_MONITORING: bool({ default: true }),
  ENABLE_ERROR_TRACKING: bool({ default: true }),

  // Email Configuration
  SMTP_HOST: str({ default: 'smtp.gmail.com' }),
  SMTP_PORT: num({ default: 587 }),
  SMTP_USER: email(),
  SMTP_PASS: str(),
  SMTP_FROM: str({ default: 'Algo360FX <noreply@algo360fx.com>' }),

  // Backup Configuration
  BACKUP_ENABLED: bool({ default: true }),
  BACKUP_FREQUENCY: num({ default: 86400 }),
  BACKUP_RETENTION_DAYS: num({ default: 30 }),
  BACKUP_S3_BUCKET: str(),

  // Feature Flags
  ENABLE_REAL_TIME_UPDATES: bool({ default: true }),
  ENABLE_AI_PREDICTIONS: bool({ default: true }),
  ENABLE_SOCIAL_TRADING: bool({ default: false }),
  ENABLE_DEMO_MODE: bool({ default: false }),
});

export interface Config {
  server: {
    env: string;
    port: number;
    host: string;
  };
  database: {
    url: string;
    ssl: boolean;
    maxConnections: number;
    idleTimeout: number;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
    algorithm: string;
  };
  mt5: {
    wsPort: number;
    accountId: string;
    apiToken: string;
    apiUrl: string;
  };
  marketData: {
    apiKey: string;
    apiUrl: string;
    timeout: number;
    cacheTtl: number;
  };
  websocket: {
    port: number;
    heartbeatInterval: number;
    reconnectDelay: number;
    maxConnections: number;
  };
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
    timeout: number;
  };
  ai: {
    confidenceThreshold: number;
    updateInterval: number;
    maxRetries: number;
    batchSize: number;
  };
  rateLimiting: {
    window: number;
    max: number;
    message: string;
    store: string;
  };
  redis: {
    url: string;
    password: string;
    db: number;
    prefix: string;
  };
  cors: {
    origins: string[];
    methods: string;
    headers: string;
    credentials: boolean;
  };
  security: {
    enableHeaders: boolean;
    enableDetailedLogging: boolean;
    logLevel: string;
    bcryptSaltRounds: number;
    sessionSecret: string;
    cookieSecret: string;
  };
  monitoring: {
    sentryDsn: string;
    newRelicKey: string;
    enablePerformance: boolean;
    enableErrorTracking: boolean;
  };
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  backup: {
    enabled: boolean;
    frequency: number;
    retentionDays: number;
    s3Bucket: string;
  };
  features: {
    enableRealTimeUpdates: boolean;
    enableAiPredictions: boolean;
    enableSocialTrading: boolean;
    enableDemoMode: boolean;
  };
}

export const config: Config = {
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
  },
  database: {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL,
    maxConnections: env.DATABASE_MAX_CONNECTIONS,
    idleTimeout: env.DATABASE_IDLE_TIMEOUT,
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    algorithm: env.JWT_ALGORITHM,
  },
  mt5: {
    wsPort: env.MT5_WS_PORT,
    accountId: env.MT5_ACCOUNT_ID,
    apiToken: env.META_API_TOKEN,
    apiUrl: env.META_API_URL,
  },
  marketData: {
    apiKey: env.MARKET_API_KEY,
    apiUrl: env.MARKET_API_URL,
    timeout: env.MARKET_API_TIMEOUT,
    cacheTtl: env.MARKET_DATA_CACHE_TTL,
  },
  websocket: {
    port: env.WS_PORT,
    heartbeatInterval: env.WS_HEARTBEAT_INTERVAL,
    reconnectDelay: env.WS_RECONNECT_DELAY,
    maxConnections: env.WS_MAX_CONNECTIONS,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    maxTokens: env.OPENAI_MAX_TOKENS,
    temperature: env.OPENAI_TEMPERATURE,
    timeout: env.OPENAI_TIMEOUT,
  },
  ai: {
    confidenceThreshold: env.AI_CONFIDENCE_THRESHOLD,
    updateInterval: env.AI_UPDATE_INTERVAL,
    maxRetries: env.AI_MAX_RETRIES,
    batchSize: env.AI_BATCH_SIZE,
  },
  rateLimiting: {
    window: env.RATE_LIMIT_WINDOW,
    max: env.RATE_LIMIT_MAX,
    message: env.RATE_LIMIT_MESSAGE,
    store: env.RATE_LIMIT_STORE,
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    prefix: env.REDIS_PREFIX,
  },
  cors: {
    origins: [env.ALLOWED_ORIGINS],
    methods: env.CORS_METHODS,
    headers: env.CORS_HEADERS,
    credentials: env.CORS_CREDENTIALS,
  },
  security: {
    enableHeaders: env.ENABLE_SECURITY_HEADERS,
    enableDetailedLogging: env.ENABLE_DETAILED_LOGGING,
    logLevel: env.LOG_LEVEL,
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
    sessionSecret: env.SESSION_SECRET,
    cookieSecret: env.COOKIE_SECRET,
  },
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    newRelicKey: env.NEW_RELIC_LICENSE_KEY,
    enablePerformance: env.ENABLE_PERFORMANCE_MONITORING,
    enableErrorTracking: env.ENABLE_ERROR_TRACKING,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
  },
  backup: {
    enabled: env.BACKUP_ENABLED,
    frequency: env.BACKUP_FREQUENCY,
    retentionDays: env.BACKUP_RETENTION_DAYS,
    s3Bucket: env.BACKUP_S3_BUCKET,
  },
  features: {
    enableRealTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
    enableAiPredictions: env.ENABLE_AI_PREDICTIONS,
    enableSocialTrading: env.ENABLE_SOCIAL_TRADING,
    enableDemoMode: env.ENABLE_DEMO_MODE,
  },
};
