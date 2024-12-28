import WebSocket from 'ws';

// Mock WebSocket methods that are not available in the test environment
jest.mock('ws', () => {
  const mockWebSocket = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    terminate: jest.fn(),
    emit: jest.fn()
  }));

  Object.defineProperty(mockWebSocket, 'Server', {
    value: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn()
    })),
    writable: true
  });

  return mockWebSocket;
});
