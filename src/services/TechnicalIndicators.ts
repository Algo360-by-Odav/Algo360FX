import {
  CandleData,
  IndicatorResult,
  ChartConfiguration,
} from '../types/trading';

export class TechnicalIndicators {
  // Trend Indicators
  static calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
        continue;
      }
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  static calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA uses SMA
    const firstSMA = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(firstSMA);
    
    for (let i = 1; i < data.length; i++) {
      const value = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
      ema.push(value);
    }
    return ema;
  }

  static calculateMACD(data: number[]): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const fastEMA = this.calculateEMA(data, 12);
    const slowEMA = this.calculateEMA(data, 26);
    const macd: number[] = [];
    
    // Calculate MACD line
    for (let i = 0; i < data.length; i++) {
      macd.push(fastEMA[i] - slowEMA[i]);
    }
    
    // Calculate Signal line (9-day EMA of MACD)
    const signal = this.calculateEMA(macd, 9);
    
    // Calculate Histogram
    const histogram = macd.map((value, i) => value - signal[i]);
    
    return { macd, signal, histogram };
  }

  // Momentum Indicators
  static calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    // Calculate average gains and losses
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    // Calculate RSI
    for (let i = period; i < data.length; i++) {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
      
      // Update averages
      avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    }
    
    return rsi;
  }

  static calculateStochastic(data: CandleData[], period: number = 14): {
    k: number[];
    d: number[];
  } {
    const k: number[] = [];
    const highs = data.map(candle => candle.high);
    const lows = data.map(candle => candle.low);
    const closes = data.map(candle => candle.close);
    
    for (let i = period - 1; i < data.length; i++) {
      const periodHigh = Math.max(...highs.slice(i - period + 1, i + 1));
      const periodLow = Math.min(...lows.slice(i - period + 1, i + 1));
      const close = closes[i];
      
      k.push(((close - periodLow) / (periodHigh - periodLow)) * 100);
    }
    
    // Calculate %D (3-period SMA of %K)
    const d = this.calculateSMA(k, 3);
    
    return { k, d };
  }

  // Volatility Indicators
  static calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): {
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
      upper.push(middle[i - period + 1] + (stdDev * std));
      lower.push(middle[i - period + 1] - (stdDev * std));
    }
    
    return { upper, middle, lower };
  }

  static calculateATR(data: CandleData[], period: number = 14): number[] {
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
    let atrValue = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
    atr.push(atrValue);
    
    for (let i = period; i < tr.length; i++) {
      atrValue = ((atrValue * (period - 1)) + tr[i]) / period;
      atr.push(atrValue);
    }
    
    return atr;
  }

  // Volume Indicators
  static calculateOBV(data: CandleData[]): number[] {
    const obv: number[] = [0];
    
    for (let i = 1; i < data.length; i++) {
      const currentClose = data[i].close;
      const prevClose = data[i - 1].close;
      const currentVolume = data[i].volume;
      
      if (currentClose > prevClose) {
        obv.push(obv[i - 1] + currentVolume);
      } else if (currentClose < prevClose) {
        obv.push(obv[i - 1] - currentVolume);
      } else {
        obv.push(obv[i - 1]);
      }
    }
    
    return obv;
  }

  // Custom Indicators
  static calculatePivotPoints(data: CandleData[]): {
    r3: number;
    r2: number;
    r1: number;
    pp: number;
    s1: number;
    s2: number;
    s3: number;
  } {
    const lastCandle = data[data.length - 1];
    const high = lastCandle.high;
    const low = lastCandle.low;
    const close = lastCandle.close;
    
    const pp = (high + low + close) / 3;
    const r1 = (2 * pp) - low;
    const s1 = (2 * pp) - high;
    const r2 = pp + (high - low);
    const s2 = pp - (high - low);
    const r3 = high + 2 * (pp - low);
    const s3 = low - 2 * (high - pp);
    
    return { r3, r2, r1, pp, s1, s2, s3 };
  }

  static calculateIchimoku(data: CandleData[]): {
    tenkan: number[];
    kijun: number[];
    senkou_a: number[];
    senkou_b: number[];
    chikou: number[];
  } {
    const highs = data.map(candle => candle.high);
    const lows = data.map(candle => candle.low);
    const closes = data.map(candle => candle.close);
    
    const tenkan: number[] = [];
    const kijun: number[] = [];
    const senkou_a: number[] = [];
    const senkou_b: number[] = [];
    const chikou = closes.map((close, i) => i >= 26 ? close : NaN);
    
    // Calculate Tenkan-sen (Conversion Line): (9-period high + 9-period low)/2
    for (let i = 8; i < data.length; i++) {
      const periodHigh = Math.max(...highs.slice(i - 8, i + 1));
      const periodLow = Math.min(...lows.slice(i - 8, i + 1));
      tenkan.push((periodHigh + periodLow) / 2);
    }
    
    // Calculate Kijun-sen (Base Line): (26-period high + 26-period low)/2
    for (let i = 25; i < data.length; i++) {
      const periodHigh = Math.max(...highs.slice(i - 25, i + 1));
      const periodLow = Math.min(...lows.slice(i - 25, i + 1));
      kijun.push((periodHigh + periodLow) / 2);
    }
    
    // Calculate Senkou Span A (Leading Span A): (Tenkan-sen + Kijun-sen)/2
    for (let i = 0; i < tenkan.length && i < kijun.length; i++) {
      senkou_a.push((tenkan[i] + kijun[i]) / 2);
    }
    
    // Calculate Senkou Span B (Leading Span B): (52-period high + 52-period low)/2
    for (let i = 51; i < data.length; i++) {
      const periodHigh = Math.max(...highs.slice(i - 51, i + 1));
      const periodLow = Math.min(...lows.slice(i - 51, i + 1));
      senkou_b.push((periodHigh + periodLow) / 2);
    }
    
    return { tenkan, kijun, senkou_a, senkou_b, chikou };
  }

  // Helper Functions
  private static calculateStandardDeviation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squareDiffs = data.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(avgSquareDiff);
  }

  // Chart Configuration Generators
  static generateChartConfig(
    data: CandleData[],
    indicators: string[],
    timeframe: string
  ): ChartConfiguration {
    const closes = data.map(candle => candle.close);
    const config: ChartConfiguration = {
      type: 'candlestick',
      data: {
        labels: data.map(candle => new Date(candle.timestamp).toLocaleString()),
        datasets: [
          {
            label: 'Price',
            data: data.map(candle => ({
              t: candle.timestamp,
              o: candle.open,
              h: candle.high,
              l: candle.low,
              c: candle.close,
            })),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: this.determineTimeUnit(timeframe),
            },
          },
          y: {
            type: 'linear',
            position: 'right',
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
      },
    };

    // Add requested indicators
    indicators.forEach(indicator => {
      switch (indicator.toLowerCase()) {
        case 'sma':
          this.addSMAToChart(config, closes);
          break;
        case 'ema':
          this.addEMAToChart(config, closes);
          break;
        case 'macd':
          this.addMACDToChart(config, closes);
          break;
        case 'rsi':
          this.addRSIToChart(config, closes);
          break;
        case 'bollinger':
          this.addBollingerBandsToChart(config, closes);
          break;
        case 'ichimoku':
          this.addIchimokuToChart(config, data);
          break;
      }
    });

    return config;
  }

  private static determineTimeUnit(timeframe: string): 'minute' | 'hour' | 'day' {
    if (timeframe.includes('M')) return 'minute';
    if (timeframe.includes('H')) return 'hour';
    return 'day';
  }

  private static addSMAToChart(config: ChartConfiguration, data: number[]) {
    const sma20 = this.calculateSMA(data, 20);
    const sma50 = this.calculateSMA(data, 50);
    const sma200 = this.calculateSMA(data, 200);

    config.data.datasets.push(
      {
        label: 'SMA 20',
        data: sma20,
        borderColor: 'rgba(255, 99, 132, 1)',
        type: 'line',
      },
      {
        label: 'SMA 50',
        data: sma50,
        borderColor: 'rgba(54, 162, 235, 1)',
        type: 'line',
      },
      {
        label: 'SMA 200',
        data: sma200,
        borderColor: 'rgba(75, 192, 192, 1)',
        type: 'line',
      }
    );
  }

  private static addEMAToChart(config: ChartConfiguration, data: number[]) {
    const ema20 = this.calculateEMA(data, 20);
    const ema50 = this.calculateEMA(data, 50);

    config.data.datasets.push(
      {
        label: 'EMA 20',
        data: ema20,
        borderColor: 'rgba(153, 102, 255, 1)',
        type: 'line',
      },
      {
        label: 'EMA 50',
        data: ema50,
        borderColor: 'rgba(255, 159, 64, 1)',
        type: 'line',
      }
    );
  }

  private static addMACDToChart(config: ChartConfiguration, data: number[]) {
    const { macd, signal, histogram } = this.calculateMACD(data);

    // Add new scale for MACD
    config.options.scales.macd = {
      type: 'linear',
      position: 'bottom',
      grid: {
        drawOnChartArea: false,
      },
    };

    config.data.datasets.push(
      {
        label: 'MACD',
        data: macd,
        borderColor: 'rgba(255, 99, 132, 1)',
        type: 'line',
        yAxisID: 'macd',
      },
      {
        label: 'Signal',
        data: signal,
        borderColor: 'rgba(54, 162, 235, 1)',
        type: 'line',
        yAxisID: 'macd',
      },
      {
        label: 'Histogram',
        data: histogram,
        backgroundColor: histogram.map(h => h >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'),
        type: 'bar',
        yAxisID: 'macd',
      }
    );
  }

  private static addRSIToChart(config: ChartConfiguration, data: number[]) {
    const rsi = this.calculateRSI(data);

    // Add new scale for RSI
    config.options.scales.rsi = {
      type: 'linear',
      position: 'bottom',
      min: 0,
      max: 100,
      grid: {
        drawOnChartArea: false,
      },
    };

    config.data.datasets.push({
      label: 'RSI',
      data: rsi,
      borderColor: 'rgba(153, 102, 255, 1)',
      type: 'line',
      yAxisID: 'rsi',
    });
  }

  private static addBollingerBandsToChart(config: ChartConfiguration, data: number[]) {
    const { upper, middle, lower } = this.calculateBollingerBands(data);

    config.data.datasets.push(
      {
        label: 'BB Upper',
        data: upper,
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: '+1',
        type: 'line',
      },
      {
        label: 'BB Middle',
        data: middle,
        borderColor: 'rgba(54, 162, 235, 0.5)',
        type: 'line',
      },
      {
        label: 'BB Lower',
        data: lower,
        borderColor: 'rgba(75, 192, 192, 0.5)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: '-1',
        type: 'line',
      }
    );
  }

  private static addIchimokuToChart(config: ChartConfiguration, data: CandleData[]) {
    const ichimoku = this.calculateIchimoku(data);

    config.data.datasets.push(
      {
        label: 'Tenkan-sen',
        data: ichimoku.tenkan,
        borderColor: 'rgba(255, 99, 132, 1)',
        type: 'line',
      },
      {
        label: 'Kijun-sen',
        data: ichimoku.kijun,
        borderColor: 'rgba(54, 162, 235, 1)',
        type: 'line',
      },
      {
        label: 'Senkou Span A',
        data: ichimoku.senkou_a,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: '+1',
        type: 'line',
      },
      {
        label: 'Senkou Span B',
        data: ichimoku.senkou_b,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        fill: '-1',
        type: 'line',
      },
      {
        label: 'Chikou Span',
        data: ichimoku.chikou,
        borderColor: 'rgba(255, 159, 64, 1)',
        type: 'line',
      }
    );
  }
}
