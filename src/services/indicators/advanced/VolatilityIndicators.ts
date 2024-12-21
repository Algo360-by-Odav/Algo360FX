import { Candle } from '../../../types/trading';

export class VolatilityIndicators {
  /**
   * Calculates Keltner Channels
   * Similar to Bollinger Bands but uses ATR for the bands calculation
   */
  static calculateKeltnerChannels(
    candles: Candle[],
    emaPeriod: number = 20,
    atrPeriod: number = 10,
    multiplier: number = 2
  ): { middle: number[]; upper: number[]; lower: number[] } {
    const middle: number[] = [];
    const upper: number[] = [];
    const lower: number[] = [];
    
    // Calculate EMA
    const emaMultiplier = 2 / (emaPeriod + 1);
    middle[0] = candles[0].close;
    
    for (let i = 1; i < candles.length; i++) {
      middle[i] = (candles[i].close - middle[i - 1]) * emaMultiplier + middle[i - 1];
    }

    // Calculate ATR
    const trueRanges: number[] = [0];
    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;
      
      trueRanges[i] = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
    }

    const atr: number[] = [trueRanges[0]];
    for (let i = 1; i < candles.length; i++) {
      atr[i] = (atr[i - 1] * (atrPeriod - 1) + trueRanges[i]) / atrPeriod;
    }

    // Calculate bands
    for (let i = 0; i < candles.length; i++) {
      upper[i] = middle[i] + (multiplier * atr[i]);
      lower[i] = middle[i] - (multiplier * atr[i]);
    }

    return { middle, upper, lower };
  }

  /**
   * Calculates Average True Range Percentage (ATRP)
   * ATR relative to the current price, expressed as a percentage
   */
  static calculateATRP(candles: Candle[], period: number = 14): number[] {
    const atrp: number[] = [];
    const trueRanges: number[] = [0];

    // Calculate True Ranges
    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;
      
      trueRanges[i] = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
    }

    // Calculate ATRP
    for (let i = 0; i < candles.length; i++) {
      if (i < period) {
        atrp[i] = 0;
        continue;
      }

      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += trueRanges[j];
      }

      const atr = sum / period;
      atrp[i] = (atr / candles[i].close) * 100;
    }

    return atrp;
  }

  /**
   * Calculates Historical Volatility
   * Measures price volatility by calculating the standard deviation of price changes
   */
  static calculateHistoricalVolatility(
    candles: Candle[],
    period: number = 20,
    annualizationFactor: number = 252
  ): number[] {
    const volatility: number[] = [];
    const returns: number[] = [0];

    // Calculate log returns
    for (let i = 1; i < candles.length; i++) {
      returns[i] = Math.log(candles[i].close / candles[i - 1].close);
    }

    // Calculate Historical Volatility
    for (let i = 0; i < candles.length; i++) {
      if (i < period) {
        volatility[i] = 0;
        continue;
      }

      // Calculate mean of returns
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += returns[j];
      }
      const mean = sum / period;

      // Calculate variance
      let variance = 0;
      for (let j = i - period + 1; j <= i; j++) {
        variance += Math.pow(returns[j] - mean, 2);
      }
      variance /= (period - 1);

      // Calculate annualized volatility
      volatility[i] = Math.sqrt(variance * annualizationFactor) * 100;
    }

    return volatility;
  }

  /**
   * Calculates Chaikin Volatility
   * Measures volatility by calculating the rate of change of the ATR
   */
  static calculateChaikinVolatility(
    candles: Candle[],
    emaPeriod: number = 10,
    rocPeriod: number = 10
  ): number[] {
    const volatility: number[] = [];
    const trueRanges: number[] = [0];

    // Calculate True Ranges
    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;
      
      trueRanges[i] = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
    }

    // Calculate EMA of True Ranges
    const ema: number[] = [trueRanges[0]];
    const multiplier = 2 / (emaPeriod + 1);
    
    for (let i = 1; i < candles.length; i++) {
      ema[i] = (trueRanges[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }

    // Calculate Rate of Change
    for (let i = 0; i < candles.length; i++) {
      if (i < rocPeriod) {
        volatility[i] = 0;
        continue;
      }

      volatility[i] = ((ema[i] - ema[i - rocPeriod]) / ema[i - rocPeriod]) * 100;
    }

    return volatility;
  }
}
