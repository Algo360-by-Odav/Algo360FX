import axios, { AxiosError } from 'axios';
import { config } from '../config/config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
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
      window.location.href = '/auth/login';
    }

    // Extract error message
    let errorMessage = 'An error occurred';
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      errorMessage = data.message || data.error || errorMessage;
    } else if (error.response?.data && typeof error.response.data === 'string') {
      errorMessage = error.response.data;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name;
    return Promise.reject(enhancedError);
  }
);

// API endpoints interface
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

// API methods
export const apiService = {
  // Auth
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData: RegisterData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw error;
    }
    localStorage.removeItem('token');
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Settings
  async getSettings() {
    try {
      const response = await api.get('/user/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSettings(settings: any) {
    try {
      const response = await api.put('/user/settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Trading
  async getOrders() {
    try {
      const response = await api.get('/market/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPositions() {
    try {
      const response = await api.get('/market/positions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTradeHistory() {
    try {
      const response = await api.get('/market/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Market Data
  async getQuotes(symbols: string[]) {
    try {
      const response = await api.get('/market/quotes', { params: { symbols } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getChartData(symbol: string, timeframe: string) {
    try {
      const response = await api.get('/market/chart', { params: { symbol, timeframe } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderBook(symbol: string) {
    try {
      const response = await api.get('/market/orderbook', { params: { symbol } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Analytics
  async getPerformanceAnalytics() {
    try {
      const response = await api.get('/analytics/performance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getRiskMetrics() {
    try {
      const response = await api.get('/analytics/risk');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPatternAnalysis() {
    try {
      const response = await api.get('/analytics/patterns');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getClusterAnalysis() {
    try {
      const response = await api.get('/analytics/clusters');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getLiquidityAnalysis() {
    try {
      const response = await api.get('/analytics/liquidity');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { api };
