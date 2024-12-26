export interface Position {
  symbol: string;
  size: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  period: number;
}

export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
