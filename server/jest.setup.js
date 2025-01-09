const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/algo360fx_test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.NEWS_API_KEY = 'test-news-key';
process.env.MARKET_API_KEY = 'test-market-key';
process.env.MT5_WS_PORT = '8081';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Create Prisma client singleton
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
});

// Create Redis client singleton
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
});

// Mock WebSocket
class MockWebSocket {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event](data);
    }
  }

  close() {}
}

// Helper functions
const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('test-password', 10);
  return prisma.user.create({
    data: {
      email: 'test@algo360fx.com',
      password: hashedPassword,
      username: 'testuser',
      role: 'USER',
      emailVerified: true,
      settings: {
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            trade: true,
            signal: true,
            news: true,
          },
          trading: {
            defaultLeverage: 100,
            defaultRiskPerTrade: 1,
            defaultTimeframe: 'H1',
            favoriteSymbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
            defaultStopLoss: 50,
            defaultTakeProfit: 100,
          },
          display: {
            defaultChartType: 'candlestick',
            showVolume: true,
            showIndicators: true,
            indicatorSettings: {},
          },
          analysis: {
            defaultPeriod: 'D1',
            favoriteIndicators: ['RSI', 'MACD', 'MA'],
            customIndicators: [],
          },
        },
      },
    },
  });
};

const generateTestToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Global test setup
beforeAll(async () => {
  // Clear database
  const tablenames = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      } catch (error) {
        console.log(`Error truncating ${tablename}:`, error);
      }
    }
  }

  // Clear Redis
  await redis.flushdb();

  // Create test data
  global.testUser = await createTestUser();
  global.testToken = generateTestToken(global.testUser.id);

  // Add global mocks
  global.WebSocket = MockWebSocket;
  global.fetch = jest.fn();
  global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };
});

// Global test teardown
afterAll(async () => {
  await prisma.$disconnect();
  await redis.quit();
  jest.clearAllMocks();
});

// Make test utilities available globally
global.prisma = prisma;
global.redis = redis;
global.createTestUser = createTestUser;
global.generateTestToken = generateTestToken;

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
});

// Add test timeouts
jest.setTimeout(10000);

// Add global error handler
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection in tests:', error);
});
