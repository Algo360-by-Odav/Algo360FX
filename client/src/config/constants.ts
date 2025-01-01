// API Base URL based on environment
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'wss://algo360fx-server.onrender.com'  // Use WSS for production
  : 'ws://localhost:5000';                 // Use WS for development

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  path: '/ws',
  transports: ['websocket'] as string[],
  secure: process.env.NODE_ENV === 'production',
  rejectUnauthorized: process.env.NODE_ENV === 'production',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: true,
  forceNew: true
};

// Other constants
export const DEFAULT_TIMEOUT = 10000; // 10 seconds
export const MAX_RECONNECT_ATTEMPTS = 5;
export const INITIAL_RECONNECT_DELAY = 1000; // 1 second
