export interface Position {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  currentPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'OPEN' | 'CLOSED';
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  performance?: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
  };
}
