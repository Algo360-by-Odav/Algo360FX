import { TechnicalAnalysis } from './TechnicalAnalysis';
import { MarketDataService } from './MarketData';
import { RiskManagement } from './RiskManagement';
import { Strategy } from '../types-new/Strategy';

interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StrategyResult {
  signal: 'buy' | 'sell' | 'neutral';
  confidence: number;
  indicators: Record<string, unknown>;
  timestamp: number;
}

interface VolumeAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  strength: number;
}

interface MACD {
  histogram: number;
}

export class TradingStrategies {
  private technicalAnalysis: TechnicalAnalysis;
  private marketData: MarketDataService;
  private riskManagement: RiskManagement;

  constructor() {
    this.technicalAnalysis = new TechnicalAnalysis();
    this.marketData = new MarketDataService();
    this.riskManagement = new RiskManagement();
  }

  public async executeEMACrossoverStrategy(
    historicalData: MarketData[],
    shortPeriod: number = 9,
    longPeriod: number = 21
  ): Promise<StrategyResult> {
    const prices = historicalData.map(d => d.close);
    const shortEMA = TechnicalAnalysis.calculateEMA(prices, shortPeriod);
    const longEMA = TechnicalAnalysis.calculateEMA(prices, longPeriod);
    const rsi = TechnicalAnalysis.calculateRSI(prices);

    const lastShortEMA = shortEMA[shortEMA.length - 1];
    const lastLongEMA = longEMA[longEMA.length - 1];
    const lastRSI = rsi[rsi.length - 1];

    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let confidence = 0;

    if (lastShortEMA > lastLongEMA && lastRSI < 70) {
      signal = 'buy';
      confidence = 0.7 + (lastRSI < 30 ? 0.2 : 0);
    } else if (lastShortEMA < lastLongEMA && lastRSI > 30) {
      signal = 'sell';
      confidence = 0.7 + (lastRSI > 70 ? 0.2 : 0);
    }

    return {
      signal,
      confidence,
      indicators: {
        shortEMA: lastShortEMA,
        longEMA: lastLongEMA,
        rsi: lastRSI
      },
      timestamp: historicalData[historicalData.length - 1].timestamp
    };
  }

  public async executeBollingerBandsStrategy(
    historicalData: MarketData[],
    period: number = 20
  ): Promise<StrategyResult> {
    const prices = historicalData.map(d => d.close);
    const bands = TechnicalAnalysis.calculateBollingerBands(prices, period);
    const rsi = TechnicalAnalysis.calculateRSI(prices);

    const lastPrice = prices[prices.length - 1];
    const lastBand = bands[bands.length - 1];
    const lastRSI = rsi[rsi.length - 1];

    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let confidence = 0;

    if (lastPrice < lastBand.lower && lastRSI < 30) {
      signal = 'buy';
      confidence = 0.8;
    } else if (lastPrice > lastBand.upper && lastRSI > 70) {
      signal = 'sell';
      confidence = 0.8;
    }

    return {
      signal,
      confidence,
      indicators: {
        price: lastPrice,
        upperBand: lastBand.upper,
        middleBand: lastBand.middle,
        lowerBand: lastBand.lower,
        rsi: lastRSI
      },
      timestamp: historicalData[historicalData.length - 1].timestamp
    };
  }

  public async executeBreakoutStrategy(
    historicalData: MarketData[],
    period: number = 14
  ): Promise<StrategyResult> {
    const atr = TechnicalAnalysis.calculateATR(historicalData, period);
    const supportLevels = TechnicalAnalysis.findSupportLevels(historicalData);
    const resistanceLevels = TechnicalAnalysis.findResistanceLevels(historicalData);

    const lastPrice = historicalData[historicalData.length - 1].close;
    const lastATR = atr[atr.length - 1];

    // Find nearest support and resistance
    const nearestSupport = Math.max(...supportLevels.filter((s: number) => s < lastPrice));
    const nearestResistance = Math.min(...resistanceLevels.filter((r: number) => r > lastPrice));

    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let confidence = 0;

    const distanceToSupport = lastPrice - nearestSupport;
    const distanceToResistance = nearestResistance - lastPrice;

    if (distanceToSupport < lastATR * 0.5) {
      signal = 'buy';
      confidence = 0.6 + (0.2 * (1 - distanceToSupport / (lastATR * 0.5)));
    } else if (distanceToResistance < lastATR * 0.5) {
      signal = 'sell';
      confidence = 0.6 + (0.2 * (1 - distanceToResistance / (lastATR * 0.5)));
    }

    return {
      signal,
      confidence,
      indicators: {
        price: lastPrice,
        atr: lastATR,
        nearestSupport,
        nearestResistance
      },
      timestamp: historicalData[historicalData.length - 1].timestamp
    };
  }

  public async executeTrendFollowingStrategy(
    historicalData: MarketData[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): Promise<StrategyResult> {
    const macd: MACD[] = TechnicalAnalysis.calculateMACD(historicalData.map(d => d.close), fastPeriod, slowPeriod, signalPeriod);
    const adx = TechnicalAnalysis.calculateADX(historicalData);

    const lastMACD = macd[macd.length - 1];
    const lastADX = adx[adx.length - 1];

    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let confidence = 0;

    if (lastMACD.histogram > 0 && lastADX > 25) {
      signal = 'buy';
      confidence = 0.5 + (Math.min(lastADX, 50) - 25) / 50;
    } else if (lastMACD.histogram < 0 && lastADX > 25) {
      signal = 'sell';
      confidence = 0.5 + (Math.min(lastADX, 50) - 25) / 50;
    }

    return {
      signal,
      confidence,
      indicators: {
        macd: lastMACD,
        adx: lastADX
      },
      timestamp: historicalData[historicalData.length - 1].timestamp
    };
  }

  public async executePatternRecognitionStrategy(
    historicalData: MarketData[]
  ): Promise<StrategyResult> {
    const patterns: string[] = TechnicalAnalysis.findCandlePatterns(historicalData);
    const volume: VolumeAnalysis = TechnicalAnalysis.analyzeVolume(historicalData);

    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let confidence = 0;

    // Analyze patterns and volume to generate signals
    const bullishPatterns = patterns.filter((p: string) => p.includes('bullish')).length;
    const bearishPatterns = patterns.filter((p: string) => p.includes('bearish')).length;

    if (bullishPatterns > bearishPatterns && volume.trend === 'increasing') {
      signal = 'buy';
      confidence = 0.5 + (0.1 * bullishPatterns);
    } else if (bearishPatterns > bullishPatterns && volume.trend === 'increasing') {
      signal = 'sell';
      confidence = 0.5 + (0.1 * bearishPatterns);
    }

    return {
      signal,
      confidence,
      indicators: {
        bullishPatterns,
        bearishPatterns,
        volumeTrend: volume.trend,
        volumeStrength: volume.strength
      },
      timestamp: historicalData[historicalData.length - 1].timestamp
    };
  }

  async executeEMAStrategy(symbol: string, timeframe: string): Promise<Strategy> {
    const data = await this.technicalAnalysis.getHistoricalData(symbol, timeframe);
    const { close } = TechnicalAnalysis.convertToArray(data);

    const ema12 = TechnicalAnalysis.calculateMACD(close, 12, 26, 9);
    const ema26 = TechnicalAnalysis.calculateMACD(close, 26, 12, 9);
    const rsi = TechnicalAnalysis.calculateRSI(close);

    // Strategy logic implementation
    return {
      id: '',
      name: 'EMA Strategy',
      type: 'EMA',
      description: 'EMA Crossover Strategy',
      parameters: {
        ema12,
        ema26,
        rsi
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async executeBollingerBandsStrategy(symbol: string, timeframe: string): Promise<Strategy> {
    const data = await this.technicalAnalysis.getHistoricalData(symbol, timeframe);
    const { close } = TechnicalAnalysis.convertToArray(data);

    const bollinger = TechnicalAnalysis.calculateBollingerBands(close);
    const rsi = TechnicalAnalysis.calculateRSI(close);

    // Strategy logic implementation
    return {
      id: '',
      name: 'Bollinger Bands Strategy',
      type: 'BB',
      description: 'Bollinger Bands Mean Reversion Strategy',
      parameters: {
        bollinger,
        rsi
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async executeTrendFollowingStrategy(symbol: string, timeframe: string): Promise<Strategy> {
    const data = await this.technicalAnalysis.getHistoricalData(symbol, timeframe);
    const { close, high, low } = TechnicalAnalysis.convertToArray(data);

    const macd = TechnicalAnalysis.calculateMACD(close);
    const adx = TechnicalAnalysis.calculateADX(high, low, close);

    // Strategy logic implementation
    return {
      id: '',
      name: 'Trend Following Strategy',
      type: 'TREND',
      description: 'MACD and ADX Trend Following Strategy',
      parameters: {
        macd,
        adx
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
