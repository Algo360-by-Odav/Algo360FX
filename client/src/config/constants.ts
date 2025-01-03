// API Base URL based on environment
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://algo360fx-server.onrender.com'  // Use HTTPS for production
  : 'http://localhost:5000';                 // Use HTTP for development

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  path: '/ws',
  transports: ['websocket', 'polling'],
  secure: process.env.NODE_ENV === 'production',
  rejectUnauthorized: process.env.NODE_ENV === 'production',
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  forceNew: true,
  extraHeaders: {
    'Access-Control-Allow-Credentials': 'true'
  }
};

// Other constants
export const DEFAULT_TIMEOUT = 20000; // 20 seconds
export const MAX_RECONNECT_ATTEMPTS = 10;
export const INITIAL_RECONNECT_DELAY = 1000; // 1 second
