import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { MarketData, MACDOutput, BollingerBandsOutput } from '../types/market';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';

// Load environment variables
config();

export class TechnicalAnalysis {
  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketData[]> {
    const response: AxiosResponse<MarketData[]> = await axios.get(`${process.env.MARKET_DATA_API}/historical`, {
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

  private calculateSMA(data: number[], period: number): number[] {
    return SMA.calculate({
      values: data,
      period
    });
  }

  private calculateRSI(data: number[], period: number = 14): number[] {
    return RSI.calculate({
      values: data,
      period
    });
  }

  private calculateMACD(data: number[]): MACDOutput[] {
    return MACD.calculate({
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });
  }

  private calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): BollingerBandsOutput[] {
    return BollingerBands.calculate({
      values: data,
      period,
      stdDev
    });
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

  private findKeyLevels(data: MarketData[]): { support: number[]; resistance: number[] } {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    return {
      support: [Math.min(...lows)],
      resistance: [Math.max(...highs)]
    };
  }
}
