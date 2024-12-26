import { SMA, RSI, MACD } from 'technicalindicators';

export class TechnicalAnalysis {
  calculateSMA(data: number[], period: number) {
    const sma = new SMA({ period, values: data });
    return sma.getResult();
  }

  calculateRSI(data: number[], period: number = 14) {
    const rsi = new RSI({ period, values: data });
    return rsi.getResult();
  }

  calculateMACD(data: number[]) {
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

  analyzeIndicators(data: number[]) {
    const sma = this.calculateSMA(data, 20);
    const rsi = this.calculateRSI(data);
    const macd = this.calculateMACD(data);
    
    return {
      sma: sma[sma.length - 1],
      rsi: rsi[rsi.length - 1],
      macd: macd[macd.length - 1]
    };
  }
}
