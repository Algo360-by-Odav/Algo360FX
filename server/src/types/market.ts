import { TimeFrame } from '../services/strategyService';

export interface MarketData {
  readonly symbol: string;
  readonly timeframe: TimeFrame;
  readonly timestamp: Date;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
}

export interface MACDOutput {
  readonly MACD: number;
  readonly signal: number;
  readonly histogram: number;
}

export interface BollingerBandsOutput {
  readonly upper: number;
  readonly middle: number;
  readonly lower: number;
}

export interface TechnicalIndicator {
  readonly name: string;
  readonly value: number;
  readonly period?: number;
  readonly timestamp: Date;
}

export interface PriceLevel {
  readonly price: number;
  readonly strength: number;  // 1-10, higher means stronger level
  readonly timestamp: Date;
  readonly touches: number;  // Number of times price has touched this level
}

export interface VolumeProfile {
  readonly price: number;
  readonly volume: number;
  readonly timestamp: Date;
}

export interface MarketStructure {
  readonly trend: {
    readonly direction: 'up' | 'down' | 'sideways';
    readonly strength: number;  // 1-10, higher means stronger trend
    readonly startTime: Date;
    readonly endTime: Date;
  };
  readonly momentum: {
    readonly value: number;  // -100 to 100
    readonly timestamp: Date;
  };
  readonly volatility: {
    readonly value: number;  // Standard deviation of returns
    readonly timestamp: Date;
  };
}

export interface MarketContext {
  readonly price: MarketData;
  readonly indicators: {
    readonly sma: {
      readonly [period: number]: number;
    };
    readonly rsi: number;
    readonly macd: MACDOutput;
    readonly bb: BollingerBandsOutput;
  };
  readonly structure: MarketStructure;
  readonly levels: {
    readonly support: PriceLevel[];
    readonly resistance: PriceLevel[];
  };
  readonly volume: {
    readonly profile: VolumeProfile[];
    readonly vwap: number;
  };
}
