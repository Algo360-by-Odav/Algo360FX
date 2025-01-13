import { Prisma } from '@prisma/client';
import { TimeFrame } from './MarketData';
import { Position } from './Position';
import { User } from './User';
import { InputJsonValue, JsonValue } from '@prisma/client/runtime/library';

export enum StrategyType {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MEAN_REVERSION = 'MEAN_REVERSION',
  BREAKOUT = 'BREAKOUT',
  MOMENTUM = 'MOMENTUM',
  ARBITRAGE = 'ARBITRAGE',
  CUSTOM = 'CUSTOM'
}

export interface StrategyParameters {
  timeframe: string;
  entryConditions: {
    indicators: Record<string, any>;
    rules: string[];
  };
  exitConditions: {
    indicators: Record<string, any>;
    rules: string[];
  };
  riskManagement: {
    stopLoss?: number;
    takeProfit?: number;
    trailingStop?: number;
    maxDrawdown?: number;
    positionSize?: number;
  };
  filters: {
    volatility?: number;
    volume?: number;
    spread?: number;
    time?: string[];
  };
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  parameters: InputJsonValue;
  isActive: boolean;
  performance: InputJsonValue | null;
  metadata: InputJsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  user?: User;
  positions?: Position[];
}

export interface StrategyWithRelations extends Strategy {
  user: User;
  positions: Position[];
}

export type StrategyCreateInput = {
  name: string;
  type: string;
  description: string;
  parameters: InputJsonValue;
  userId: string;
  isActive?: boolean;
  performance?: InputJsonValue | null;
  metadata?: InputJsonValue | null;
};

export type StrategyUpdateInput = {
  name?: string;
  type?: string;
  description?: string;
  parameters?: InputJsonValue;
  isActive?: boolean;
  performance?: InputJsonValue | null;
  metadata?: InputJsonValue | null;
};

export type StrategyWhereInput = {
  id?: string;
  userId?: string;
  type?: string;
  isActive?: boolean;
};

export type StrategyWhereUniqueInput = {
  id: string;
};

export interface CreateStrategyInput {
  name: string;
  type: string;
  description: string;
  parameters: StrategyParameters;
  metadata?: Record<string, any>;
}

export interface UpdateStrategyInput {
  name?: string;
  type?: string;
  description?: string;
  parameters?: Partial<StrategyParameters>;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface StrategyFilters {
  userId?: string;
  type?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface StrategySignal {
  timestamp: Date;
  symbol: string;
  type: 'LONG' | 'SHORT' | 'CLOSE' | 'NONE';
  price: number;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface StrategyStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageProfit: number;
  averageLoss: number;
  expectancy: number;
}

export interface StrategyBacktest {
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  trades: Array<{
    timestamp: Date;
    type: 'LONG' | 'SHORT' | 'CLOSE';
    symbol: string;
    price: number;
    size: number;
    profit: number;
  }>;
  performance: StrategyStats;
}
