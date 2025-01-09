import { Prisma } from '@prisma/client';

export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';
export type DataSource = 'BINANCE' | 'OANDA' | 'FXCM' | 'CUSTOM';

export interface MarketDataPoint {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  metadata?: Prisma.JsonValue;
}

export interface MarketData {
  id: string;
  symbol: string;
  timeframe: TimeFrame;
  source: DataSource;
  data: MarketDataPoint[];
  startTime: Date;
  endTime: Date;
  metadata?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndicatorOutput {
  macd?: {
    histogram: number;
    signal: number;
    MACD: number;
  }[];
  bollinger?: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  rsi?: number[];
  stochastic?: {
    k: number[];
    d: number[];
  };
  adx?: number[];
  sma?: number[];
  ema?: number[];
}

export interface MarketDataWithIndicators extends MarketData {
  indicators: IndicatorOutput;
}

export interface CreateMarketDataInput {
  symbol: string;
  timeframe: TimeFrame;
  source: DataSource;
  data: MarketDataPoint[];
  metadata?: Prisma.JsonValue;
}

export interface UpdateMarketDataInput {
  data?: MarketDataPoint[];
  metadata?: Prisma.JsonValue;
}

export interface MarketDataFilters {
  symbol?: string;
  timeframe?: TimeFrame;
  source?: DataSource;
  startTime?: Date;
  endTime?: Date;
}

export interface MarketDataStats {
  totalPoints: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
  highestPrice: number;
  lowestPrice: number;
  averageVolume: number;
  volatility: number;
}

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below';
  price: number;
  triggered: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface VolumeProfile {
  priceLevel: number;
  volume: number;
  trades: number;
  buyVolume: number;
  sellVolume: number;
}

export interface OrderFlow {
  timestamp: Date;
  price: number;
  volume: number;
  side: 'buy' | 'sell';
  aggressor: boolean;
  liquidation: boolean;
}
