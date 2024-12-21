import { Strategy, StrategyParameters, StrategySignal, TimeFrame, Candle } from '../../types/trading';
import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands } from '../indicators/TechnicalIndicators';

export interface StrategyContext {
  timestamp: Date;
  price: number;
  balance: number;
  equity: number;
  position: any | null;
  historicalData: Candle[];
}

abstract class BaseStrategy implements Strategy {
  abstract name: string;
  abstract description: string;
  abstract defaultParameters: StrategyParameters;

  abstract execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]>;

  protected calculatePositionSize(balance: number, risk: number, entryPrice: number, stopLoss: number): number {
    const riskAmount = balance * risk;
    const priceDiff = Math.abs(entryPrice - stopLoss);
    return riskAmount / priceDiff;
  }
}

export class MovingAverageCrossoverStrategy extends BaseStrategy {
  name = 'Moving Average Crossover';
  description = 'Generates signals based on crossovers between fast and slow moving averages';
  defaultParameters = {
    fastPeriod: 10,
    slowPeriod: 20,
    riskPerTrade: 0.01,
    stopLossAtr: 2,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const { fastPeriod, slowPeriod, riskPerTrade, stopLossAtr } = parameters;

    if (historicalData.length < slowPeriod) {
      return [];
    }

    const prices = historicalData.map(candle => candle.close);
    const fastMA = calculateEMA(prices, fastPeriod);
    const slowMA = calculateEMA(prices, slowPeriod);
    const atr = this.calculateATR(historicalData, 14);

    const signals: StrategySignal[] = [];
    const currentPrice = prices[prices.length - 1];
    const stopLossDistance = atr * stopLossAtr;

    // Check for crossover
    const currentFastMA = fastMA[fastMA.length - 1];
    const previousFastMA = fastMA[fastMA.length - 2];
    const currentSlowMA = slowMA[slowMA.length - 1];
    const previousSlowMA = slowMA[slowMA.length - 2];

    // Bullish crossover
    if (previousFastMA <= previousSlowMA && currentFastMA > currentSlowMA) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }
    // Bearish crossover
    else if (previousFastMA >= previousSlowMA && currentFastMA < currentSlowMA) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    return signals;
  }

  private calculateATR(data: Candle[], period: number): number {
    const trs = data.map((candle, i) => {
      if (i === 0) return candle.high - candle.low;
      const previousClose = data[i - 1].close;
      const tr1 = candle.high - candle.low;
      const tr2 = Math.abs(candle.high - previousClose);
      const tr3 = Math.abs(candle.low - previousClose);
      return Math.max(tr1, tr2, tr3);
    });

    return calculateEMA(trs, period)[trs.length - 1];
  }
}

export class RSIStrategy extends BaseStrategy {
  name = 'RSI Strategy';
  description = 'Generates signals based on RSI oversold and overbought conditions';
  defaultParameters = {
    period: 14,
    oversold: 30,
    overbought: 70,
    riskPerTrade: 0.01,
    stopLossAtr: 2,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const { period, oversold, overbought, riskPerTrade, stopLossAtr } = parameters;

    if (historicalData.length < period) {
      return [];
    }

    const prices = historicalData.map(candle => candle.close);
    const rsi = calculateRSI(prices, period);
    const atr = this.calculateATR(historicalData, 14);

    const signals: StrategySignal[] = [];
    const currentPrice = prices[prices.length - 1];
    const currentRSI = rsi[rsi.length - 1];
    const previousRSI = rsi[rsi.length - 2];
    const stopLossDistance = atr * stopLossAtr;

    // Oversold to bullish
    if (previousRSI <= oversold && currentRSI > oversold) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }
    // Overbought to bearish
    else if (previousRSI >= overbought && currentRSI < overbought) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    return signals;
  }

  private calculateATR(data: Candle[], period: number): number {
    const trs = data.map((candle, i) => {
      if (i === 0) return candle.high - candle.low;
      const previousClose = data[i - 1].close;
      const tr1 = candle.high - candle.low;
      const tr2 = Math.abs(candle.high - previousClose);
      const tr3 = Math.abs(candle.low - previousClose);
      return Math.max(tr1, tr2, tr3);
    });

    return calculateEMA(trs, period)[trs.length - 1];
  }
}

export class MACDStrategy extends BaseStrategy {
  name = 'MACD Strategy';
  description = 'Generates signals based on MACD crossovers and divergences';
  defaultParameters = {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    riskPerTrade: 0.01,
    stopLossAtr: 2,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const { fastPeriod, slowPeriod, signalPeriod, riskPerTrade, stopLossAtr } = parameters;

    if (historicalData.length < slowPeriod + signalPeriod) {
      return [];
    }

    const prices = historicalData.map(candle => candle.close);
    const { macd, signal } = calculateMACD(prices, fastPeriod, slowPeriod, signalPeriod);
    const atr = this.calculateATR(historicalData, 14);

    const signals: StrategySignal[] = [];
    const currentPrice = prices[prices.length - 1];
    const stopLossDistance = atr * stopLossAtr;

    const currentMACD = macd[macd.length - 1];
    const previousMACD = macd[macd.length - 2];
    const currentSignal = signal[signal.length - 1];
    const previousSignal = signal[signal.length - 2];

    // Bullish crossover
    if (previousMACD <= previousSignal && currentMACD > currentSignal) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }
    // Bearish crossover
    else if (previousMACD >= previousSignal && currentMACD < currentSignal) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - (stopLossDistance * 2),
        risk: riskPerTrade,
      });
    }

    return signals;
  }

  private calculateATR(data: Candle[], period: number): number {
    const trs = data.map((candle, i) => {
      if (i === 0) return candle.high - candle.low;
      const previousClose = data[i - 1].close;
      const tr1 = candle.high - candle.low;
      const tr2 = Math.abs(candle.high - previousClose);
      const tr3 = Math.abs(candle.low - previousClose);
      return Math.max(tr1, tr2, tr3);
    });

    return calculateEMA(trs, period)[trs.length - 1];
  }
}

export class BollingerBandsStrategy extends BaseStrategy {
  name = 'Bollinger Bands Strategy';
  description = 'Generates signals based on price touching Bollinger Bands and momentum';
  defaultParameters = {
    period: 20,
    standardDeviations: 2,
    riskPerTrade: 0.01,
    momentum: 14,
  };

  async execute(context: StrategyContext, parameters: StrategyParameters): Promise<StrategySignal[]> {
    const { historicalData } = context;
    const { period, standardDeviations, riskPerTrade, momentum } = parameters;

    if (historicalData.length < period) {
      return [];
    }

    const prices = historicalData.map(candle => candle.close);
    const { upper, lower, middle } = calculateBollingerBands(prices, period, standardDeviations);
    const rsi = calculateRSI(prices, momentum);

    const signals: StrategySignal[] = [];
    const currentPrice = prices[prices.length - 1];
    const currentUpper = upper[upper.length - 1];
    const currentLower = lower[lower.length - 1];
    const currentRSI = rsi[rsi.length - 1];

    const stopLossDistance = (currentUpper - currentLower) / 2;

    // Price touches lower band with bullish momentum
    if (currentPrice <= currentLower && currentRSI > 30) {
      signals.push({
        type: 'ENTRY',
        side: 'BUY',
        price: currentPrice,
        stopLoss: currentPrice - stopLossDistance,
        takeProfit: currentPrice + stopLossDistance,
        risk: riskPerTrade,
      });
    }
    // Price touches upper band with bearish momentum
    else if (currentPrice >= currentUpper && currentRSI < 70) {
      signals.push({
        type: 'ENTRY',
        side: 'SELL',
        price: currentPrice,
        stopLoss: currentPrice + stopLossDistance,
        takeProfit: currentPrice - stopLossDistance,
        risk: riskPerTrade,
      });
    }

    return signals;
  }
}

export const strategyTemplates = [
  new MovingAverageCrossoverStrategy(),
  new RSIStrategy(),
  new MACDStrategy(),
  new BollingerBandsStrategy(),
];
