import axios from 'axios';
import { API_URL } from '../config';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
  timestamp: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  openPrice: number;
  currentPrice: number;
  size: number;
  profit: number;
  timestamp: string;
}

export interface MarketAlert {
  id: string;
  symbol: string;
  type: string;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
}

export interface AccountSummary {
  balance: number;
  equity: number;
  openPnL: number;
  usedMargin: number;
  freeMargin: number;
  marginLevel: number;
  dailyPnL: number;
  weeklyPnL: number;
}

class MarketService {
  private mockData = true; // Set to false when real API is ready

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    if (this.mockData) {
      return symbols.map(symbol => ({
        symbol,
        price: 1.2000 + Math.random() * 0.0100,
        change: (Math.random() * 2 - 1) * 5,
        volume: Math.floor(Math.random() * 1000000000),
        high: 1.2100,
        low: 1.1900,
        timestamp: new Date().toISOString()
      }));
    }

    const response = await axios.get(`${API_URL}/market/prices`, {
      params: { symbols: symbols.join(',') }
    });
    return response.data;
  }

  async getOpenPositions(): Promise<Position[]> {
    if (this.mockData) {
      return [
        {
          id: '1',
          symbol: 'EUR/USD',
          type: 'BUY',
          openPrice: 1.1950,
          currentPrice: 1.2000,
          size: 1.0,
          profit: 500,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          symbol: 'GBP/USD',
          type: 'SELL',
          openPrice: 1.3800,
          currentPrice: 1.3750,
          size: 0.5,
          profit: 250,
          timestamp: new Date().toISOString()
        }
      ];
    }

    const response = await axios.get(`${API_URL}/trading/positions`);
    return response.data;
  }

  async getMarketAlerts(): Promise<MarketAlert[]> {
    if (this.mockData) {
      return [
        {
          id: '1',
          symbol: 'EUR/USD',
          type: 'PRICE_ALERT',
          message: 'EUR/USD approaching key resistance level at 1.2050',
          priority: 'HIGH',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          symbol: 'GBP/USD',
          type: 'TECHNICAL',
          message: 'RSI indicating oversold conditions',
          priority: 'MEDIUM',
          timestamp: new Date().toISOString()
        }
      ];
    }

    const response = await axios.get(`${API_URL}/market/alerts`);
    return response.data;
  }

  async getAccountSummary(): Promise<AccountSummary> {
    if (this.mockData) {
      return {
        balance: 50000,
        equity: 52500,
        openPnL: 2500,
        usedMargin: 5000,
        freeMargin: 45000,
        marginLevel: 900,
        dailyPnL: 1200,
        weeklyPnL: 3500
      };
    }

    const response = await axios.get(`${API_URL}/account/summary`);
    return response.data;
  }

  async placeOrder(order: any): Promise<any> {
    if (this.mockData) {
      return {
        id: Math.random().toString(36).substring(7),
        status: 'FILLED',
        ...order
      };
    }

    const response = await axios.post(`${API_URL}/trading/order`, order);
    return response.data;
  }

  async getHistoricalData(symbol: string, timeframe: string, limit: number = 100): Promise<any[]> {
    if (this.mockData) {
      const data = [];
      let basePrice = 1.2000;
      let time = new Date();
      time.setHours(time.getHours() - limit);

      for (let i = 0; i < limit; i++) {
        const volatility = 0.0002;
        const open = basePrice + (Math.random() - 0.5) * volatility;
        const high = open + Math.random() * volatility;
        const low = open - Math.random() * volatility;
        const close = low + Math.random() * (high - low);
        const volume = Math.floor(Math.random() * 1000000);

        data.push({
          time: time.toISOString(),
          open,
          high,
          low,
          close,
          volume
        });

        basePrice = close;
        const timeIncrement = timeframe === '1m' ? 60000
          : timeframe === '5m' ? 300000
          : timeframe === '15m' ? 900000
          : timeframe === '1h' ? 3600000
          : timeframe === '4h' ? 14400000
          : 86400000; // 1d
        time = new Date(time.getTime() + timeIncrement);
      }

      return data;
    }

    const response = await axios.get(`${API_URL}/market/history`, {
      params: { symbol, timeframe, limit }
    });
    return response.data;
  }
}

export const marketService = new MarketService();
