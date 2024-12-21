export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: StrategyParameters;
  rules: TradingRule[];
  indicators: Indicator[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
  entryRules: TradingRule[];
  exitRules: TradingRule[];
  symbol: string;
  timeframe: string;
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxDrawdown: number;
    positionSize: number;
  };
}

export interface StrategyParameters {
  [key: string]: number | string | boolean;
}

export interface TradingRule {
  id: string;
  condition: string;
  action: string;
  parameters: { [key: string]: any };
}

export interface Indicator {
  id: string;
  name: string;
  type: string;
  parameters: { [key: string]: any };
}

export interface BacktestConfig {
  strategy: Strategy;
  parameters: StrategyParameters;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  commission: number;
  slippage: number;
  useSpread: boolean;
}

export interface BacktestResult {
  trades: Trade[];
  metrics: PerformanceMetrics;
  equity: EquityCurve[];
  equityCurve: EquityCurve[];
  historicalData: {
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  indicators: {
    [key: string]: {
      timestamp: Date;
      value: number;
    }[];
  };
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL';
  position: 'LONG' | 'SHORT';
  openTime: Date;
  closeTime: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  commission: number;
  swap: number;
  profit: number;
  pips: number;
  riskRewardRatio: number;
  duration: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  tags?: string[];
  notes?: string;
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
  timestamp: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StrategyContext {
  timestamp: Date;
  symbol: string;
  timeframe: string;
  data: {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
  };
  position: {
    type: 'LONG' | 'SHORT' | 'FLAT';
    size: number;
    entryPrice: number;
  };
  indicators: { [key: string]: any };
}

export interface ChartSettings {
  showGrid: boolean;
  showVolume: boolean;
  showCrosshair: boolean;
  showLegend: boolean;
  theme: 'light' | 'dark';
  drawingMode: boolean;
}

export type TimeFrameType = '1M' | '5M' | '15M' | '1H' | '4H' | '1D';

export type ChartType = 'candlestick' | 'line';

export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartIndicator {
  id: string;
  type: string;
  parameters: Record<string, any>;
}

export interface DrawingTool {
  id: string;
  type: string;
  coordinates: Array<{ x: number; y: number }>;
  style?: {
    color?: string;
    lineWidth?: number;
    fillColor?: string;
  };
}

export interface PerformanceMetrics {
  totalPnL: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface EquityCurve {
  timestamp: string;
  equity: number;
  drawdown: number;
}

export type TimeFrame = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'ALL';
