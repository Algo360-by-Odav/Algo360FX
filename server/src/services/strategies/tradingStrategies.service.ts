import { logger } from '../../utils/logger';
import { TechnicalAnalysisService } from '../technicalAnalysis.service';
import { MarketDataService } from '../marketData.service';

interface Strategy {
  name: string;
  timeframes: string[];
  analyze: (data: any) => Promise<{
    signal: 'buy' | 'sell' | 'neutral';
    confidence: number;
    entry?: number;
    stopLoss?: number;
    takeProfit?: number;
    metadata: any;
  }>;
}

export class TradingStrategiesService {
  private technicalAnalysis: TechnicalAnalysisService;
  private marketData: MarketDataService;
  private strategies: Map<string, Strategy>;

  constructor() {
    this.technicalAnalysis = new TechnicalAnalysisService();
    this.marketData = new MarketDataService();
    this.strategies = new Map();
    this.initializeStrategies();
  }

  private initializeStrategies() {
    // Trend Following Strategy
    this.strategies.set('trend_following', {
      name: 'Trend Following',
      timeframes: ['1h', '4h', '1d'],
      analyze: async (data) => {
        const ema20 = await this.technicalAnalysis.calculateEMA(data, 20);
        const ema50 = await this.technicalAnalysis.calculateEMA(data, 50);
        const rsi = await this.technicalAnalysis.calculateRSI(data, 14);
        
        const signal = this.analyzeTrendFollowing(ema20, ema50, rsi);
        return {
          ...signal,
          metadata: { ema20, ema50, rsi }
        };
      }
    });

    // Mean Reversion Strategy
    this.strategies.set('mean_reversion', {
      name: 'Mean Reversion',
      timeframes: ['15m', '1h', '4h'],
      analyze: async (data) => {
        const bollinger = await this.technicalAnalysis.calculateBollingerBands(data, 20, 2);
        const rsi = await this.technicalAnalysis.calculateRSI(data, 14);
        
        const signal = this.analyzeMeanReversion(bollinger, rsi);
        return {
          ...signal,
          metadata: { bollinger, rsi }
        };
      }
    });

    // Breakout Strategy
    this.strategies.set('breakout', {
      name: 'Breakout',
      timeframes: ['1h', '4h', '1d'],
      analyze: async (data) => {
        const atr = await this.technicalAnalysis.calculateATR(data, 14);
        const support = await this.technicalAnalysis.findSupportLevels(data);
        const resistance = await this.technicalAnalysis.findResistanceLevels(data);
        
        const signal = this.analyzeBreakout(data, support, resistance, atr);
        return {
          ...signal,
          metadata: { atr, support, resistance }
        };
      }
    });

    // Momentum Strategy
    this.strategies.set('momentum', {
      name: 'Momentum',
      timeframes: ['15m', '1h', '4h'],
      analyze: async (data) => {
        const macd = await this.technicalAnalysis.calculateMACD(data);
        const adx = await this.technicalAnalysis.calculateADX(data, 14);
        
        const signal = this.analyzeMomentum(macd, adx);
        return {
          ...signal,
          metadata: { macd, adx }
        };
      }
    });

    // Pattern Recognition Strategy
    this.strategies.set('pattern_recognition', {
      name: 'Pattern Recognition',
      timeframes: ['1h', '4h', '1d'],
      analyze: async (data) => {
        const patterns = await this.technicalAnalysis.findCandlePatterns(data);
        const volume = await this.technicalAnalysis.analyzeVolume(data);
        
        const signal = this.analyzePatterns(patterns, volume);
        return {
          ...signal,
          metadata: { patterns, volume }
        };
      }
    });
  }

  private analyzeTrendFollowing(ema20: number[], ema50: number[], rsi: number) {
    const lastEma20 = ema20[ema20.length - 1];
    const lastEma50 = ema50[ema50.length - 1];
    const lastRSI = rsi[rsi.length - 1];

    if (lastEma20 > lastEma50 && lastRSI > 50) {
      return {
        signal: 'buy' as const,
        confidence: 0.8,
        entry: lastEma20,
        stopLoss: lastEma50,
        takeProfit: lastEma20 + (lastEma20 - lastEma50) * 1.5
      };
    } else if (lastEma20 < lastEma50 && lastRSI < 50) {
      return {
        signal: 'sell' as const,
        confidence: 0.8,
        entry: lastEma20,
        stopLoss: lastEma50,
        takeProfit: lastEma20 - (lastEma50 - lastEma20) * 1.5
      };
    }

    return {
      signal: 'neutral' as const,
      confidence: 0.5
    };
  }

  private analyzeMeanReversion(bollinger: any, rsi: number[]) {
    const lastRSI = rsi[rsi.length - 1];
    const lastPrice = bollinger.middle[bollinger.middle.length - 1];
    const lastUpper = bollinger.upper[bollinger.upper.length - 1];
    const lastLower = bollinger.lower[bollinger.lower.length - 1];

    if (lastRSI < 30 && lastPrice < lastLower) {
      return {
        signal: 'buy' as const,
        confidence: 0.7,
        entry: lastPrice,
        stopLoss: lastLower * 0.99,
        takeProfit: bollinger.middle[bollinger.middle.length - 1]
      };
    } else if (lastRSI > 70 && lastPrice > lastUpper) {
      return {
        signal: 'sell' as const,
        confidence: 0.7,
        entry: lastPrice,
        stopLoss: lastUpper * 1.01,
        takeProfit: bollinger.middle[bollinger.middle.length - 1]
      };
    }

    return {
      signal: 'neutral' as const,
      confidence: 0.5
    };
  }

  private analyzeBreakout(data: any[], support: number[], resistance: number[], atr: number[]) {
    const lastPrice = data[data.length - 1].close;
    const lastATR = atr[atr.length - 1];
    const nearestSupport = support.find(level => Math.abs(level - lastPrice) < lastATR);
    const nearestResistance = resistance.find(level => Math.abs(level - lastPrice) < lastATR);

    if (nearestResistance && lastPrice > nearestResistance) {
      return {
        signal: 'buy' as const,
        confidence: 0.75,
        entry: lastPrice,
        stopLoss: nearestResistance - lastATR,
        takeProfit: lastPrice + lastATR * 2
      };
    } else if (nearestSupport && lastPrice < nearestSupport) {
      return {
        signal: 'sell' as const,
        confidence: 0.75,
        entry: lastPrice,
        stopLoss: nearestSupport + lastATR,
        takeProfit: lastPrice - lastATR * 2
      };
    }

    return {
      signal: 'neutral' as const,
      confidence: 0.5
    };
  }

  private analyzeMomentum(macd: any, adx: number[]) {
    const lastMACD = macd.histogram[macd.histogram.length - 1];
    const lastADX = adx[adx.length - 1];
    const macdTrend = macd.histogram.slice(-3);

    if (lastMACD > 0 && lastADX > 25 && macdTrend.every(v => v > macdTrend[0])) {
      return {
        signal: 'buy' as const,
        confidence: 0.8,
        entry: macd.price[macd.price.length - 1],
        stopLoss: macd.price[macd.price.length - 1] * 0.99,
        takeProfit: macd.price[macd.price.length - 1] * 1.02
      };
    } else if (lastMACD < 0 && lastADX > 25 && macdTrend.every(v => v < macdTrend[0])) {
      return {
        signal: 'sell' as const,
        confidence: 0.8,
        entry: macd.price[macd.price.length - 1],
        stopLoss: macd.price[macd.price.length - 1] * 1.01,
        takeProfit: macd.price[macd.price.length - 1] * 0.98
      };
    }

    return {
      signal: 'neutral' as const,
      confidence: 0.5
    };
  }

  private analyzePatterns(patterns: any[], volume: any) {
    const lastPattern = patterns[patterns.length - 1];
    const volumeConfirmation = volume.trend === 'increasing';

    if (lastPattern && lastPattern.type === 'bullish' && volumeConfirmation) {
      return {
        signal: 'buy' as const,
        confidence: 0.7,
        entry: lastPattern.price,
        stopLoss: lastPattern.low,
        takeProfit: lastPattern.price + (lastPattern.price - lastPattern.low) * 2
      };
    } else if (lastPattern && lastPattern.type === 'bearish' && volumeConfirmation) {
      return {
        signal: 'sell' as const,
        confidence: 0.7,
        entry: lastPattern.price,
        stopLoss: lastPattern.high,
        takeProfit: lastPattern.price - (lastPattern.high - lastPattern.price) * 2
      };
    }

    return {
      signal: 'neutral' as const,
      confidence: 0.5
    };
  }

  public async analyzeAllStrategies(symbol: string, timeframe: string) {
    try {
      const marketData = await this.marketData.getMarketData([symbol], timeframe);
      const results = new Map();

      for (const [name, strategy] of this.strategies) {
        if (strategy.timeframes.includes(timeframe)) {
          const analysis = await strategy.analyze(marketData[symbol]);
          results.set(name, analysis);
        }
      }

      return this.combineStrategyResults(results);
    } catch (error) {
      logger.error('Error analyzing strategies:', error);
      throw error;
    }
  }

  private combineStrategyResults(results: Map<string, any>) {
    let buySignals = 0;
    let sellSignals = 0;
    let totalConfidence = 0;
    let count = 0;

    results.forEach((result) => {
      if (result.signal === 'buy') buySignals++;
      if (result.signal === 'sell') sellSignals++;
      totalConfidence += result.confidence;
      count++;
    });

    const averageConfidence = totalConfidence / count;
    let finalSignal: 'buy' | 'sell' | 'neutral' = 'neutral';
    
    if (buySignals > sellSignals && buySignals > count / 3) {
      finalSignal = 'buy';
    } else if (sellSignals > buySignals && sellSignals > count / 3) {
      finalSignal = 'sell';
    }

    return {
      signal: finalSignal,
      confidence: averageConfidence,
      individualResults: Object.fromEntries(results),
      metadata: {
        buySignals,
        sellSignals,
        totalStrategies: count
      }
    };
  }
}
