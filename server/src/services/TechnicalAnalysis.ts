import { MACD, BollingerBands, RSI, Stochastic, ADX } from 'technicalindicators';
import axios from 'axios';

export interface MarketDataPoint {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: Date;
  volume: number;
}

export interface IndicatorOutput {
  macd: {
    histogram: number;
    signal: number;
    MACD: number;
  }[];
  bollinger: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  rsi: number[];
  stochastic: {
    k: number[];
    d: number[];
  };
  adx: number[];
}

export class TechnicalAnalysis {
  private static convertToArray(points: MarketDataPoint[]): { close: number[]; high: number[]; low: number[]; } {
    return {
      close: points.map(p => p.close),
      high: points.map(p => p.high),
      low: points.map(p => p.low),
    };
  }

  public static calculateMACD(values: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const macd = new MACD({
      values,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
    return macd.getResult();
  }

  public static calculateBollingerBands(values: number[], period = 20, stdDev = 2) {
    const bb = new BollingerBands({
      period,
      values,
      stdDev
    });
    const result = bb.getResult();
    return {
      upper: result.upper,
      middle: result.middle,
      lower: result.lower
    };
  }

  public static calculateRSI(values: number[], period = 14) {
    const rsi = new RSI({
      period,
      values
    });
    return rsi.getResult();
  }

  public static calculateStochastic(high: number[], low: number[], close: number[], period = 14, signalPeriod = 3) {
    const stoch = new Stochastic({
      high,
      low,
      close,
      period,
      signalPeriod
    });
    const result = stoch.getResult();
    return {
      k: result.k,
      d: result.d
    };
  }

  public static calculateADX(high: number[], low: number[], close: number[], period = 14) {
    const adx = new ADX({
      high,
      low,
      close,
      period
    });
    return adx.getResult();
  }

  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketDataPoint[]> {
    try {
      const response = await axios.get<MarketDataPoint[]>(`${process.env.MARKET_DATA_API}/historical`, {
        params: { symbol, timeframe }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch historical data: ${error.message}`);
      }
      throw error;
    }
  }

  public async analyze(symbol: string, timeframe: string): Promise<IndicatorOutput> {
    try {
      const data = await this.getHistoricalData(symbol, timeframe);
      const { close, high, low } = TechnicalAnalysis.convertToArray(data);

      return {
        macd: TechnicalAnalysis.calculateMACD(close),
        bollinger: TechnicalAnalysis.calculateBollingerBands(close),
        rsi: TechnicalAnalysis.calculateRSI(close),
        stochastic: TechnicalAnalysis.calculateStochastic(high, low, close),
        adx: TechnicalAnalysis.calculateADX(high, low, close)
      };
    } catch (error) {
      throw new Error(`Failed to analyze technical indicators: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
