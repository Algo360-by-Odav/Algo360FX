import { logger } from '../../utils/logger';

export class TechnicalIndicatorsService {
  // Moving Averages
  public calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  public calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    ema[0] = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 1; i < data.length - period + 1; i++) {
      ema[i] = (data[i + period - 1] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
  }

  // Oscillators
  public calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    let gains: number[] = [];
    let losses: number[] = [];

    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }

    // Calculate initial averages
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    // Calculate RSI
    for (let i = period; i < data.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;

      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }

    return rsi;
  }

  public calculateMACD(data: number[]): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const fastEMA = this.calculateEMA(data, 12);
    const slowEMA = this.calculateEMA(data, 26);
    const macd: number[] = [];
    
    // Calculate MACD line
    for (let i = 0; i < fastEMA.length; i++) {
      macd.push(fastEMA[i] - slowEMA[i]);
    }

    // Calculate Signal line (9-day EMA of MACD)
    const signal = this.calculateEMA(macd, 9);

    // Calculate Histogram
    const histogram = macd.map((value, i) => value - signal[i]);

    return { macd, signal, histogram };
  }

  // Volatility Indicators
  public calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): {
    upper: number[];
    middle: number[];
    lower: number[];
  } {
    const middle = this.calculateSMA(data, period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const std = this.calculateStandardDeviation(slice);
      upper.push(middle[i - period + 1] + (std * stdDev));
      lower.push(middle[i - period + 1] - (std * stdDev));
    }

    return { upper, middle, lower };
  }

  public calculateATR(data: any[], period: number = 14): number[] {
    const tr: number[] = [];
    const atr: number[] = [];

    // Calculate True Range
    for (let i = 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
      const prevClose = data[i - 1].close;

      tr.push(Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      ));
    }

    // Calculate ATR
    atr[0] = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 1; i < tr.length - period + 1; i++) {
      atr[i] = (atr[i - 1] * (period - 1) + tr[i + period - 1]) / period;
    }

    return atr;
  }

  // Trend Indicators
  public calculateADX(data: any[], period: number = 14): number[] {
    const plusDM: number[] = [];
    const minusDM: number[] = [];
    const tr: number[] = [];
    const adx: number[] = [];

    // Calculate +DM, -DM, and TR
    for (let i = 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
      const prevHigh = data[i - 1].high;
      const prevLow = data[i - 1].low;
      const prevClose = data[i - 1].close;

      const upMove = high - prevHigh;
      const downMove = prevLow - low;

      plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
      tr.push(Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      ));
    }

    // Calculate smoothed averages
    const smoothedPlusDM = this.calculateEMA(plusDM, period);
    const smoothedMinusDM = this.calculateEMA(minusDM, period);
    const smoothedTR = this.calculateEMA(tr, period);

    // Calculate +DI and -DI
    const plusDI = smoothedPlusDM.map((value, i) => (value / smoothedTR[i]) * 100);
    const minusDI = smoothedMinusDM.map((value, i) => (value / smoothedTR[i]) * 100);

    // Calculate DX
    const dx = plusDI.map((value, i) => 
      Math.abs(value - minusDI[i]) / (value + minusDI[i]) * 100
    );

    // Calculate ADX
    return this.calculateEMA(dx, period);
  }

  // Volume Indicators
  public calculateOBV(data: any[]): number[] {
    const obv: number[] = [0];
    
    for (let i = 1; i < data.length; i++) {
      const currentClose = data[i].close;
      const previousClose = data[i - 1].close;
      const currentVolume = data[i].volume;

      if (currentClose > previousClose) {
        obv.push(obv[i - 1] + currentVolume);
      } else if (currentClose < previousClose) {
        obv.push(obv[i - 1] - currentVolume);
      } else {
        obv.push(obv[i - 1]);
      }
    }

    return obv;
  }

  // Pattern Recognition
  public findCandlePatterns(data: any[]): any[] {
    const patterns: any[] = [];

    for (let i = 2; i < data.length; i++) {
      const current = data[i];
      const prev1 = data[i - 1];
      const prev2 = data[i - 2];

      // Doji
      if (this.isDoji(current)) {
        patterns.push({
          type: 'doji',
          position: i,
          price: current.close
        });
      }

      // Hammer
      if (this.isHammer(current)) {
        patterns.push({
          type: 'hammer',
          position: i,
          price: current.close
        });
      }

      // Engulfing
      if (this.isEngulfing(prev1, current)) {
        patterns.push({
          type: current.close > current.open ? 'bullish_engulfing' : 'bearish_engulfing',
          position: i,
          price: current.close
        });
      }

      // Morning/Evening Star
      if (this.isMorningStar(prev2, prev1, current)) {
        patterns.push({
          type: 'morning_star',
          position: i,
          price: current.close
        });
      }
      if (this.isEveningStar(prev2, prev1, current)) {
        patterns.push({
          type: 'evening_star',
          position: i,
          price: current.close
        });
      }
    }

    return patterns;
  }

  // Helper Methods
  private calculateStandardDeviation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(variance);
  }

  private isDoji(candle: any): boolean {
    const bodySize = Math.abs(candle.open - candle.close);
    const totalSize = candle.high - candle.low;
    return bodySize / totalSize < 0.1;
  }

  private isHammer(candle: any): boolean {
    const bodySize = Math.abs(candle.open - candle.close);
    const upperWick = candle.high - Math.max(candle.open, candle.close);
    const lowerWick = Math.min(candle.open, candle.close) - candle.low;
    return lowerWick > bodySize * 2 && upperWick < bodySize * 0.5;
  }

  private isEngulfing(prev: any, current: any): boolean {
    const prevBody = Math.abs(prev.open - prev.close);
    const currentBody = Math.abs(current.open - current.close);
    return currentBody > prevBody * 1.5;
  }

  private isMorningStar(first: any, second: any, third: any): boolean {
    return first.close < first.open && // First bearish
           Math.abs(second.open - second.close) < Math.abs(first.open - first.close) * 0.3 && // Small second
           third.close > third.open; // Third bullish
  }

  private isEveningStar(first: any, second: any, third: any): boolean {
    return first.close > first.open && // First bullish
           Math.abs(second.open - second.close) < Math.abs(first.open - first.close) * 0.3 && // Small second
           third.close < third.open; // Third bearish
  }
}
