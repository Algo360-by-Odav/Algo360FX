import { SMA, RSI, MACD, BollingerBands, VWAP, SD } from 'technicalindicators';
import { 
  MarketData, 
  MACDOutput, 
  BollingerBandsOutput, 
  PriceLevel, 
  VolumeProfile, 
  MarketStructure, 
  MarketContext 
} from '../types/market';
import { TimeFrame } from './strategyService';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

// Enums for better type safety
export enum IndicatorType {
  SMA = 'sma',
  RSI = 'rsi',
  MACD = 'macd',
  BB = 'bb',
  VWAP = 'vwap'
}

export enum TrendStrength {
  VeryWeak = 1,
  Weak = 3,
  Moderate = 5,
  Strong = 7,
  VeryStrong = 10
}

export enum TrendDirection {
  Up = 'up',
  Down = 'down',
  Sideways = 'sideways'
}

// Interfaces with readonly properties
interface SMAValues {
  readonly sma20: number;
  readonly sma50: number;
  readonly sma200: number;
}

interface IndicatorValues {
  readonly sma?: SMAValues;
  readonly rsi?: number;
  readonly macd?: MACDOutput;
  readonly bb?: BollingerBandsOutput;
  readonly vwap?: number;
}

interface IndicatorConfig {
  readonly sma: {
    readonly periods: ReadonlyArray<number>;
  };
  readonly rsi: {
    readonly period: number;
    readonly overbought: number;
    readonly oversold: number;
  };
  readonly macd: {
    readonly fastPeriod: number;
    readonly slowPeriod: number;
    readonly signalPeriod: number;
    readonly SimpleMAOscillator: boolean;
    readonly SimpleMASignal: boolean;
  };
  readonly bb: {
    readonly period: number;
    readonly stdDev: number;
  };
  readonly vwap: {
    readonly period: number;
  };
  readonly keyLevels: {
    readonly minTouches: number;
    readonly recencyWeight: number;
    readonly volumeWeight: number;
    readonly priceProximity: number;
  };
}

export class TechnicalAnalysis {
  private readonly config: IndicatorConfig = {
    sma: {
      periods: [20, 50, 200]
    },
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    },
    bb: {
      period: 20,
      stdDev: 2
    },
    vwap: {
      period: 14
    },
    keyLevels: {
      minTouches: 2,
      recencyWeight: 0.7,
      volumeWeight: 0.3,
      priceProximity: 0.001 // 0.1% price difference to consider as same level
    }
  };

  private async getHistoricalData(symbol: string, timeframe: TimeFrame): Promise<MarketData[]> {
    if (!process.env.MARKET_DATA_API) {
      throw new Error('MARKET_DATA_API environment variable not set');
    }

    try {
      const response: AxiosResponse<MarketData[]> = await axios.get(
        `${process.env.MARKET_DATA_API}/historical`,
        {
          params: { symbol, timeframe },
          timeout: 5000 // 5 second timeout
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw new Error('Failed to fetch historical data');
    }
  }

  public async analyze(
    symbol: string,
    timeframe: TimeFrame,
    requestedIndicators: ReadonlyArray<IndicatorType> = []
  ): Promise<MarketContext> {
    try {
      const historicalData = await this.getHistoricalData(symbol, timeframe);
      if (!historicalData.length) {
        throw new Error('No historical data available');
      }

      const indicators = this.calculateIndicators(historicalData, requestedIndicators);
      const structure = this.analyzeMarketStructure(historicalData, indicators);
      const levels = this.findKeyLevels(historicalData);
      const volumeProfile = this.analyzeVolumeProfile(historicalData);

      return {
        price: historicalData[historicalData.length - 1],
        indicators: {
          sma: Object.fromEntries(
            this.config.sma.periods.map(period => [
              period,
              indicators.sma?.[`sma${period}` as keyof SMAValues] || 0
            ])
          ),
          rsi: indicators.rsi || 50,
          macd: indicators.macd || { MACD: 0, signal: 0, histogram: 0 },
          bb: indicators.bb || { upper: 0, middle: 0, lower: 0 }
        },
        structure,
        levels: {
          support: levels.support.map(price => ({
            price,
            strength: this.calculateLevelStrength(price, historicalData, 'support'),
            timestamp: new Date(),
            touches: this.countTouches(price, historicalData, 'support')
          })),
          resistance: levels.resistance.map(price => ({
            price,
            strength: this.calculateLevelStrength(price, historicalData, 'resistance'),
            timestamp: new Date(),
            touches: this.countTouches(price, historicalData, 'resistance')
          }))
        },
        volume: {
          profile: volumeProfile,
          vwap: indicators.vwap || 0
        }
      };
    } catch (error) {
      console.error('Error in technical analysis:', error);
      throw error;
    }
  }

  private calculateIndicators(
    data: ReadonlyArray<MarketData>,
    requestedIndicators: ReadonlyArray<IndicatorType>
  ): IndicatorValues {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const volumes = data.map(d => d.volume);
    const indicators: IndicatorValues = {};

    try {
      // Calculate SMA if requested or no specific indicators requested
      if (requestedIndicators.includes(IndicatorType.SMA) || requestedIndicators.length === 0) {
        const smaResults = this.config.sma.periods.map(period => ({
          period,
          values: this.calculateSMA(closes, period)
        }));

        indicators.sma = {
          sma20: smaResults.find(r => r.period === 20)?.values.slice(-1)[0] || 0,
          sma50: smaResults.find(r => r.period === 50)?.values.slice(-1)[0] || 0,
          sma200: smaResults.find(r => r.period === 200)?.values.slice(-1)[0] || 0
        };
      }

      // Calculate RSI if requested or no specific indicators requested
      if (requestedIndicators.includes(IndicatorType.RSI) || requestedIndicators.length === 0) {
        const rsi = this.calculateRSI(closes);
        indicators.rsi = rsi.slice(-1)[0];
      }

      // Calculate MACD if requested or no specific indicators requested
      if (requestedIndicators.includes(IndicatorType.MACD) || requestedIndicators.length === 0) {
        const macd = this.calculateMACD(closes);
        indicators.macd = macd.slice(-1)[0];
      }

      // Calculate Bollinger Bands if requested or no specific indicators requested
      if (requestedIndicators.includes(IndicatorType.BB) || requestedIndicators.length === 0) {
        const bb = this.calculateBollingerBands(closes);
        indicators.bb = bb.slice(-1)[0];
      }

      // Calculate VWAP if requested or no specific indicators requested
      if (requestedIndicators.includes(IndicatorType.VWAP) || requestedIndicators.length === 0) {
        const vwap = this.calculateVWAP(data);
        indicators.vwap = vwap.slice(-1)[0];
      }

      return indicators;
    } catch (error) {
      console.error('Error calculating indicators:', error);
      throw new Error('Failed to calculate indicators');
    }
  }

  private calculateSMA(data: ReadonlyArray<number>, period: number): ReadonlyArray<number> {
    return SMA.calculate({
      values: [...data],
      period
    });
  }

  private calculateRSI(data: ReadonlyArray<number>): ReadonlyArray<number> {
    return RSI.calculate({
      values: [...data],
      period: this.config.rsi.period
    });
  }

  private calculateMACD(data: ReadonlyArray<number>): ReadonlyArray<MACDOutput> {
    return MACD.calculate({
      values: [...data],
      ...this.config.macd
    });
  }

  private calculateBollingerBands(
    data: ReadonlyArray<number>
  ): ReadonlyArray<BollingerBandsOutput> {
    return BollingerBands.calculate({
      values: [...data],
      period: this.config.bb.period,
      stdDev: this.config.bb.stdDev
    });
  }

  private calculateVWAP(data: ReadonlyArray<MarketData>): ReadonlyArray<number> {
    return VWAP.calculate({
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      volume: data.map(d => d.volume),
      period: this.config.vwap.period
    });
  }

  private analyzeMarketStructure(
    data: ReadonlyArray<MarketData>,
    indicators: IndicatorValues
  ): MarketStructure {
    const closes = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    const returns = closes.slice(1).map((close, i) => (close - closes[i]) / closes[i]);

    // Calculate trend direction and strength
    const trendInfo = this.analyzeTrend(data, indicators);
    const volatility = SD.calculate({
      values: returns,
      period: 20
    }).slice(-1)[0];

    // Calculate momentum using RSI
    const momentum = ((indicators.rsi || 50) - 50) * 2; // Scale to -100 to 100

    return {
      trend: {
        direction: trendInfo.direction,
        strength: trendInfo.strength,
        startTime: data[0].timestamp,
        endTime: data[data.length - 1].timestamp
      },
      momentum: {
        value: momentum,
        timestamp: new Date()
      },
      volatility: {
        value: volatility || 0,
        timestamp: new Date()
      }
    };
  }

  private analyzeTrend(
    data: ReadonlyArray<MarketData>,
    indicators: IndicatorValues
  ): { direction: TrendDirection; strength: TrendStrength } {
    const lastClose = data[data.length - 1].close;
    const sma20 = indicators.sma?.sma20 || 0;
    const sma50 = indicators.sma?.sma50 || 0;
    const sma200 = indicators.sma?.sma200 || 0;

    // Determine trend direction
    let direction: TrendDirection;
    let strength: TrendStrength;

    if (lastClose > sma20 && sma20 > sma50 && sma50 > sma200) {
      direction = TrendDirection.Up;
      strength = TrendStrength.VeryStrong;
    } else if (lastClose < sma20 && sma20 < sma50 && sma50 < sma200) {
      direction = TrendDirection.Down;
      strength = TrendStrength.VeryStrong;
    } else if (lastClose > sma20 && lastClose > sma50) {
      direction = TrendDirection.Up;
      strength = TrendStrength.Strong;
    } else if (lastClose < sma20 && lastClose < sma50) {
      direction = TrendDirection.Down;
      strength = TrendStrength.Strong;
    } else {
      direction = TrendDirection.Sideways;
      strength = TrendStrength.Moderate;
    }

    // Adjust strength based on RSI
    const rsi = indicators.rsi || 50;
    if (direction === TrendDirection.Up && rsi > this.config.rsi.overbought) {
      strength = Math.min(strength + 1, TrendStrength.VeryStrong);
    } else if (direction === TrendDirection.Down && rsi < this.config.rsi.oversold) {
      strength = Math.min(strength + 1, TrendStrength.VeryStrong);
    }

    return { direction, strength };
  }

  private findKeyLevels(data: ReadonlyArray<MarketData>): { support: number[]; resistance: number[] } {
    const { minTouches, priceProximity } = this.config.keyLevels;
    const prices = data.map(d => ({
      high: d.high,
      low: d.low,
      volume: d.volume
    }));

    // Find potential support and resistance levels
    const levels = new Map<number, { touches: number; volume: number }>();

    prices.forEach(price => {
      [price.high, price.low].forEach(level => {
        // Round to nearby level based on priceProximity
        const roundedLevel = Math.round(level / (level * priceProximity)) * (level * priceProximity);
        const existing = levels.get(roundedLevel);
        if (existing) {
          levels.set(roundedLevel, {
            touches: existing.touches + 1,
            volume: existing.volume + price.volume
          });
        } else {
          levels.set(roundedLevel, { touches: 1, volume: price.volume });
        }
      });
    });

    // Filter levels by minimum touches and sort by importance
    const significantLevels = Array.from(levels.entries())
      .filter(([_, info]) => info.touches >= minTouches)
      .sort((a, b) => {
        const scoreA = this.calculateLevelScore(a[0], a[1], data);
        const scoreB = this.calculateLevelScore(b[0], b[1], data);
        return scoreB - scoreA;
      });

    const lastPrice = data[data.length - 1].close;
    return {
      support: significantLevels
        .filter(([price]) => price < lastPrice)
        .map(([price]) => price),
      resistance: significantLevels
        .filter(([price]) => price > lastPrice)
        .map(([price]) => price)
    };
  }

  private calculateLevelScore(
    price: number,
    info: { touches: number; volume: number },
    data: ReadonlyArray<MarketData>
  ): number {
    const { recencyWeight, volumeWeight } = this.config.keyLevels;
    const recency = this.calculateRecencyScore(price, data);
    const volumeScore = info.volume / Math.max(...data.map(d => d.volume));
    return (recency * recencyWeight + volumeScore * volumeWeight) * info.touches;
  }

  private calculateRecencyScore(price: number, data: ReadonlyArray<MarketData>): number {
    const lastTouch = data.reduceRight((last, candle, index) => {
      if (last === -1 && (Math.abs(candle.high - price) < 0.0001 || Math.abs(candle.low - price) < 0.0001)) {
        return index;
      }
      return last;
    }, -1);

    if (lastTouch === -1) return 0;
    return 1 - lastTouch / data.length; // More recent touches get higher scores
  }

  private calculateLevelStrength(
    price: number,
    data: ReadonlyArray<MarketData>,
    type: 'support' | 'resistance'
  ): number {
    const touches = this.countTouches(price, data, type);
    const recencyScore = this.calculateRecencyScore(price, data);
    const volumeScore = this.calculateVolumeScore(price, data);

    // Combine scores with weights
    const { recencyWeight, volumeWeight } = this.config.keyLevels;
    const baseStrength = Math.min(touches, 10); // Cap at 10
    const weightedScore = 
      recencyScore * recencyWeight +
      volumeScore * volumeWeight;

    return Math.round(baseStrength * weightedScore);
  }

  private countTouches(
    price: number,
    data: ReadonlyArray<MarketData>,
    type: 'support' | 'resistance'
  ): number {
    const { priceProximity } = this.config.keyLevels;
    const threshold = price * priceProximity;

    return data.reduce((touches, candle) => {
      if (type === 'support' && Math.abs(candle.low - price) <= threshold) {
        return touches + 1;
      }
      if (type === 'resistance' && Math.abs(candle.high - price) <= threshold) {
        return touches + 1;
      }
      return touches;
    }, 0);
  }

  private calculateVolumeScore(price: number, data: ReadonlyArray<MarketData>): number {
    const { priceProximity } = this.config.keyLevels;
    const threshold = price * priceProximity;

    const volumeAtLevel = data.reduce((sum, candle) => {
      if (Math.abs(candle.high - price) <= threshold || Math.abs(candle.low - price) <= threshold) {
        return sum + candle.volume;
      }
      return sum;
    }, 0);

    const maxVolume = Math.max(...data.map(d => d.volume));
    return volumeAtLevel / (maxVolume * data.length); // Normalize to 0-1
  }

  private analyzeVolumeProfile(data: ReadonlyArray<MarketData>): VolumeProfile[] {
    const volumeByPrice = new Map<number, number>();
    
    // Group volume by price levels
    data.forEach(candle => {
      const price = Math.round(((candle.high + candle.low) / 2) * 100) / 100; // Round to 2 decimal places
      const existing = volumeByPrice.get(price) || 0;
      volumeByPrice.set(price, existing + candle.volume);
    });

    // Convert to array and sort by price
    return Array.from(volumeByPrice.entries())
      .map(([price, volume]) => ({
        price,
        volume,
        timestamp: new Date()
      }))
      .sort((a, b) => a.price - b.price);
  }
}
