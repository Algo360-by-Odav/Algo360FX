import { MarketDataPoint } from '../types-new/MarketData';
import { MACD, BollingerBands, RSI, ADX } from 'technicalindicators';

export class TechnicalAnalysisService {
  calculateMACD(data: MarketDataPoint[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): { MACD: number; signal: number; histogram: number; }[] {
    if (!data || data.length === 0) {
      throw new Error('Data is required');
    }

    const closes = data.map(d => d.close);
    const macdInput = {
      values: closes,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };

    const macdResults = MACD.calculate(macdInput);
    return macdResults.map(result => ({
      MACD: result.MACD || 0,
      signal: result.signal || 0,
      histogram: result.histogram || 0
    }));
  }

  calculateBollingerBands(data: MarketDataPoint[], period = 20, stdDev = 2): { upper: number[]; middle: number[]; lower: number[]; } {
    if (!data || data.length === 0) {
      throw new Error('Data is required');
    }

    const closes = data.map(d => d.close);
    const bbInput = {
      period,
      values: closes,
      stdDev
    };

    const bbResults = BollingerBands.calculate(bbInput);
    const upper = bbResults.map(r => r.upper);
    const middle = bbResults.map(r => r.middle);
    const lower = bbResults.map(r => r.lower);

    return { upper, middle, lower };
  }

  calculateRSI(data: MarketDataPoint[], period = 14): number[] {
    if (!data || data.length === 0) {
      throw new Error('Data is required');
    }

    const closes = data.map(d => d.close);
    const rsiInput = {
      values: closes,
      period
    };

    return RSI.calculate(rsiInput);
  }

  calculateStochastic(data: MarketDataPoint[], period = 14, signalPeriod = 3): { k: number[]; d: number[]; } {
    if (!data || data.length === 0) {
      throw new Error('Data is required');
    }

    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const closes = data.map(d => d.close);

    const stochK: number[] = [];
    const stochD: number[] = [];

    // Calculate %K
    for (let i = period - 1; i < data.length; i++) {
      const currentClose = closes[i];
      const highestHigh = Math.max(...highs.slice(i - period + 1, i + 1));
      const lowestLow = Math.min(...lows.slice(i - period + 1, i + 1));
      const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
      stochK.push(k);
    }

    // Calculate %D (SMA of %K)
    for (let i = signalPeriod - 1; i < stochK.length; i++) {
      const d = stochK.slice(i - signalPeriod + 1, i + 1).reduce((a, b) => a + b) / signalPeriod;
      stochD.push(d);
    }

    return {
      k: stochK,
      d: stochD
    };
  }

  calculateADX(data: MarketDataPoint[], period = 14): number[] {
    if (!data || data.length === 0) {
      throw new Error('Data is required');
    }

    const adxInput = {
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      period
    };

    const adxResults = ADX.calculate(adxInput);
    return adxResults.map(r => r.adx);
  }
}
