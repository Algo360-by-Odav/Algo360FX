import { Candle } from '../types/trading';

export interface Pattern {
  type: string;
  start: number;
  end: number;
  probability: number;
  description: string;
}

export class ChartAnalysisService {
  static recognizePatterns(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    
    // Head and Shoulders
    patterns.push(...this.findHeadAndShoulders(data));
    
    // Double Top/Bottom
    patterns.push(...this.findDoublePatterms(data));
    
    // Triangle Patterns
    patterns.push(...this.findTrianglePatterns(data));
    
    // Wedge Patterns
    patterns.push(...this.findWedgePatterns(data));
    
    // Channel Patterns
    patterns.push(...this.findChannelPatterns(data));
    
    // Harmonic Patterns
    patterns.push(...this.findHarmonicPatterns(data));
    
    // Divergence Patterns
    const rsi = this.calculateRSI(data);
    patterns.push(...this.findDivergencePatterns(data, rsi));
    
    return patterns;
  }

  static findHeadAndShoulders(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 20; // Look for pattern in 20-candle windows

    for (let i = window; i < data.length - window; i++) {
      const leftShoulder = this.findLocalHigh(data, i - window, i - window/2);
      const head = this.findLocalHigh(data, i - window/2, i + window/2);
      const rightShoulder = this.findLocalHigh(data, i + window/2, i + window);

      if (leftShoulder && head && rightShoulder) {
        if (head.high > leftShoulder.high && 
            head.high > rightShoulder.high && 
            Math.abs(leftShoulder.high - rightShoulder.high) / leftShoulder.high < 0.02) {
          patterns.push({
            type: 'Head and Shoulders',
            start: i - window,
            end: i + window,
            probability: 0.8,
            description: 'Potential reversal pattern indicating trend change'
          });
        }
      }
    }

    return patterns;
  }

  static findDoublePatterms(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 15;

    for (let i = window; i < data.length - window; i++) {
      const first = this.findLocalHigh(data, i - window, i);
      const second = this.findLocalHigh(data, i, i + window);

      if (first && second) {
        if (Math.abs(first.high - second.high) / first.high < 0.01) {
          patterns.push({
            type: 'Double Top',
            start: i - window,
            end: i + window,
            probability: 0.75,
            description: 'Potential reversal indicating trend change from bullish to bearish'
          });
        }
      }

      const firstLow = this.findLocalLow(data, i - window, i);
      const secondLow = this.findLocalLow(data, i, i + window);

      if (firstLow && secondLow) {
        if (Math.abs(firstLow.low - secondLow.low) / firstLow.low < 0.01) {
          patterns.push({
            type: 'Double Bottom',
            start: i - window,
            end: i + window,
            probability: 0.75,
            description: 'Potential reversal indicating trend change from bearish to bullish'
          });
        }
      }
    }

    return patterns;
  }

  static findTrianglePatterns(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 20;

    for (let i = window; i < data.length - window; i++) {
      const highs = data.slice(i - window, i + window).map(c => c.high);
      const lows = data.slice(i - window, i + window).map(c => c.low);

      const highTrend = this.calculateTrendline(highs);
      const lowTrend = this.calculateTrendline(lows);

      if (Math.abs(highTrend) < 0.001 && lowTrend > 0.001) {
        patterns.push({
          type: 'Ascending Triangle',
          start: i - window,
          end: i + window,
          probability: 0.7,
          description: 'Bullish continuation pattern with resistance level'
        });
      } else if (highTrend < -0.001 && Math.abs(lowTrend) < 0.001) {
        patterns.push({
          type: 'Descending Triangle',
          start: i - window,
          end: i + window,
          probability: 0.7,
          description: 'Bearish continuation pattern with support level'
        });
      } else if (Math.abs(highTrend + lowTrend) < 0.001) {
        patterns.push({
          type: 'Symmetrical Triangle',
          start: i - window,
          end: i + window,
          probability: 0.65,
          description: 'Continuation pattern indicating potential breakout'
        });
      }
    }

    return patterns;
  }

  static findWedgePatterns(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 20;

    for (let i = window; i < data.length - window; i++) {
      const highs = data.slice(i - window, i + window).map(c => c.high);
      const lows = data.slice(i - window, i + window).map(c => c.low);

      const highTrend = this.calculateTrendline(highs);
      const lowTrend = this.calculateTrendline(lows);

      if (highTrend < -0.001 && lowTrend < -0.001 && Math.abs(highTrend - lowTrend) < 0.0005) {
        patterns.push({
          type: 'Falling Wedge',
          start: i - window,
          end: i + window,
          probability: 0.75,
          description: 'Bullish reversal pattern'
        });
      } else if (highTrend > 0.001 && lowTrend > 0.001 && Math.abs(highTrend - lowTrend) < 0.0005) {
        patterns.push({
          type: 'Rising Wedge',
          start: i - window,
          end: i + window,
          probability: 0.75,
          description: 'Bearish reversal pattern'
        });
      }
    }

    return patterns;
  }

  static findChannelPatterns(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 30;

    for (let i = window; i < data.length - window; i++) {
      const slice = data.slice(i - window, i + window);
      const highs = slice.map(c => c.high);
      const lows = slice.map(c => c.low);

      const highTrend = this.calculateTrendline(highs);
      const lowTrend = this.calculateTrendline(lows);

      const channelWidth = Math.abs(highs[0] - lows[0]);
      const endChannelWidth = Math.abs(highs[highs.length - 1] - lows[lows.length - 1]);

      if (Math.abs(highTrend - lowTrend) < 0.0005 && Math.abs(channelWidth - endChannelWidth) / channelWidth < 0.1) {
        if (highTrend > 0.001) {
          patterns.push({
            type: 'Ascending Channel',
            start: i - window,
            end: i + window,
            probability: 0.7,
            description: 'Bullish continuation pattern'
          });
        } else if (highTrend < -0.001) {
          patterns.push({
            type: 'Descending Channel',
            start: i - window,
            end: i + window,
            probability: 0.7,
            description: 'Bearish continuation pattern'
          });
        }
      }
    }

    return patterns;
  }

  static findHarmonicPatterns(data: Candle[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 30;

    for (let i = window; i < data.length - window; i++) {
      const slice = data.slice(i - window, i + window);
      
      // Gartley Pattern
      const gartley = this.findGartleyPattern(slice);
      if (gartley) patterns.push({
        type: 'Gartley',
        start: i - window,
        end: i + window,
        probability: gartley.probability,
        description: `${gartley.direction} Gartley pattern`
      });
      
      // Butterfly Pattern
      const butterfly = this.findButterflyPattern(slice);
      if (butterfly) patterns.push({
        type: 'Butterfly',
        start: i - window,
        end: i + window,
        probability: butterfly.probability,
        description: `${butterfly.direction} Butterfly pattern`
      });
    }

    return patterns;
  }

  static findDivergencePatterns(data: Candle[], rsi: number[]): Pattern[] {
    const patterns: Pattern[] = [];
    const window = 20;

    for (let i = window; i < data.length - window; i++) {
      const priceSlice = data.slice(i - window, i + 1);
      const rsiSlice = rsi.slice(i - window, i + 1);

      // Bullish Divergence
      if (this.isBullishDivergence(priceSlice, rsiSlice)) {
        patterns.push({
          type: 'Bullish Divergence',
          start: i - window,
          end: i,
          probability: 0.8,
          description: 'Price making lower lows while RSI makes higher lows'
        });
      }

      // Bearish Divergence
      if (this.isBearishDivergence(priceSlice, rsiSlice)) {
        patterns.push({
          type: 'Bearish Divergence',
          start: i - window,
          end: i,
          probability: 0.8,
          description: 'Price making higher highs while RSI makes lower highs'
        });
      }
    }

    return patterns;
  }

  private static findGartleyPattern(data: Candle[]): { direction: string; probability: number } | null {
    const swings = this.findSwingPoints(data);
    if (swings.length < 5) return null;

    // Check for bullish Gartley
    const bullish = this.checkGartleyRatios(swings, 'bullish');
    if (bullish) return { direction: 'Bullish', probability: bullish };

    // Check for bearish Gartley
    const bearish = this.checkGartleyRatios(swings, 'bearish');
    if (bearish) return { direction: 'Bearish', probability: bearish };

    return null;
  }

  private static findButterflyPattern(data: Candle[]): { direction: string; probability: number } | null {
    const swings = this.findSwingPoints(data);
    if (swings.length < 5) return null;

    // Check for bullish Butterfly
    const bullish = this.checkButterflyRatios(swings, 'bullish');
    if (bullish) return { direction: 'Bullish', probability: bullish };

    // Check for bearish Butterfly
    const bearish = this.checkButterflyRatios(swings, 'bearish');
    if (bearish) return { direction: 'Bearish', probability: bearish };

    return null;
  }

  private static findSwingPoints(data: Candle[]): { price: number; index: number }[] {
    const swings: { price: number; index: number }[] = [];
    const lookback = 3;

    for (let i = lookback; i < data.length - lookback; i++) {
      // High swing
      if (this.isSwingHigh(data, i, lookback)) {
        swings.push({ price: data[i].high, index: i });
      }
      // Low swing
      else if (this.isSwingLow(data, i, lookback)) {
        swings.push({ price: data[i].low, index: i });
      }
    }

    return swings;
  }

  private static isSwingHigh(data: Candle[], index: number, lookback: number): boolean {
    const price = data[index].high;
    for (let i = index - lookback; i < index + lookback; i++) {
      if (i === index) continue;
      if (data[i].high > price) return false;
    }
    return true;
  }

  private static isSwingLow(data: Candle[], index: number, lookback: number): boolean {
    const price = data[index].low;
    for (let i = index - lookback; i < index + lookback; i++) {
      if (i === index) continue;
      if (data[i].low < price) return false;
    }
    return true;
  }

  private static checkGartleyRatios(swings: { price: number; index: number }[], direction: string): number | null {
    if (swings.length < 5) return null;

    const xaRatio = Math.abs(swings[1].price - swings[0].price);
    const abRatio = Math.abs(swings[2].price - swings[1].price) / xaRatio;
    const bcRatio = Math.abs(swings[3].price - swings[2].price) / Math.abs(swings[2].price - swings[1].price);
    const cdRatio = Math.abs(swings[4].price - swings[3].price) / Math.abs(swings[3].price - swings[2].price);

    // Gartley ratios: AB = 0.618 of XA, BC = 0.382-0.886 of AB, CD = 1.27-1.618 of BC
    const abValid = Math.abs(abRatio - 0.618) < 0.05;
    const bcValid = bcRatio >= 0.382 && bcRatio <= 0.886;
    const cdValid = cdRatio >= 1.27 && cdRatio <= 1.618;

    if (abValid && bcValid && cdValid) {
      // Calculate probability based on how close the ratios are to ideal values
      const probability = 0.7 + 
        (1 - Math.abs(abRatio - 0.618)) * 0.1 +
        (1 - Math.abs(bcRatio - 0.618)) * 0.1 +
        (1 - Math.abs(cdRatio - 1.414)) * 0.1;
      
      return probability;
    }

    return null;
  }

  private static checkButterflyRatios(swings: { price: number; index: number }[], direction: string): number | null {
    if (swings.length < 5) return null;

    const xaRatio = Math.abs(swings[1].price - swings[0].price);
    const abRatio = Math.abs(swings[2].price - swings[1].price) / xaRatio;
    const bcRatio = Math.abs(swings[3].price - swings[2].price) / Math.abs(swings[2].price - swings[1].price);
    const cdRatio = Math.abs(swings[4].price - swings[3].price) / Math.abs(swings[3].price - swings[2].price);

    // Butterfly ratios: AB = 0.786 of XA, BC = 0.382-0.886 of AB, CD = 1.618-2.618 of BC
    const abValid = Math.abs(abRatio - 0.786) < 0.05;
    const bcValid = bcRatio >= 0.382 && bcRatio <= 0.886;
    const cdValid = cdRatio >= 1.618 && cdRatio <= 2.618;

    if (abValid && bcValid && cdValid) {
      // Calculate probability based on how close the ratios are to ideal values
      const probability = 0.7 + 
        (1 - Math.abs(abRatio - 0.786)) * 0.1 +
        (1 - Math.abs(bcRatio - 0.618)) * 0.1 +
        (1 - Math.abs(cdRatio - 2.0)) * 0.1;
      
      return probability;
    }

    return null;
  }

  private static isBullishDivergence(priceData: Candle[], rsiData: number[]): boolean {
    const priceLows = this.findLocalMinima(priceData.map(d => d.low));
    const rsiLows = this.findLocalMinima(rsiData);

    if (priceLows.length < 2 || rsiLows.length < 2) return false;

    // Check if price is making lower lows while RSI is making higher lows
    return priceLows[1] < priceLows[0] && rsiLows[1] > rsiLows[0];
  }

  private static isBearishDivergence(priceData: Candle[], rsiData: number[]): boolean {
    const priceHighs = this.findLocalMaxima(priceData.map(d => d.high));
    const rsiHighs = this.findLocalMaxima(rsiData);

    if (priceHighs.length < 2 || rsiHighs.length < 2) return false;

    // Check if price is making higher highs while RSI is making lower highs
    return priceHighs[1] > priceHighs[0] && rsiHighs[1] < rsiHighs[0];
  }

  private static findLocalMaxima(data: number[]): number[] {
    const maxima: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        maxima.push(data[i]);
      }
    }
    return maxima;
  }

  private static findLocalMinima(data: number[]): number[] {
    const minima: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
        minima.push(data[i]);
      }
    }
    return minima;
  }

  private static findLocalHigh(data: Candle[], start: number, end: number): Candle | null {
    let highest = data[start];
    for (let i = start + 1; i < end; i++) {
      if (data[i].high > highest.high) {
        highest = data[i];
      }
    }
    return highest;
  }

  private static findLocalLow(data: Candle[], start: number, end: number): Candle | null {
    let lowest = data[start];
    for (let i = start + 1; i < end; i++) {
      if (data[i].low < lowest.low) {
        lowest = data[i];
      }
    }
    return lowest;
  }

  private static calculateTrendline(values: number[]): number {
    const n = values.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumXX += i * i;
    }

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  // Technical Analysis Indicators
  static calculateRSI(data: Candle[], period: number = 14): number[] {
    const rsi: number[] = [];
    let gains = 0;
    let losses = 0;

    // Calculate first average gain and loss
    for (let i = 1; i < period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) gains += change;
      else losses -= change;
    }

    gains /= period;
    losses /= period;

    // Calculate RSI for each period
    for (let i = period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) {
        gains = (gains * (period - 1) + change) / period;
        losses = (losses * (period - 1)) / period;
      } else {
        gains = (gains * (period - 1)) / period;
        losses = (losses * (period - 1) - change) / period;
      }

      const rs = gains / losses;
      rsi.push(100 - (100 / (1 + rs)));
    }

    return rsi;
  }

  static calculateMACD(data: Candle[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const fastEMA = this.calculateEMA(data.map(d => d.close), fastPeriod);
    const slowEMA = this.calculateEMA(data.map(d => d.close), slowPeriod);
    const macd = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signal = this.calculateEMA(macd, signalPeriod);
    const histogram = macd.map((value, i) => value - signal[i]);

    return { macd, signal, histogram };
  }

  static calculateBollingerBands(data: Candle[], period: number = 20, stdDev: number = 2): {
    middle: number[];
    upper: number[];
    lower: number[];
  } {
    const closes = data.map(d => d.close);
    const sma = this.calculateSMA(closes, period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = period - 1; i < closes.length; i++) {
      const slice = closes.slice(i - period + 1, i + 1);
      const std = this.calculateStandardDeviation(slice);
      upper.push(sma[i - period + 1] + stdDev * std);
      lower.push(sma[i - period + 1] - stdDev * std);
    }

    return { middle: sma, upper, lower };
  }

  static calculateIchimoku(data: Candle[]): {
    conversionLine: number[];
    baseLine: number[];
    leadingSpanA: number[];
    leadingSpanB: number[];
    laggingSpan: number[];
  } {
    const conversionPeriod = 9;
    const basePeriod = 26;
    const leadingSpanBPeriod = 52;
    const displacement = 26;

    const conversionLine = this.calculateIchimokuLine(data, conversionPeriod);
    const baseLine = this.calculateIchimokuLine(data, basePeriod);
    
    const leadingSpanA = conversionLine.map((val, i) => 
      (val + baseLine[i]) / 2
    );
    
    const leadingSpanB = this.calculateIchimokuLine(data, leadingSpanBPeriod);
    
    // Shift leading spans forward
    for (let i = 0; i < displacement; i++) {
      leadingSpanA.push(leadingSpanA[leadingSpanA.length - 1]);
      leadingSpanB.push(leadingSpanB[leadingSpanB.length - 1]);
    }
    
    const laggingSpan = data.map(d => d.close);
    // Shift lagging span backward
    for (let i = 0; i < displacement; i++) {
      laggingSpan.unshift(laggingSpan[0]);
    }

    return {
      conversionLine,
      baseLine,
      leadingSpanA,
      leadingSpanB,
      laggingSpan
    };
  }

  static calculateStochastic(data: Candle[], period: number = 14, smoothK: number = 3, smoothD: number = 3): {
    k: number[];
    d: number[];
  } {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const closes = data.map(d => d.close);
    const k: number[] = [];
    
    // Calculate raw K values
    for (let i = period - 1; i < data.length; i++) {
      const highSlice = highs.slice(i - period + 1, i + 1);
      const lowSlice = lows.slice(i - period + 1, i + 1);
      const highestHigh = Math.max(...highSlice);
      const lowestLow = Math.min(...lowSlice);
      
      k.push(
        ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100
      );
    }
    
    // Smooth K values
    const smoothedK = this.calculateSMA(k, smoothK);
    // Calculate D values (SMA of smoothed K)
    const d = this.calculateSMA(smoothedK, smoothD);
    
    return { k: smoothedK, d };
  }

  static calculateATR(data: Candle[], period: number = 14): number[] {
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
    let sum = tr.slice(0, period).reduce((a, b) => a + b, 0);
    atr.push(sum / period);
    
    for (let i = period; i < tr.length; i++) {
      atr.push((atr[atr.length - 1] * (period - 1) + tr[i]) / period);
    }
    
    return atr;
  }

  static calculateIchimokuLine(data: Candle[], period: number): number[] {
    const result: number[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const highest = Math.max(...slice.map(d => d.high));
      const lowest = Math.min(...slice.map(d => d.low));
      result.push((highest + lowest) / 2);
    }
    
    return result;
  }

  static calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    let sum = 0;
    
    for (let i = 0; i < period - 1; i++) {
      sum += data[i];
    }
    
    for (let i = period - 1; i < data.length; i++) {
      sum += data[i];
      sma.push(sum / period);
      sum -= data[i - period + 1];
    }
    
    return sma;
  }

  static calculateStandardDeviation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(variance);
  }

  static calculateEMA(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const ema: number[] = [data[0]];

    for (let i = 1; i < data.length; i++) {
      ema.push(data[i] * k + ema[i - 1] * (1 - k));
    }

    return ema;
  }
}
