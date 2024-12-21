import { BaseStrategy, StrategyContext } from './StrategyTemplates';
import { Strategy, StrategyParameters, StrategySignal, Candle, TimeFrame } from '../../types/trading';
import {
  calculateSMA, calculateEMA, calculateRSI, calculateMACD,
  calculateBollingerBands, calculateATR, calculateStochastic
} from '../indicators/TechnicalIndicators';
import { SentimentService } from '../market/SentimentService';

export class PatternRecognitionStrategy extends BaseStrategy {
  name = 'Pattern Recognition Strategy';
  description = 'Identifies and trades based on chart patterns like head and shoulders, double tops/bottoms, etc.';
  defaultParameters = {
    lookbackPeriod: 20,
    confirmationPeriod: 3,
    minPatternSize: 5,
    maxPatternSize: 20,
    riskPerTrade: 0.01,
    stopLossAtr: 2,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const { lookbackPeriod, confirmationPeriod, minPatternSize, maxPatternSize, riskPerTrade, stopLossAtr } = parameters;

    if (historicalData.length < lookbackPeriod) {
      return [];
    }

    const signals: StrategySignal[] = [];
    const prices = historicalData.map(candle => candle.close);
    const currentPrice = prices[prices.length - 1];
    const atr = calculateATR(historicalData, 14);
    const stopLossDistance = atr * stopLossAtr;

    // Check for Head and Shoulders pattern
    if (this.isHeadAndShoulders(prices.slice(-lookbackPeriod))) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    // Check for Inverse Head and Shoulders pattern
    if (this.isInverseHeadAndShoulders(prices.slice(-lookbackPeriod))) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    // Check for Double Top pattern
    if (this.isDoubleTop(prices.slice(-lookbackPeriod), confirmationPeriod)) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    // Check for Double Bottom pattern
    if (this.isDoubleBottom(prices.slice(-lookbackPeriod), confirmationPeriod)) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    return signals;
  }

  private isHeadAndShoulders(prices: number[]): boolean {
    // Implement head and shoulders pattern recognition logic
    // This is a simplified version - you should implement more robust pattern recognition
    const peaks = this.findPeaks(prices);
    if (peaks.length < 3) return false;

    const leftShoulder = peaks[peaks.length - 3];
    const head = peaks[peaks.length - 2];
    const rightShoulder = peaks[peaks.length - 1];

    return (
      head > leftShoulder &&
      head > rightShoulder &&
      Math.abs(leftShoulder - rightShoulder) / leftShoulder < 0.1
    );
  }

  private isInverseHeadAndShoulders(prices: number[]): boolean {
    // Implement inverse head and shoulders pattern recognition logic
    const troughs = this.findTroughs(prices);
    if (troughs.length < 3) return false;

    const leftShoulder = troughs[troughs.length - 3];
    const head = troughs[troughs.length - 2];
    const rightShoulder = troughs[troughs.length - 1];

    return (
      head < leftShoulder &&
      head < rightShoulder &&
      Math.abs(leftShoulder - rightShoulder) / leftShoulder < 0.1
    );
  }

  private isDoubleTop(prices: number[], confirmationPeriod: number): boolean {
    const peaks = this.findPeaks(prices);
    if (peaks.length < 2) return false;

    const firstPeak = peaks[peaks.length - 2];
    const secondPeak = peaks[peaks.length - 1];
    const valley = Math.min(...prices.slice(peaks.length - 2, peaks.length - 1));

    return (
      Math.abs(firstPeak - secondPeak) / firstPeak < 0.02 &&
      firstPeak > valley &&
      secondPeak > valley &&
      prices[prices.length - 1] < valley
    );
  }

  private isDoubleBottom(prices: number[], confirmationPeriod: number): boolean {
    const troughs = this.findTroughs(prices);
    if (troughs.length < 2) return false;

    const firstTrough = troughs[troughs.length - 2];
    const secondTrough = troughs[troughs.length - 1];
    const peak = Math.max(...prices.slice(troughs.length - 2, troughs.length - 1));

    return (
      Math.abs(firstTrough - secondTrough) / firstTrough < 0.02 &&
      firstTrough < peak &&
      secondTrough < peak &&
      prices[prices.length - 1] > peak
    );
  }

  private findPeaks(prices: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 1; i < prices.length - 1; i++) {
      if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
        peaks.push(prices[i]);
      }
    }
    return peaks;
  }

  private findTroughs(prices: number[]): number[] {
    const troughs: number[] = [];
    for (let i = 1; i < prices.length - 1; i++) {
      if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
        troughs.push(prices[i]);
      }
    }
    return troughs;
  }
}

export class MultiTimeframeStrategy extends BaseStrategy {
  name = 'Multi-Timeframe Strategy';
  description = 'Analyzes multiple timeframes to identify high-probability trading opportunities';
  defaultParameters = {
    primaryTimeframe: TimeFrame.H1,
    secondaryTimeframe: TimeFrame.H4,
    tertiaryTimeframe: TimeFrame.D1,
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    trendStrengthThreshold: 25,
    riskPerTrade: 0.01,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const {
      primaryTimeframe,
      secondaryTimeframe,
      tertiaryTimeframe,
      rsiPeriod,
      rsiOverbought,
      rsiOversold,
      trendStrengthThreshold,
      riskPerTrade,
    } = parameters;

    const signals: StrategySignal[] = [];
    const currentPrice = historicalData[historicalData.length - 1].close;

    // Analyze trend direction on different timeframes
    const primaryTrend = this.analyzeTrend(historicalData, primaryTimeframe);
    const secondaryTrend = this.analyzeTrend(historicalData, secondaryTimeframe);
    const tertiaryTrend = this.analyzeTrend(historicalData, tertiaryTimeframe);

    // Calculate RSI for entry timing
    const prices = historicalData.map(candle => candle.close);
    const rsi = calculateRSI(prices, rsiPeriod);
    const currentRSI = rsi[rsi.length - 1];

    // Check for aligned trends
    if (primaryTrend > trendStrengthThreshold &&
        secondaryTrend > trendStrengthThreshold &&
        tertiaryTrend > trendStrengthThreshold) {
      // Bullish alignment with oversold condition
      if (currentRSI < rsiOversold) {
        signals.push({
          type: 'ENTRY',
          side: 'BUY',
          price: currentPrice,
          stopLoss: this.calculateStopLoss('BUY', historicalData),
          takeProfit: this.calculateTakeProfit('BUY', historicalData),
          risk: riskPerTrade,
        });
      }
    } else if (primaryTrend < -trendStrengthThreshold &&
               secondaryTrend < -trendStrengthThreshold &&
               tertiaryTrend < -trendStrengthThreshold) {
      // Bearish alignment with overbought condition
      if (currentRSI > rsiOverbought) {
        signals.push({
          type: 'ENTRY',
          side: 'SELL',
          price: currentPrice,
          stopLoss: this.calculateStopLoss('SELL', historicalData),
          takeProfit: this.calculateTakeProfit('SELL', historicalData),
          risk: riskPerTrade,
        });
      }
    }

    return signals;
  }

  private analyzeTrend(data: Candle[], timeframe: TimeFrame): number {
    // Calculate trend strength using ADX or similar indicator
    const prices = data.map(candle => candle.close);
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);

    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    const previousSMA20 = sma20[sma20.length - 2];
    const previousSMA50 = sma50[sma50.length - 2];

    // Calculate trend strength (simple version)
    const currentSlope = (currentSMA20 - currentSMA50) / currentSMA50 * 100;
    const previousSlope = (previousSMA20 - previousSMA50) / previousSMA50 * 100;

    return currentSlope - previousSlope;
  }

  private calculateStopLoss(side: 'BUY' | 'SELL', data: Candle[]): number {
    const atr = calculateATR(data, 14);
    const currentPrice = data[data.length - 1].close;
    return side === 'BUY' ? currentPrice - (atr * 2) : currentPrice + (atr * 2);
  }

  private calculateTakeProfit(side: 'BUY' | 'SELL', data: Candle[]): number {
    const atr = calculateATR(data, 14);
    const currentPrice = data[data.length - 1].close;
    return side === 'BUY' ? currentPrice + (atr * 4) : currentPrice - (atr * 4);
  }
}

export class SentimentAnalysisStrategy extends BaseStrategy {
  name = 'Sentiment Analysis Strategy';
  description = 'Combines technical analysis with market sentiment data for trading decisions';
  defaultParameters = {
    sentimentThreshold: 0.6,
    volumeThreshold: 1.5,
    rsiPeriod: 14,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    riskPerTrade: 0.01,
  };

  private sentimentService: SentimentService;

  constructor() {
    super();
    this.sentimentService = new SentimentService();
  }

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const {
      sentimentThreshold,
      volumeThreshold,
      rsiPeriod,
      macdFast,
      macdSlow,
      macdSignal,
      riskPerTrade,
    } = parameters;

    const signals: StrategySignal[] = [];
    const currentPrice = historicalData[historicalData.length - 1].close;

    // Get market sentiment data
    const sentiment = await this.sentimentService.getSentiment(context.symbol);
    const volumeRatio = await this.sentimentService.getVolumeRatio(context.symbol);

    // Calculate technical indicators
    const prices = historicalData.map(candle => candle.close);
    const rsi = calculateRSI(prices, rsiPeriod);
    const { macd, signal } = calculateMACD(prices, macdFast, macdSlow, macdSignal);

    const currentRSI = rsi[rsi.length - 1];
    const currentMACD = macd[macd.length - 1];
    const currentSignal = signal[signal.length - 1];

    // Strong bullish sentiment with technical confirmation
    if (sentiment.bullish > sentimentThreshold && volumeRatio > volumeThreshold) {
      if (currentRSI < 50 && currentMACD > currentSignal) {
        signals.push({
          type: 'ENTRY',
          side: 'BUY',
          price: currentPrice,
          stopLoss: this.calculateStopLoss('BUY', historicalData),
          takeProfit: this.calculateTakeProfit('BUY', historicalData, sentiment.strength),
          risk: riskPerTrade,
        });
      }
    }
    // Strong bearish sentiment with technical confirmation
    else if (sentiment.bearish > sentimentThreshold && volumeRatio > volumeThreshold) {
      if (currentRSI > 50 && currentMACD < currentSignal) {
        signals.push({
          type: 'ENTRY',
          side: 'SELL',
          price: currentPrice,
          stopLoss: this.calculateStopLoss('SELL', historicalData),
          takeProfit: this.calculateTakeProfit('SELL', historicalData, sentiment.strength),
          risk: riskPerTrade,
        });
      }
    }

    return signals;
  }

  private calculateStopLoss(side: 'BUY' | 'SELL', data: Candle[]): number {
    const atr = calculateATR(data, 14);
    const currentPrice = data[data.length - 1].close;
    return side === 'BUY' ? currentPrice - (atr * 2) : currentPrice + (atr * 2);
  }

  private calculateTakeProfit(side: 'BUY' | 'SELL', data: Candle[], sentimentStrength: number): number {
    const atr = calculateATR(data, 14);
    const multiplier = 2 + (sentimentStrength * 2); // Adjust take profit based on sentiment strength
    const currentPrice = data[data.length - 1].close;
    return side === 'BUY' ? currentPrice + (atr * multiplier) : currentPrice - (atr * multiplier);
  }
}

export const advancedStrategyTemplates = [
  new PatternRecognitionStrategy(),
  new MultiTimeframeStrategy(),
  new SentimentAnalysisStrategy(),
];
