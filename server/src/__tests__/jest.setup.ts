// This file is run before each test file
import '@testing-library/jest-dom';

// Extend timeout for all tests
jest.setTimeout(30000); // MongoDB memory server can take a while to start up

// Mock console.warn to avoid noise in tests
global.console.warn = jest.fn();
