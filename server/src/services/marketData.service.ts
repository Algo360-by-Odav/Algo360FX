import axios from 'axios';
import { logger } from '../utils/logger';

export class MarketDataService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.MARKET_API_KEY || '';
  }

  async getMarketData(symbols: string[], timeframe: string) {
    try {
      const data = await Promise.all(
        symbols.map(symbol => this.fetchMarketData(symbol, timeframe))
      );
      
      return data.reduce((acc, curr) => {
        acc[curr.symbol] = curr.data;
        return acc;
      }, {});
    } catch (error) {
      logger.error('Error fetching market data:', error);
      throw error;
    }
  }

  private async fetchMarketData(symbol: string, timeframe: string) {
    try {
      const response = await axios.get(`https://api.marketdata.com/data/${symbol}/${timeframe}`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return {
        symbol,
        data: response.data
      };
    } catch (error) {
      logger.error(`Error fetching data for ${symbol}:`, error);
      throw error;
    }
  }
}
