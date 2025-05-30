import { makeAutoObservable, runInAction } from 'mobx';
import { analysisService } from '../services/analysisService';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: Date;
}

export interface PerformanceMetric {
  totalPnL: number;
  pnLPercent: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  trades: {
    total: number;
    winning: number;
    losing: number;
  };
  averages: {
    winSize: number;
    lossSize: number;
    tradeSize: number;
  };
}

export interface RiskMetric {
  valueAtRisk: number;
  marginUtilization: number;
  exposureByAsset: { [key: string]: number };
  leverageRatio: number;
  correlations: { [key: string]: number };
  volatility: number;
  beta: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  parameters?: Record<string, any>;
  description?: string;
  strength?: number;
}

export interface MarketSentiment {
  bullishPercent: number;
  bearishPercent: number;
  neutralPercent: number;
  socialScore: number;
  newsScore: number;
  volatilityIndex: number;
  marketMomentum: number;
  trendStrength: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  price: number;
  active: boolean;
  createdAt: Date;
}

export interface Strategy {
  id: string;
  name: string;
  performance: {
    return: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    correlations: Record<string, number>;
  };
}

export interface OptimizationResult {
  weights: Record<string, number>;
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface OptimizationParams {
  objective: 'SHARPE' | 'RETURN' | 'RISK' | 'DRAWDOWN';
  constraints: {
    minWeight: number;
    maxWeight: number;
    targetReturn?: number;
    maxVolatility?: number;
    maxDrawdown?: number;
  };
  riskFreeRate: number;
}

class AnalysisStore {
  marketData: MarketData[] = [];
  performanceMetrics: PerformanceMetric | null = null;
  riskMetrics: RiskMetric | null = null;
  technicalIndicators: TechnicalIndicator[] = [];
  marketSentiment: MarketSentiment | null = null;
  selectedTimeframe: string = '1D';
  selectedSymbol: string = 'EURUSD';
  priceAlerts: PriceAlert[] = [];
  strategies: Strategy[] = [];
  optimizationResults: OptimizationResult[] = [];
  isOptimizing = false;
  optimizationError: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeStore();
  }

  private async initializeStore() {
    await this.fetchMarketData(this.selectedSymbol);
    await this.fetchPerformanceMetrics();
    await this.fetchRiskMetrics();
    this.calculateTechnicalIndicators();
    this.calculateMarketSentiment();
    await this.fetchStrategies();
  }

  setSelectedTimeframe(timeframe: string) {
    this.selectedTimeframe = timeframe;
    this.fetchMarketData(this.selectedSymbol);
  }

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.fetchMarketData(symbol);
  }

  async fetchMarketData(symbol: string) {
    try {
      this.isLoading = true;
      // Simulated API call
      const mockData: MarketData[] = Array.from({ length: 100 }, (_, i) => {
        const basePrice = symbol === 'EURUSD' ? 1.1234 : symbol === 'GBPUSD' ? 1.2567 : 1.3456;
        const randomChange = (Math.random() - 0.5) * 0.02;
        const price = basePrice + randomChange;
        return {
          symbol,
          price,
          change: randomChange,
          changePercent: (randomChange / basePrice) * 100,
          volume: Math.floor(Math.random() * 1000000),
          high: price + Math.random() * 0.01,
          low: price - Math.random() * 0.01,
          timestamp: new Date(Date.now() - i * 60000),
        };
      });

      runInAction(() => {
        this.marketData = mockData;
        this.calculateTechnicalIndicators();
        this.calculateMarketSentiment();
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch market data';
        this.isLoading = false;
      });
    }
  }

  async fetchPerformanceMetrics() {
    try {
      // Simulated API call
      const mockMetrics: PerformanceMetric = {
        totalPnL: Math.random() * 100000,
        pnLPercent: Math.random() * 20,
        winRate: Math.random() * 30 + 50,
        sharpeRatio: Math.random() * 2 + 1,
        maxDrawdown: Math.random() * 15,
        profitFactor: Math.random() * 2 + 1,
        trades: {
          total: Math.floor(Math.random() * 1000),
          winning: Math.floor(Math.random() * 600),
          losing: Math.floor(Math.random() * 400),
        },
        averages: {
          winSize: Math.random() * 500,
          lossSize: Math.random() * 300,
          tradeSize: Math.random() * 1000,
        },
      };

      runInAction(() => {
        this.performanceMetrics = mockMetrics;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch performance metrics';
      });
    }
  }

  async fetchRiskMetrics() {
    try {
      // Simulated API call
      const mockMetrics: RiskMetric = {
        valueAtRisk: Math.random() * 10000,
        marginUtilization: Math.random() * 60,
        exposureByAsset: {
          EURUSD: Math.random() * 100000,
          GBPUSD: Math.random() * 80000,
          USDJPY: Math.random() * 70000,
        },
        leverageRatio: Math.random() * 20 + 1,
        correlations: {
          EURUSD: Math.random(),
          GBPUSD: Math.random(),
          USDJPY: Math.random(),
        },
        volatility: Math.random() * 15,
        beta: Math.random() * 1.5,
      };

      runInAction(() => {
        this.riskMetrics = mockMetrics;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch risk metrics';
      });
    }
  }

  calculateTechnicalIndicators() {
    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI',
        value: Math.random() * 100,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Relative Strength Index',
        strength: Math.random(),
        parameters: { period: 14 },
      },
      {
        name: 'MACD',
        value: Math.random() * 2 - 1,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Moving Average Convergence Divergence',
        strength: Math.random(),
        parameters: { fast: 12, slow: 26, signal: 9 },
      },
      {
        name: 'MA Cross',
        value: Math.random() * 100,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Moving Average Crossover',
        strength: Math.random(),
        parameters: { fast: 50, slow: 200 },
      },
      {
        name: 'Bollinger Bands',
        value: Math.random() * 2 - 1,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Bollinger Bands Position',
        strength: Math.random(),
        parameters: { period: 20, deviations: 2 },
      },
      {
        name: 'Stochastic',
        value: Math.random() * 100,
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        description: 'Stochastic Oscillator',
        strength: Math.random(),
        parameters: { k: 14, d: 3 },
      },
    ];

    runInAction(() => {
      this.technicalIndicators = indicators;
    });
  }

  calculateMarketSentiment() {
    const sentiment: MarketSentiment = {
      bullishPercent: Math.random() * 100,
      bearishPercent: Math.random() * 100,
      neutralPercent: Math.random() * 100,
      socialScore: Math.random() * 100,
      newsScore: Math.random() * 100,
      volatilityIndex: Math.random() * 30,
      marketMomentum: Math.random() * 100 - 50,
      trendStrength: Math.random() * 100,
    };

    // Normalize percentages
    const total = sentiment.bullishPercent + sentiment.bearishPercent + sentiment.neutralPercent;
    sentiment.bullishPercent = (sentiment.bullishPercent / total) * 100;
    sentiment.bearishPercent = (sentiment.bearishPercent / total) * 100;
    sentiment.neutralPercent = (sentiment.neutralPercent / total) * 100;

    runInAction(() => {
      this.marketSentiment = sentiment;
    });
  }

  addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>) {
    const newAlert: PriceAlert = {
      ...alert,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
    };
    this.priceAlerts.push(newAlert);
  }

  removePriceAlert(id: string) {
    this.priceAlerts = this.priceAlerts.filter(alert => alert.id !== id);
  }

  togglePriceAlert(id: string) {
    const alert = this.priceAlerts.find(a => a.id === id);
    if (alert) {
      alert.active = !alert.active;
    }
  }

  clearError() {
    this.error = null;
  }

  async fetchStrategies() {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample strategies
      const strategies: Strategy[] = [
        {
          id: 'trend_following',
          name: 'Trend Following',
          performance: {
            return: 0.15,
            volatility: 0.12,
            sharpeRatio: 1.25,
            maxDrawdown: 0.18,
            correlations: { trend_following: 1, mean_reversion: 0.3, stat_arb: -0.1 }
          }
        },
        {
          id: 'mean_reversion',
          name: 'Mean Reversion',
          performance: {
            return: 0.12,
            volatility: 0.09,
            sharpeRatio: 1.33,
            maxDrawdown: 0.15,
            correlations: { trend_following: 0.3, mean_reversion: 1, stat_arb: 0.2 }
          }
        },
        {
          id: 'stat_arb',
          name: 'Statistical Arbitrage',
          performance: {
            return: 0.18,
            volatility: 0.14,
            sharpeRatio: 1.29,
            maxDrawdown: 0.22,
            correlations: { trend_following: -0.1, mean_reversion: 0.2, stat_arb: 1 }
          }
        }
      ];

      runInAction(() => {
        this.strategies = strategies;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch strategies';
        console.error('Error fetching strategies:', error);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async optimizePortfolio(params: OptimizationParams) {
    try {
      this.isOptimizing = true;
      this.optimizationError = null;
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sample optimization result
      const result: OptimizationResult = {
        weights: {
          trend_following: 0.4,
          mean_reversion: 0.35,
          stat_arb: 0.25
        },
        metrics: {
          expectedReturn: 0.147,
          volatility: 0.095,
          sharpeRatio: 1.55,
          maxDrawdown: 0.16
        }
      };

      runInAction(() => {
        this.optimizationResults = [result];
      });

      return result;
    } catch (error) {
      runInAction(() => {
        this.optimizationError = 'Failed to optimize portfolio';
        console.error('Error optimizing portfolio:', error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isOptimizing = false;
      });
    }
  }

  get hasOptimizationResults() {
    return this.optimizationResults.length > 0;
  }

  get latestOptimizationResult() {
    return this.optimizationResults[0];
  }
}

export const analysisStore = new AnalysisStore();
