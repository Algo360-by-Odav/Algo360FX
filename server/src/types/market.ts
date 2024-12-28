export enum TimeFrame {
  M1 = '1m',
  M5 = '5m',
  M15 = '15m',
  M30 = '30m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1d',
  W1 = '1w',
  MN = '1M'
}

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

export enum OrderTimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK'
}

export enum OrderStatus {
  Pending = 'PENDING',
  Executed = 'EXECUTED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED'
}

export enum TrendDirection {
  Up = 'up',
  Down = 'down',
  Sideways = 'sideways'
}

export enum TrendStrength {
  VeryWeak = 0,
  Weak = 1,
  Moderate = 2,
  Strong = 3,
  VeryStrong = 4
}

export interface MarketData {
  readonly symbol: string;
  readonly timeframe: TimeFrame;
  readonly timestamp: Date;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
}

export interface PriceLevel {
  readonly price: number;
  readonly strength: number;
  readonly touches: number;
  readonly timestamp: Date;
}

export interface VolumeLevel {
  readonly price: number;
  readonly volume: number;
  readonly timestamp: Date;
}

export interface MarketStructure {
  readonly trend: {
    readonly direction: TrendDirection;
    readonly strength: TrendStrength;
    readonly startTime?: Date;
    readonly endTime?: Date;
  };
  readonly volatility: {
    readonly value: number;
    readonly timestamp: Date;
  };
  readonly momentum?: number;
}

export interface BacktestResults {
  readonly totalTrades: number;
  readonly winningTrades: number;
  readonly losingTrades: number;
  readonly winRate: number;
  readonly profitFactor: number;
  readonly netProfit: number;
  readonly maxDrawdown: number;
  readonly sharpeRatio: number;
  readonly trades: ReadonlyArray<Trade>;
}

export interface Trade {
  readonly id: string;
  readonly symbol: string;
  readonly type: OrderType;
  readonly openTime: Date;
  readonly closeTime: Date;
  readonly openPrice: number;
  readonly closePrice: number;
  readonly volume: number;
  readonly profit: number;
  readonly stopLoss?: number;
  readonly takeProfit?: number;
}

export interface CorrelationData {
  readonly symbol: string;
  readonly correlations: ReadonlyArray<{
    readonly symbol: string;
    readonly correlation: number;
  }>;
  readonly timeframe: TimeFrame;
  readonly sampleSize: number;
}

export interface MarketDataEvent {
  readonly type: 'price' | 'position' | 'order' | 'error';
  readonly data: Record<string, unknown>;
}
