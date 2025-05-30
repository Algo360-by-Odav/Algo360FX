import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_URL } from './index';

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Create Axios instances
const createAxiosInstance = (options: { withAuth?: boolean } = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token for private endpoints
      if (options.withAuth) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && options.withAuth) {
        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken && originalRequest) {
            const response = await axios.post(
              `${API_URL}/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // If refresh token fails, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }

      // Handle other errors
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      return Promise.reject({
        ...error,
        message: errorMessage,
        statusCode: error.response?.status
      });
    }
  );

  return instance;
};

// Public API instance (no auth required)
export const publicApi = createAxiosInstance();

// Private API instance (auth required)
export const privateApi = createAxiosInstance({ withAuth: true });

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    preferences: '/user/preferences'
  },
  trading: {
    accounts: '/trading/accounts',
    positions: '/trading/positions',
    orders: '/trading/orders',
    history: '/trading/history',
    statistics: '/trading/statistics'
  },
  market: {
    symbols: '/market/symbols',
    quotes: '/market/quotes',
    charts: '/market/charts',
    analysis: '/market/analysis'
  },
  strategy: {
    list: '/strategy',
    create: '/strategy',
    update: '/strategy/:id',
    delete: '/strategy/:id',
    backtest: '/strategy/:id/backtest',
    deploy: '/strategy/:id/deploy',
    performance: '/strategy/:id/performance'
  },
  portfolio: {
    summary: '/portfolio/summary',
    assets: '/portfolio/assets',
    performance: '/portfolio/performance',
    risk: '/portfolio/risk'
  },
  notifications: {
    list: '/notifications',
    markRead: '/notifications/:id/read',
    preferences: '/notifications/preferences'
  },
  documentation: {
    guides: '/docs/guides',
    api: '/docs/api',
    examples: '/docs/examples'
  }
};

// Helper function to replace URL parameters
export const replaceUrlParams = (url: string, params: Record<string, string | number>) => {
  let resultUrl = url;
  Object.entries(params).forEach(([key, value]) => {
    resultUrl = resultUrl.replace(`:${key}`, value.toString());
  });
  return resultUrl;
};

// API error handler
export const handleApiError = (error: any): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
      statusCode: error.response?.status
    };
  }
  return {
    message: error.message || 'An unexpected error occurred',
    statusCode: 500
  };
};

// Example usage:
/*
try {
  // Public endpoint
  const response = await publicApi.get(endpoints.market.symbols);
  
  // Private endpoint with URL params
  const strategyId = '123';
  const url = replaceUrlParams(endpoints.strategy.performance, { id: strategyId });
  const performance = await privateApi.get(url);
} catch (error) {
  const errorDetails = handleApiError(error);
  console.error(errorDetails);
}
*/
