import { Timeframe } from './trading';

export enum ModelType {
  RANDOM_FOREST = 'RANDOM_FOREST',
  GRADIENT_BOOST = 'GRADIENT_BOOST',
  NEURAL_NETWORK = 'NEURAL_NETWORK',
}

export interface MLModel {
  id: string;
  type: ModelType;
  name: string;
  description: string;
  parameters: any;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionResult {
  timestamp: Date;
  probability: number;
  confidence: number;
  direction: 'UP' | 'DOWN';
  predictedChange: number;
}

export interface FeatureSet {
  timestamp: Date;
  priceFeatures: {
    close: number[];
    high: number[];
    low: number[];
    volume: number[];
  };
  technicalFeatures: {
    rsi: number[];
    macd: number[];
    bollingerBands: number[];
    atr: number[];
  };
  derivedFeatures: {
    returns: number[];
    volatility: number[];
    momentum: number[];
    trendStrength: number[];
  };
}

export interface MarketFeatureSet {
  timestamp: Date;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  technicalIndicators: {
    rsi: number;
    macd: {
      macdLine: number;
      signalLine: number;
      histogram: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
    atr: number;
    adx: number;
    obv: number;
  };
  marketSentiment: {
    volatilityIndex: number;
    trendStrength: number;
    momentum: number;
    volumeProfile: number;
  };
  fundamentals?: {
    interestRates?: number;
    gdp?: number;
    inflation?: number;
    employment?: number;
  };
}

export interface LearningConfig {
  timeframe: Timeframe;
  lookbackPeriod: number;
  maxHoldingPeriod: number;
  minProfitThreshold: number;
  minPatternSignificance: number;
  minExitReliability: number;
  maxDrawdown: number;
  riskParameters: {
    maxPositionSize: number;
    stopLossRange: [number, number];
    takeProfitRange: [number, number];
  };
}

export interface MLJob {
  id: string;
  type: 'TRAINING' | 'PREDICTION' | 'OPTIMIZATION';
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  model?: MLModel;
  config: any;
  results?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ModelEvaluation {
  modelId: string;
  timestamp: Date;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  confusionMatrix: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
  predictions: PredictionResult[];
}
