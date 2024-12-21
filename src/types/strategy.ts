import { Strategy } from './trading';

export interface StrategySignal {
  timestamp: Date;
  type: 'ENTRY' | 'EXIT';
  direction: 'LONG' | 'SHORT';
  price: number;
  reason: string;
}

export interface TimeFrame {
  value: number;
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

export interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Portfolio {
  id: string;
  name: string;
  assets: {
    symbol: string;
    allocation: number;
    currentValue: number;
  }[];
  totalValue: number;
  lastRebalanced: Date;
}

export interface RebalanceStrategy {
  type: 'threshold' | 'periodic' | 'custom';
  parameters: {
    threshold?: number;
    period?: number;
    customLogic?: string;
  };
}

export interface RebalanceTarget {
  symbol: string;
  targetAllocation: number;
}

export interface RebalanceConstraints {
  minTradeSize: number;
  maxTradeSize: number;
  maxSlippage: number;
  minHoldingPeriod: number;
}

export interface StrategyMetrics {
  [key: string]: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  recoveryFactor: number;
  payoffRatio: number;
  totalPnL: number;
}

export interface OptimizationResult {
  parameters: { [key: string]: number | string | boolean };
  metrics: StrategyMetrics;
  rank: number;
}

export type OptimizationTarget = 
  | 'totalReturn'
  | 'sharpeRatio'
  | 'sortinoRatio'
  | 'calmarRatio'
  | 'winRate'
  | 'profitFactor'
  | 'recoveryFactor'
  | 'payoffRatio'
  | 'maxDrawdown'
  | 'totalPnL';
