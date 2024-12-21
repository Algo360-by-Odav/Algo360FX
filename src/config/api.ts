export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  WS_URL: process.env.VITE_WS_URL || 'http://localhost:5000',
  MT5_WS_URL: process.env.VITE_MT5_WS_URL || 'ws://localhost:6777',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/user/profile',
      PREFERENCES: '/user/preferences',
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      PREFERENCES: '/notifications/preferences',
      MARK_READ: '/notifications/mark-read',
    },
    TRADING: {
      ORDERS: '/trading/orders',
      POSITIONS: '/trading/positions',
      HISTORY: '/trading/history',
    },
  },
};
