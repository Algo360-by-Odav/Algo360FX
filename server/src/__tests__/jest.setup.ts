// This file is run before each test file
import '@testing-library/jest-dom';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../lib/prisma';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Extend timeout for all tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };

beforeAll(() => {
  global.console.warn = jest.fn();
  global.console.error = jest.fn();
  global.console.log = jest.fn();
});

afterAll(() => {
  global.console.warn = originalConsole.warn;
  global.console.error = originalConsole.error;
  global.console.log = originalConsole.log;
});

// Mock process.env
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
  DATABASE_URL: 'mock:connection:string',
  PORT: '4000',
  API_KEY: 'test-api-key',
};

// Mock Date
const mockDate = new Date('2025-01-03T13:21:20.000Z'); // Using the provided timestamp
const RealDate = Date;
class MockDate extends RealDate {
  constructor(date?: string | number | Date) {
    super();
    return date ? new RealDate(date) : mockDate;
  }

  static now() {
    return mockDate.getTime();
  }
}
global.Date = MockDate as DateConstructor;

// Mock crypto for password hashing
const mockCrypto = {
  randomBytes: (size: number) => Buffer.alloc(size),
  pbkdf2: (
    password: string,
    salt: Buffer,
    iterations: number,
    keylen: number,
    digest: string,
    callback: (err: Error | null, derivedKey: Buffer) => void
  ) => {
    callback(null, Buffer.from('mocked-hash'));
  },
};

jest.mock('crypto', () => mockCrypto);

// Mock axios
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
  },
}));

// Add custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
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
  toBeValidJWT(received: string) {
    const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    const pass = jwtRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },
});

// Declare custom matcher types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toBeValidJWT(): R;
    }
  }
}

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
