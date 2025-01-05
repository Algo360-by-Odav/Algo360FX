import * as technicalIndicators from 'technicalindicators';
import axios from 'axios';
import { MACDInput } from '../types/technicalAnalysis';

interface MarketData {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
  volume: number; // Add volume property
}

export class TechnicalAnalysis {
  private async getHistoricalData(symbol: string, timeframe: string): Promise<MarketData[]> {
    const response = await axios.get(`${process.env.MARKET_DATA_API}/historical`, {
      params: { symbol, timeframe }
    });
    return response.data;
  }

  public async analyze(symbol: string, timeframe: string): Promise<Record<string, unknown>> {
    try {
      const historicalData = await this.getHistoricalData(symbol, timeframe);
      const analysis: Record<string, unknown> = {};

      // Calculate core indicators
      analysis.sma = await this.calculateSMA(historicalData.map(d => d.close));
      analysis.ema = await this.calculateEMA(historicalData.map(d => d.close));
      analysis.rsi = await this.calculateRSI(historicalData.map(d => d.close));
      analysis.macd = await this.calculateMACD(historicalData.map(d => d.close));
      analysis.bollinger = await this.calculateBollingerBands(historicalData.map(d => d.close));
      analysis.atr = await this.calculateATR(historicalData);
      analysis.stochastic = await this.calculateStochastic(historicalData);
      analysis.adx = await this.calculateADX(historicalData);

      // Add trend analysis
      analysis.trend = await this.analyzeTrend(historicalData);
      
      // Add support/resistance levels
      analysis.levels = await this.findKeyLevels(historicalData);

      // Add pattern recognition
      analysis.patterns = await this.detectPatterns(historicalData);

      // Add volume analysis
      analysis.volume = await this.analyzeVolume(historicalData);

      return analysis;
    } catch (error) {
      console.error('Error in technical analysis:', error);
      throw error;
    }
  }

  public async calculateSMA(data: number[], period: number = 14): Promise<number[]> {
    return technicalIndicators.SMA.calculate({ period, values: data });
  }

  public async calculateEMA(data: number[], period: number = 14): Promise<number[]> {
    return technicalIndicators.EMA.calculate({ period, values: data });
  }

  public async calculateRSI(data: number[], period: number = 14): Promise<number[]> {
    return technicalIndicators.RSI.calculate({ period, values: data });
  }

  public async calculateMACD(data: number[]): Promise<{ histogram: number; signal: number; MACD: number }[]> {
    const macdInput: MACDInput = {
      values: data,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    return technicalIndicators.MACD.calculate(macdInput);
  }

  public async calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2): Promise<{
    upper: number[];
    middle: number[];
    lower: number[];
  }> {
    return technicalIndicators.BollingerBands.calculate({
      period,
      values: data,
      stdDev
    });
  }

  public async calculateATR(data: MarketData[], period: number = 14): Promise<number[]> {
    return technicalIndicators.ATR.calculate({
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      period
    });
  }

  public async findSupportLevels(data: MarketData[]): Promise<number[]> {
    const lows = data.map(d => d.low);
    const supportLevels = new Set<number>();
    
    for (let i = 1; i < lows.length - 1; i++) {
      if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
        supportLevels.add(lows[i]);
      }
    }
    
    return Array.from(supportLevels).sort((a, b) => a - b);
  }

  public async findResistanceLevels(data: MarketData[]): Promise<number[]> {
    const highs = data.map(d => d.high);
    const resistanceLevels = new Set<number>();
    
    for (let i = 1; i < highs.length - 1; i++) {
      if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
        resistanceLevels.add(highs[i]);
      }
    }
    
    return Array.from(resistanceLevels).sort((a, b) => a - b);
  }

  public async findCandlePatterns(data: MarketData[]): Promise<string[]> {
    const patterns: string[] = [];
    const lastThreeCandles = data.slice(-3);
    
    // Simple pattern detection example
    if (lastThreeCandles.length === 3) {
      const [c1, c2, c3] = lastThreeCandles;
      
      // Bullish engulfing
      if (c2.close < c2.open && c3.close > c3.open && c3.close > c2.open && c3.open < c2.close) {
        patterns.push('bullish engulfing');
      }
      
      // Bearish engulfing
      if (c2.close > c2.open && c3.close < c3.open && c3.close < c2.open && c3.open > c2.close) {
        patterns.push('bearish engulfing');
      }
    }
    
    return patterns;
  }

  public async analyzeVolume(data: MarketData[]): Promise<{
    trend: 'increasing' | 'decreasing' | 'stable';
    strength: number;
  }> {
    const volumes = data.map(d => d.volume);
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const recentVolume = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
    
    let trend: 'increasing' | 'decreasing' | 'stable';
    if (recentVolume > avgVolume * 1.1) {
      trend = 'increasing';
    } else if (recentVolume < avgVolume * 0.9) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }
    
    const strength = recentVolume / avgVolume;
    
    return { trend, strength };
  }

  private async calculateStochastic(data: MarketData[], period: number = 14): Promise<{
    k: number[];
    d: number[];
  }> {
    return technicalIndicators.Stochastic.calculate({
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      period,
      signalPeriod: 3
    });
  }

  private async analyzeTrend(data: MarketData[]): Promise<{
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
    strength: string;
  }> {
    const closes = data.map(d => d.close);
    const sma20 = await this.calculateSMA(closes, 20);
    const sma50 = await this.calculateSMA(closes, 50);
    const sma200 = await this.calculateSMA(closes, 200);
    
    return {
      shortTerm: closes[closes.length - 1] > sma20[sma20.length - 1] ? 'bullish' : 'bearish',
      mediumTerm: closes[closes.length - 1] > sma50[sma50.length - 1] ? 'bullish' : 'bearish',
      longTerm: closes[closes.length - 1] > sma200[sma200.length - 1] ? 'bullish' : 'bearish',
      strength: await this.calculateTrendStrength(data),
    };
  }

  private async calculateTrendStrength(data: MarketData[]): Promise<string> {
    const adx = await this.calculateADX(data);
    const lastADX = adx[adx.length - 1];
    
    if (lastADX > 40) return 'strong';
    if (lastADX > 25) return 'moderate';
    return 'weak';
  }

  private async findKeyLevels(data: MarketData[]): Promise<{
    support: number[];
    resistance: number[];
  }> {
    return {
      support: await this.findSupportLevels(data),
      resistance: await this.findResistanceLevels(data),
    };
  }

  private async detectPatterns(data: MarketData[]): Promise<string[]> {
    return this.findCandlePatterns(data);
  }

  public async calculateADX(data: MarketData[], period: number = 14): Promise<number[]> {
    return technicalIndicators.ADX.calculate({
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      period
    });
  }
}
