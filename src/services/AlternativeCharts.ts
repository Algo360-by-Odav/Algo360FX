import { CandleData, HeikinAshiData, RenkoData, KagiData } from '../types/trading';

export class AlternativeCharts {
  static calculateHeikinAshi(candles: CandleData[]): HeikinAshiData[] {
    const heikinAshi: HeikinAshiData[] = [];
    
    for (let i = 0; i < candles.length; i++) {
      const currentCandle = candles[i];
      const prevHA = heikinAshi[i - 1];
      
      // Calculate Heikin Ashi values
      const haClose = (currentCandle.open + currentCandle.high + currentCandle.low + currentCandle.close) / 4;
      
      let haOpen: number;
      if (!prevHA) {
        haOpen = (currentCandle.open + currentCandle.close) / 2;
      } else {
        haOpen = (prevHA.open + prevHA.close) / 2;
      }
      
      const haHigh = Math.max(currentCandle.high, haOpen, haClose);
      const haLow = Math.min(currentCandle.low, haOpen, haClose);
      
      heikinAshi.push({
        timestamp: currentCandle.timestamp,
        open: haOpen,
        high: haHigh,
        low: haLow,
        close: haClose
      });
    }
    
    return heikinAshi;
  }
  
  static calculateRenko(candles: CandleData[], brickSize: number): RenkoData[] {
    const renko: RenkoData[] = [];
    if (candles.length === 0) return renko;
    
    let lastBrick = {
      timestamp: candles[0].timestamp,
      open: candles[0].close,
      high: candles[0].close,
      low: candles[0].close,
      close: candles[0].close,
      brickSize
    };
    renko.push(lastBrick);
    
    for (const candle of candles) {
      const priceDiff = candle.close - lastBrick.close;
      const bricks = Math.floor(Math.abs(priceDiff) / brickSize);
      
      if (bricks >= 1) {
        const direction = priceDiff > 0 ? 1 : -1;
        
        for (let i = 0; i < bricks; i++) {
          const newClose = lastBrick.close + (direction * brickSize);
          const newBrick: RenkoData = {
            timestamp: candle.timestamp,
            open: lastBrick.close,
            close: newClose,
            high: Math.max(lastBrick.close, newClose),
            low: Math.min(lastBrick.close, newClose),
            brickSize
          };
          renko.push(newBrick);
          lastBrick = newBrick;
        }
      }
    }
    
    return renko;
  }
  
  static calculateKagi(candles: CandleData[], reversalAmount: number): KagiData[] {
    const kagi: KagiData[] = [];
    if (candles.length === 0) return kagi;
    
    let currentDirection: 'up' | 'down' = candles[1].close > candles[0].close ? 'up' : 'down';
    let lastPrice = candles[0].close;
    
    kagi.push({
      timestamp: candles[0].timestamp,
      price: lastPrice,
      direction: currentDirection,
      reversal: false
    });
    
    for (const candle of candles.slice(1)) {
      const priceChange = candle.close - lastPrice;
      const reversalThreshold = reversalAmount * lastPrice;
      
      if (currentDirection === 'up') {
        if (candle.close > lastPrice) {
          // Continue up trend
          kagi.push({
            timestamp: candle.timestamp,
            price: candle.close,
            direction: 'up',
            reversal: false
          });
          lastPrice = candle.close;
        } else if (candle.close < (lastPrice - reversalThreshold)) {
          // Reversal down
          currentDirection = 'down';
          kagi.push({
            timestamp: candle.timestamp,
            price: candle.close,
            direction: 'down',
            reversal: true
          });
          lastPrice = candle.close;
        }
      } else {
        if (candle.close < lastPrice) {
          // Continue down trend
          kagi.push({
            timestamp: candle.timestamp,
            price: candle.close,
            direction: 'down',
            reversal: false
          });
          lastPrice = candle.close;
        } else if (candle.close > (lastPrice + reversalThreshold)) {
          // Reversal up
          currentDirection = 'up';
          kagi.push({
            timestamp: candle.timestamp,
            price: candle.close,
            direction: 'up',
            reversal: true
          });
          lastPrice = candle.close;
        }
      }
    }
    
    return kagi;
  }
  
  static calculateAreaChart(candles: CandleData[]): number[] {
    return candles.map(candle => candle.close);
  }
  
  static calculateScatterPlot(
    candles: CandleData[],
    xValue: keyof CandleData,
    yValue: keyof CandleData
  ): Array<{ x: number; y: number }> {
    return candles.map(candle => ({
      x: candle[xValue] as number,
      y: candle[yValue] as number
    }));
  }
  
  static calculateBubbleChart(
    candles: CandleData[],
    getRadius: (candle: CandleData) => number
  ): Array<{ x: number; y: number; r: number }> {
    return candles.map(candle => ({
      x: candle.timestamp,
      y: candle.close,
      r: getRadius(candle)
    }));
  }
}
