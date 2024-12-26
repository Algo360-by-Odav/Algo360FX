import axios, { AxiosError } from 'axios';
import { config } from '../config/config';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Extract error message
    let errorMessage = 'An error occurred';
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      errorMessage = data.message || data.error || errorMessage;
    }

    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name;
    return Promise.reject(enhancedError);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  settings: {
    get: '/settings',
    update: '/settings',
  },
  trading: {
    orders: '/trading/orders',
    positions: '/trading/positions',
    history: '/trading/history',
  },
  market: {
    quotes: '/market/quotes',
    charts: '/market/charts',
    orderbook: '/market/orderbook',
  },
  analytics: {
    performance: '/analytics/performance',
    risk: '/analytics/risk',
    patterns: '/analytics/patterns',
    clusters: '/analytics/clusters',
    liquidity: '/analytics/liquidity',
  },
};

// API methods
export const apiService = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    api.post(endpoints.auth.login, credentials),
  register: (userData: { email: string; password: string; name: string }) =>
    api.post(endpoints.auth.register, userData),
  logout: () => api.post(endpoints.auth.logout),
  getProfile: () => api.get(endpoints.auth.profile),

  // Settings
  getSettings: () => api.get(endpoints.settings.get),
  updateSettings: (settings: any) => api.put(endpoints.settings.update, settings),

  // Trading
  getOrders: () => api.get(endpoints.trading.orders),
  getPositions: () => api.get(endpoints.trading.positions),
  getTradeHistory: () => api.get(endpoints.trading.history),

  // Market Data
  getQuotes: (symbols: string[]) => api.get(endpoints.market.quotes, { params: { symbols } }),
  getChartData: (symbol: string, timeframe: string) =>
    api.get(endpoints.market.charts, { params: { symbol, timeframe } }),
  getOrderBook: (symbol: string) =>
    api.get(endpoints.market.orderbook, { params: { symbol } }),

  // Analytics
  getPerformanceAnalytics: () => api.get(endpoints.analytics.performance),
  getRiskMetrics: () => api.get(endpoints.analytics.risk),
  getPatternAnalysis: () => api.get(endpoints.analytics.patterns),
  getClusterAnalysis: () => api.get(endpoints.analytics.clusters),
  getLiquidityAnalysis: () => api.get(endpoints.analytics.liquidity),
};

export { api };
