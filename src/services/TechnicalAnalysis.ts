import { SMA, RSI, MACD } from 'technicalindicators';

interface Indicator {
  value: number;
  signal?: number;
  histogram?: number;
}

export class TechnicalAnalysis {
  calculateSMA(data: number[], period: number): number[] {
    if (!data?.length) return [];
    const sma = new SMA({ period, values: data });
    return sma.getResult();
  }

  calculateRSI(data: number[], period: number = 14): number[] {
    if (!data?.length) return [];
    const rsi = new RSI({ period, values: data });
    return rsi.getResult();
  }

  calculateMACD(data: number[]): Array<{ MACD: number; signal: number; histogram: number }> {
    if (!data?.length) return [];
    const macd = new MACD({
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
    return macd.getResult();
  }

  analyzeIndicators(data: number[]): Record<string, Indicator | null> {
    if (!data?.length) return {
      sma: null,
      rsi: null,
      macd: null
    };
    
    const sma = this.calculateSMA(data, 20);
    const rsi = this.calculateRSI(data);
    const macd = this.calculateMACD(data);
    
    return {
      sma: { value: sma[sma.length - 1] },
      rsi: { value: rsi[rsi.length - 1] },
      macd: macd.length ? {
        value: macd[macd.length - 1].MACD,
        signal: macd[macd.length - 1].signal,
        histogram: macd[macd.length - 1].histogram
      } : null
    };
  }
}
