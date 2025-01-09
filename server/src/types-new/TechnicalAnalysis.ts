export interface MACDOutput {
  MACD: number;
  signal: number;
  histogram: number;
}

export interface BollingerBandsOutput {
  upper: number[];
  middle: number[];
  lower: number[];
}

export interface StochasticOutput {
  k: number[];
  d: number[];
}

export interface ADXOutput {
  adx: number;
  plusDI: number;
  minusDI: number;
}

export interface BacktestResult {
  trades: {
    entryTime: string;
    exitTime: string;
    entryPrice: number;
    exitPrice: number;
    type: 'LONG' | 'SHORT';
    profit: number;
    profitPercentage: number;
  }[];
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}
