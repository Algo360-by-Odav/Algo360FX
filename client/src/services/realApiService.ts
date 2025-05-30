import axios from 'axios';

// Configuration for the real API endpoints
const API_BASE_URL = 'http://localhost:8080';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service for real backend endpoints
const realApiService = {
  // Product related endpoints
  getProducts: async (type?: string) => {
    try {
      // Use marketplace endpoint since we don't have a product endpoint
      const response = await api.get('/marketplace');
      // Combine ebooks and courses into a single products array
      const products = [
        ...response.data.ebooks.map((ebook: any) => ({
          ...ebook,
          type: 'ebook'
        })),
        ...response.data.courses.map((course: any) => ({
          ...course,
          type: 'course'
        }))
      ];
      // Filter by type if provided
      return type ? products.filter((product: any) => product.type === type) : products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/product/featured/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const response = await api.get(`/product/search/${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  purchaseProduct: async (productId: string) => {
    try {
      const response = await api.post(`/product/${productId}/purchase`);
      return response.data;
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  },

  getUserPurchases: async () => {
    try {
      const response = await api.get('/product/purchases/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
    }
  },

  // Portfolio related endpoints - mock data since there's no portfolio endpoint
  getPortfolios: async () => {
    try {
      // Using trading strategies as a substitute for portfolios
      const response = await api.get('/tradingStrategies');
      // Transform to portfolio-like structure
      return response.data.map((strategy: any) => ({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        balance: Math.random() * 10000,
        pnl: Math.random() * 2000 - 1000,
        pnlPercentage: (Math.random() * 20 - 10).toFixed(2),
        positions: []
      }));
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string) => {
    try {
      const response = await api.get(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching portfolio ${id}:`, error);
      throw error;
    }
  },

  createPortfolio: async (data: any) => {
    try {
      const response = await api.post('/portfolio', data);
      return response.data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: any) => {
    try {
      const response = await api.put(`/portfolio/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating portfolio ${id}:`, error);
      throw error;
    }
  },

  deletePortfolio: async (id: string) => {
    try {
      const response = await api.delete(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting portfolio ${id}:`, error);
      throw error;
    }
  },

  getPositions: async (portfolioId: string) => {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/positions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching positions for portfolio ${portfolioId}:`, error);
      throw error;
    }
  },

  createPosition: async (portfolioId: string, data: any) => {
    try {
      const response = await api.post(`/portfolio/${portfolioId}/positions`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating position:', error);
      throw error;
    }
  },

  // Subscription related endpoints
  getSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptionPlans');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  getSubscription: async (id: string) => {
    try {
      const response = await api.get(`/subscription/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription ${id}:`, error);
      throw error;
    }
  },

  createSubscription: async (data: any) => {
    try {
      const response = await api.post('/subscription', data);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  cancelSubscription: async (id: string) => {
    try {
      const response = await api.put(`/subscription/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling subscription ${id}:`, error);
      throw error;
    }
  },

  checkSubscriptionStatus: async () => {
    try {
      const response = await api.get('/subscription/status/check');
      return response.data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  },

  // Market data endpoints
  getMarketData: async (type?: string) => {
    try {
      const response = await api.get('/marketData');
      if (type && response.data[type.toLowerCase()]) {
        return response.data[type.toLowerCase()];
      }
      // Flatten the market data structure
      let allData = [];
      for (const category in response.data) {
        if (Array.isArray(response.data[category])) {
          allData = [...allData, ...response.data[category].map((item: any) => ({
            ...item,
            category
          }))];
        }
      }
      return allData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  getMarketDataBySymbol: async (symbol: string) => {
    try {
      const response = await api.get(`/market-data/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  },
};

export default realApiService;
