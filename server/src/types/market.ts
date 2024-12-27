export interface MarketData {
  symbol: string;
  timeframe: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MACDOutput {
  MACD: number;
  signal: number;
  histogram: number;
}

export interface BollingerBandsOutput {
  upper: number;
  middle: number;
  lower: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  period?: number;
}
