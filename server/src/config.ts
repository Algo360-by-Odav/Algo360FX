import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

// Load environment variables
dotenv.config();

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'OPENAI_API_KEY',
  'NEWS_API_KEY',
  'MARKET_API_KEY',
  'MT5_WS_PORT',
  'REDIS_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configuration interface
export interface Config {
  env: 'development' | 'production' | 'test';
  server: {
    port: number;
    host: string;
    corsOrigin: string | string[];
    rateLimitWindow: number;
    rateLimitMax: number;
  };
  database: {
    url: string;
    maxConnections: number;
    timeout: number;
  };
  redis: {
    url: string;
    maxRetries: number;
    retryDelay: number;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  websocket: {
    mt5Port: number;
    pingInterval: number;
    pongTimeout: number;
  };
  trading: {
    defaultLeverage: number;
    maxLeverage: number;
    minVolume: number;
    maxVolume: number;
    spreadMultiplier: number;
    defaultSymbols: string[];
    defaultTimeframes: string[];
  };
  ai: {
    openaiApiKey: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
    cacheExpiration: number;
  };
  market: {
    newsApiKey: string;
    marketApiKey: string;
    updateInterval: number;
    maxHistoricalDays: number;
    cacheExpiration: number;
  };
  security: {
    bcryptRounds: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    sessionTimeout: number;
  };
  logging: {
    level: string;
    format: string;
    directory: string;
    maxFiles: number;
    maxSize: string;
  };
  cache: {
    defaultTTL: number;
    checkPeriod: number;
    maxItems: number;
  };
}

// Configuration object
const config: Config = {
  env: (process.env.NODE_ENV as Config['env']) || 'development',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    corsOrigin: process.env.CORS_ORIGIN || 'https://algo360fx-client.onrender.com',
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100,
  },
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: 10,
    timeout: 30000,
  },
  redis: {
    url: process.env.REDIS_URL!,
    maxRetries: 3,
    retryDelay: 1000,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiration: '15m',
    refreshExpiration: '7d',
  },
  websocket: {
    mt5Port: parseInt(process.env.MT5_WS_PORT || '8080', 10),
    pingInterval: 30000,
    pongTimeout: 5000,
  },
  trading: {
    defaultLeverage: 100,
    maxLeverage: 500,
    minVolume: 0.01,
    maxVolume: 100,
    spreadMultiplier: 1.2,
    defaultSymbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'],
    defaultTimeframes: ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'],
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY!,
    defaultModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    cacheExpiration: 24 * 60 * 60, // 24 hours
  },
  market: {
    newsApiKey: process.env.NEWS_API_KEY!,
    marketApiKey: process.env.MARKET_API_KEY!,
    updateInterval: 5 * 60 * 1000, // 5 minutes
    maxHistoricalDays: 365,
    cacheExpiration: 60 * 60, // 1 hour
  },
  security: {
    bcryptRounds: 10,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    directory: 'logs',
    maxFiles: 10,
    maxSize: '10m',
  },
  cache: {
    defaultTTL: 60 * 60, // 1 hour
    checkPeriod: 60, // 1 minute
    maxItems: 1000,
  },
};

// Singleton instances
export const prisma = new PrismaClient({
  log: config.env === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: config.redis.maxRetries,
  retryStrategy: (times: number) => {
    if (times > config.redis.maxRetries) {
      return null;
    }
    return config.redis.retryDelay;
  },
});

// Event handlers
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

// Cleanup function
async function cleanup() {
  await prisma.$disconnect();
  await redis.quit();
}

export default config;
