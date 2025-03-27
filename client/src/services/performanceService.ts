import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface PerformanceData {
  performance: {
    date: string;
    balance: number;
    drawdown: number;
  }[];
  trades: {
    openTime: string;
    closeTime: string;
    pair: string;
    type: 'BUY' | 'SELL';
    profit: string;
    volume: number;
  }[];
  tradeDistribution: {
    labels: string[];
    data: number[];
  };
}

export const performanceService = {
  async getPortfolioPerformance(portfolioId: string, timeframe: string): Promise<PerformanceData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/portfolios/${portfolioId}/performance`, {
        params: { timeframe },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
      throw error;
    }
  },

  async exportPerformanceData(portfolioId: string, timeframe: string): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/portfolios/${portfolioId}/performance/export`, {
        params: { timeframe },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting performance data:', error);
      throw error;
    }
  }
};
