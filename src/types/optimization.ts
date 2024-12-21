import { TradingStrategy } from './algo-trading';

export enum OptimizationMetric {
  SHARPE_RATIO = 'SHARPE_RATIO',
  NET_PROFIT = 'NET_PROFIT',
  WIN_RATE = 'WIN_RATE',
  PROFIT_FACTOR = 'PROFIT_FACTOR',
  MAX_DRAWDOWN = 'MAX_DRAWDOWN',
  CUSTOM = 'CUSTOM',
}

export enum OptimizationMethod {
  GeneticAlgorithm = 'genetic',
  GridSearch = 'grid',
  ParticleSwarm = 'particle_swarm',
  RandomSearch = 'random',
  BayesianOptimization = 'bayesian'
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
  min: number;
  max: number;
  step: number;
  current: number;
}

export type OptimizationMethodType = 'genetic' | 'grid' | 'random' | 'bayesian';
export type OptimizationObjectiveType = 'sharpe' | 'returns' | 'drawdown' | 'sortino';

export interface OptimizationConfig {
  // Time range for optimization
  startDate: Date;
  endDate: Date;

  // Parameters to optimize with their possible values
  parameters: Record<string, number[]>;

  // Optimization settings
  optimizationMetric: OptimizationMetric;
  method: OptimizationMethod;

  // Method-specific settings
  walkForwardPeriods?: number;
  monteCarloIterations?: number;
  generations?: number;
  populationSize?: number;
  mutationRate?: number;

  // Constraints
  maxDrawdown?: number;
  minTradeCount?: number;
  minWinRate?: number;
  minProfitFactor?: number;
  maxPositionSize?: number;
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

export interface OptimizationResult {
  parameters: Record<string, number>;
  performance: OptimizationPerformance;
  allResults: OptimizationResultItem[];
}

export interface OptimizationProgress {
  status: 'running' | 'completed' | 'failed';
  progress: number;
  currentIteration: number;
  totalIterations: number;
  bestResult?: OptimizationResult;
  error?: string;
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

export interface ParameterDistribution {
  parameter: string;
  values: number[];
  frequencies: number[];
}

export interface OptimizationResultNew {
  generations: {
    number: number;
    bestFitness: number;
    averageFitness: number;
    parameters: Record<string, number>;
  }[];
  performance: PerformanceMetrics[];
  parameterDistribution: ParameterDistribution[];
  bestParameters: Record<string, number>;
  finalPerformance: PerformanceMetrics;
}

export interface TradingStrategyNew {
  id: string;
  name: string;
  description: string;
  parameters: OptimizationParameter[];
  metrics: PerformanceMetrics;
  config: {
    method: OptimizationMethodType;
    objective: OptimizationObjectiveType;
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
  results?: OptimizationResultNew;
}
