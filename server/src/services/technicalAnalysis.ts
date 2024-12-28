import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { MarketData, MACDOutput, BollingerBandsOutput } from '../types/market';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

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
}

type TrendType = 'strong_uptrend' | 'strong_downtrend' | 'uptrend' | 'downtrend' | 'sideways';

interface KeyLevels {
  readonly support: ReadonlyArray<number>;
  readonly resistance: ReadonlyArray<number>;
}

interface TechnicalAnalysisResult {
  readonly indicators: IndicatorValues;
  readonly trend: TrendType;
  readonly levels: KeyLevels;
}

type IndicatorType = 'sma' | 'rsi' | 'macd' | 'bb';

interface IndicatorConfig {
  readonly sma: {
    readonly periods: ReadonlyArray<number>;
  };
  readonly rsi: {
    readonly period: number;
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
}

export class TechnicalAnalysis {
  private readonly config: IndicatorConfig = {
    sma: {
      periods: [20, 50, 200]
    },
    rsi: {
      period: 14
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
    }
  };

  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketData[]> {
    const response: AxiosResponse<MarketData[]> = await axios.get(`${process.env.MARKET_DATA_API}/historical`, {
      params: { symbol, timeframe }
    });
    return response.data;
  }

  public async analyze(
    symbol: string,
    timeframe: string,
    requestedIndicators: ReadonlyArray<IndicatorType> = []
  ): Promise<TechnicalAnalysisResult> {
    const historicalData = await this.getHistoricalData(symbol, timeframe);
    const analysis: TechnicalAnalysisResult = {
      indicators: {},
      trend: 'sideways',
      levels: { support: [], resistance: [] }
    };

    // Calculate indicators
    analysis.indicators = this.calculateIndicators(historicalData, requestedIndicators);

    // Add trend analysis
    analysis.trend = this.analyzeTrend(historicalData, analysis.indicators);

    // Add support/resistance levels
    analysis.levels = this.findKeyLevels(historicalData);

    return analysis;
  }

  private calculateIndicators(
    data: ReadonlyArray<MarketData>,
    requestedIndicators: ReadonlyArray<IndicatorType>
  ): IndicatorValues {
    const closes = data.map(d => d.close);
    const indicators: IndicatorValues = {};

    // Calculate SMA if requested or no specific indicators requested
    if (requestedIndicators.includes('sma') || requestedIndicators.length === 0) {
      const sma20 = this.calculateSMA(closes, this.config.sma.periods[0]);
      const sma50 = this.calculateSMA(closes, this.config.sma.periods[1]);
      const sma200 = this.calculateSMA(closes, this.config.sma.periods[2]);

      indicators.sma = {
        sma20: sma20[sma20.length - 1] || 0,
        sma50: sma50[sma50.length - 1] || 0,
        sma200: sma200[sma200.length - 1] || 0
      };
    }

    // Calculate RSI if requested or no specific indicators requested
    if (requestedIndicators.includes('rsi') || requestedIndicators.length === 0) {
      const rsi = this.calculateRSI(closes, this.config.rsi.period);
      indicators.rsi = rsi[rsi.length - 1] || 50; // Default to neutral if undefined
    }

    // Calculate MACD if requested or no specific indicators requested
    if (requestedIndicators.includes('macd') || requestedIndicators.length === 0) {
      const macd = this.calculateMACD(closes);
      indicators.macd = macd[macd.length - 1] || {
        MACD: 0,
        signal: 0,
        histogram: 0
      };
    }

    // Calculate Bollinger Bands if requested or no specific indicators requested
    if (requestedIndicators.includes('bb') || requestedIndicators.length === 0) {
      const bb = this.calculateBollingerBands(closes);
      indicators.bb = bb[bb.length - 1] || {
        upper: 0,
        middle: 0,
        lower: 0
      };
    }

    return indicators;
  }

  private calculateSMA(data: ReadonlyArray<number>, period: number): ReadonlyArray<number> {
    return SMA.calculate({
      values: [...data],
      period
    });
  }

  private calculateRSI(data: ReadonlyArray<number>, period: number = this.config.rsi.period): ReadonlyArray<number> {
    return RSI.calculate({
      values: [...data],
      period
    });
  }

  private calculateMACD(data: ReadonlyArray<number>): ReadonlyArray<MACDOutput> {
    return MACD.calculate({
      values: [...data],
      ...this.config.macd
    });
  }

  private calculateBollingerBands(
    data: ReadonlyArray<number>,
    period: number = this.config.bb.period,
    stdDev: number = this.config.bb.stdDev
  ): ReadonlyArray<BollingerBandsOutput> {
    return BollingerBands.calculate({
      values: [...data],
      period,
      stdDev
    });
  }

  private analyzeTrend(data: ReadonlyArray<MarketData>, indicators: IndicatorValues): TrendType {
    const lastClose = data[data.length - 1].close;
    const sma20 = indicators.sma?.sma20 || 0;
    const sma50 = indicators.sma?.sma50 || 0;
    const sma200 = indicators.sma?.sma200 || 0;

    if (lastClose > sma20 && sma20 > sma50 && sma50 > sma200) {
      return 'strong_uptrend';
    } else if (lastClose < sma20 && sma20 < sma50 && sma50 < sma200) {
      return 'strong_downtrend';
    } else if (lastClose > sma20 && lastClose > sma50) {
      return 'uptrend';
    } else if (lastClose < sma20 && lastClose < sma50) {
      return 'downtrend';
    } else {
      return 'sideways';
    }
  }

  private findKeyLevels(data: ReadonlyArray<MarketData>): KeyLevels {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    return {
      support: [Math.min(...lows)],
      resistance: [Math.max(...highs)]
    };
  }
}
