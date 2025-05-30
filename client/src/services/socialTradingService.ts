import { apiService } from './api';
import { Trade } from '../stores/tradingStore';

export interface Trader {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    winRate: number;
    avgProfit: number;
    avgLoss: number;
    sharpeRatio: number;
  };
  statistics: {
    followers: number;
    following: number;
    totalTrades: number;
    successfulTrades: number;
  };
  badges: string[];
  ranking: number;
  verified: boolean;
}

export interface Signal {
  id: string;
  traderId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  analysis: string;
  confidence: number;
  timestamp: Date;
  status: 'active' | 'closed' | 'cancelled';
  result?: {
    profit: number;
    pips: number;
    closed: Date;
  };
}

export interface CopySettings {
  traderId: string;
  allocation: number;
  maxRiskPerTrade: number;
  instruments: string[];
  excludedInstruments: string[];
  copyStopLoss: boolean;
  copyTakeProfit: boolean;
  maxDailyLoss: number;
  maxWeeklyLoss: number;
}

class SocialTradingService {
  private static instance: SocialTradingService;
  private readonly baseUrl = '/social-trading';

  private constructor() {}

  public static getInstance(): SocialTradingService {
    if (!SocialTradingService.instance) {
      SocialTradingService.instance = new SocialTradingService();
    }
    return SocialTradingService.instance;
  }

  // Trader Management
  async getTopTraders(filters?: {
    timeframe?: string;
    market?: string;
    minTrades?: number;
  }): Promise<Trader[]> {
    try {
      return await apiService.get(`${this.baseUrl}/traders`, { params: filters });
    } catch (error) {
      console.error('Failed to fetch top traders:', error);
      throw error;
    }
  }

  async getTraderProfile(traderId: string): Promise<Trader> {
    try {
      return await apiService.get(`${this.baseUrl}/traders/${traderId}`);
    } catch (error) {
      console.error('Failed to fetch trader profile:', error);
      throw error;
    }
  }

  async getTraderTrades(traderId: string): Promise<Trade[]> {
    try {
      return await apiService.get(`${this.baseUrl}/traders/${traderId}/trades`);
    } catch (error) {
      console.error('Failed to fetch trader trades:', error);
      throw error;
    }
  }

  // Copy Trading
  async startCopyTrading(settings: CopySettings): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/copy/start`, settings);
    } catch (error) {
      console.error('Failed to start copy trading:', error);
      throw error;
    }
  }

  async stopCopyTrading(traderId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/copy/stop`, { traderId });
    } catch (error) {
      console.error('Failed to stop copy trading:', error);
      throw error;
    }
  }

  async updateCopySettings(settings: CopySettings): Promise<{ success: boolean }> {
    try {
      return await apiService.put(`${this.baseUrl}/copy/settings`, settings);
    } catch (error) {
      console.error('Failed to update copy settings:', error);
      throw error;
    }
  }

  // Signals
  async getSignals(filters?: {
    symbol?: string;
    type?: 'buy' | 'sell';
    status?: 'active' | 'closed' | 'cancelled';
  }): Promise<Signal[]> {
    try {
      return await apiService.get(`${this.baseUrl}/signals`, { params: filters });
    } catch (error) {
      console.error('Failed to fetch signals:', error);
      throw error;
    }
  }

  async subscribeToTrader(traderId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/subscribe`, { traderId });
    } catch (error) {
      console.error('Failed to subscribe to trader:', error);
      throw error;
    }
  }

  async unsubscribeFromTrader(traderId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/unsubscribe`, { traderId });
    } catch (error) {
      console.error('Failed to unsubscribe from trader:', error);
      throw error;
    }
  }

  // Leaderboard
  async getLeaderboard(timeframe: string = 'monthly'): Promise<Trader[]> {
    try {
      return await apiService.get(`${this.baseUrl}/leaderboard`, { params: { timeframe } });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  // Analytics
  async getTraderAnalytics(traderId: string): Promise<{
    profitDistribution: any;
    instrumentBreakdown: any;
    timeAnalysis: any;
    riskMetrics: any;
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/analytics/${traderId}`);
    } catch (error) {
      console.error('Failed to fetch trader analytics:', error);
      throw error;
    }
  }
}

export const socialTradingService = SocialTradingService.getInstance();
