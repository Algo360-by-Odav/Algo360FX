import { makeAutoObservable } from 'mobx';
import { Strategy, BacktestResult, StrategyParameters } from '../../types/trading';
import { backtestingService } from '../backtesting/BacktestingService';
import { strategyOptimizationService } from './StrategyOptimizationService';

export interface WalkForwardConfig {
  strategy: Strategy;
  startDate: Date;
  endDate: Date;
  inSampleSize: number; // days
  outSampleSize: number; // days
  overlap: number; // percentage
  initialBalance: number;
  optimizationTarget: 'TOTAL_RETURN' | 'SHARPE_RATIO' | 'PROFIT_FACTOR';
}

export interface WalkForwardResult {
  periods: WalkForwardPeriod[];
  summary: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    robustnessFactor: number; // Ratio of out-of-sample to in-sample performance
    optimizationEfficiency: number; // Percentage of successful out-of-sample periods
  };
  predictivePower: number; // Correlation between in-sample and out-of-sample results
  parameterStability: {
    [key: string]: {
      mean: number;
      standardDeviation: number;
      stabilityScore: number; // Lower is more stable
    };
  };
}

export interface WalkForwardPeriod {
  inSample: {
    startDate: Date;
    endDate: Date;
    parameters: StrategyParameters;
    result: BacktestResult;
  };
  outSample: {
    startDate: Date;
    endDate: Date;
    result: BacktestResult;
  };
  robustnessFactor: number;
}

class WalkForwardAnalysisService {
  private isRunning: boolean = false;
  private progress: number = 0;
  private currentResults: WalkForwardResult[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async runAnalysis(config: WalkForwardConfig): Promise<WalkForwardResult> {
    this.isRunning = true;
    this.progress = 0;

    try {
      const periods = this.generatePeriods(config);
      const walkForwardPeriods: WalkForwardPeriod[] = [];
      let completedPeriods = 0;

      for (const period of periods) {
        // Optimize parameters using in-sample data
        const optimizedParams = await this.optimizeParameters(
          config.strategy,
          period.inSample.startDate,
          period.inSample.endDate,
          config.initialBalance,
          config.optimizationTarget
        );

        // Run backtest with optimized parameters on in-sample period
        const inSampleResult = await backtestingService.runBacktest({
          strategy: config.strategy,
          parameters: optimizedParams,
          startDate: period.inSample.startDate,
          endDate: period.inSample.endDate,
          initialBalance: config.initialBalance,
        });

        // Run backtest with same parameters on out-of-sample period
        const outSampleResult = await backtestingService.runBacktest({
          strategy: config.strategy,
          parameters: optimizedParams,
          startDate: period.outSample.startDate,
          endDate: period.outSample.endDate,
          initialBalance: config.initialBalance,
        });

        const robustnessFactor = this.calculateRobustnessFactor(inSampleResult, outSampleResult);

        walkForwardPeriods.push({
          inSample: {
            startDate: period.inSample.startDate,
            endDate: period.inSample.endDate,
            parameters: optimizedParams,
            result: inSampleResult,
          },
          outSample: {
            startDate: period.outSample.startDate,
            endDate: period.outSample.endDate,
            result: outSampleResult,
          },
          robustnessFactor,
        });

        completedPeriods++;
        this.progress = (completedPeriods / periods.length) * 100;
      }

      const result = this.calculateSummaryStatistics(walkForwardPeriods);
      this.currentResults.push(result);
      return result;

    } finally {
      this.isRunning = false;
      this.progress = 100;
    }
  }

  private generatePeriods(config: WalkForwardConfig): {
    inSample: { startDate: Date; endDate: Date };
    outSample: { startDate: Date; endDate: Date };
  }[] {
    const periods: {
      inSample: { startDate: Date; endDate: Date };
      outSample: { startDate: Date; endDate: Date };
    }[] = [];

    const totalDays = Math.floor((config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const stepSize = Math.floor(config.outSampleSize * (1 - config.overlap / 100));

    for (let i = 0; i < totalDays - config.inSampleSize - config.outSampleSize; i += stepSize) {
      const inSampleStart = new Date(config.startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const inSampleEnd = new Date(inSampleStart.getTime() + config.inSampleSize * 24 * 60 * 60 * 1000);
      const outSampleStart = new Date(inSampleEnd.getTime());
      const outSampleEnd = new Date(outSampleStart.getTime() + config.outSampleSize * 24 * 60 * 60 * 1000);

      periods.push({
        inSample: { startDate: inSampleStart, endDate: inSampleEnd },
        outSample: { startDate: outSampleStart, endDate: outSampleEnd },
      });
    }

    return periods;
  }

  private async optimizeParameters(
    strategy: Strategy,
    startDate: Date,
    endDate: Date,
    initialBalance: number,
    optimizationTarget: string
  ): Promise<StrategyParameters> {
    return await strategyOptimizationService.optimizeStrategy({
      strategy,
      startDate,
      endDate,
      initialBalance,
      optimizationTarget,
    });
  }

  private calculateRobustnessFactor(
    inSampleResult: BacktestResult,
    outSampleResult: BacktestResult
  ): number {
    const inSampleReturn = inSampleResult.metrics.totalPnL;
    const outSampleReturn = outSampleResult.metrics.totalPnL;

    if (inSampleReturn <= 0) return 0;
    return outSampleReturn / inSampleReturn;
  }

  private calculateSummaryStatistics(periods: WalkForwardPeriod[]): WalkForwardResult {
    const outSampleResults = periods.map(p => p.outSample.result);
    const inSampleResults = periods.map(p => p.inSample.result);

    const parameterStability: { [key: string]: number[] } = {};
    periods.forEach(period => {
      Object.entries(period.inSample.parameters).forEach(([key, value]) => {
        if (!parameterStability[key]) parameterStability[key] = [];
        parameterStability[key].push(value);
      });
    });

    const parameterStats = Object.entries(parameterStability).reduce((acc, [key, values]) => {
      const mean = this.calculateMean(values);
      const standardDeviation = this.calculateStandardDeviation(values);
      acc[key] = {
        mean,
        standardDeviation,
        stabilityScore: standardDeviation / mean,
      };
      return acc;
    }, {} as { [key: string]: { mean: number; standardDeviation: number; stabilityScore: number } });

    const successfulPeriods = periods.filter(p => p.robustnessFactor >= 0.7).length;
    const optimizationEfficiency = successfulPeriods / periods.length;

    const predictivePower = this.calculateCorrelation(
      inSampleResults.map(r => r.metrics.totalPnL),
      outSampleResults.map(r => r.metrics.totalPnL)
    );

    return {
      periods,
      summary: {
        totalReturn: this.calculateCumulativeReturn(outSampleResults),
        sharpeRatio: this.calculateAverageSharpeRatio(outSampleResults),
        maxDrawdown: this.calculateWorstDrawdown(outSampleResults),
        winRate: this.calculateAverageWinRate(outSampleResults),
        profitFactor: this.calculateAverageProfitFactor(outSampleResults),
        robustnessFactor: this.calculateMean(periods.map(p => p.robustnessFactor)),
        optimizationEfficiency,
      },
      predictivePower,
      parameterStability: parameterStats,
    };
  }

  private calculateMean(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(this.calculateMean(squaredDiffs));
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);
    const stdX = this.calculateStandardDeviation(x);
    const stdY = this.calculateStandardDeviation(y);

    const covariance = x.reduce((sum, xi, i) => {
      return sum + (xi - meanX) * (y[i] - meanY);
    }, 0) / x.length;

    return covariance / (stdX * stdY);
  }

  private calculateCumulativeReturn(results: BacktestResult[]): number {
    return results.reduce((acc, result) => (1 + acc) * (1 + result.metrics.totalPnL / 100) - 1, 0) * 100;
  }

  private calculateAverageSharpeRatio(results: BacktestResult[]): number {
    return this.calculateMean(results.map(r => r.metrics.sharpeRatio));
  }

  private calculateWorstDrawdown(results: BacktestResult[]): number {
    return Math.min(...results.map(r => r.metrics.maxDrawdown));
  }

  private calculateAverageWinRate(results: BacktestResult[]): number {
    return this.calculateMean(results.map(r => r.metrics.winRate));
  }

  private calculateAverageProfitFactor(results: BacktestResult[]): number {
    return this.calculateMean(results.map(r => r.metrics.profitFactor));
  }

  getProgress(): number {
    return this.progress;
  }

  isAnalysisRunning(): boolean {
    return this.isRunning;
  }

  getCurrentResults(): WalkForwardResult[] {
    return this.currentResults;
  }

  clearResults(): void {
    this.currentResults = [];
  }
}

export const walkForwardAnalysisService = new WalkForwardAnalysisService();
