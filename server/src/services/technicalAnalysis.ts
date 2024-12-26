import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { MarketData } from '../types/market';
import axios from 'axios';

export class TechnicalAnalysis {
  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketData[]> {
    const response = await axios.get(`${process.env.MARKET_DATA_API}/historical`, {
      params: { symbol, timeframe }
    });
    return response.data;
  }

  public async analyze(symbol: string, timeframe: string, requestedIndicators: string[] = []): Promise<Record<string, any>> {
    const historicalData = await this.getHistoricalData(symbol, timeframe);
    const analysis: Record<string, any> = {};

    // Calculate indicators
    const technicalIndicators = this.calculateIndicators(historicalData, requestedIndicators);
    analysis.indicators = technicalIndicators;

    // Add trend analysis
    analysis.trend = this.analyzeTrend(historicalData, technicalIndicators);

    // Add support/resistance levels
    analysis.levels = this.findKeyLevels(historicalData);

    return analysis;
  }

  private calculateIndicators(data: MarketData[], requestedIndicators: string[]): Record<string, any> {
    const closes = data.map(d => d.close);
    const indicators: Record<string, any> = {};

    // Calculate SMA if requested or no specific indicators requested
    if (requestedIndicators.includes('sma') || requestedIndicators.length === 0) {
      const sma20 = this.calculateSMA(closes, 20);
      const sma50 = this.calculateSMA(closes, 50);
      const sma200 = this.calculateSMA(closes, 200);

      indicators.sma = {
        sma20: sma20[sma20.length - 1] || 0,
        sma50: sma50[sma50.length - 1] || 0,
        sma200: sma200[sma200.length - 1] || 0
      };
    }

    // Calculate RSI if requested or no specific indicators requested
    if (requestedIndicators.includes('rsi') || requestedIndicators.length === 0) {
      const rsi = this.calculateRSI(closes);
      indicators.rsi = rsi[rsi.length - 1] || 50; // Default to neutral if undefined
    }

    // Calculate MACD if requested or no specific indicators requested
    if (requestedIndicators.includes('macd') || requestedIndicators.length === 0) {
      const macd = this.calculateMACD(closes);
      indicators.macd = {
        line: macd.MACD[macd.MACD.length - 1] || 0,
        signal: macd.signal[macd.signal.length - 1] || 0,
        histogram: macd.histogram[macd.histogram.length - 1] || 0
      };
    }

    // Calculate Bollinger Bands if requested or no specific indicators requested
    if (requestedIndicators.includes('bollinger') || requestedIndicators.length === 0) {
      const bollinger = this.calculateBollingerBands(closes);
      indicators.bollinger = {
        upper: bollinger.upper[bollinger.upper.length - 1] || 0,
        middle: bollinger.middle[bollinger.middle.length - 1] || 0,
        lower: bollinger.lower[bollinger.lower.length - 1] || 0
      };
    }

    return indicators;
  }

  private calculateSMA(data: number[], period: number): number[] {
    const input = {
      values: data,
      period
    };
    return SMA.calculate(input);
  }

  private calculateRSI(data: number[]): number[] {
    const input = {
      values: data,
      period: 14
    };
    return RSI.calculate(input);
  }

  private calculateMACD(data: number[]) {
    const input = {
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    return MACD.calculate(input);
  }

  private calculateBollingerBands(data: number[]) {
    const input = {
      values: data,
      period: 20,
      stdDev: 2
    };
    return BollingerBands.calculate(input);
  }

  private analyzeTrend(data: MarketData[], indicators: Record<string, any>): string {
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

  private findKeyLevels(data: MarketData[]) {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    return {
      resistance: Math.max(...highs),
      support: Math.min(...lows)
    };
  }
}
