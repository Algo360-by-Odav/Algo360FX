import { makeAutoObservable } from 'mobx';
import { Strategy, StrategyParameters } from '../../types/trading';
import { BacktestConfig, BacktestResult, backtestingService } from '../backtesting/BacktestingService';

export interface OptimizationConfig {
  strategy: Strategy;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  commission: number;
  slippage: number;
  useSpread: boolean;
  parameterRanges: ParameterRange[];
  optimizationTarget: OptimizationTarget;
  populationSize?: number;
  generations?: number;
  crossoverRate?: number;
  mutationRate?: number;
}

export interface ParameterRange {
  name: string;
  min: number;
  max: number;
  step: number;
}

export interface OptimizationResult {
  parameters: StrategyParameters;
  fitness: number;
  testResult: BacktestResult;
  generation: number;
}

export enum OptimizationTarget {
  TOTAL_RETURN = 'TOTAL_RETURN',
  SHARPE_RATIO = 'SHARPE_RATIO',
  PROFIT_FACTOR = 'PROFIT_FACTOR',
  RISK_ADJUSTED_RETURN = 'RISK_ADJUSTED_RETURN'
}

class StrategyOptimizationService {
  private isRunning: boolean = false;
  private progress: number = 0;
  private currentResults: OptimizationResult[] = [];
  private bestResult: OptimizationResult | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async optimizeStrategy(config: OptimizationConfig): Promise<OptimizationResult[]> {
    this.isRunning = true;
    this.progress = 0;
    this.currentResults = [];
    this.bestResult = null;

    try {
      // Use genetic algorithm for optimization
      const population = await this.initializePopulation(config);
      const generations = config.generations || 10;
      const populationSize = config.populationSize || 50;
      const crossoverRate = config.crossoverRate || 0.8;
      const mutationRate = config.mutationRate || 0.1;

      let currentPopulation = population;

      for (let generation = 0; generation < generations; generation++) {
        // Evaluate fitness for current population
        const evaluatedPopulation = await this.evaluatePopulation(currentPopulation, config);
        
        // Update progress
        this.progress = (generation + 1) / generations * 100;
        
        // Store best result
        const bestInGeneration = this.findBestResult(evaluatedPopulation);
        if (!this.bestResult || bestInGeneration.fitness > this.bestResult.fitness) {
          this.bestResult = bestInGeneration;
        }

        // Create next generation
        const nextGeneration = await this.createNextGeneration(
          evaluatedPopulation,
          config,
          crossoverRate,
          mutationRate
        );

        currentPopulation = nextGeneration;
        
        // Store results for this generation
        this.currentResults = this.currentResults.concat(
          evaluatedPopulation.map(result => ({ ...result, generation }))
        );
      }

      return this.currentResults;

    } finally {
      this.isRunning = false;
      this.progress = 100;
    }
  }

  private async initializePopulation(config: OptimizationConfig): Promise<StrategyParameters[]> {
    const populationSize = config.populationSize || 50;
    const population: StrategyParameters[] = [];

    for (let i = 0; i < populationSize; i++) {
      const parameters: StrategyParameters = {};
      
      // Generate random values within the specified ranges
      for (const range of config.parameterRanges) {
        const steps = Math.floor((range.max - range.min) / range.step);
        const randomSteps = Math.floor(Math.random() * steps);
        parameters[range.name] = range.min + (randomSteps * range.step);
      }

      population.push(parameters);
    }

    return population;
  }

  private async evaluatePopulation(
    population: StrategyParameters[],
    config: OptimizationConfig
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];

    for (const parameters of population) {
      const backtestConfig: BacktestConfig = {
        strategy: config.strategy,
        parameters,
        symbol: config.symbol,
        timeframe: config.timeframe,
        startDate: config.startDate,
        endDate: config.endDate,
        initialBalance: config.initialBalance,
        commission: config.commission,
        slippage: config.slippage,
        useSpread: config.useSpread
      };

      const testResult = await backtestingService.runBacktest(backtestConfig);
      const fitness = this.calculateFitness(testResult, config.optimizationTarget);

      results.push({
        parameters,
        fitness,
        testResult,
        generation: 0
      });
    }

    return results;
  }

  private calculateFitness(result: BacktestResult, target: OptimizationTarget): number {
    switch (target) {
      case OptimizationTarget.TOTAL_RETURN:
        return result.metrics.totalPnL;
      
      case OptimizationTarget.SHARPE_RATIO:
        return result.metrics.sharpeRatio;
      
      case OptimizationTarget.PROFIT_FACTOR:
        return result.metrics.profitFactor;
      
      case OptimizationTarget.RISK_ADJUSTED_RETURN:
        return (result.metrics.totalPnL * result.metrics.winRate) / Math.abs(result.metrics.maxDrawdown);
      
      default:
        return result.metrics.totalPnL;
    }
  }

  private async createNextGeneration(
    population: OptimizationResult[],
    config: OptimizationConfig,
    crossoverRate: number,
    mutationRate: number
  ): Promise<StrategyParameters[]> {
    const nextGeneration: StrategyParameters[] = [];
    const populationSize = config.populationSize || 50;

    // Sort population by fitness
    population.sort((a, b) => b.fitness - a.fitness);

    // Elitism: Keep the best individuals
    const eliteCount = Math.floor(populationSize * 0.1);
    for (let i = 0; i < eliteCount; i++) {
      nextGeneration.push({ ...population[i].parameters });
    }

    // Fill the rest with crossover and mutation
    while (nextGeneration.length < populationSize) {
      const parent1 = this.selectParent(population);
      const parent2 = this.selectParent(population);

      let child: StrategyParameters;

      if (Math.random() < crossoverRate) {
        child = this.crossover(parent1.parameters, parent2.parameters);
      } else {
        child = { ...parent1.parameters };
      }

      if (Math.random() < mutationRate) {
        child = this.mutate(child, config.parameterRanges);
      }

      nextGeneration.push(child);
    }

    return nextGeneration;
  }

  private selectParent(population: OptimizationResult[]): OptimizationResult {
    // Tournament selection
    const tournamentSize = 3;
    let best: OptimizationResult = population[Math.floor(Math.random() * population.length)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const contestant = population[Math.floor(Math.random() * population.length)];
      if (contestant.fitness > best.fitness) {
        best = contestant;
      }
    }

    return best;
  }

  private crossover(parent1: StrategyParameters, parent2: StrategyParameters): StrategyParameters {
    const child: StrategyParameters = {};
    
    // Uniform crossover
    for (const key in parent1) {
      child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
    }

    return child;
  }

  private mutate(parameters: StrategyParameters, ranges: ParameterRange[]): StrategyParameters {
    const mutated = { ...parameters };
    
    // Randomly select a parameter to mutate
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    const steps = Math.floor((range.max - range.min) / range.step);
    const randomSteps = Math.floor(Math.random() * steps);
    mutated[range.name] = range.min + (randomSteps * range.step);

    return mutated;
  }

  private findBestResult(population: OptimizationResult[]): OptimizationResult {
    return population.reduce((best, current) => {
      return current.fitness > best.fitness ? current : best;
    });
  }

  getBestResult(): OptimizationResult | null {
    return this.bestResult;
  }

  getCurrentResults(): OptimizationResult[] {
    return this.currentResults;
  }

  getProgress(): number {
    return this.progress;
  }

  isOptimizationRunning(): boolean {
    return this.isRunning;
  }
}

export const strategyOptimizationService = new StrategyOptimizationService();
