import { Candle } from '../../../types/trading';

export class VolumeIndicators {
  /**
   * Calculates On-Balance Volume (OBV)
   * OBV measures buying and selling pressure as a cumulative indicator
   */
  static calculateOBV(candles: Candle[]): number[] {
    const obv: number[] = [0];
    
    for (let i = 1; i < candles.length; i++) {
      const currentClose = candles[i].close;
      const previousClose = candles[i - 1].close;
      const currentVolume = candles[i].volume;
      
      if (currentClose > previousClose) {
        obv[i] = obv[i - 1] + currentVolume;
      } else if (currentClose < previousClose) {
        obv[i] = obv[i - 1] - currentVolume;
      } else {
        obv[i] = obv[i - 1];
      }
    }
    
    return obv;
  }

  /**
   * Calculates Volume Weighted Average Price (VWAP)
   * VWAP is a trading benchmark that represents the average price a security
   * has traded at throughout the day, based on both volume and price
   */
  static calculateVWAP(candles: Candle[]): number[] {
    const vwap: number[] = [];
    let cumulativeTPV = 0; // Typical Price × Volume
    let cumulativeVolume = 0;

    for (let i = 0; i < candles.length; i++) {
      const typicalPrice = (candles[i].high + candles[i].low + candles[i].close) / 3;
      const volume = candles[i].volume;
      
      cumulativeTPV += typicalPrice * volume;
      cumulativeVolume += volume;
      
      vwap[i] = cumulativeTPV / cumulativeVolume;
    }

    return vwap;
  }

  /**
   * Calculates Chaikin Money Flow (CMF)
   * CMF measures the amount of Money Flow Volume over a specific period
   */
  static calculateCMF(candles: Candle[], period: number = 20): number[] {
    const cmf: number[] = [];
    
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        cmf[i] = 0;
        continue;
      }

      let periodVolume = 0;
      let moneyFlowVolume = 0;

      for (let j = i - period + 1; j <= i; j++) {
        const high = candles[j].high;
        const low = candles[j].low;
        const close = candles[j].close;
        const volume = candles[j].volume;
        
        const moneyFlowMultiplier = ((close - low) - (high - close)) / (high - low);
        moneyFlowVolume += moneyFlowMultiplier * volume;
        periodVolume += volume;
      }

      cmf[i] = periodVolume !== 0 ? moneyFlowVolume / periodVolume : 0;
    }

    return cmf;
  }

  /**
   * Calculates Accumulation/Distribution Line (ADL)
   * ADL is a volume-based indicator designed to measure supply and demand
   */
  static calculateADL(candles: Candle[]): number[] {
    const adl: number[] = [0];
    
    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const close = candles[i].close;
      const volume = candles[i].volume;
      
      const moneyFlowMultiplier = ((close - low) - (high - close)) / (high - low);
      const moneyFlowVolume = moneyFlowMultiplier * volume;
      
      adl[i] = adl[i - 1] + moneyFlowVolume;
    }

    return adl;
  }

  /**
   * Calculates Force Index (FI)
   * FI measures the force of buying and selling pressure
   */
  static calculateForceIndex(candles: Candle[], period: number = 13): number[] {
    const forceIndex: number[] = [];
    const rawForce: number[] = [];

    // Calculate raw force
    for (let i = 1; i < candles.length; i++) {
      const priceDiff = candles[i].close - candles[i - 1].close;
      rawForce[i] = priceDiff * candles[i].volume;
    }
    rawForce[0] = 0;

    // Apply EMA to raw force
    let multiplier = 2 / (period + 1);
    forceIndex[0] = rawForce[0];

    for (let i = 1; i < candles.length; i++) {
      forceIndex[i] = (rawForce[i] - forceIndex[i - 1]) * multiplier + forceIndex[i - 1];
    }

    return forceIndex;
  }
}
