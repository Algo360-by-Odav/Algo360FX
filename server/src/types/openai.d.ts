import { OpenAI } from 'openai';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export interface AIResponse {
  content: string;
  role: 'assistant' | 'user' | 'system';
}

export interface MarketAnalysis {
  symbol: string;
  timeframe: string;
  analysis: {
    trend: string;
    support: number[];
    resistance: number[];
    indicators: {
      rsi: number;
      macd: {
        value: number;
        signal: number;
        histogram: number;
      };
      bollingerBands: {
        upper: number;
        middle: number;
        lower: number;
      };
    };
    recommendation: string;
    confidence: number;
  };
}

export interface PricePrediction {
  symbol: string;
  timeframe: string;
  prediction: {
    direction: 'up' | 'down' | 'sideways';
    targetPrice: number;
    probability: number;
    timeframe: string;
  };
  confidence: number;
  timestamp: Date;
}

export interface TradingSignal {
  symbol: string;
  timeframe: string;
  signal: 'buy' | 'sell' | 'hold';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

export interface RiskAssessment {
  symbol: string;
  overallRisk: 'low' | 'medium' | 'high';
  metrics: {
    volatility: number;
    correlation: number;
    marketSentiment: number;
    liquidityRisk: number;
  };
  recommendations: string[];
  timestamp: Date;
}
