import { TradingStrategy, OptimizationResult, OptimizationConfig, OptimizationMetric } from '../../types/optimization';
import { BacktestResult } from '../../types/backtest';
import { BacktestService } from '../backtest/BacktestService';

export class StrategyOptimizer {
  private backtestService: BacktestService;

  constructor(backtestService: BacktestService) {
    this.backtestService = backtestService;
  }

  /**
   * Grid Search Optimization
   * Systematically works through multiple parameter combinations
   */
  async gridSearch(
    strategy: TradingStrategy,
    config: OptimizationConfig
  ): Promise<OptimizationResult> {
    const parameterCombinations = this.generateParameterCombinations(config.parameters);
    const results: BacktestResult[] = [];

    for (const params of parameterCombinations) {
      const optimizedStrategy = {
        ...strategy,
        conditions: this.updateStrategyParameters(strategy.conditions, params),
      };

      const backtestResult = await this.backtestService.runBacktest(
        optimizedStrategy,
        config.startDate,
        config.endDate
      );

      results.push(backtestResult);
    }

    return this.evaluateResults(results, config.optimizationMetric);
  }

  /**
   * Walk-Forward Optimization
   * Tests parameters on multiple time periods to ensure robustness
   */
  async walkForwardOptimization(
    strategy: TradingStrategy,
    config: OptimizationConfig
  ): Promise<OptimizationResult[]> {
    const periodResults: OptimizationResult[] = [];
    const periodLength = Math.floor(
      (config.endDate.getTime() - config.startDate.getTime()) / config.walkForwardPeriods
    );

    for (let i = 0; i < config.walkForwardPeriods; i++) {
      const periodStart = new Date(config.startDate.getTime() + periodLength * i);
      const periodEnd = new Date(periodStart.getTime() + periodLength);

      const periodConfig = {
        ...config,
        startDate: periodStart,
        endDate: periodEnd,
      };

      const result = await this.gridSearch(strategy, periodConfig);
      periodResults.push(result);
    }

    return this.consolidateWalkForwardResults(periodResults);
  }

  /**
   * Monte Carlo Optimization
   * Randomly samples parameter combinations to find optimal settings
   */
  async monteCarloOptimization(
    strategy: TradingStrategy,
    config: OptimizationConfig
  ): Promise<OptimizationResult> {
    const results: BacktestResult[] = [];
    const iterations = config.monteCarloIterations || 100;

    for (let i = 0; i < iterations; i++) {
      const randomParams = this.generateRandomParameters(config.parameters);
      const optimizedStrategy = {
        ...strategy,
        conditions: this.updateStrategyParameters(strategy.conditions, randomParams),
      };

      const backtestResult = await this.backtestService.runBacktest(
        optimizedStrategy,
        config.startDate,
        config.endDate
      );

      results.push(backtestResult);
    }

    return this.evaluateResults(results, config.optimizationMetric);
  }

  /**
   * Genetic Algorithm Optimization
   * Uses evolutionary algorithms to find optimal parameters
   */
  async geneticOptimization(
    strategy: TradingStrategy,
    config: OptimizationConfig
  ): Promise<OptimizationResult> {
    let population = this.initializePopulation(config);
    const generations = config.generations || 10;
    const populationSize = config.populationSize || 50;

    for (let generation = 0; generation < generations; generation++) {
      // Evaluate fitness for current population
      const fitnessResults = await Promise.all(
        population.map(async (params) => {
          const optimizedStrategy = {
            ...strategy,
            conditions: this.updateStrategyParameters(strategy.conditions, params),
          };

          const backtestResult = await this.backtestService.runBacktest(
            optimizedStrategy,
            config.startDate,
            config.endDate
          );

          return {
            params,
            fitness: this.calculateFitness(backtestResult, config.optimizationMetric),
          };
        })
      );

      // Sort by fitness
      fitnessResults.sort((a, b) => b.fitness - a.fitness);

      // Select best performers
      const eliteCount = Math.floor(populationSize * 0.1);
      const elite = fitnessResults.slice(0, eliteCount).map((result) => result.params);

      // Create new population through crossover and mutation
      const newPopulation = [...elite];

      while (newPopulation.length < populationSize) {
        const parent1 = this.selectParent(fitnessResults);
        const parent2 = this.selectParent(fitnessResults);
        const child = this.crossover(parent1, parent2);
        const mutatedChild = this.mutate(child, config.mutationRate || 0.1);
        newPopulation.push(mutatedChild);
      }

      population = newPopulation;
    }

    // Evaluate final population
    const finalResults = await Promise.all(
      population.map(async (params) => {
        const optimizedStrategy = {
          ...strategy,
          conditions: this.updateStrategyParameters(strategy.conditions, params),
        };

        return await this.backtestService.runBacktest(
          optimizedStrategy,
          config.startDate,
          config.endDate
        );
      })
    );

    return this.evaluateResults(finalResults, config.optimizationMetric);
  }

  private generateParameterCombinations(parameters: Record<string, number[]>): Record<string, number>[] {
    const keys = Object.keys(parameters);
    const combinations: Record<string, number>[] = [{}];

    for (const key of keys) {
      const values = parameters[key];
      const newCombinations: Record<string, number>[] = [];

      for (const combination of combinations) {
        for (const value of values) {
          newCombinations.push({ ...combination, [key]: value });
        }
      }

      combinations.length = 0;
      combinations.push(...newCombinations);
    }

    return combinations;
  }

  private generateRandomParameters(parameters: Record<string, number[]>): Record<string, number> {
    const randomParams: Record<string, number> = {};

    for (const [key, values] of Object.entries(parameters)) {
      const randomIndex = Math.floor(Math.random() * values.length);
      randomParams[key] = values[randomIndex];
    }

    return randomParams;
  }

  private updateStrategyParameters(
    conditions: any,
    parameters: Record<string, number>
  ): any {
    // Deep clone conditions
    const updatedConditions = JSON.parse(JSON.stringify(conditions));

    // Update parameters in conditions
    for (const [key, value] of Object.entries(parameters)) {
      // Find and update the parameter in the conditions tree
      this.updateParameterInConditions(updatedConditions, key, value);
    }

    return updatedConditions;
  }

  private updateParameterInConditions(conditions: any, key: string, value: number): void {
    if (typeof conditions !== 'object') return;

    for (const prop in conditions) {
      if (prop === key) {
        conditions[prop] = value;
      } else if (typeof conditions[prop] === 'object') {
        this.updateParameterInConditions(conditions[prop], key, value);
      }
    }
  }

  private calculateFitness(result: BacktestResult, metric: OptimizationMetric): number {
    switch (metric) {
      case OptimizationMetric.SHARPE_RATIO:
        return result.metrics.sharpeRatio;
      case OptimizationMetric.NET_PROFIT:
        return result.metrics.netProfit;
      case OptimizationMetric.WIN_RATE:
        return result.metrics.winRate;
      case OptimizationMetric.PROFIT_FACTOR:
        return result.metrics.profitFactor;
      case OptimizationMetric.MAX_DRAWDOWN:
        return -result.metrics.maxDrawdown; // Negative because we want to minimize drawdown
      case OptimizationMetric.CUSTOM:
        // Custom fitness function can be implemented here
        return this.calculateCustomFitness(result);
      default:
        return result.metrics.netProfit;
    }
  }

  private calculateCustomFitness(result: BacktestResult): number {
    // Example custom fitness function
    const { sharpeRatio, winRate, profitFactor, maxDrawdown } = result.metrics;
    return (
      sharpeRatio * 0.3 +
      winRate * 0.3 +
      profitFactor * 0.2 -
      maxDrawdown * 0.2
    );
  }

  private selectParent(population: { params: any; fitness: number }[]): any {
    // Tournament selection
    const tournamentSize = 3;
    let best = population[Math.floor(Math.random() * population.length)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const contestant = population[Math.floor(Math.random() * population.length)];
      if (contestant.fitness > best.fitness) {
        best = contestant;
      }
    }

    return best.params;
  }

  private crossover(parent1: any, parent2: any): any {
    const child: any = {};
    
    for (const key in parent1) {
      // 50% chance to inherit from each parent
      child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
    }

    return child;
  }

  private mutate(params: any, mutationRate: number): any {
    const mutated = { ...params };

    for (const key in mutated) {
      if (Math.random() < mutationRate) {
        // Adjust the parameter by a random amount within a range
        const adjustment = (Math.random() - 0.5) * 0.2; // ±10% change
        mutated[key] *= (1 + adjustment);
      }
    }

    return mutated;
  }

  private initializePopulation(config: OptimizationConfig): Record<string, number>[] {
    const population: Record<string, number>[] = [];
    const size = config.populationSize || 50;

    for (let i = 0; i < size; i++) {
      population.push(this.generateRandomParameters(config.parameters));
    }

    return population;
  }

  private consolidateWalkForwardResults(
    results: OptimizationResult[]
  ): OptimizationResult[] {
    // Sort results by performance
    return results.sort((a, b) => {
      const aPerformance = this.calculateOverallPerformance(a);
      const bPerformance = this.calculateOverallPerformance(b);
      return bPerformance - aPerformance;
    });
  }

  private calculateOverallPerformance(result: OptimizationResult): number {
    // Example: Combine multiple metrics for overall performance score
    const {
      netProfit,
      sharpeRatio,
      maxDrawdown,
      winRate,
      profitFactor,
    } = result.performance;

    return (
      netProfit * 0.3 +
      sharpeRatio * 0.2 +
      (1 - maxDrawdown) * 0.2 +
      winRate * 0.15 +
      profitFactor * 0.15
    );
  }

  private evaluateResults(
    results: BacktestResult[],
    metric: OptimizationMetric
  ): OptimizationResult {
    // Sort results by the specified metric
    results.sort((a, b) => this.calculateFitness(b, metric) - this.calculateFitness(a, metric));

    const bestResult = results[0];
    
    return {
      parameters: bestResult.parameters,
      performance: {
        netProfit: bestResult.metrics.netProfit,
        sharpeRatio: bestResult.metrics.sharpeRatio,
        maxDrawdown: bestResult.metrics.maxDrawdown,
        winRate: bestResult.metrics.winRate,
        profitFactor: bestResult.metrics.profitFactor,
      },
      allResults: results.map((result) => ({
        parameters: result.parameters,
        performance: {
          netProfit: result.metrics.netProfit,
          sharpeRatio: result.metrics.sharpeRatio,
          maxDrawdown: result.metrics.maxDrawdown,
          winRate: result.metrics.winRate,
          profitFactor: result.metrics.profitFactor,
        },
      })),
    };
  }
}
