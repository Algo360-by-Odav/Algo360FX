export const WEBSOCKET_CONFIG = {
  ENDPOINTS: {
    MARKET_DATA: '/ws/market-data',
    TRADING: '/ws/trading',
    NOTIFICATIONS: '/ws/notifications',
    MT5_BRIDGE_URL: import.meta.env.VITE_MT5_BRIDGE_URL || 'ws://localhost:5000',
    CONNECT: '/ws/connect',
    DISCONNECT: '/ws/disconnect',
    ERROR: '/ws/error'
  },
  CONFIG: {
    URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',  // Using ws:// for local development
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000,
    PING_INTERVAL: 30000,
    SECURE: import.meta.env.MODE === 'production'  // Use wss:// only in production
  },
  EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    MESSAGE: 'message',
    MARKET_DATA: 'market_data',
    ORDER_UPDATE: 'order_update',
    POSITION_UPDATE: 'position_update',
    ACCOUNT_UPDATE: 'account_update'
  }
};
