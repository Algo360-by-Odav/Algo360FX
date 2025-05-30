import { apiService } from './api';

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  type: 'trend' | 'scalping' | 'mean-reversion' | 'arbitrage';
  status: 'active' | 'paused' | 'stopped';
  settings: {
    symbols: string[];
    timeframe: string;
    riskPerTrade: number;
    maxDrawdown: number;
    maxPositions: number;
    strategy: any;
  };
  performance: {
    totalReturn: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    trades: number;
  };
}

export interface Alert {
  id: string;
  name: string;
  symbol: string;
  type: 'price' | 'technical' | 'news' | 'volume' | 'custom';
  conditions: {
    indicator?: string;
    operator: string;
    value: number | string;
    timeframe?: string;
  }[];
  actions: {
    type: 'notification' | 'email' | 'webhook' | 'trade';
    settings: any;
  }[];
  status: 'active' | 'triggered' | 'disabled';
}

export interface BacktestResult {
  strategy: {
    name: string;
    settings: any;
  };
  performance: {
    netProfit: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    recoveryFactor: number;
  };
  trades: {
    total: number;
    winning: number;
    losing: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
  };
  equity: {
    date: string;
    value: number;
    drawdown: number;
  }[];
}

class TradingToolsService {
  private static instance: TradingToolsService;
  private readonly baseUrl = '/trading-tools';

  private constructor() {}

  public static getInstance(): TradingToolsService {
    if (!TradingToolsService.instance) {
      TradingToolsService.instance = new TradingToolsService();
    }
    return TradingToolsService.instance;
  }

  // Trading Bots
  async getBots(): Promise<TradingBot[]> {
    try {
      return await apiService.get(`${this.baseUrl}/bots`);
    } catch (error) {
      console.error('Failed to fetch bots:', error);
      throw error;
    }
  }

  async createBot(bot: Omit<TradingBot, 'id' | 'performance'>): Promise<TradingBot> {
    try {
      return await apiService.post(`${this.baseUrl}/bots`, bot);
    } catch (error) {
      console.error('Failed to create bot:', error);
      throw error;
    }
  }

  async updateBot(botId: string, settings: Partial<TradingBot>): Promise<TradingBot> {
    try {
      return await apiService.put(`${this.baseUrl}/bots/${botId}`, settings);
    } catch (error) {
      console.error('Failed to update bot:', error);
      throw error;
    }
  }

  async startBot(botId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/bots/${botId}/start`);
    } catch (error) {
      console.error('Failed to start bot:', error);
      throw error;
    }
  }

  async stopBot(botId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/bots/${botId}/stop`);
    } catch (error) {
      console.error('Failed to stop bot:', error);
      throw error;
    }
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      return await apiService.get(`${this.baseUrl}/alerts`);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw error;
    }
  }

  async createAlert(alert: Omit<Alert, 'id' | 'status'>): Promise<Alert> {
    try {
      return await apiService.post(`${this.baseUrl}/alerts`, alert);
    } catch (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }
  }

  async updateAlert(alertId: string, settings: Partial<Alert>): Promise<Alert> {
    try {
      return await apiService.put(`${this.baseUrl}/alerts/${alertId}`, settings);
    } catch (error) {
      console.error('Failed to update alert:', error);
      throw error;
    }
  }

  async deleteAlert(alertId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.delete(`${this.baseUrl}/alerts/${alertId}`);
    } catch (error) {
      console.error('Failed to delete alert:', error);
      throw error;
    }
  }

  // Portfolio Optimizer
  async optimizePortfolio(request: {
    assets: string[];
    constraints: {
      risk?: number;
      return?: number;
      weights?: { min?: number; max?: number };
    };
  }): Promise<{
    weights: { [asset: string]: number };
    metrics: {
      expectedReturn: number;
      risk: number;
      sharpeRatio: number;
    };
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/portfolio/optimize`, request);
    } catch (error) {
      console.error('Failed to optimize portfolio:', error);
      throw error;
    }
  }

  // Backtesting
  async runBacktest(request: {
    strategy: {
      name: string;
      settings: any;
    };
    symbols: string[];
    timeframe: string;
    startDate: string;
    endDate: string;
    initialCapital: number;
  }): Promise<BacktestResult> {
    try {
      return await apiService.post(`${this.baseUrl}/backtest`, request);
    } catch (error) {
      console.error('Failed to run backtest:', error);
      throw error;
    }
  }

  // Paper Trading
  async createPaperAccount(settings: {
    balance: number;
    currency: string;
    leverage?: number;
  }): Promise<{
    accountId: string;
    balance: number;
    currency: string;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/paper/create`, settings);
    } catch (error) {
      console.error('Failed to create paper trading account:', error);
      throw error;
    }
  }

  async getPaperTrades(accountId: string): Promise<any[]> {
    try {
      return await apiService.get(`${this.baseUrl}/paper/${accountId}/trades`);
    } catch (error) {
      console.error('Failed to fetch paper trades:', error);
      throw error;
    }
  }

  async executePaperTrade(accountId: string, trade: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price?: number;
  }): Promise<any> {
    try {
      return await apiService.post(`${this.baseUrl}/paper/${accountId}/trade`, trade);
    } catch (error) {
      console.error('Failed to execute paper trade:', error);
      throw error;
    }
  }
}

export const tradingToolsService = TradingToolsService.getInstance();
