export interface OptimizationConfig {
  strategyId: string;
  parameters: {
    [key: string]: {
      min: number;
      max: number;
      step: number;
    };
  };
  timeframe: string;
  startDate: string;
  endDate: string;
  symbol: string;
  optimizationMetric: 'profit' | 'sharpeRatio' | 'drawdown';
}

export interface OptimizationResultNew {
  optimizationId: string;
  strategyId: string;
  parameters: { [key: string]: number };
  performance: {
    profit: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    tradeCount: number;
  };
  timestamp: string;
}
