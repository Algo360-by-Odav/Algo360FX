export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'TREND_FOLLOWING' | 'MEAN_REVERSION' | 'BREAKOUT' | 'CUSTOM';
  timeframe: TimeFrame;
  symbol: string;
  parameters: Record<string, number>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  timeframe: TimeFrame;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  commission: number;
  slippage: number;
  useSpread: boolean;
  warmupPeriod: number;
  initialCapital: number;
  riskPerTrade: number;
  leverage: number;
}

export interface BacktestResult {
  trades: Trade[];
  equityCurve: number[];
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  initialCapital: number;
  finalCapital: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  entryTime: Date;
  exitTime?: Date;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;
  commission?: number;
  leverage?: number;
  duration?: number;
}

export interface Position {
  symbol: string;
  size: number;
  price: number;
  side: 'LONG' | 'SHORT';
  unrealizedPnl: number;
  realizedPnl: number;
  margin: number;
  leverage: number;
  liquidationPrice: number;
  openTime: Date;
}

export interface Portfolio {
  userId: string;
  balance: number;
  margin: number;
  equity: number;
  freeMargin: number;
  marginLevel: number;
  positions: Position[];
  openOrders: Trade[];
  closedTrades: Trade[];
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TimeFrame = 
  | '1m'  // 1 minute
  | '5m'  // 5 minutes
  | '15m' // 15 minutes
  | '30m' // 30 minutes
  | '1h'  // 1 hour
  | '4h'  // 4 hours
  | '1d'  // 1 day
  | '1w'  // 1 week
  | '1M';  // 1 month

export interface Candle {
  timestamp: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBook {
  symbol: string;
  timestamp: Date;
  bids: [number, number][]; // [price, size][]
  asks: [number, number][]; // [price, size][]
}

export interface Ticker {
  symbol: string;
  timestamp: Date;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  change: number;
  changePercent: number;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorResult {
  values: number[];
  colors?: string[];
  labels?: string[];
}

export interface ChartConfiguration {
  type: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: any[];
      type?: string;
      borderColor?: string;
      backgroundColor?: string;
      yAxisID?: string;
      fill?: boolean | string | number;
    }>;
  };
  options: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    scales: {
      x?: {
        type: string;
        time?: {
          unit: 'minute' | 'hour' | 'day';
        };
      };
      y?: {
        type: string;
        position: string;
      };
      [key: string]: any;
    };
    plugins?: {
      legend?: {
        position: string;
      };
      tooltip?: {
        mode: string;
        intersect: boolean;
      };
    };
  };
}

export interface IndicatorOptions {
  period?: number;
  stdDev?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  source?: 'close' | 'open' | 'high' | 'low' | 'hl2' | 'hlc3' | 'ohlc4';
  displacement?: number;
  multiplier?: number;
}

export interface ChartStyle {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  candleUpColor: string;
  candleDownColor: string;
  volumeUpColor: string;
  volumeDownColor: string;
  lineColors: string[];
  crosshairColor: string;
  fontFamily: string;
}

export interface ChartAnnotation {
  id: string;
  type: 'line' | 'text' | 'rectangle' | 'circle' | 'arrow' | 'fibonacci' | 'pitchfork';
  points: Array<{ x: number; y: number }>;
  text?: string;
  style: {
    color: string;
    lineWidth: number;
    fillColor?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
  };
  visible: boolean;
}

export interface DrawingTool {
  type: 'line' | 'text' | 'rectangle' | 'circle' | 'arrow' | 'fibonacci' | 'pitchfork';
  mode: 'draw' | 'edit' | 'delete';
  style: {
    color: string;
    lineWidth: number;
    fillColor?: string;
    fontSize?: number;
    fontFamily?: string;
  };
}

export interface ComparisonSeries {
  id: string;
  symbol: string;
  data: CandleData[];
  color: string;
  visible: boolean;
  type: 'price' | 'percentage';
  baseValue?: number;
}

export interface ExtendedChartOptions {
  // General options
  showVolume: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  showCrosshair: boolean;
  theme: 'light' | 'dark' | 'custom';
  
  // Zoom and navigation
  enableZoom: boolean;
  enablePan: boolean;
  autoScale: boolean;
  zoomLevel: number;
  
  // Time axis
  timeFormat: string;
  showTimeScale: boolean;
  timeScaleFormat: 'date' | 'time' | 'datetime';
  
  // Price axis
  priceFormat: {
    precision: number;
    minMove: number;
    prefix?: string;
    suffix?: string;
  };
  showPriceScale: boolean;
  priceScalePosition: 'left' | 'right';
  
  // Comparison
  comparisonMode: 'overlay' | 'separate';
  normalizeComparison: boolean;
  
  // Annotations
  enableAnnotations: boolean;
  annotationDefaults: {
    color: string;
    lineWidth: number;
    fillColor: string;
    fontSize: number;
    fontFamily: string;
  };
  
  // Drawing tools
  enableDrawingTools: boolean;
  drawingDefaults: {
    color: string;
    lineWidth: number;
    fillColor: string;
    fontSize: number;
    fontFamily: string;
  };
}

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

export type TimeFrameType = '1M' | '5M' | '15M' | '1H' | '4H' | '1D';

export type ChartType = 
  | 'candlestick'
  | 'line'
  | 'area'
  | 'bar'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'heikinAshi'
  | 'renko'
  | 'kagi'
  | 'pointfigure';

export interface AreaChartOptions {
  fillColor?: string;
  fillOpacity?: number;
  showPoints?: boolean;
  curved?: boolean;
}

export interface ScatterChartOptions {
  pointSize?: number;
  pointStyle?: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle';
}

export interface HeikinAshiData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface RenkoData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  brickSize: number;
}

export interface KagiData {
  timestamp: number;
  price: number;
  direction: 'up' | 'down';
  reversal: boolean;
}

export interface StrategyContext {
  timestamp: Date;
  symbol: string;
  timeframe: TimeFrame;
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

export interface StrategySignal {
  timestamp: Date;
  type: 'ENTRY' | 'EXIT';
  direction: 'LONG' | 'SHORT';
  price: number;
  reason: string;
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

export interface MarketEnvironment {
  trend: 'uptrend' | 'downtrend' | 'sideways';
  volatility: 'low' | 'medium' | 'high';
  volume: 'low' | 'normal' | 'high';
  regime: 'trending' | 'ranging' | 'breakout' | 'reversal';
  momentum: 'strong' | 'weak' | 'neutral';
  correlation: Record<string, number>;
  volatilityIndex: number;
  marketStrength: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidityScore: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface OptimizationResult {
  bestByProfitFactor: StrategyPerformance;
  bestBySharpeRatio: StrategyPerformance;
  bestByMaxDrawdown: StrategyPerformance;
  robustParameters: StrategyPerformance[];
  allResults: StrategyPerformance[];
}

export interface StrategyParameter {
  name: string;
  min: number;
  max: number;
  step: number;
}

export interface StrategyPerformance {
  parameters: Record<string, number>;
  performance: BacktestResult;
  robustness?: number;
  metrics: {
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    expectancy: number;
    recoveryFactor: number;
    calmarRatio: number;
    sortinoRatio: number;
    trades: number;
    profitableMonths: number;
    maxConsecutiveLosses: number;
    averageWin: number;
    averageLoss: number;
    averageHoldingPeriod: number;
    profitabilityByTimeframe: Record<TimeFrame, number>;
    profitabilityByMarketCondition: Record<string, number>;
  };
}
