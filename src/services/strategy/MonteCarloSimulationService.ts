import { makeAutoObservable } from 'mobx';
import { Trade, Strategy, BacktestResult } from '../../types/trading';
import { backtestingService } from '../backtesting/BacktestingService';

export interface MonteCarloConfig {
  strategy: Strategy;
  initialCapital: number;
  numSimulations: number;
  timeHorizon: number; // in days
  confidenceInterval: number; // e.g., 0.95 for 95% confidence
  riskFreeRate: number;
  tradingDaysPerYear: number;
}

export interface MonteCarloResult {
  expectedReturn: number;
  worstCase: number;
  bestCase: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  maxDrawdown: {
    mean: number;
    worst: number;
    best: number;
  };
  sharpeRatio: number;
  equityCurves: number[][];
  probabilityOfProfit: number;
  riskMetrics: {
    var95: number;
    cvar95: number;
    standardDeviation: number;
    skewness: number;
    kurtosis: number;
  };
}

class MonteCarloSimulationService {
  private simulations: MonteCarloResult[] = [];
  private isRunning: boolean = false;
  private progress: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async runSimulation(config: MonteCarloConfig): Promise<MonteCarloResult> {
    this.isRunning = true;
    this.progress = 0;

    try {
      const equityCurves: number[][] = [];
      const drawdowns: number[] = [];
      const finalReturns: number[] = [];
      const dailyReturns: number[] = [];

      // Run multiple simulations
      for (let i = 0; i < config.numSimulations; i++) {
        const simulationResult = await this.runSingleSimulation(config);
        equityCurves.push(simulationResult.equityCurve);
        drawdowns.push(simulationResult.maxDrawdown);
        finalReturns.push(simulationResult.finalReturn);
        dailyReturns.push(...simulationResult.dailyReturns);

        this.progress = ((i + 1) / config.numSimulations) * 100;
      }

      // Calculate statistics
      const sortedReturns = finalReturns.sort((a, b) => a - b);
      const confidenceIndex = Math.floor(config.numSimulations * (1 - config.confidenceInterval));
      
      const result: MonteCarloResult = {
        expectedReturn: this.calculateMean(finalReturns),
        worstCase: sortedReturns[0],
        bestCase: sortedReturns[sortedReturns.length - 1],
        confidenceInterval: {
          lower: sortedReturns[confidenceIndex],
          upper: sortedReturns[sortedReturns.length - 1 - confidenceIndex]
        },
        maxDrawdown: {
          mean: this.calculateMean(drawdowns),
          worst: Math.max(...drawdowns),
          best: Math.min(...drawdowns)
        },
        sharpeRatio: this.calculateSharpeRatio(dailyReturns, config.riskFreeRate, config.tradingDaysPerYear),
        equityCurves,
        probabilityOfProfit: finalReturns.filter(r => r > 0).length / config.numSimulations,
        riskMetrics: {
          var95: this.calculateVaR(dailyReturns, 0.95),
          cvar95: this.calculateCVaR(dailyReturns, 0.95),
          standardDeviation: this.calculateStandardDeviation(dailyReturns),
          skewness: this.calculateSkewness(dailyReturns),
          kurtosis: this.calculateKurtosis(dailyReturns)
        }
      };

      this.simulations.push(result);
      return result;

    } finally {
      this.isRunning = false;
      this.progress = 100;
    }
  }

  private async runSingleSimulation(config: MonteCarloConfig): Promise<{
    equityCurve: number[];
    maxDrawdown: number;
    finalReturn: number;
    dailyReturns: number[];
  }> {
    // Run backtest with randomized market conditions
    const backtestResult = await backtestingService.runBacktest({
      strategy: config.strategy,
      initialBalance: config.initialCapital,
      startDate: new Date(),
      endDate: new Date(Date.now() + config.timeHorizon * 24 * 60 * 60 * 1000),
      symbol: config.strategy.symbol,
      timeframe: config.strategy.timeframe
    });

    const equityCurve = this.generateEquityCurve(backtestResult.trades, config.initialCapital);
    const dailyReturns = this.calculateDailyReturns(equityCurve);
    const maxDrawdown = this.calculateMaxDrawdown(equityCurve);
    const finalReturn = (equityCurve[equityCurve.length - 1] - config.initialCapital) / config.initialCapital;

    return {
      equityCurve,
      maxDrawdown,
      finalReturn,
      dailyReturns
    };
  }

  private generateEquityCurve(trades: Trade[], initialCapital: number): number[] {
    const equity = [initialCapital];
    let currentEquity = initialCapital;

    trades.forEach(trade => {
      currentEquity += trade.profit;
      equity.push(currentEquity);
    });

    return equity;
  }

  private calculateDailyReturns(equityCurve: number[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < equityCurve.length; i++) {
      returns.push((equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1]);
    }
    return returns;
  }

  private calculateMaxDrawdown(equityCurve: number[]): number {
    let maxDrawdown = 0;
    let peak = equityCurve[0];

    equityCurve.forEach(equity => {
      if (equity > peak) {
        peak = equity;
      }
      const drawdown = (peak - equity) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return maxDrawdown;
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(this.calculateMean(squaredDiffs));
  }

  private calculateSharpeRatio(
    dailyReturns: number[],
    riskFreeRate: number,
    tradingDaysPerYear: number
  ): number {
    const annualizedReturn = this.calculateMean(dailyReturns) * tradingDaysPerYear;
    const annualizedStdDev = this.calculateStandardDeviation(dailyReturns) * Math.sqrt(tradingDaysPerYear);
    return (annualizedReturn - riskFreeRate) / annualizedStdDev;
  }

  private calculateVaR(returns: number[], confidenceLevel: number): number {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor(returns.length * (1 - confidenceLevel));
    return -sortedReturns[index];
  }

  private calculateCVaR(returns: number[], confidenceLevel: number): number {
    const sortedReturns = returns.sort((a, b) => a - b);
    const varIndex = Math.floor(returns.length * (1 - confidenceLevel));
    const tailReturns = sortedReturns.slice(0, varIndex);
    return -this.calculateMean(tailReturns);
  }

  private calculateSkewness(values: number[]): number {
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStandardDeviation(values);
    const cubedDiffs = values.map(value => Math.pow((value - mean) / stdDev, 3));
    return this.calculateMean(cubedDiffs);
  }

  private calculateKurtosis(values: number[]): number {
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStandardDeviation(values);
    const fourthPowerDiffs = values.map(value => Math.pow((value - mean) / stdDev, 4));
    return this.calculateMean(fourthPowerDiffs) - 3; // Excess kurtosis
  }

  getProgress(): number {
    return this.progress;
  }

  isSimulationRunning(): boolean {
    return this.isRunning;
  }

  getSimulations(): MonteCarloResult[] {
    return this.simulations;
  }

  clearSimulations(): void {
    this.simulations = [];
  }
}

export const monteCarloSimulationService = new MonteCarloSimulationService();
