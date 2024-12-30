import { Trade } from './trading';

export interface BacktestMetrics {
  netProfit: number;
  returnPercentage: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  maxDrawdownDate: Date;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  averageTradeDuration: string;
  expectancy: number;
  kellyPercentage: number;
  recoveryFactor: number;
  payoffRatio: number;
  profitPerMonth: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
}

export interface EquityPoint {
  date: Date;
  equity: number;
  drawdown: number;
  underwater: number;
}

export interface TradeDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface MonthlyReturn {
  month: string;
  return: number;
  trades: number;
}

export interface DrawdownPeriod {
  date: Date;
  drawdown: number;
  duration: number;
  recovery: number;
}

export interface ParameterSensitivity {
  parameter: string;
  value: number;
  profit: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface WalkForwardResult {
  period: string;
  inSampleReturn: number;
  outOfSampleReturn: number;
  robustness: number;
}

export interface BacktestAnalysis {
  tradeDistribution: TradeDistribution[];
  monthlyReturns: MonthlyReturn[];
  drawdownPeriods: DrawdownPeriod[];
  correlationMatrix: {
    parameters: string[];
    values: number[][];
  };
  marketRegimes: {
    regime: string;
    performance: {
      return: number;
      winRate: number;
      trades: number;
    };
  }[];
  timeAnalysis: {
    hourly: {
      hour: number;
      trades: number;
      winRate: number;
      profit: number;
    }[];
    daily: {
      day: string;
      trades: number;
      winRate: number;
      profit: number;
    }[];
    monthly: {
      month: string;
      trades: number;
      winRate: number;
      profit: number;
    }[];
  };
}

export interface BacktestOptimization {
  parameterSensitivity: ParameterSensitivity[];
  walkForwardResults: WalkForwardResult[];
  optimalParameters: Record<string, number>;
  robustnessScore: number;
  stabilityScore: number;
  consistencyScore: number;
}

export interface BacktestResult {
  id: string;
  strategyId: string;
  startDate: Date;
  endDate: Date;
  symbol: string;
  timeframe: string;
  initialBalance: number;
  metrics: BacktestMetrics;
  trades: Trade[];
  equityCurve: EquityPoint[];
  analysis: BacktestAnalysis;
  optimization: BacktestOptimization;
  parameters: Record<string, any>;
  createdAt: Date;
}

export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  symbol: string;
  timeframe: string;
  initialBalance: number;
  commission: number;
  slippage: number;
  useOptimization: boolean;
  optimizationConfig?: {
    parameterRanges: Record<string, [number, number, number]>;
    optimizationMetric: 'netProfit' | 'sharpeRatio' | 'profitFactor';
    walkForwardPeriods: number;
    outOfSampleRatio: number;
  };
}

export interface BacktestProgress {
  status: 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: string;
  error?: string;
}

export interface BacktestJob {
  id: string;
  strategyId: string;
  config: BacktestConfig;
  progress: BacktestProgress;
  result?: BacktestResult;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
