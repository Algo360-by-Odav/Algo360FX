import { TimeFrame } from './market';

export interface OptimizationConfig {
  strategyId: string;
  symbol: string;
  timeframe: string;
  parameters: {
    [key: string]: {
      min: number;
      max: number;
      step: number;
    };
  };
}

export interface OptimizationResult {
  parameters: {
    [key: string]: number;
  };
  metrics: {
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface OptimizationMessage {
  type: 'start_optimization' | 'stop_optimization' | 'get_optimization_status';
  config?: OptimizationConfig;
  optimizationId?: string;
}
