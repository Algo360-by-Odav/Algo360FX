/// <reference types="vite/client" />

// Application Constants
export const APP_CONFIG = {
  NAME: 'Algo360FX',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional Algorithmic Trading Platform',
  COMPANY: 'Algo360FX Technologies',
  SUPPORT_EMAIL: 'support@algo360fx.com',
  WEBSITE: 'https://algo360fx.com'
} as const;

// Authentication Constants
export const AUTH_CONFIG = {
  REGION: import.meta.env.VITE_AWS_REGION,
  USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  OAUTH: {
    DOMAIN: `${import.meta.env.VITE_COGNITO_USER_POOL_ID}.auth.${import.meta.env.VITE_AWS_REGION}.amazoncognito.com`,
    REDIRECT_SIGN_IN: import.meta.env.VITE_ENV === 'production' 
      ? 'https://algo360fx.cloudfront.net/callback'
      : 'http://localhost:5173/callback',
    REDIRECT_SIGN_OUT: import.meta.env.VITE_ENV === 'production'
      ? 'https://algo360fx.cloudfront.net'
      : 'http://localhost:5173',
    RESPONSE_TYPE: 'code',
    SCOPE: ['email', 'openid', 'phone']
  },
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY: 3600, // 1 hour in seconds
  REFRESH_TOKEN_EXPIRY: 2592000, // 30 days in seconds
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900, // 15 minutes in seconds
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  },
  STORAGE_KEYS: {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user'
  }
} as const;

// Trading Constants
export const TRADING_CONFIG = {
  MARKETS: {
    FOREX: 'forex',
    CRYPTO: 'crypto',
    STOCKS: 'stocks',
    COMMODITIES: 'commodities',
    INDICES: 'indices'
  },
  INSTRUMENTS: {
    FOREX: {
      MAJOR_PAIRS: {
        'EUR/USD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'GBP/USD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'USD/JPY': { pip: 0.01, minLot: 0.01, maxLot: 100, leverage: 30 },
        'USD/CHF': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'AUD/USD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'USD/CAD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'NZD/USD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 }
      },
      MINOR_PAIRS: {
        'EUR/GBP': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'EUR/JPY': { pip: 0.01, minLot: 0.01, maxLot: 100, leverage: 30 },
        'GBP/JPY': { pip: 0.01, minLot: 0.01, maxLot: 100, leverage: 30 },
        'CHF/JPY': { pip: 0.01, minLot: 0.01, maxLot: 100, leverage: 30 },
        'EUR/CHF': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'GBP/CHF': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 },
        'EUR/AUD': { pip: 0.0001, minLot: 0.01, maxLot: 100, leverage: 30 }
      },
      EXOTIC_PAIRS: {
        'USD/SGD': { pip: 0.0001, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/THB': { pip: 0.01, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/MYR': { pip: 0.0001, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/IDR': { pip: 1, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/CNH': { pip: 0.0001, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/INR': { pip: 0.01, minLot: 0.01, maxLot: 50, leverage: 20 },
        'EUR/TRY': { pip: 0.0001, minLot: 0.01, maxLot: 50, leverage: 20 },
        'USD/ZAR': { pip: 0.0001, minLot: 0.01, maxLot: 50, leverage: 20 }
      }
    },
    CRYPTO: {
      MAJOR: {
        'BTC/USD': { decimals: 2, minQty: 0.001, maxQty: 10, leverage: 10 },
        'ETH/USD': { decimals: 2, minQty: 0.01, maxQty: 100, leverage: 10 },
        'BNB/USD': { decimals: 2, minQty: 0.01, maxQty: 100, leverage: 10 },
        'SOL/USD': { decimals: 2, minQty: 0.1, maxQty: 1000, leverage: 10 },
        'ADA/USD': { decimals: 4, minQty: 1, maxQty: 10000, leverage: 10 },
        'XRP/USD': { decimals: 4, minQty: 1, maxQty: 10000, leverage: 10 }
      },
      DEFI: {
        'AAVE/USD': { decimals: 2, minQty: 0.01, maxQty: 100, leverage: 5 },
        'MKR/USD': { decimals: 2, minQty: 0.001, maxQty: 10, leverage: 5 },
        'COMP/USD': { decimals: 2, minQty: 0.01, maxQty: 100, leverage: 5 },
        'UNI/USD': { decimals: 3, minQty: 0.1, maxQty: 1000, leverage: 5 },
        'SUSHI/USD': { decimals: 3, minQty: 0.1, maxQty: 1000, leverage: 5 },
        'CAKE/USD': { decimals: 3, minQty: 0.1, maxQty: 1000, leverage: 5 }
      },
      CROSS_PAIRS: {
        'ETH/BTC': { decimals: 6, minQty: 0.01, maxQty: 100, leverage: 5 },
        'BNB/BTC': { decimals: 6, minLot: 0.01, maxLot: 100, leverage: 5 },
        'SOL/BTC': { decimals: 8, minQty: 0.1, maxQty: 1000, leverage: 5 },
        'ADA/ETH': { decimals: 8, minQty: 1, maxQty: 10000, leverage: 5 },
        'DOT/BTC': { decimals: 8, minQty: 0.1, maxQty: 1000, leverage: 5 }
      }
    },
    STOCKS: {
      MALAYSIA: {
        'MAYBANK': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 },
        'PBBANK': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 },
        'CIMB': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 },
        'TENAGA': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 },
        'PETRONAS': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 },
        'TOPGLOVE': { decimals: 2, minQty: 100, maxQty: 100000, leverage: 5 }
      },
      EMERGING_MARKETS: {
        // China ADRs
        'BABA': { decimals: 2, minQty: 1, maxQty: 1000, leverage: 5 },
        'NIO': { decimals: 2, minQty: 1, maxQty: 2000, leverage: 5 },
        'BIDU': { decimals: 2, minQty: 1, maxQty: 1000, leverage: 5 },
        // India ADRs
        'INFY': { decimals: 2, minQty: 1, maxQty: 2000, leverage: 5 },
        'WIT': { decimals: 2, minQty: 1, maxQty: 2000, leverage: 5 },
        // Brazil ADRs
        'VALE': { decimals: 2, minQty: 1, maxQty: 2000, leverage: 5 },
        'ITUB': { decimals: 2, minQty: 1, maxQty: 2000, leverage: 5 }
      }
    },
    COMMODITIES: {
      FUTURES: {
        'GOLD': { decimals: 2, minQty: 0.1, maxQty: 100, leverage: 20 },
        'SILVER': { decimals: 3, minQty: 1, maxQty: 1000, leverage: 20 },
        'CRUDE_OIL': { decimals: 2, minQty: 1, maxQty: 1000, leverage: 20 },
        'BRENT_OIL': { decimals: 2, minQty: 1, maxQty: 1000, leverage: 20 },
        'NATURAL_GAS': { decimals: 3, minQty: 1, maxQty: 1000, leverage: 20 },
        'COPPER': { decimals: 3, minQty: 1, maxQty: 1000, leverage: 20 },
        'PLATINUM': { decimals: 2, minQty: 0.1, maxQty: 100, leverage: 20 },
        'PALLADIUM': { decimals: 2, minQty: 0.1, maxQty: 100, leverage: 20 }
      },
      OPTIONS: {
        'GOLD_OPTIONS': { decimals: 2, minQty: 1, maxQty: 10, leverage: 10 },
        'SILVER_OPTIONS': { decimals: 3, minQty: 1, maxQty: 10, leverage: 10 },
        'OIL_OPTIONS': { decimals: 2, minQty: 1, maxQty: 10, leverage: 10 },
        'COPPER_OPTIONS': { decimals: 3, minQty: 1, maxQty: 10, leverage: 10 }
      }
    },
    INDICES: {
      MAJOR: {
        'SPX500': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'NASDAQ': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'DJ30': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 }
      },
      ASIA_PACIFIC: {
        'NIKKEI225': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'HSI': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'ASX200': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'KOSPI': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'NIFTY50': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 }
      },
      EUROPEAN: {
        'DAX': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'CAC40': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 },
        'FTSE100': { decimals: 2, minQty: 1, maxQty: 100, leverage: 20 }
      }
    }
  },
  ORDER_TYPES: {
    MARKET: 'market',
    LIMIT: 'limit',
    STOP: 'stop',
    STOP_LIMIT: 'stop_limit',
    TRAILING_STOP: 'trailing_stop'
  },
  POSITION_TYPES: {
    LONG: 'long',
    SHORT: 'short'
  },
  TIME_IN_FORCE: {
    GTC: 'good_till_cancelled',
    IOC: 'immediate_or_cancel',
    FOK: 'fill_or_kill',
    GTD: 'good_till_date'
  },
  MAX_ORDERS: 100,
  MAX_POSITIONS: 50,
  MAX_PENDING_ORDERS: 50,
  DEFAULT_STOP_LOSS_PIPS: 50,
  DEFAULT_TAKE_PROFIT_PIPS: 100
} as const;

// Chart Constants
export const CHART_CONFIG = {
  TIMEFRAMES: {
    M1: '1m',
    M5: '5m',
    M15: '15m',
    M30: '30m',
    H1: '1h',
    H4: '4h',
    D1: '1d',
    W1: '1w',
    MN1: '1M'
  },
  INDICATORS: {
    MOVING_AVERAGES: {
      SMA: 'Simple Moving Average',
      EMA: 'Exponential Moving Average',
      WMA: 'Weighted Moving Average',
      VWAP: 'Volume Weighted Average Price'
    },
    OSCILLATORS: {
      RSI: 'Relative Strength Index',
      MACD: 'Moving Average Convergence Divergence',
      STOCH: 'Stochastic Oscillator',
      CCI: 'Commodity Channel Index'
    },
    VOLATILITY: {
      BB: 'Bollinger Bands',
      ATR: 'Average True Range',
      KC: 'Keltner Channel'
    },
    VOLUME: {
      OBV: 'On Balance Volume',
      MFI: 'Money Flow Index',
      CMF: 'Chaikin Money Flow'
    }
  },
  STYLES: {
    CANDLESTICK: 'candlestick',
    LINE: 'line',
    BAR: 'bar',
    AREA: 'area',
    HEIKIN_ASHI: 'heikin-ashi',
    RENKO: 'renko'
  }
} as const;

// Risk Management Constants
export const RISK_CONFIG = {
  MAX_POSITION_SIZE: {
    FOREX: 10.0,
    CRYPTO: 5.0,
    STOCKS: 20.0,
    COMMODITIES: 5.0
  },
  MAX_LEVERAGE: {
    FOREX: 30,
    CRYPTO: 10,
    STOCKS: 5,
    COMMODITIES: 20
  },
  RISK_LEVELS: {
    LOW: { maxDrawdown: 0.05, maxLeverage: 5 },
    MEDIUM: { maxDrawdown: 0.10, maxLeverage: 10 },
    HIGH: { maxDrawdown: 0.20, maxLeverage: 20 },
    AGGRESSIVE: { maxDrawdown: 0.30, maxLeverage: 30 }
  },
  MAX_DRAWDOWN: 0.25,
  MARGIN_CALL_LEVEL: 0.8,
  STOP_OUT_LEVEL: 0.5,
  POSITION_SIZING: {
    FIXED: 'fixed',
    RISK_PERCENT: 'risk_percent',
    POSITION_PERCENT: 'position_percent',
    KELLY_CRITERION: 'kelly_criterion'
  }
} as const;

// UI Constants
export const UI_CONFIG = {
  THEME: {
    DEFAULT: 'light',
    LIGHT: {
      PRIMARY: '#2196F3',
      PRIMARY_LIGHT: '#64B5F6',
      PRIMARY_DARK: '#1976D2',
      SECONDARY: '#FF4081',
      SECONDARY_LIGHT: '#FF80AB',
      SECONDARY_DARK: '#F50057',
      BACKGROUND: '#F5F5F5',
      PAPER: '#FFFFFF',
      TEXT_PRIMARY: 'rgba(0, 0, 0, 0.87)',
      TEXT_SECONDARY: 'rgba(0, 0, 0, 0.54)',
      DIVIDER: 'rgba(0, 0, 0, 0.12)'
    },
    DARK: {
      PRIMARY: '#90CAF9',
      PRIMARY_LIGHT: '#E3F2FD',
      PRIMARY_DARK: '#42A5F5',
      SECONDARY: '#FF80AB',
      SECONDARY_LIGHT: '#FFE0E9',
      SECONDARY_DARK: '#FF4081',
      BACKGROUND: '#303030',
      PAPER: '#424242',
      TEXT_PRIMARY: '#FFFFFF',
      TEXT_SECONDARY: 'rgba(255, 255, 255, 0.7)',
      DIVIDER: 'rgba(255, 255, 255, 0.12)'
    }
  },
  SNACKBAR: {
    MAX_SNACKS: 3,
    AUTO_HIDE_DURATION: 3000,
    ANCHOR_ORIGIN: {
      vertical: 'top',
      horizontal: 'right'
    },
    POSITION: {
      TOP: 24,
      RIGHT: 24
    }
  },
  ENDPOINTS: {
    MARKET_DATA: '/ws/market-data',
    TRADING: '/ws/trading',
    NOTIFICATIONS: '/ws/notifications',
    MT5_BRIDGE: '/api/mt5/bridge',
    CONNECT: '/ws/connect',
    DISCONNECT: '/ws/disconnect',
    ERROR: '/ws/error'
  }
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 5000,
  PING_INTERVAL: 30000,
  ENDPOINTS: {
    MARKET_DATA: '/ws/market-data',
    TRADING: '/ws/trading',
    NOTIFICATIONS: '/ws/notifications',
    MT5_BRIDGE_URL: import.meta.env.VITE_MT5_BRIDGE_URL,
    CONNECT: '/ws/connect',
    DISCONNECT: '/ws/disconnect',
    ERROR: '/ws/error'
  },
  EVENTS: {
    MARKET_DATA: 'MARKET_DATA',
    ORDER_UPDATE: 'ORDER_UPDATE',
    POSITION_UPDATE: 'POSITION_UPDATE',
    ACCOUNT_UPDATE: 'ACCOUNT_UPDATE',
    ERROR: 'ERROR'
  },
  URL: import.meta.env.VITE_WEBSOCKET_URL || 'wss://api.algo360fx.com/ws'
} as const;

// API and WebSocket Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  WEBSOCKET: WEBSOCKET_CONFIG
} as const;

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    TRADE: 'trade'
  },
  PRIORITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  DISPLAY_DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  },
  MAX_NOTIFICATIONS: 5,
  SOUND_ENABLED: true
} as const;

// Export individual constants for backward compatibility
export const UI = UI_CONFIG;
export const AUTH = AUTH_CONFIG;
export const WEBSOCKET = WEBSOCKET_CONFIG;
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const MAX_RECONNECT_ATTEMPTS = WEBSOCKET_CONFIG.RECONNECT_ATTEMPTS;
export const INITIAL_RECONNECT_DELAY = WEBSOCKET_CONFIG.RECONNECT_DELAY;
export const DEFAULT_TIMEOUT = WEBSOCKET_CONFIG.PING_INTERVAL;
export const SOCKET_CONFIG = WEBSOCKET_CONFIG;

// Export all constants as a single object
export const Constants = {
  APP: APP_CONFIG,
  AUTH: AUTH_CONFIG,
  TRADING: TRADING_CONFIG,
  CHART: CHART_CONFIG,
  RISK: RISK_CONFIG,
  API: API_CONFIG,
  UI: UI_CONFIG,
  NOTIFICATION: NOTIFICATION_CONFIG
} as const;

export const APP_NAME = 'Algo360FX';

export const API_ROUTES = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/sign-out',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  PORTFOLIO: {
    BASE: '/portfolios',
    GET_ALL: '/portfolios',
    GET_ONE: (id: string) => `/portfolios/${id}`,
    CREATE: '/portfolios',
    UPDATE: (id: string) => `/portfolios/${id}`,
    DELETE: (id: string) => `/portfolios/${id}`,
  },
  STRATEGY: {
    BASE: '/strategies',
    GET_ALL: '/strategies',
    GET_ONE: (id: string) => `/strategies/${id}`,
    CREATE: '/strategies',
    UPDATE: (id: string) => `/strategies/${id}`,
    DELETE: (id: string) => `/strategies/${id}`,
    ACTIVATE: (id: string) => `/strategies/${id}/activate`,
    DEACTIVATE: (id: string) => `/strategies/${id}/deactivate`,
  },
  POSITION: {
    BASE: '/positions',
    GET_ALL: '/positions',
    GET_ONE: (id: string) => `/positions/${id}`,
    CREATE: '/positions',
    UPDATE: (id: string) => `/positions/${id}`,
    DELETE: (id: string) => `/positions/${id}`,
  },
};

export const TRADING_PAIRS = {
  CRYPTO: {
    BTC_USD: 'BTC/USD',
    ETH_USD: 'ETH/USD',
    BNB_USD: 'BNB/USD',
    SOL_USD: 'SOL/USD',
    ADA_USD: 'ADA/USD',
    DOT_USD: 'DOT/USD',
  },
  FOREX: {
    EUR_USD: 'EUR/USD',
    GBP_USD: 'GBP/USD',
    USD_JPY: 'USD/JPY',
    USD_CHF: 'USD/CHF',
    AUD_USD: 'AUD/USD',
    NZD_USD: 'NZD/USD',
  },
};

export const POSITION_TYPES = {
  LONG: 'LONG',
  SHORT: 'SHORT',
} as const;

export const POSITION_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PENDING: 'PENDING',
} as const;

export const STRATEGY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
} as const;
