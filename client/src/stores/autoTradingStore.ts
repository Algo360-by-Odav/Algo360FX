import { makeAutoObservable, runInAction } from 'mobx';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  symbol: string;
  timeframe: string;
  type: 'TREND' | 'REVERSAL' | 'BREAKOUT' | 'CUSTOM';
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  metrics: {
    totalReturn: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: number;
  };
  parameters: {
    entryConditions: TradingCondition[];
    exitConditions: TradingCondition[];
    riskManagement: RiskParameters;
  };
  lastUpdated: Date;
  createdAt: Date;
}

export interface TradingCondition {
  id: string;
  type: 'INDICATOR' | 'PRICE' | 'TIME' | 'VOLUME' | 'CUSTOM';
  indicator?: {
    name: string;
    parameters: Record<string, any>;
  };
  operator: 'CROSSES_ABOVE' | 'CROSSES_BELOW' | 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'BETWEEN';
  value: number | [number, number];
  timeframe?: string;
}

export interface RiskParameters {
  positionSize: number;
  maxPositions: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: boolean;
  trailingStopDistance?: number;
  maxDrawdown: number;
  maxDailyLoss: number;
  maxWeeklyLoss: number;
}

export interface BacktestResult {
  strategyId: string;
  period: {
    start: Date;
    end: Date;
  };
  trades: Trade[];
  metrics: {
    totalReturn: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    averageTrade: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
    profitableMonths: number;
    recoveryFactor: number;
    payoffRatio: number;
    tradingPeriod: string;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    longTrades: number;
    shortTrades: number;
  };
  equityCurve: {
    date: string;
    equity: number;
  }[];
  drawdownCurve: {
    date: string;
    drawdown: number;
  }[];
}

export interface Trade {
  id: string;
  strategyId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryTime: Date;
  exitTime?: Date;
  stopLoss: number;
  takeProfit: number;
  profit?: number;
  pips?: number;
  commission?: number;
  swap?: number;
  notes?: string;
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

class AutoTradingStore {
  strategies: Strategy[] = [];
  activeStrategy: Strategy | null = null;
  backtestResults: Record<string, BacktestResult> = {};
  trades: Trade[] = [];
  optimizationResults: OptimizationResult[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadStrategies();
  }

  private async loadStrategies() {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      // Simulated API response
      const mockStrategies: Strategy[] = [
        {
          id: 'strategy1',
          name: 'MA Crossover Strategy',
          description: 'Simple moving average crossover strategy',
          symbol: 'EURUSD',
          timeframe: 'H1',
          type: 'TREND',
          status: 'ACTIVE',
          metrics: {
            totalReturn: 15.5,
            winRate: 65,
            profitFactor: 1.8,
            maxDrawdown: 8.2,
            sharpeRatio: 1.5,
            trades: 120,
          },
          parameters: {
            entryConditions: [
              {
                id: 'condition1',
                type: 'INDICATOR',
                indicator: {
                  name: 'MA',
                  parameters: { period: 20 },
                },
                operator: 'CROSSES_ABOVE',
                value: 0,
              },
            ],
            exitConditions: [
              {
                id: 'condition2',
                type: 'INDICATOR',
                indicator: {
                  name: 'MA',
                  parameters: { period: 50 },
                },
                operator: 'CROSSES_BELOW',
                value: 0,
              },
            ],
            riskManagement: {
              positionSize: 0.01,
              maxPositions: 3,
              stopLoss: 50,
              takeProfit: 100,
              trailingStop: true,
              trailingStopDistance: 20,
              maxDrawdown: 10,
              maxDailyLoss: 3,
              maxWeeklyLoss: 10,
            },
          },
          lastUpdated: new Date(),
          createdAt: new Date(),
        },
      ];

      runInAction(() => {
        this.strategies = mockStrategies;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load strategies';
        this.isLoading = false;
      });
    }
  }

  async createStrategy(strategy: Omit<Strategy, 'id' | 'createdAt' | 'lastUpdated'>) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      const newStrategy: Strategy = {
        ...strategy,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      runInAction(() => {
        this.strategies.push(newStrategy);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to create strategy';
        this.isLoading = false;
      });
    }
  }

  async updateStrategy(id: string, updates: Partial<Strategy>) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      runInAction(() => {
        const index = this.strategies.findIndex(s => s.id === id);
        if (index !== -1) {
          this.strategies[index] = {
            ...this.strategies[index],
            ...updates,
            lastUpdated: new Date(),
          };
        }
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update strategy';
        this.isLoading = false;
      });
    }
  }

  async deleteStrategy(id: string) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      runInAction(() => {
        this.strategies = this.strategies.filter(s => s.id !== id);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to delete strategy';
        this.isLoading = false;
      });
    }
  }

  async startStrategy(id: string) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      runInAction(() => {
        const strategy = this.strategies.find(s => s.id === id);
        if (strategy) {
          strategy.status = 'ACTIVE';
          strategy.lastUpdated = new Date();
        }
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to start strategy';
        this.isLoading = false;
      });
    }
  }

  async stopStrategy(id: string) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      runInAction(() => {
        const strategy = this.strategies.find(s => s.id === id);
        if (strategy) {
          strategy.status = 'STOPPED';
          strategy.lastUpdated = new Date();
        }
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to stop strategy';
        this.isLoading = false;
      });
    }
  }

  async runBacktest(id: string, params: { startDate: Date; endDate: Date }) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      const mockBacktestResult: BacktestResult = {
        strategyId: id,
        period: {
          start: params.startDate,
          end: params.endDate,
        },
        trades: Array.from({ length: 50 }, (_, i) => ({
          id: `trade${i}`,
          strategyId: id,
          symbol: 'EURUSD',
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          status: 'CLOSED',
          entryPrice: 1.1000 + Math.random() * 0.0100,
          exitPrice: 1.1000 + Math.random() * 0.0100,
          quantity: 0.01,
          entryTime: new Date(params.startDate.getTime() + Math.random() * (params.endDate.getTime() - params.startDate.getTime())),
          exitTime: new Date(params.startDate.getTime() + Math.random() * (params.endDate.getTime() - params.startDate.getTime())),
          stopLoss: 1.0950,
          takeProfit: 1.1050,
          profit: Math.random() * 100 - 50,
          pips: Math.random() * 100 - 50,
        })),
        metrics: {
          totalReturn: 15.5,
          winRate: 0.65,
          profitFactor: 1.8,
          maxDrawdown: 8.2,
          sharpeRatio: 1.5,
          sortinoRatio: 2.1,
          averageTrade: 0.3,
          averageWin: 0.8,
          averageLoss: -0.4,
          largestWin: 2.5,
          largestLoss: -1.8,
          consecutiveWins: 5,
          consecutiveLosses: 3,
          profitableMonths: 8,
          recoveryFactor: 1.9,
          payoffRatio: 2.0,
          tradingPeriod: '3 months',
          totalTrades: 120,
          winningTrades: 78,
          losingTrades: 42,
          longTrades: 65,
          shortTrades: 55,
        },
        equityCurve: Array.from({ length: 90 }, (_, i) => ({
          date: new Date(params.startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
          equity: 10000 * (1 + Math.random() * 0.002 - 0.001) ** i,
        })),
        drawdownCurve: Array.from({ length: 90 }, (_, i) => ({
          date: new Date(params.startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
          drawdown: Math.random() * 10,
        })),
      };

      runInAction(() => {
        this.backtestResults[id] = mockBacktestResult;
        this.isLoading = false;
      });

      return mockBacktestResult;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to run backtest';
        this.isLoading = false;
      });
      throw error;
    }
  }

  async optimizePortfolio(strategies: string[], constraints: any) {
    try {
      this.isLoading = true;
      // TODO: Replace with actual API call
      const mockResults: OptimizationResult[] = Array.from({ length: 20 }, () => ({
        weights: strategies.reduce((acc, id) => ({
          ...acc,
          [id]: Math.random(),
        }), {}),
        metrics: {
          expectedReturn: Math.random() * 0.2,
          volatility: Math.random() * 0.15,
          sharpeRatio: Math.random() * 2 + 1,
          maxDrawdown: Math.random() * 0.15,
        },
      }));

      runInAction(() => {
        this.optimizationResults = mockResults;
        this.isLoading = false;
      });

      return mockResults;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to optimize portfolio';
        this.isLoading = false;
      });
      throw error;
    }
  }

  clearError() {
    this.error = null;
  }
}

export const autoTradingStore = new AutoTradingStore();
