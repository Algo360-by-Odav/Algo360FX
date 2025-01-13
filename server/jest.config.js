/** @type {import('jest').Config} */
const config = {
  // Basic configuration
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  
  // TypeScript configuration
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    }],
  },

  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Test matching
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],

  // Setup files
  setupFiles: ['<rootDir>/src/test/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupAfterEnv.ts'],

  // Global configuration
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.json',
    },
  },

  // Mock configuration
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // Environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  // Prisma specific configuration
  transformIgnorePatterns: [
    'node_modules/(?!(tslib|@prisma/client)/)',
  ],

  // Custom resolver
  resolver: '<rootDir>/src/test/resolver.js',

  // Test timeouts
  testTimeout: 10000,

  // Parallel execution
  maxWorkers: '50%',

  // Error handling
  bail: 1,
  errorOnDeprecated: true,

  // Snapshot configuration
  snapshotSerializers: [
    'jest-serializer-path',
  ],

  // Watch configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'jest-junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
};

module.exports = config;
