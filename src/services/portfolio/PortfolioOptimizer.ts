import { makeAutoObservable } from 'mobx';
import { Strategy, BacktestResult } from '../../types/trading';
import { backtestingService } from '../backtesting/BacktestingService';
import { monteCarloSimulationService } from '../strategy/MonteCarloSimulationService';

export interface PortfolioConfig {
  strategies: Strategy[];
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  riskFreeRate: number;
  constraints: {
    minWeight: number;
    maxWeight: number;
    targetReturn?: number;
    maxDrawdown?: number;
    minSharpe?: number;
  };
  optimizationTarget: 'SHARPE' | 'RETURN' | 'RISK_PARITY' | 'MIN_VARIANCE';
}

export interface PortfolioAllocation {
  strategy: Strategy;
  weight: number;
  expectedReturn: number;
  risk: number;
  sharpeRatio: number;
  contribution: {
    return: number;
    risk: number;
    sharpe: number;
  };
}

export interface PortfolioResult {
  allocations: PortfolioAllocation[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    diversificationRatio: number;
    riskParity: number;
  };
  efficientFrontier: {
    return: number;
    risk: number;
    weights: number[];
  }[];
  riskDecomposition: {
    strategy: string;
    systematicRisk: number;
    specificRisk: number;
    totalRisk: number;
  }[];
  correlationMatrix: number[][];
  stressTest: {
    scenario: string;
    impact: number;
  }[];
}

class PortfolioOptimizer {
  private isOptimizing: boolean = false;
  private progress: number = 0;
  private optimizationHistory: PortfolioResult[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async optimizePortfolio(config: PortfolioConfig): Promise<PortfolioResult> {
    this.isOptimizing = true;
    this.progress = 0;

    try {
      // Run backtests for all strategies
      const backtestResults = await this.runBacktests(config);

      // Calculate returns and covariance matrix
      const returns = this.calculateReturns(backtestResults);
      const covariance = this.calculateCovarianceMatrix(returns);
      const correlations = this.calculateCorrelationMatrix(covariance);

      // Generate efficient frontier
      const efficientFrontier = await this.generateEfficientFrontier(
        returns,
        covariance,
        config
      );

      // Optimize portfolio based on target
      const weights = await this.optimizeWeights(
        returns,
        covariance,
        config
      );

      // Calculate portfolio metrics
      const metrics = this.calculatePortfolioMetrics(
        weights,
        returns,
        covariance,
        config
      );

      // Perform risk decomposition
      const riskDecomposition = this.decomposeRisk(
        weights,
        returns,
        covariance
      );

      // Run stress tests
      const stressTest = await this.runStressTests(
        weights,
        config.strategies,
        config
      );

      // Create portfolio allocations
      const allocations = this.createAllocations(
        weights,
        config.strategies,
        returns,
        covariance,
        config.riskFreeRate
      );

      const result: PortfolioResult = {
        allocations,
        metrics,
        efficientFrontier,
        riskDecomposition,
        correlationMatrix: correlations,
        stressTest,
      };

      this.optimizationHistory.push(result);
      return result;

    } finally {
      this.isOptimizing = false;
      this.progress = 100;
    }
  }

  private async runBacktests(config: PortfolioConfig): Promise<BacktestResult[]> {
    const results: BacktestResult[] = [];
    
    for (const strategy of config.strategies) {
      const result = await backtestingService.runBacktest({
        strategy,
        startDate: config.startDate,
        endDate: config.endDate,
        initialBalance: config.initialBalance,
      });
      results.push(result);
      this.progress += 20 / config.strategies.length;
    }

    return results;
  }

  private calculateReturns(results: BacktestResult[]): number[][] {
    return results.map(result =>
      result.equityCurve.map((point, i, arr) =>
        i === 0 ? 0 : (point.equity - arr[i - 1].equity) / arr[i - 1].equity
      )
    );
  }

  private calculateCovarianceMatrix(returns: number[][]): number[][] {
    const n = returns.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const cov = this.calculateCovariance(returns[i], returns[j]);
        matrix[i][j] = cov;
        matrix[j][i] = cov;
      }
    }

    return matrix;
  }

  private calculateCorrelationMatrix(covariance: number[][]): number[][] {
    const n = covariance.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[i][j] = covariance[i][j] / Math.sqrt(covariance[i][i] * covariance[j][j]);
      }
    }

    return matrix;
  }

  private async generateEfficientFrontier(
    returns: number[][],
    covariance: number[][],
    config: PortfolioConfig
  ): Promise<{ return: number; risk: number; weights: number[]; }[]> {
    const points: { return: number; risk: number; weights: number[]; }[] = [];
    const numPoints = 50;

    const minReturn = Math.min(...returns.map(r => this.calculateMean(r)));
    const maxReturn = Math.max(...returns.map(r => this.calculateMean(r)));
    const step = (maxReturn - minReturn) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const targetReturn = minReturn + step * i;
      const weights = await this.optimizeWeights(
        returns,
        covariance,
        {
          ...config,
          constraints: {
            ...config.constraints,
            targetReturn,
          },
          optimizationTarget: 'MIN_VARIANCE',
        }
      );

      const portfolioReturn = this.calculatePortfolioReturn(weights, returns);
      const portfolioRisk = this.calculatePortfolioRisk(weights, covariance);

      points.push({
        return: portfolioReturn,
        risk: portfolioRisk,
        weights,
      });
    }

    return points;
  }

  private async optimizeWeights(
    returns: number[][],
    covariance: number[][],
    config: PortfolioConfig
  ): Promise<number[]> {
    const n = returns.length;
    let weights: number[] = Array(n).fill(1 / n); // Start with equal weights

    switch (config.optimizationTarget) {
      case 'SHARPE':
        weights = await this.maximizeSharpeRatio(returns, covariance, config);
        break;
      case 'RETURN':
        weights = await this.maximizeReturn(returns, config);
        break;
      case 'RISK_PARITY':
        weights = await this.achieveRiskParity(covariance, config);
        break;
      case 'MIN_VARIANCE':
        weights = await this.minimizeVariance(covariance, config);
        break;
    }

    return this.normalizeWeights(weights, config.constraints);
  }

  private async maximizeSharpeRatio(
    returns: number[][],
    covariance: number[][],
    config: PortfolioConfig
  ): Promise<number[]> {
    // Implement gradient descent to maximize Sharpe ratio
    const n = returns.length;
    let weights = Array(n).fill(1 / n);
    const learningRate = 0.01;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const gradient = this.calculateSharpeRatioGradient(
        weights,
        returns,
        covariance,
        config.riskFreeRate
      );

      weights = weights.map((w, j) => w + learningRate * gradient[j]);
      weights = this.normalizeWeights(weights, config.constraints);
    }

    return weights;
  }

  private async maximizeReturn(
    returns: number[][],
    config: PortfolioConfig
  ): Promise<number[]> {
    const meanReturns = returns.map(r => this.calculateMean(r));
    const n = returns.length;
    const weights = Array(n).fill(0);

    // Allocate maximum weight to highest returning strategies
    const sortedIndices = meanReturns
      .map((r, i) => ({ return: r, index: i }))
      .sort((a, b) => b.return - a.return);

    let remainingWeight = 1;
    for (const { index } of sortedIndices) {
      const weight = Math.min(remainingWeight, config.constraints.maxWeight);
      weights[index] = weight;
      remainingWeight -= weight;
      if (remainingWeight <= 0) break;
    }

    return this.normalizeWeights(weights, config.constraints);
  }

  private async achieveRiskParity(
    covariance: number[][],
    config: PortfolioConfig
  ): Promise<number[]> {
    // Implement risk parity optimization using Newton's method
    const n = covariance.length;
    let weights = Array(n).fill(1 / n);
    const iterations = 1000;
    const tolerance = 1e-6;

    for (let i = 0; i < iterations; i++) {
      const riskContributions = this.calculateRiskContributions(weights, covariance);
      const targetRisk = 1 / n;
      const delta = riskContributions.map(rc => rc - targetRisk);

      if (Math.max(...delta.map(Math.abs)) < tolerance) break;

      const jacobian = this.calculateRiskParityJacobian(weights, covariance);
      weights = this.updateWeightsNewton(weights, delta, jacobian);
      weights = this.normalizeWeights(weights, config.constraints);
    }

    return weights;
  }

  private async minimizeVariance(
    covariance: number[][],
    config: PortfolioConfig
  ): Promise<number[]> {
    // Implement quadratic programming to minimize portfolio variance
    const n = covariance.length;
    let weights = Array(n).fill(1 / n);
    const iterations = 1000;
    const learningRate = 0.01;

    for (let i = 0; i < iterations; i++) {
      const gradient = this.calculateVarianceGradient(weights, covariance);
      weights = weights.map((w, j) => w - learningRate * gradient[j]);
      weights = this.normalizeWeights(weights, config.constraints);
    }

    return weights;
  }

  private calculatePortfolioMetrics(
    weights: number[],
    returns: number[][],
    covariance: number[][],
    config: PortfolioConfig
  ): {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    diversificationRatio: number;
    riskParity: number;
  } {
    const expectedReturn = this.calculatePortfolioReturn(weights, returns);
    const volatility = this.calculatePortfolioRisk(weights, covariance);
    const sharpeRatio = (expectedReturn - config.riskFreeRate) / volatility;

    const diversificationRatio = this.calculateDiversificationRatio(
      weights,
      covariance
    );

    const riskParity = this.calculateRiskParityScore(
      weights,
      covariance
    );

    const maxDrawdown = this.calculatePortfolioDrawdown(weights, returns);

    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      diversificationRatio,
      riskParity,
    };
  }

  private decomposeRisk(
    weights: number[],
    returns: number[][],
    covariance: number[][]
  ): {
    strategy: string;
    systematicRisk: number;
    specificRisk: number;
    totalRisk: number;
  }[] {
    const n = weights.length;
    const decomposition: {
      strategy: string;
      systematicRisk: number;
      specificRisk: number;
      totalRisk: number;
    }[] = [];

    const portfolioReturn = this.calculatePortfolioReturn(weights, returns);
    const portfolioRisk = this.calculatePortfolioRisk(weights, covariance);

    for (let i = 0; i < n; i++) {
      const beta = this.calculateBeta(returns[i], portfolioReturn);
      const systematicRisk = beta * portfolioRisk;
      const specificRisk = Math.sqrt(covariance[i][i] - Math.pow(systematicRisk, 2));
      const totalRisk = Math.sqrt(Math.pow(systematicRisk, 2) + Math.pow(specificRisk, 2));

      decomposition.push({
        strategy: `Strategy ${i + 1}`,
        systematicRisk,
        specificRisk,
        totalRisk,
      });
    }

    return decomposition;
  }

  private async runStressTests(
    weights: number[],
    strategies: Strategy[],
    config: PortfolioConfig
  ): Promise<{ scenario: string; impact: number; }[]> {
    const scenarios = [
      { name: 'Market Crash', returnShock: -0.2 },
      { name: 'High Volatility', volShock: 2 },
      { name: 'Correlation Breakdown', corrShock: 0.5 },
      { name: 'Liquidity Crisis', spreadShock: 3 },
    ];

    const results: { scenario: string; impact: number; }[] = [];

    for (const scenario of scenarios) {
      const monteCarloResult = await monteCarloSimulationService.runSimulation({
        strategies,
        weights,
        numSimulations: 1000,
        ...scenario,
        startDate: config.startDate,
        endDate: config.endDate,
        initialBalance: config.initialBalance,
      });

      results.push({
        scenario: scenario.name,
        impact: monteCarloResult.worstCase,
      });
    }

    return results;
  }

  private createAllocations(
    weights: number[],
    strategies: Strategy[],
    returns: number[][],
    covariance: number[][],
    riskFreeRate: number
  ): PortfolioAllocation[] {
    return strategies.map((strategy, i) => {
      const expectedReturn = this.calculateMean(returns[i]);
      const risk = Math.sqrt(covariance[i][i]);
      const sharpeRatio = (expectedReturn - riskFreeRate) / risk;

      return {
        strategy,
        weight: weights[i],
        expectedReturn,
        risk,
        sharpeRatio,
        contribution: {
          return: weights[i] * expectedReturn,
          risk: weights[i] * risk,
          sharpe: weights[i] * sharpeRatio,
        },
      };
    });
  }

  // Helper methods for mathematical calculations
  private calculateMean(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private calculateCovariance(x: number[], y: number[]): number {
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);
    return x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / (x.length - 1);
  }

  private calculatePortfolioReturn(weights: number[], returns: number[][]): number {
    return weights.reduce((sum, weight, i) => sum + weight * this.calculateMean(returns[i]), 0);
  }

  private calculatePortfolioRisk(weights: number[], covariance: number[][]): number {
    let risk = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        risk += weights[i] * weights[j] * covariance[i][j];
      }
    }
    return Math.sqrt(risk);
  }

  private normalizeWeights(weights: number[], constraints: { minWeight: number; maxWeight: number; }): number[] {
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => {
      const normalized = w / sum;
      return Math.min(Math.max(normalized, constraints.minWeight), constraints.maxWeight);
    });
  }

  getProgress(): number {
    return this.progress;
  }

  isOptimizing(): boolean {
    return this.isOptimizing;
  }

  getOptimizationHistory(): PortfolioResult[] {
    return this.optimizationHistory;
  }

  clearHistory(): void {
    this.optimizationHistory = [];
  }
}

export const portfolioOptimizer = new PortfolioOptimizer();
