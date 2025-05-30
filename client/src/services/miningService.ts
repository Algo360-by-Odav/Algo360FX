import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface MiningStats {
  activeMiners: number;
  totalHashrate: number;
  dailyEarnings: number;
  powerCost: number;
}

export interface TradingStats {
  totalTrades: number;
  profitLoss: number;
  pendingSwaps: number;
}

export interface MarketPrediction {
  btcPrice: {
    current: number;
    predicted: number;
  };
  optimalCoins: string[];
  confidence: number;
}

class MiningService {
  private readonly baseUrl = `${API_BASE_URL}/mining`;

  // Mining Operations
  async getMiningStats(): Promise<MiningStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.warn('Using mock mining stats due to backend unavailability');
      // Return mock data for development
      return {
        activeMiners: 12,
        totalHashrate: 345.6,
        dailyEarnings: 0.0023,
        powerCost: 0.0008
      };
    }
  }

  async updateMiningConfig(config: {
    algorithm: string;
    powerLimit: number;
    poolUrl: string;
  }): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/config`, config);
    } catch (error) {
      console.warn('Mock: Mining config updated (backend unavailable)', config);
      // Just log the config in development mode
    }
  }

  // Auto-Trading
  async getTradingStats(): Promise<TradingStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/trading/stats`);
      return response.data;
    } catch (error) {
      console.warn('Using mock trading stats due to backend unavailability');
      // Return mock data for development
      return {
        totalTrades: 287,
        profitLoss: 1250.75,
        pendingSwaps: 3
      };
    }
  }

  async updateTradingSettings(settings: {
    enabled: boolean;
    strategy: string;
    threshold: number;
  }): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/trading/settings`, settings);
    } catch (error) {
      console.warn('Mock: Trading settings updated (backend unavailable)', settings);
      // Just log the settings in development mode
    }
  }

  // AI Optimization
  async getMarketPredictions(): Promise<MarketPrediction> {
    try {
      const response = await axios.get(`${this.baseUrl}/ai/predictions`);
      return response.data;
    } catch (error) {
      console.warn('Using mock market predictions due to backend unavailability');
      // Return mock data for development
      return {
        btcPrice: {
          current: 42850.75,
          predicted: 43500.25
        },
        optimalCoins: ['ETH', 'SOL', 'ADA', 'DOT'],
        confidence: 0.87
      };
    }
  }

  async getOptimizationRecommendations(): Promise<{
    algorithm: string;
    powerLimit: number;
    impact: 'high' | 'medium' | 'low';
  }[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/ai/recommendations`);
      return response.data;
    } catch (error) {
      console.warn('Using mock optimization recommendations due to backend unavailability');
      // Return mock data for development
      return [
        { algorithm: 'Ethash', powerLimit: 180, impact: 'high' },
        { algorithm: 'Kawpow', powerLimit: 150, impact: 'medium' },
        { algorithm: 'Autolykos', powerLimit: 200, impact: 'low' }
      ];
    }
  }

  // External Market Data Integration
  async fetchExternalMarketData(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/market/data`, {
        params: {
          sources: ['binance', 'nicehash', 'whattomine']
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Using mock external market data due to backend unavailability');
      // Return mock data for development
      return {
        binance: {
          btc: { price: 42850.75, volume: 12450.32 },
          eth: { price: 2350.25, volume: 45670.89 }
        },
        nicehash: {
          algorithms: {
            ethash: { price: 0.00245, profitability: 'high' },
            kawpow: { price: 0.00178, profitability: 'medium' }
          }
        },
        whattomine: {
          coins: [
            { name: 'Ethereum', algorithm: 'Ethash', profitability: 100 },
            { name: 'Ravencoin', algorithm: 'Kawpow', profitability: 85 }
          ]
        }
      };
    }
  }
}

export const miningService = new MiningService();
export default miningService;
