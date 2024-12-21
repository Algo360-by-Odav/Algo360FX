import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import {
  Strategy,
  BacktestResult,
  Trade,
  Candle,
  TimeFrame,
  OptimizationResult,
  StrategyParameter,
  BacktestConfig,
  StrategyPerformance,
  MarketEnvironment,
} from '@/types/trading';

export class BacktestingStore {
  private historicalData: Map<string, Candle[]> = new Map();
  private backtestResults: Map<string, BacktestResult> = new Map();
  private optimizationResults: Map<string, OptimizationResult> = new Map();
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async runBacktest(strategy: Strategy, config: BacktestConfig): Promise<BacktestResult> {
    try {
      this.loading = true;
      this.error = null;

      // Fetch historical data if not already available
      if (!this.historicalData.has(strategy.symbol)) {
        await this.fetchHistoricalData(strategy.symbol, strategy.timeframe, config.startDate, config.endDate);
      }

      const result = await this.executeBacktest(strategy, config);
      this.backtestResults.set(strategy.id, result);
      return result;

    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Backtest failed';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private async executeBacktest(strategy: Strategy, config: BacktestConfig): Promise<BacktestResult> {
    const candles = this.historicalData.get(strategy.symbol) || [];
    const trades: Trade[] = [];
    let equity = config.initialCapital;
    let highWaterMark = equity;
    let maxDrawdown = 0;
    let currentPosition: Trade | null = null;
    const equityCurve: number[] = [equity];

    for (let i = config.warmupPeriod; i < candles.length; i++) {
      const currentCandle = candles[i];
      const lookback = candles.slice(Math.max(0, i - config.warmupPeriod), i + 1);
      
      // Update market environment
      const marketEnv = this.analyzeMarketEnvironment(lookback);
      
      // Check for exit signals if in position
      if (currentPosition) {
        const exitSignal = this.evaluateExitRules(strategy, currentPosition, currentCandle, lookback, marketEnv);
        if (exitSignal) {
          currentPosition.exitPrice = exitSignal.price;
          currentPosition.exitTime = currentCandle.timestamp;
          currentPosition.pnl = this.calculatePnL(currentPosition);
          trades.push(currentPosition);
          equity += currentPosition.pnl;
          equityCurve.push(equity);
          currentPosition = null;

          // Update drawdown
          if (equity > highWaterMark) {
            highWaterMark = equity;
          } else {
            const drawdown = (highWaterMark - equity) / highWaterMark;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
          }
        }
      }

      // Check for entry signals if not in position
      if (!currentPosition) {
        const entrySignal = this.evaluateEntryRules(strategy, currentCandle, lookback, marketEnv);
        if (entrySignal) {
          const positionSize = this.calculatePositionSize(equity, config.riskPerTrade, entrySignal.price, entrySignal.stopLoss);
          currentPosition = {
            id: `${strategy.id}_${trades.length}`,
            strategyId: strategy.id,
            symbol: strategy.symbol,
            side: entrySignal.side,
            entryPrice: entrySignal.price,
            stopLoss: entrySignal.stopLoss,
            takeProfit: entrySignal.takeProfit,
            size: positionSize,
            entryTime: currentCandle.timestamp,
            status: 'open',
          };
        }
      }
    }

    // Close any remaining position
    if (currentPosition) {
      const lastCandle = candles[candles.length - 1];
      currentPosition.exitPrice = lastCandle.close;
      currentPosition.exitTime = lastCandle.timestamp;
      currentPosition.pnl = this.calculatePnL(currentPosition);
      trades.push(currentPosition);
      equity += currentPosition.pnl;
      equityCurve.push(equity);
    }

    return this.generateBacktestResult(trades, equityCurve, maxDrawdown, config);
  }

  private analyzeMarketEnvironment(candles: Candle[]): MarketEnvironment {
    // Implement market regime detection, trend analysis, and volatility measurement
    const trend = this.detectTrend(candles);
    const volatility = this.calculateVolatility(candles);
    const volume = this.analyzeVolume(candles);

    return {
      trend,
      volatility,
      volume,
      regime: this.detectRegime(trend, volatility, volume),
    };
  }

  private detectTrend(candles: Candle[]): 'uptrend' | 'downtrend' | 'sideways' {
    // Simple trend detection using moving averages
    const prices = candles.map(c => c.close);
    const shortMA = this.calculateSMA(prices, 20);
    const longMA = this.calculateSMA(prices, 50);

    if (shortMA > longMA * 1.01) return 'uptrend';
    if (shortMA < longMA * 0.99) return 'downtrend';
    return 'sideways';
  }

  private calculateVolatility(candles: Candle[]): number {
    const returns = candles.slice(1).map((candle, i) => 
      Math.log(candle.close / candles[i].close)
    );
    return this.calculateStandardDeviation(returns) * Math.sqrt(252);
  }

  private analyzeVolume(candles: Candle[]): 'high' | 'normal' | 'low' {
    const volumes = candles.map(c => c.volume);
    const avgVolume = this.calculateSMA(volumes, 20);
    const currentVolume = volumes[volumes.length - 1];

    if (currentVolume > avgVolume * 1.5) return 'high';
    if (currentVolume < avgVolume * 0.5) return 'low';
    return 'normal';
  }

  private detectRegime(
    trend: 'uptrend' | 'downtrend' | 'sideways',
    volatility: number,
    volume: 'high' | 'normal' | 'low'
  ): 'trending' | 'ranging' | 'breakout' | 'reversal' {
    if (trend !== 'sideways' && volume === 'high') {
      return volatility > 0.2 ? 'breakout' : 'trending';
    }
    if (trend === 'sideways' && volatility < 0.1) return 'ranging';
    return 'reversal';
  }

  private calculateSMA(values: number[], period: number): number {
    if (values.length < period) return 0;
    const sum = values.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateStandardDeviation(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  async optimizeStrategy(
    strategy: Strategy,
    parameters: StrategyParameter[],
    config: BacktestConfig
  ): Promise<OptimizationResult> {
    try {
      this.loading = true;
      this.error = null;

      const results: StrategyPerformance[] = [];
      const parameterCombinations = this.generateParameterCombinations(parameters);

      for (const params of parameterCombinations) {
        const optimizedStrategy = { ...strategy, parameters: params };
        const result = await this.runBacktest(optimizedStrategy, config);
        results.push({
          parameters: params,
          performance: result,
        });
      }

      const optimizationResult = this.analyzeOptimizationResults(results);
      this.optimizationResults.set(strategy.id, optimizationResult);
      return optimizationResult;

    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Optimization failed';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private generateParameterCombinations(parameters: StrategyParameter[]): any[] {
    const combinations: any[] = [];
    const generate = (index: number, current: any) => {
      if (index === parameters.length) {
        combinations.push(current);
        return;
      }

      const param = parameters[index];
      const values = this.generateParameterValues(param);
      values.forEach(value => {
        generate(index + 1, { ...current, [param.name]: value });
      });
    };

    generate(0, {});
    return combinations;
  }

  private generateParameterValues(parameter: StrategyParameter): number[] {
    const values: number[] = [];
    const steps = Math.floor((parameter.max - parameter.min) / parameter.step);
    
    for (let i = 0; i <= steps; i++) {
      values.push(parameter.min + i * parameter.step);
    }
    
    return values;
  }

  private analyzeOptimizationResults(results: StrategyPerformance[]): OptimizationResult {
    // Sort results by different metrics
    const byProfitFactor = [...results].sort((a, b) => 
      (b.performance.profitFactor || 0) - (a.performance.profitFactor || 0)
    );
    
    const bySharpeRatio = [...results].sort((a, b) => 
      (b.performance.sharpeRatio || 0) - (a.performance.sharpeRatio || 0)
    );
    
    const byMaxDrawdown = [...results].sort((a, b) => 
      (a.performance.maxDrawdown || 0) - (b.performance.maxDrawdown || 0)
    );

    // Find robust parameters that perform well across multiple metrics
    const topResults = this.findRobustParameters(results);

    return {
      bestByProfitFactor: byProfitFactor[0],
      bestBySharpeRatio: bySharpeRatio[0],
      bestByMaxDrawdown: byMaxDrawdown[0],
      robustParameters: topResults,
      allResults: results,
    };
  }

  private findRobustParameters(results: StrategyPerformance[]): StrategyPerformance[] {
    // Score each result based on multiple metrics
    const scoredResults = results.map(result => ({
      ...result,
      score: this.calculateRobustnessScore(result.performance),
    }));

    // Return top 5 most robust parameter sets
    return scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ score, ...result }) => result);
  }

  private calculateRobustnessScore(performance: BacktestResult): number {
    // Weight different metrics based on importance
    const weights = {
      profitFactor: 0.3,
      sharpeRatio: 0.3,
      maxDrawdown: 0.2,
      winRate: 0.2,
    };

    return (
      (performance.profitFactor || 0) * weights.profitFactor +
      (performance.sharpeRatio || 0) * weights.sharpeRatio +
      (1 - (performance.maxDrawdown || 0)) * weights.maxDrawdown +
      (performance.winRate || 0) * weights.winRate
    );
  }

  // Helper methods
  private calculatePnL(trade: Trade): number {
    if (!trade.exitPrice) return 0;
    const direction = trade.side === 'buy' ? 1 : -1;
    return direction * (trade.exitPrice - trade.entryPrice) * trade.size;
  }

  private calculatePositionSize(equity: number, riskPerTrade: number, entryPrice: number, stopLoss: number): number {
    const riskAmount = equity * riskPerTrade;
    const riskPerUnit = Math.abs(entryPrice - stopLoss);
    return riskAmount / riskPerUnit;
  }

  private async fetchHistoricalData(symbol: string, timeframe: TimeFrame, startDate: string, endDate: string): Promise<void> {
    try {
      const response = await fetch(`/api/historical-data/${symbol}`, {
        params: { timeframe, startDate, endDate },
      });
      const data = await response.json();
      this.historicalData.set(symbol, data);
    } catch (error) {
      throw new Error(`Failed to fetch historical data: ${error}`);
    }
  }

  private generateBacktestResult(
    trades: Trade[],
    equityCurve: number[],
    maxDrawdown: number,
    config: BacktestConfig
  ): BacktestResult {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));

    return {
      trades,
      equityCurve,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      totalPnL,
      grossProfit,
      grossLoss,
      profitFactor: grossLoss === 0 ? grossProfit : grossProfit / grossLoss,
      maxDrawdown,
      sharpeRatio: this.calculateSharpeRatio(trades),
      initialCapital: config.initialCapital,
      finalCapital: config.initialCapital + totalPnL,
    };
  }

  private calculateSharpeRatio(trades: Trade[]): number {
    const returns = trades.map(t => t.pnl || 0);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);
  }

  // Public getters
  getBacktestResult(strategyId: string): BacktestResult | undefined {
    return this.backtestResults.get(strategyId);
  }

  getOptimizationResult(strategyId: string): OptimizationResult | undefined {
    return this.optimizationResults.get(strategyId);
  }

  clearResults() {
    this.backtestResults.clear();
    this.optimizationResults.clear();
  }
}
