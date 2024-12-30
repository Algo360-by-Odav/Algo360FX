import { Trade, Position } from './trading';

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'LIVE' | 'DEMO' | 'BACKTEST';
  currency: string;
  initialBalance: number;
  currentBalance: number;
  unrealizedPnl: number;
  realizedPnl: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  positions: Position[];
  trades: Trade[];
  createdAt: Date;
  updatedAt: Date;
  settings: PortfolioSettings;
  performance: PortfolioPerformance;
  risk: PortfolioRisk;
}

export interface PortfolioSettings {
  autoRebalance: boolean;
  rebalanceThreshold: number;
  rebalanceInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  maxDrawdown: number;
  maxLeverage: number;
  maxPositions: number;
  defaultStopLoss: number;
  defaultTakeProfit: number;
  defaultPositionSize: number;
  defaultLeverage: number;
}

export interface PortfolioPerformance {
  returns: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
  metrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    recoveryFactor: number;
    profitFactor: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    expectancy: number;
  };
  history: {
    equity: EquityPoint[];
    drawdown: DrawdownPoint[];
    returns: ReturnPoint[];
  };
}

export interface PortfolioRisk {
  currentDrawdown: number;
  maxDrawdown: number;
  valueAtRisk: number;
  expectedShortfall: number;
  betaToMarket: number;
  correlationToMarket: number;
  volatility: number;
  concentrationRisk: ConcentrationRisk[];
  exposures: ExposureRisk[];
}

export interface ConcentrationRisk {
  type: 'SYMBOL' | 'SECTOR' | 'STRATEGY';
  name: string;
  exposure: number;
  limit: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ExposureRisk {
  symbol: string;
  notional: number;
  percentage: number;
  direction: 'LONG' | 'SHORT';
  leverage: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface EquityPoint {
  timestamp: Date;
  equity: number;
  balance: number;
  unrealizedPnl: number;
}

export interface DrawdownPoint {
  timestamp: Date;
  drawdown: number;
  duration: number;
  recovered: boolean;
}

export interface ReturnPoint {
  timestamp: Date;
  return: number;
  cumulative: number;
}

export interface PortfolioAllocation {
  symbol: string;
  targetWeight: number;
  currentWeight: number;
  deviation: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  amount: number;
  notional: number;
}

export interface RebalanceConfig {
  method: 'THRESHOLD' | 'PERIODIC' | 'CUSTOM';
  threshold?: number;
  interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  customLogic?: string;
  constraints: {
    minTradeSize: number;
    maxTradeSize: number;
    maxSlippage: number;
    minHoldingPeriod: number;
  };
}

export interface RebalanceResult {
  timestamp: Date;
  trades: Trade[];
  allocations: PortfolioAllocation[];
  metrics: {
    turnover: number;
    cost: number;
    tracking: number;
  };
}
