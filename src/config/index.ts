// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

// Authentication
export const AUTH_TOKEN_KEY = 'algo360fx_auth_token';
export const REFRESH_TOKEN_KEY = 'algo360fx_refresh_token';

// Trading
export const DEFAULT_TIMEFRAMES = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
];

export const CHART_TYPES = [
  { value: 'candlestick', label: 'Candlestick' },
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
];

// Market Data
export const MARKET_UPDATE_INTERVAL = 1000; // 1 second
export const PRICE_PRECISION = 5;
export const VOLUME_PRECISION = 2;

// Notifications
export const MAX_NOTIFICATIONS = 100;
export const NOTIFICATION_TYPES = {
  TRADE: 'trade',
  DEPOSIT: 'deposit',
  EVENT: 'event',
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
};

// Portfolio
export const MAX_ACTIVE_TRADES = 50;
export const DEFAULT_LEVERAGE = 1;
export const MAX_LEVERAGE = 100;

// Risk Management
export const MAX_RISK_PER_TRADE = 5; // percentage
export const DEFAULT_STOP_LOSS = 2; // percentage
export const DEFAULT_TAKE_PROFIT = 4; // percentage

// UI
export const SIDEBAR_WIDTH = 280;
export const TOPBAR_HEIGHT = 64;
export const MOBILE_BREAKPOINT = 'md';

// Date Format
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

// Cache
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHE_SIZE = 1000;
