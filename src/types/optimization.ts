import { TradingStrategy } from './algo-trading';
import { BacktestResult } from './trading';

export enum OptimizationMetric {
  SHARPE_RATIO = 'SHARPE_RATIO',
  NET_PROFIT = 'NET_PROFIT',
  WIN_RATE = 'WIN_RATE',
  PROFIT_FACTOR = 'PROFIT_FACTOR',
  MAX_DRAWDOWN = 'MAX_DRAWDOWN',
  CUSTOM = 'CUSTOM',
}

export enum OptimizationMethod {
  GridSearch = 'GRID_SEARCH',
  WalkForward = 'WALK_FORWARD',
  MonteCarlo = 'MONTE_CARLO',
  Genetic = 'GENETIC'
}

export enum OptimizationObjective {
  SharpeRatio = 'sharpe',
  Returns = 'returns',
  DrawdownAdjustedReturns = 'drawdown_adjusted_returns',
  ProfitFactor = 'profit_factor',
  Sortino = 'sortino'
}

export interface OptimizationParameter {
  name: string;
  type: 'number' | 'boolean' | 'string';
  min?: number;
  max?: number;
  step?: number;
  values?: any[];
  value: any;
}

export interface OptimizationConfig {
  strategyId: string;
  method: OptimizationMethod;
  parameters: OptimizationParameter[];
  metric: 'sharpeRatio' | 'sortino' | 'maxDrawdown' | 'returns' | 'winRate' | 'profitFactor';
  constraints?: {
    maxDrawdown?: number;
    minProfitFactor?: number;
    minWinRate?: number;
    maxExecutionTime?: number;
  };
  walkForwardPeriods?: number;
  populationSize?: number;
  generations?: number;
  crossoverRate?: number;
  mutationRate?: number;
}

export interface OptimizationProgress {
  status: 'running' | 'completed' | 'failed';
  progress: number;
  currentGeneration?: number;
  bestFitness?: number;
  message?: string;
  error?: string;
}

export interface OptimizationResult {
  id: string;
  strategyId: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  config: OptimizationConfig;
  generations: {
    generation: number;
    bestFitness: number;
    averageFitness: number;
    parameters: Record<string, any>;
  }[];
  parameterDistribution: {
    parameter: string;
    values: any[];
    frequencies: number[];
  }[];
  bestParameters: Record<string, any>;
  finalPerformance: {
    sharpeRatio: number;
    sortino: number;
    maxDrawdown: number;
    returns: number;
    winRate: number;
    profitFactor: number;
  };
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface OptimizationPerformance {
  netProfit: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
}

export interface OptimizationResultItem {
  parameters: Record<string, number>;
  performance: OptimizationPerformance;
}

export interface OptimizationJob {
  id: string;
  strategy: TradingStrategy;
  config: OptimizationConfig;
  progress: OptimizationProgress;
  result?: OptimizationResult;
  createdAt: Date;
  completedAt?: Date;
}

export interface PerformanceMetrics {
  sharpeRatio: number;
  sortino: number;
  maxDrawdown: number;
  returns: number;
  winRate: number;
  profitFactor: number;
}

export interface TradingStrategyNew {
  id: string;
  name: string;
  description: string;
  parameters: OptimizationParameter[];
  metrics: PerformanceMetrics;
  config: {
    method: OptimizationMethod;
    objective: 'sharpe_ratio' | 'sortino_ratio' | 'returns' | 'max_drawdown' | 'profit_factor';
    parameters: OptimizationParameter[];
    populationSize?: number;
    generations?: number;
    mutationRate?: number;
    crossoverRate?: number;
    eliteSize?: number;
    timeframe?: string;
    startDate?: string;
    endDate?: string;
  };
  results?: OptimizationResult;
}
