import { makeAutoObservable, runInAction } from 'mobx';
import dayjs from 'dayjs';

interface BacktestParameters {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  symbol: string;
  timeframe: string;
  leverage: number;
  riskPerTrade: number;
  stopLossType: 'FIXED' | 'ATR' | 'VOLATILITY';
  stopLossValue: number;
  takeProfitType: 'FIXED' | 'RR_RATIO' | 'VOLATILITY';
  takeProfitValue: number;
  maxOpenPositions: number;
  maxDailyTrades: number;
  trailingStop: boolean;
  trailingStopDistance: number;
}

interface Trade {
  date: string;
  type: 'BUY' | 'SELL';
  price: number;
  size: number;
  pnl: number;
  stopLoss: number;
  takeProfit: number;
  duration: number; // in minutes
  reason: string;
  fees: number;
}

interface BacktestMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageDuration: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  expectancy: number;
  annualizedReturn: number;
  recoveryFactor: number;
  sortinoRatio: number;
  calmarRatio: number;
  monthlyReturns: { [key: string]: number };
}

interface BacktestResults {
  metrics: BacktestMetrics;
  returns: number[];
  trades: Trade[];
  equityCurve: { date: string; equity: number; drawdown: number }[];
  monthlyPerformance: { month: string; return: number; trades: number }[];
  riskMetrics: {
    averageLeverage: number;
    maxLeverage: number;
    marginUtilization: number;
    averageRiskPerTrade: number;
  };
  correlationMatrix?: { [key: string]: number };
}

export class BacktestingStore {
  isLoading: boolean = false;
  error: string | null = null;
  results: BacktestResults | null = null;
  compareResults: BacktestResults[] = [];
  optimizationResults: { parameters: Partial<BacktestParameters>; metrics: BacktestMetrics }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async runBacktest(params: BacktestParameters) {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults: BacktestResults = {
        metrics: {
          totalReturn: 15.7,
          sharpeRatio: 1.8,
          maxDrawdown: -8.5,
          winRate: 62.5,
          profitFactor: 1.65,
          averageWin: 250,
          averageLoss: -150,
          largestWin: 1200,
          largestLoss: -800,
          averageDuration: 120,
          totalTrades: 150,
          winningTrades: 94,
          losingTrades: 52,
          breakEvenTrades: 4,
          expectancy: 85.5,
          annualizedReturn: 22.4,
          recoveryFactor: 1.85,
          sortinoRatio: 2.1,
          calmarRatio: 1.95,
          monthlyReturns: {
            '2024-01': 2.5,
            '2024-02': -1.2,
            '2024-03': 3.1,
          },
        },
        returns: Array.from({ length: 100 }, (_, i) => {
          const x = i / 10;
          return 100000 * (1 + 0.2 * Math.sin(x) + 0.1 * Math.cos(2 * x) + 0.05 * x);
        }),
        trades: Array.from({ length: 20 }, (_, i) => ({
          date: dayjs().subtract(i, 'days').toISOString(),
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          price: 1.2000 + Math.random() * 0.1,
          size: Math.floor(Math.random() * 100000),
          pnl: (Math.random() - 0.4) * 1000,
          stopLoss: 1.1950 + Math.random() * 0.01,
          takeProfit: 1.2050 + Math.random() * 0.01,
          duration: Math.floor(Math.random() * 480),
          reason: Math.random() > 0.5 ? 'TP Hit' : 'SL Hit',
          fees: Math.random() * 10,
        })),
        equityCurve: Array.from({ length: 100 }, (_, i) => ({
          date: dayjs().subtract(i, 'days').toISOString(),
          equity: 100000 * (1 + 0.001 * i),
          drawdown: -Math.random() * 5,
        })),
        monthlyPerformance: Array.from({ length: 12 }, (_, i) => ({
          month: dayjs().subtract(i, 'months').format('YYYY-MM'),
          return: (Math.random() - 0.3) * 10,
          trades: Math.floor(Math.random() * 50),
        })),
        riskMetrics: {
          averageLeverage: 2.5,
          maxLeverage: 5.0,
          marginUtilization: 15.5,
          averageRiskPerTrade: 1.2,
        },
      };

      runInAction(() => {
        this.results = mockResults;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to run backtest';
        this.isLoading = false;
      });
    }
  }

  async compareStrategies(strategies: string[]) {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = strategies.map(strategy => this.generateMockResults(strategy));
      
      runInAction(() => {
        this.compareResults = results;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to compare strategies';
        this.isLoading = false;
      });
    }
  }

  async optimizeParameters(baseParams: BacktestParameters, paramRanges: Partial<Record<keyof BacktestParameters, [number, number, number]>>) {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = Array.from({ length: 20 }, () => ({
        parameters: Object.fromEntries(
          Object.entries(paramRanges).map(([key, [min, max]]) => [
            key,
            min + Math.random() * (max - min),
          ])
        ),
        metrics: this.generateMockMetrics(),
      }));
      
      runInAction(() => {
        this.optimizationResults = results;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to optimize parameters';
        this.isLoading = false;
      });
    }
  }

  private generateMockResults(strategyId: string): BacktestResults {
    return {
      metrics: this.generateMockMetrics(),
      returns: Array.from({ length: 100 }, () => Math.random() * 100000),
      trades: [],
      equityCurve: [],
      monthlyPerformance: [],
      riskMetrics: {
        averageLeverage: Math.random() * 5,
        maxLeverage: Math.random() * 10,
        marginUtilization: Math.random() * 50,
        averageRiskPerTrade: Math.random() * 2,
      },
    };
  }

  private generateMockMetrics(): BacktestMetrics {
    return {
      totalReturn: Math.random() * 50,
      sharpeRatio: 1 + Math.random() * 2,
      maxDrawdown: -Math.random() * 20,
      winRate: 40 + Math.random() * 30,
      profitFactor: 1 + Math.random(),
      averageWin: 200 + Math.random() * 300,
      averageLoss: -(100 + Math.random() * 200),
      largestWin: 800 + Math.random() * 1000,
      largestLoss: -(400 + Math.random() * 800),
      averageDuration: Math.random() * 240,
      totalTrades: Math.floor(100 + Math.random() * 200),
      winningTrades: Math.floor(50 + Math.random() * 100),
      losingTrades: Math.floor(30 + Math.random() * 80),
      breakEvenTrades: Math.floor(Math.random() * 10),
      expectancy: Math.random() * 100,
      annualizedReturn: Math.random() * 40,
      recoveryFactor: 1 + Math.random() * 2,
      sortinoRatio: 1 + Math.random() * 2,
      calmarRatio: 1 + Math.random() * 2,
      monthlyReturns: {},
    };
  }

  clearResults() {
    this.results = null;
    this.compareResults = [];
    this.optimizationResults = [];
    this.error = null;
  }
}

export const backtestingStore = new BacktestingStore();
