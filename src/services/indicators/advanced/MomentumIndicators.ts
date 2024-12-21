import { Candle } from '../../../types/trading';

export class MomentumIndicators {
  /**
   * Calculates Relative Momentum Index (RMI)
   * Similar to RSI but uses momentum instead of price changes
   */
  static calculateRMI(candles: Candle[], period: number = 14, momentum: number = 3): number[] {
    const rmi: number[] = [];
    const upGains: number[] = [];
    const downGains: number[] = [];

    // Calculate momentum price changes
    for (let i = momentum; i < candles.length; i++) {
      const change = candles[i].close - candles[i - momentum].close;
      upGains[i] = change > 0 ? change : 0;
      downGains[i] = change < 0 ? -change : 0;
    }

    // Fill initial values
    for (let i = 0; i < momentum; i++) {
      upGains[i] = 0;
      downGains[i] = 0;
      rmi[i] = 50;
    }

    // Calculate RMI using smoothed averages
    let upEMA = 0;
    let downEMA = 0;

    for (let i = momentum; i < candles.length; i++) {
      if (i === momentum) {
        // First EMA uses SMA
        let upSum = 0;
        let downSum = 0;
        for (let j = i - period + 1; j <= i; j++) {
          upSum += upGains[j];
          downSum += downGains[j];
        }
        upEMA = upSum / period;
        downEMA = downSum / period;
      } else {
        // Subsequent EMAs
        const multiplier = 2 / (period + 1);
        upEMA = (upGains[i] - upEMA) * multiplier + upEMA;
        downEMA = (downGains[i] - downEMA) * multiplier + downEMA;
      }

      rmi[i] = downEMA === 0 ? 100 : 100 - (100 / (1 + upEMA / downEMA));
    }

    return rmi;
  }

  /**
   * Calculates Stochastic Momentum Index (SMI)
   * A more advanced version of the stochastic oscillator
   */
  static calculateSMI(
    candles: Candle[],
    period: number = 13,
    smoothK: number = 25,
    smoothD: number = 2
  ): { smi: number[]; signal: number[] } {
    const smi: number[] = [];
    const signal: number[] = [];
    
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        smi[i] = 0;
        signal[i] = 0;
        continue;
      }

      let highestHigh = -Infinity;
      let lowestLow = Infinity;
      
      // Find highest high and lowest low in the period
      for (let j = i - period + 1; j <= i; j++) {
        highestHigh = Math.max(highestHigh, candles[j].high);
        lowestLow = Math.min(lowestLow, candles[j].low);
      }

      const median = (highestHigh + lowestLow) / 2;
      const distance = candles[i].close - median;
      const range = highestHigh - lowestLow;
      
      // Calculate raw SMI
      const rawSMI = range !== 0 ? (distance / (range / 2)) * 100 : 0;
      
      // Apply double smoothing
      if (i >= period + smoothK - 1) {
        let firstSmooth = 0;
        for (let j = i - smoothK + 1; j <= i; j++) {
          firstSmooth += rawSMI;
        }
        firstSmooth /= smoothK;

        let secondSmooth = 0;
        for (let j = i - smoothD + 1; j <= i; j++) {
          secondSmooth += firstSmooth;
        }
        secondSmooth /= smoothD;

        smi[i] = secondSmooth;
      } else {
        smi[i] = rawSMI;
      }
    }

    // Calculate signal line (EMA of SMI)
    const signalPeriod = 10;
    const multiplier = 2 / (signalPeriod + 1);
    signal[period - 1] = smi[period - 1];

    for (let i = period; i < candles.length; i++) {
      signal[i] = (smi[i] - signal[i - 1]) * multiplier + signal[i - 1];
    }

    return { smi, signal };
  }

  /**
   * Calculates Ultimate Oscillator (UO)
   * Combines three different time periods to reduce volatility and false signals
   */
  static calculateUO(
    candles: Candle[],
    period1: number = 7,
    period2: number = 14,
    period3: number = 28,
    weight1: number = 4,
    weight2: number = 2,
    weight3: number = 1
  ): number[] {
    const uo: number[] = [];
    const maxPeriod = Math.max(period1, period2, period3);

    for (let i = 0; i < candles.length; i++) {
      if (i < maxPeriod) {
        uo[i] = 0;
        continue;
      }

      let bpSum1 = 0, trSum1 = 0;
      let bpSum2 = 0, trSum2 = 0;
      let bpSum3 = 0, trSum3 = 0;

      // Calculate buying pressure (BP) and true range (TR) for each period
      for (let j = i - period1 + 1; j <= i; j++) {
        const bp = candles[j].close - Math.min(candles[j].low, candles[j - 1].close);
        const tr = Math.max(candles[j].high, candles[j - 1].close) - 
                  Math.min(candles[j].low, candles[j - 1].close);
        bpSum1 += bp;
        trSum1 += tr;
      }

      for (let j = i - period2 + 1; j <= i; j++) {
        const bp = candles[j].close - Math.min(candles[j].low, candles[j - 1].close);
        const tr = Math.max(candles[j].high, candles[j - 1].close) - 
                  Math.min(candles[j].low, candles[j - 1].close);
        bpSum2 += bp;
        trSum2 += tr;
      }

      for (let j = i - period3 + 1; j <= i; j++) {
        const bp = candles[j].close - Math.min(candles[j].low, candles[j - 1].close);
        const tr = Math.max(candles[j].high, candles[j - 1].close) - 
                  Math.min(candles[j].low, candles[j - 1].close);
        bpSum3 += bp;
        trSum3 += tr;
      }

      // Calculate averages for each period
      const avg1 = trSum1 !== 0 ? bpSum1 / trSum1 : 0;
      const avg2 = trSum2 !== 0 ? bpSum2 / trSum2 : 0;
      const avg3 = trSum3 !== 0 ? bpSum3 / trSum3 : 0;

      // Calculate UO
      uo[i] = 100 * ((weight1 * avg1 + weight2 * avg2 + weight3 * avg3) / 
              (weight1 + weight2 + weight3));
    }

    return uo;
  }

  /**
   * Calculates Chande Momentum Oscillator (CMO)
   * Calculates the difference between the sum of recent gains and the sum of recent losses
   */
  static calculateCMO(candles: Candle[], period: number = 14): number[] {
    const cmo: number[] = [];
    
    for (let i = 0; i < candles.length; i++) {
      if (i < period) {
        cmo[i] = 0;
        continue;
      }

      let sumGain = 0;
      let sumLoss = 0;

      for (let j = i - period + 1; j <= i; j++) {
        const change = candles[j].close - candles[j - 1].close;
        if (change > 0) {
          sumGain += change;
        } else {
          sumLoss -= change;
        }
      }

      cmo[i] = 100 * ((sumGain - sumLoss) / (sumGain + sumLoss));
    }

    return cmo;
  }
}
