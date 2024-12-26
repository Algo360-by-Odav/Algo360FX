import { TimeFrame } from './trading';

export interface MarketData {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  bid: number;
  ask: number;
  last: number;
}

export interface OrderBook {
  symbol: string;
  timestamp: Date;
  bids: [number, number][]; // [price, volume]
  asks: [number, number][]; // [price, volume]
}

export interface Ticker {
  symbol: string;
  timestamp: Date;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  change: number;
}

export interface MarketDepth {
  symbol: string;
  timestamp: Date;
  level: number;
  bids: {
    price: number;
    volume: number;
    orders: number;
  }[];
  asks: {
    price: number;
    volume: number;
    orders: number;
  }[];
}

export interface TradingSession {
  symbol: string;
  timezone: string;
  open: string; // HH:mm format
  close: string; // HH:mm format
  preMarketOpen?: string;
  preMarketClose?: string;
  afterHoursOpen?: string;
  afterHoursClose?: string;
  holidays: Date[];
}

export interface MarketStatus {
  symbol: string;
  status: 'open' | 'closed' | 'pre-market' | 'after-hours' | 'holiday';
  nextOpen?: Date;
  nextClose?: Date;
}

export interface HistoricalDataRequest {
  symbol: string;
  timeframe: TimeFrame;
  start: Date;
  end: Date;
  adjustments?: ('splits' | 'dividends')[];
}

export interface MarketEvent {
  type: 'trade' | 'quote' | 'depth' | 'status';
  symbol: string;
  timestamp: Date;
  data: MarketData | OrderBook | MarketDepth | MarketStatus;
}

export interface Spread {
  symbol: string;
  timestamp: Date;
  value: number;
  bid: number;
  ask: number;
}

export interface VolumeProfile {
  symbol: string;
  timeframe: TimeFrame;
  start: Date;
  end: Date;
  levels: {
    price: number;
    volume: number;
    buys: number;
    sells: number;
  }[];
}

export interface LiquidityAnalysis {
  symbol: string;
  timestamp: Date;
  buyLiquidity: number;
  sellLiquidity: number;
  imbalance: number;
  volumeWeightedPrice: number;
}

export interface MarketStatistics {
  symbol: string;
  timestamp: Date;
  period: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y';
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  volatility: number;
  averageVolume: number;
}
