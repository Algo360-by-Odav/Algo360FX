import { SMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { MarketData, TechnicalIndicator } from '../types/services';
import axios from 'axios';

export class TechnicalAnalysis {
  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketData[]> {
    const response = await axios.get(`${process.env.MARKET_DATA_API}/historical`, {
      params: { symbol, timeframe }
    });
    return response.data;
  }

  public async analyze(symbol: string, timeframe: string, indicators: string[] = []): Promise<Record<string, any>> {
    const historicalData = await this.getHistoricalData(symbol, timeframe);
    const analysis: Record<string, any> = {};

    // Calculate indicators
    const technicalIndicators = this.calculateIndicators(historicalData);
    analysis.indicators = technicalIndicators;

    // Add trend analysis
    analysis.trend = this.analyzeTrend(historicalData, technicalIndicators);
    
    // Add support/resistance levels
    analysis.levels = this.findKeyLevels(historicalData);

    // Add pattern recognition
    analysis.patterns = this.detectPatterns(historicalData);

    return analysis;
  }

  private calculateIndicators(marketData: MarketData[]): TechnicalIndicator[] {
    const closePrices = marketData.map(d => d.close);
    
    return [
      {
        name: 'SMA',
        value: this.calculateSMA(closePrices, 20),
        period: 20
      },
      {
        name: 'RSI',
        value: this.calculateRSI(closePrices, 14),
        period: 14
      },
      {
        name: 'MACD',
        value: this.calculateMACD(closePrices).histogram,
        period: 26
      }
    ];
  }

  private calculateSMA(data: number[], period: number): number {
    const input = {
      values: data,
      period
    };
    const results = SMA.calculate(input);
    return results[results.length - 1] || 0;
  }

  private calculateRSI(data: number[], period: number): number {
    const input = {
      values: data,
      period
    };
    const results = RSI.calculate(input);
    return results[results.length - 1] || 0;
  }

  private calculateMACD(data: number[]): { histogram: number } {
    const input = {
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    const results = MACD.calculate(input);
    return {
      histogram: results[results.length - 1]?.histogram || 0
    };
  }

  calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2) {
    const input = {
      period,
      values: data,
      stdDev
    };
    return BollingerBands.calculate(input);
  }

  private analyzeTrend(data: MarketData[], indicators: TechnicalIndicator[]) {
    const closes = data.map(d => d.close);
    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const sma200 = this.calculateSMA(closes, 200);
    
    return {
      shortTerm: closes[closes.length - 1] > sma20 ? 'bullish' : 'bearish',
      mediumTerm: closes[closes.length - 1] > sma50 ? 'bullish' : 'bearish',
      longTerm: closes[closes.length - 1] > sma200 ? 'bullish' : 'bearish',
      strength: this.calculateTrendStrength(data),
    };
  }

  private calculateTrendStrength(data: MarketData[]) {
    const closes = data.map(d => d.close);
    const sma20 = this.calculateSMA(closes, 20);
    return closes[closes.length - 1] > sma20 ? 'strong' : 'weak';
  }

  private findKeyLevels(data: MarketData[]) {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    return {
      support: Math.min(...lows),
      resistance: Math.max(...highs),
    };
  }

  private detectPatterns(data: MarketData[]) {
    const closes = data.map(d => d.close);
    const patterns = [];
    
    // Simple trend pattern detection
    const sma20 = this.calculateSMA(closes, 20);
    if (closes[closes.length - 1] > sma20) {
      patterns.push('uptrend');
    } else {
      patterns.push('downtrend');
    }
    
    return patterns;
  }
}
