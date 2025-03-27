import apiService from './apiService';
import { Order, Position, Trade } from '../stores/tradingStore';

class TradingService {
  private static instance: TradingService;
  private baseUrl = '/trading';

  private constructor() {}

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  // Orders
  async getActiveOrders(): Promise<Order[]> {
    return apiService.get(`${this.baseUrl}/orders/active`);
  }

  async placeOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    return apiService.post(`${this.baseUrl}/orders`, orderData);
  }

  async cancelOrder(orderId: string): Promise<void> {
    return apiService.delete(`${this.baseUrl}/orders/${orderId}`);
  }

  // Positions
  async getPositions(): Promise<Position[]> {
    return apiService.get(`${this.baseUrl}/positions`);
  }

  async closePosition(symbol: string): Promise<void> {
    return apiService.post(`${this.baseUrl}/positions/${symbol}/close`);
  }

  // Trade History
  async getTradeHistory(params?: {
    startDate?: Date;
    endDate?: Date;
    symbol?: string;
    limit?: number;
  }): Promise<Trade[]> {
    return apiService.get(`${this.baseUrl}/trades`, { params });
  }

  // Market Data
  async getMarketData(symbol: string): Promise<{
    price: number;
    bid: number;
    ask: number;
    high: number;
    low: number;
    volume: number;
  }> {
    return apiService.get(`${this.baseUrl}/market-data/${symbol}`);
  }

  // Symbols
  async getAvailableSymbols(): Promise<{
    symbol: string;
    name: string;
    type: string;
    tradingHours: string;
  }[]> {
    return apiService.get(`${this.baseUrl}/symbols`);
  }

  // Order Book
  async getOrderBook(symbol: string, depth: number = 10): Promise<{
    bids: Array<[number, number]>;
    asks: Array<[number, number]>;
    timestamp: number;
  }> {
    return apiService.get(`${this.baseUrl}/order-book/${symbol}`, {
      params: { depth }
    });
  }
}

export default TradingService.getInstance();
