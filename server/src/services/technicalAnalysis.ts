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

  private calculateIndicators(data: MarketData[], requestedIndicators: string[] = []): Record<string, TechnicalIndicator[]> {
    const indicators: Record<string, TechnicalIndicator[]> = {};
    
    // Filter and calculate only requested indicators, or all if none specified
    const calculateAll = requestedIndicators.length === 0;
    
    if (calculateAll || requestedIndicators.includes('sma')) {
      indicators.sma = this.calculateSMA(data);
    }
    
    if (calculateAll || requestedIndicators.includes('rsi')) {
      indicators.rsi = this.calculateRSI(data);
    }
    
    if (calculateAll || requestedIndicators.includes('macd')) {
      indicators.macd = this.calculateMACD(data);
    }
    
    if (calculateAll || requestedIndicators.includes('bollinger')) {
      indicators.bollinger = this.calculateBollingerBands(data);
    }
    
    return indicators;
  }

  private calculateSMA(data: MarketData[]): TechnicalIndicator[] {
    const closePrices = data.map(d => d.close);
    
    return [
      {
        name: 'SMA',
        value: this.calculateSMAValue(closePrices, 20),
        period: 20
      },
      {
        name: 'SMA',
        value: this.calculateSMAValue(closePrices, 50),
        period: 50
      },
      {
        name: 'SMA',
        value: this.calculateSMAValue(closePrices, 200),
        period: 200
      }
    ];
  }

  private calculateSMAValue(data: number[], period: number): number {
    const input = {
      values: data,
      period
    };
    const results = SMA.calculate(input);
    return results[results.length - 1] || 0;
  }

  private calculateRSI(data: MarketData[]): TechnicalIndicator[] {
    const closePrices = data.map(d => d.close);
    
    return [
      {
        name: 'RSI',
        value: this.calculateRSIValue(closePrices, 14),
        period: 14
      }
    ];
  }

  private calculateRSIValue(data: number[], period: number): number {
    const input = {
      values: data,
      period
    };
    const results = RSI.calculate(input);
    return results[results.length - 1] || 0;
  }

  private calculateMACD(data: MarketData[]): TechnicalIndicator[] {
    const closePrices = data.map(d => d.close);
    
    return [
      {
        name: 'MACD',
        value: this.calculateMACDValue(closePrices).histogram,
        period: 26
      }
    ];
  }

  private calculateMACDValue(data: number[]): { histogram: number } {
    const input = {
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    
    const results = MACD.calculate(input);
    const lastResult = results[results.length - 1] || { histogram: 0 };
    
    return {
      histogram: lastResult.histogram
    };
  }

  private calculateBollingerBands(data: MarketData[]): TechnicalIndicator[] {
    const closePrices = data.map(d => d.close);
    const bands = this.calculateBollingerBandsValue(closePrices);
    
    return [
      {
        name: 'Bollinger Upper',
        value: bands.upper,
        period: 20
      },
      {
        name: 'Bollinger Middle',
        value: bands.middle,
        period: 20
      },
      {
        name: 'Bollinger Lower',
        value: bands.lower,
        period: 20
      }
    ];
  }

  private calculateBollingerBandsValue(data: number[]): { upper: number, middle: number, lower: number } {
    const input = {
      period: 20,
      values: data,
      stdDev: 2
    };
    const results = BollingerBands.calculate(input);
    const lastResult = results[results.length - 1] || { upper: 0, middle: 0, lower: 0 };
    return {
      upper: lastResult.upper,
      middle: lastResult.middle,
      lower: lastResult.lower
    };
  }

  private analyzeTrend(data: MarketData[], indicators: Record<string, TechnicalIndicator[]>) {
    const closes = data.map(d => d.close);
    const smaIndicators = indicators.sma || [];
    
    const sma20 = smaIndicators.find(i => i.period === 20)?.value ?? 0;
    const sma50 = smaIndicators.find(i => i.period === 50)?.value ?? 0;
    const sma200 = smaIndicators.find(i => i.period === 200)?.value ?? 0;
    
    return {
      shortTerm: closes[closes.length - 1] > sma20 ? 'bullish' : 'bearish',
      mediumTerm: closes[closes.length - 1] > sma50 ? 'bullish' : 'bearish',
      longTerm: closes[closes.length - 1] > sma200 ? 'bullish' : 'bearish',
      strength: this.calculateTrendStrength(data)
    };
  }

  private calculateTrendStrength(data: MarketData[]) {
    const closes = data.map(d => d.close);
    const sma20 = this.calculateSMAValue(closes, 20);
    return closes[closes.length - 1] > sma20 ? 'strong' : 'weak';
  }

  private findKeyLevels(data: MarketData[]) {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    return {
      resistance: Math.max(...highs),
      support: Math.min(...lows)
    };
  }

  private detectPatterns(data: MarketData[]) {
    const closes = data.map(d => d.close);
    const patterns = [];
    
    // Simple trend pattern detection
    const sma20 = this.calculateSMAValue(closes, 20);
    if (closes[closes.length - 1] > sma20) {
      patterns.push('uptrend');
    } else {
      patterns.push('downtrend');
    }
    
    return patterns;
  }
}
