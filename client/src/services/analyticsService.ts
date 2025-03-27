import { apiService } from './api';

export interface MarketScan {
  symbol: string;
  market: string;
  signals: {
    technical: {
      trend: 'bullish' | 'bearish' | 'neutral';
      strength: number;
      indicators: {
        name: string;
        value: number;
        signal: 'buy' | 'sell' | 'neutral';
      }[];
    };
    fundamental: {
      rating: number;
      factors: {
        name: string;
        impact: 'positive' | 'negative' | 'neutral';
        description: string;
      }[];
    };
    sentiment: {
      overall: number;
      newsScore: number;
      socialScore: number;
      analystRating: number;
    };
  };
  opportunities: {
    type: string;
    description: string;
    probability: number;
    risk: number;
  }[];
}

export interface PortfolioAnalysis {
  overview: {
    totalValue: number;
    dailyPnL: number;
    totalReturn: number;
    sharpeRatio: number;
    beta: number;
    alpha: number;
  };
  allocation: {
    byAsset: { [asset: string]: number };
    byMarket: { [market: string]: number };
    bySector: { [sector: string]: number };
    byRisk: { [risk: string]: number };
  };
  risk: {
    var: number;
    maxDrawdown: number;
    volatility: number;
    correlations: { [asset: string]: number };
    stressTest: {
      scenario: string;
      impact: number;
    }[];
  };
  performance: {
    history: {
      date: string;
      value: number;
      return: number;
    }[];
    attribution: {
      asset: string;
      contribution: number;
    }[];
  };
}

export interface RiskAnalysis {
  marketRisk: {
    volatility: number;
    beta: number;
    var: number;
    stressTests: {
      scenario: string;
      impact: number;
    }[];
  };
  creditRisk: {
    rating: string;
    probability: number;
    exposure: number;
  };
  liquidityRisk: {
    spread: number;
    volume: number;
    depth: number;
  };
  operationalRisk: {
    factors: {
      name: string;
      level: 'low' | 'medium' | 'high';
      mitigation: string;
    }[];
  };
}

export interface AIPrediction {
  symbol: string;
  timeframe: string;
  predictions: {
    price: {
      forecast: number;
      confidence: number;
      range: [number, number];
    };
    trend: {
      direction: 'up' | 'down' | 'sideways';
      strength: number;
      duration: string;
    };
    patterns: {
      name: string;
      probability: number;
      target: number;
    }[];
  };
  factors: {
    technical: {
      impact: number;
      description: string;
    };
    fundamental: {
      impact: number;
      description: string;
    };
    sentiment: {
      impact: number;
      description: string;
    };
  };
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private readonly baseUrl = '/analytics';

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Market Scanner
  async scanMarket(filters?: {
    market?: string;
    sector?: string;
    patterns?: string[];
  }): Promise<MarketScan[]> {
    try {
      return await apiService.get(`${this.baseUrl}/scanner`, { params: filters });
    } catch (error) {
      console.error('Failed to scan market:', error);
      throw error;
    }
  }

  // Portfolio Analytics
  async analyzePortfolio(portfolioId: string): Promise<PortfolioAnalysis> {
    try {
      return await apiService.get(`${this.baseUrl}/portfolio/${portfolioId}`);
    } catch (error) {
      console.error('Failed to analyze portfolio:', error);
      throw error;
    }
  }

  async optimizePortfolio(portfolioId: string, constraints: {
    risk?: number;
    return?: number;
    constraints?: any;
  }): Promise<{
    allocation: { [asset: string]: number };
    expectedReturn: number;
    risk: number;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/portfolio/${portfolioId}/optimize`, constraints);
    } catch (error) {
      console.error('Failed to optimize portfolio:', error);
      throw error;
    }
  }

  // Risk Analysis
  async analyzeRisk(symbol: string): Promise<RiskAnalysis> {
    try {
      return await apiService.get(`${this.baseUrl}/risk/${symbol}`);
    } catch (error) {
      console.error('Failed to analyze risk:', error);
      throw error;
    }
  }

  // AI Predictions
  async getPredictions(symbol: string, timeframe: string): Promise<AIPrediction> {
    try {
      return await apiService.get(`${this.baseUrl}/predictions/${symbol}`, {
        params: { timeframe }
      });
    } catch (error) {
      console.error('Failed to get predictions:', error);
      throw error;
    }
  }

  // Custom Indicators
  async calculateCustomIndicator(
    symbol: string,
    indicator: string,
    params: any
  ): Promise<{
    values: number[];
    signals: ('buy' | 'sell' | 'neutral')[];
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/indicators/${symbol}`, {
        indicator,
        params
      });
    } catch (error) {
      console.error('Failed to calculate custom indicator:', error);
      throw error;
    }
  }

  // Backtesting
  async runBacktest(strategy: {
    name: string;
    params: any;
    symbols: string[];
    timeframe: string;
    startDate: string;
    endDate: string;
  }): Promise<{
    performance: any;
    trades: any[];
    metrics: any;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/backtest`, strategy);
    } catch (error) {
      console.error('Failed to run backtest:', error);
      throw error;
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
