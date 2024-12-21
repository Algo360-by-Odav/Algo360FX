export enum StrategyType {
  TREND_FOLLOWING = 'TREND_FOLLOWING',
  MEAN_REVERSION = 'MEAN_REVERSION',
  BREAKOUT = 'BREAKOUT',
  MOMENTUM = 'MOMENTUM',
  ARBITRAGE = 'ARBITRAGE',
  CUSTOM = 'CUSTOM'
}

export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD'
}

export enum IndicatorType {
  // Trend Indicators
  SMA = 'SMA',
  EMA = 'EMA',
  DEMA = 'DEMA',
  TEMA = 'TEMA',
  WMA = 'WMA',
  
  // Momentum Indicators
  RSI = 'RSI',
  MACD = 'MACD',
  RMI = 'RMI',
  SMI = 'SMI',
  UO = 'UO',
  CMO = 'CMO',
  
  // Volatility Indicators
  BOLLINGER_BANDS = 'BOLLINGER_BANDS',
  ATR = 'ATR',
  KELTNER_CHANNELS = 'KELTNER_CHANNELS',
  ATRP = 'ATRP',
  HISTORICAL_VOLATILITY = 'HISTORICAL_VOLATILITY',
  CHAIKIN_VOLATILITY = 'CHAIKIN_VOLATILITY',
  
  // Volume Indicators
  OBV = 'OBV',
  VWAP = 'VWAP',
  CMF = 'CMF',
  ADL = 'ADL',
  FORCE_INDEX = 'FORCE_INDEX',
}

export interface IndicatorParams {
  // Trend Indicator Params
  period?: number;
  standardDeviations?: number;
  
  // Momentum Indicator Params
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  momentum?: number;
  smoothK?: number;
  smoothD?: number;
  weight1?: number;
  weight2?: number;
  weight3?: number;
  
  // Volatility Indicator Params
  emaPeriod?: number;
  atrPeriod?: number;
  multiplier?: number;
  rocPeriod?: number;
  annualizationFactor?: number;
}

export interface Indicator {
  type: IndicatorType;
  params: IndicatorParams;
}

export interface StrategyCondition {
  indicator1: Indicator;
  indicator2?: Indicator;
  operator: 'CROSSES_ABOVE' | 'CROSSES_BELOW' | 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS';
  value?: number;
}

export interface Strategy {
  id: string;
  name: string;
  type: StrategyType;
  description: string;
  timeframe: string;
  symbols: string[];
  parameters: Record<string, any>;
  conditions: {
    entry: StrategyCondition[];
    exit: StrategyCondition[];
  };
  riskManagement: {
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
    trailingStop?: number;
    maxDrawdown?: number;
  };
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  createdAt: Date;
  updatedAt: Date;
}

export interface TradingStrategy extends Strategy {
  backtestResults?: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    netProfit: number;
    startDate: Date;
    endDate: Date;
  };
}

export interface Signal {
  id: string;
  strategyId: string;
  symbol: string;
  type: SignalType;
  price: number;
  timestamp: Date;
  confidence: number;
  metadata?: {
    indicators: {
      [key: string]: number | { [key: string]: number };
    };
    conditions: {
      [key: string]: boolean;
    };
  };
}

export interface BacktestParams {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  symbols: string[];
  timeframe: string;
  commission?: number;
  slippage?: number;
}

export interface BacktestResult {
  trades: {
    id: string;
    symbol: string;
    entryDate: Date;
    exitDate: Date;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    commission: number;
    slippage: number;
  }[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    netProfit: number;
    roi: number;
  };
  equity: {
    timestamp: Date;
    value: number;
  }[];
}

export interface OptimizationConfig {
  parameterRanges: {
    [key: string]: {
      min: number;
      max: number;
      step: number;
    };
  };
  metric: 'sharpeRatio' | 'netProfit' | 'winRate' | 'profitFactor';
  populationSize?: number;
  generations?: number;
  crossoverRate?: number;
  mutationRate?: number;
}

export interface OptimizationResult {
  bestParameters: {
    [key: string]: number;
  };
  metrics: {
    sharpeRatio: number;
    netProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
  };
  convergenceHistory: {
    generation: number;
    bestFitness: number;
    averageFitness: number;
  }[];
  optimizationTime: number;
}
