export const WEBSOCKET_CONFIG = {
  ENDPOINTS: {
    MARKET_DATA: '/ws/market-data',
    TRADING: '/ws/trading',
    NOTIFICATIONS: '/ws/notifications',
    MT5_BRIDGE_URL: process.env.REACT_APP_MT5_BRIDGE_URL || 'ws://localhost:5000',
    CONNECT: '/ws/connect',
    DISCONNECT: '/ws/disconnect',
    ERROR: '/ws/error'
  },
  CONFIG: {
    URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000,
    PING_INTERVAL: 30000
  },
  EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    MESSAGE: 'message'
  }
};
