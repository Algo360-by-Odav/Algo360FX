import apiService from './apiService';

class MockDataService {
  private static instance: MockDataService;

  private constructor() {}

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * Get mock market data for development
   */
  public async getMarketData() {
    try {
      return await apiService.get('/mock/market-data');
    } catch (error) {
      console.error('Error fetching mock market data:', error);
      throw error;
    }
  }

  /**
   * Get mock trading strategies for development
   */
  public async getTradingStrategies() {
    try {
      return await apiService.get('/mock/trading-strategies');
    } catch (error) {
      console.error('Error fetching mock trading strategies:', error);
      throw error;
    }
  }

  /**
   * Get mock subscription plans for development
   */
  public async getSubscriptionPlans() {
    try {
      return await apiService.get('/mock/subscription-plans');
    } catch (error) {
      console.error('Error fetching mock subscription plans:', error);
      throw error;
    }
  }

  /**
   * Get marketplace items
   */
  public async getMarketplace() {
    try {
      return await apiService.get('/mock/marketplace');
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      throw error;
    }
  }
}

export default MockDataService.getInstance();
