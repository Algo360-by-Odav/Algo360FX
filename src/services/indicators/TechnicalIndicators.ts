export interface IndicatorResult {
  values: number[];
  timestamp: Date[];
}

export class TechnicalIndicators {
  static SMA(data: number[], period: number): IndicatorResult {
    const values: number[] = [];
    const timestamp: Date[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      values.push(sum / period);
      timestamp.push(new Date());
    }
    
    return { values, timestamp };
  }

  static EMA(data: number[], period: number): IndicatorResult {
    const values: number[] = [];
    const timestamp: Date[] = [];
    const multiplier = 2 / (period + 1);

    let ema = data[0];
    values.push(ema);
    timestamp.push(new Date());

    for (let i = 1; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema;
      values.push(ema);
      timestamp.push(new Date());
    }

    return { values, timestamp };
  }

  static RSI(data: number[], period: number): IndicatorResult {
    const values: number[] = [];
    const timestamp: Date[] = [];
    const changes = data.slice(1).map((price, i) => price - data[i]);
    
    let gains = changes.map(change => change > 0 ? change : 0);
    let losses = changes.map(change => change < 0 ? -change : 0);

    let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

    values.push(100 - (100 / (1 + avgGain / avgLoss)));
    timestamp.push(new Date());

    for (let i = period; i < data.length - 1; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      
      values.push(100 - (100 / (1 + avgGain / avgLoss)));
      timestamp.push(new Date());
    }

    return { values, timestamp };
  }

  static MACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): IndicatorResult {
    const fastEMA = this.EMA(data, fastPeriod).values;
    const slowEMA = this.EMA(data, slowPeriod).values;
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.EMA(macdLine, signalPeriod).values;
    const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

    return {
      values: histogram,
      timestamp: Array(histogram.length).fill(null).map(() => new Date())
    };
  }

  static Bollinger(data: number[], period: number = 20, stdDev: number = 2): IndicatorResult {
    const sma = this.SMA(data, period).values;
    const timestamp: Date[] = Array(sma.length).fill(null).map(() => new Date());
    const bands: number[] = [];

    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      bands.push(std * stdDev);
    }

    return { values: bands, timestamp };
  }
}
