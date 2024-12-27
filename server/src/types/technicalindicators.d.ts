declare module 'technicalindicators' {
  interface IndicatorInput {
    values: number[];
    period: number;
  }

  interface MACDInput {
    values: number[];
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
    SimpleMAOscillator: boolean;
    SimpleMASignal: boolean;
  }

  interface BollingerBandsInput {
    values: number[];
    period: number;
    stdDev: number;
  }

  export interface MACDOutput {
    MACD: number;
    signal: number;
    histogram: number;
  }

  export interface BollingerBandsOutput {
    upper: number;
    middle: number;
    lower: number;
  }

  export class SMA {
    static calculate(input: IndicatorInput): number[];
  }

  export class RSI {
    static calculate(input: IndicatorInput): number[];
  }

  export class MACD {
    static calculate(input: MACDInput): MACDOutput[];
  }

  export class BollingerBands {
    static calculate(input: BollingerBandsInput): BollingerBandsOutput[];
  }
}
