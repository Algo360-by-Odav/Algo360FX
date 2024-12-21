import { Matrix } from '../utils/matrix';

export type TimeFrame = '1s' | '5s' | '10s' | '30s' | '1m' | '5m';

export interface MarketMicrostructure {
  orderBookImbalance: number;
  bidAskSpread: number;
  marketDepth: number;
  volumeProfile: number[];
  tickDirection: 1 | -1 | 0;
  lastTradeSize: number;
}

export interface HFTSignal {
  timestamp: number;
  symbol: string;
  strength: number;
  direction: 1 | -1 | 0;
  confidence: number;
  timeframe: TimeFrame;
  type: HFTSignalType;
  metadata: Record<string, any>;
}

export type HFTSignalType = 
  | 'orderflow_imbalance'
  | 'price_reversion'
  | 'momentum'
  | 'arbitrage'
  | 'market_making'
  | 'statistical_arbitrage'
  | 'latency_arbitrage';

export interface HFTMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  latency: {
    mean: number;
    median: number;
    p95: number;
    p99: number;
  };
}

export interface OrderFlowMetrics {
  volumeWeightedPrice: number;
  buyVolume: number;
  sellVolume: number;
  volumeImbalance: number;
  largeOrdersCount: number;
  orderBookPressure: number;
}

export interface MarketMakingMetrics {
  inventoryLevel: number;
  inventoryRisk: number;
  spreadCapture: number;
  positionTurnover: number;
  quoteLifetime: number;
  fillRatio: number;
}

export interface StatArbSignal {
  pair: [string, string];
  zscore: number;
  halfLife: number;
  correlation: number;
  cointegrationScore: number;
  spreadVolatility: number;
}

export interface HFTStrategyConfig {
  name: string;
  type: HFTSignalType;
  timeframe: TimeFrame;
  parameters: {
    entryThreshold: number;
    exitThreshold: number;
    stopLoss: number;
    takeProfit: number;
    maxPositions: number;
    maxDrawdown: number;
    riskPerTrade: number;
    minVolume: number;
    maxSpread: number;
    minImbalance: number;
    correlationThreshold: number;
    lookbackPeriod: number;
    volatilityWindow: number;
    momentumPeriod: number;
    meanReversionStrength: number;
    inventoryLimits: {
      max: number;
      min: number;
    };
  };
  riskManagement: {
    maxLeverage: number;
    maxRiskPerTrade: number;
    maxDailyLoss: number;
    maxPositionSize: number;
    emergencyCloseThreshold: number;
  };
  execution: {
    orderTypes: ('market' | 'limit' | 'ioc' | 'post_only')[];
    timeInForce: ('gtc' | 'ioc' | 'fok')[];
    minOrderInterval: number;
    maxOrdersPerSecond: number;
    smartOrderRouting: boolean;
    adaptiveOrderSizing: boolean;
  };
}

export interface HFTPerformanceSnapshot {
  timestamp: number;
  metrics: HFTMetrics;
  orderFlow: OrderFlowMetrics;
  marketMaking: MarketMakingMetrics;
  signals: HFTSignal[];
  positions: {
    symbol: string;
    size: number;
    entryPrice: number;
    unrealizedPnL: number;
    holdingTime: number;
  }[];
  riskMetrics: {
    currentDrawdown: number;
    leverageUtilization: number;
    exposureByStrategy: Record<string, number>;
    valueAtRisk: number;
  };
}
