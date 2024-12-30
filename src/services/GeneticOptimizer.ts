import { BacktestService } from './BacktestService';
import { PerformanceMetricsService, PerformanceMetrics } from './PerformanceMetricsService';
import { Strategy, StrategyParameters, Trade } from '@/types/trading';

interface Individual {
  chromosome: StrategyParameters;
  fitness: number;
}

interface OptimizationResult {
  bestConfig: StrategyParameters;
  bestFitness: number;
  generationHistory: {
    generation: number;
    bestFitness: number;
    averageFitness: number;
  }[];
}

export class GeneticOptimizer {
  private readonly POPULATION_SIZE = 50;
  private readonly GENERATIONS = 30;
  private readonly MUTATION_RATE = 0.1;
  private readonly ELITE_SIZE = 5;

  constructor(
    private backtestService: BacktestService,
    private performanceMetricsService: PerformanceMetricsService
  ) {}

  async optimizeStrategy(
    baseStrategy: Strategy,
    parameterRanges: Record<string, { min: number; max: number; step: number }>,
    fitnessFunction: (metrics: PerformanceMetrics) => number
  ): Promise<OptimizationResult> {
    let population = this.initializePopulation(baseStrategy.parameters, parameterRanges);
    const generationHistory: OptimizationResult['generationHistory'] = [];

    for (let generation = 0; generation < this.GENERATIONS; generation++) {
      // Evaluate fitness for each individual
      await Promise.all(
        population.map(async individual => {
          const strategyConfig = {
            ...baseStrategy,
            parameters: individual.chromosome
          };
          const result = await this.backtestService.runBacktest({
            strategy: strategyConfig,
            parameters: individual.chromosome,
            symbol: baseStrategy.symbol,
            timeframe: baseStrategy.timeframe,
            startDate: new Date(),
            endDate: new Date(),
            initialBalance: 10000,
            commission: 0,
            slippage: 0
          });
          const metrics = this.performanceMetricsService.calculateMetrics(result.trades, result.equityCurve.map(e => e.value));
          individual.fitness = fitnessFunction(metrics);
        })
      );

      // Sort population by fitness
      population.sort((a, b) => b.fitness - a.fitness);

      // Record generation statistics
      const averageFitness =
        population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;
      generationHistory.push({
        generation,
        bestFitness: population[0].fitness,
        averageFitness,
      });

      // Create next generation
      const nextGeneration: Individual[] = [];

      // Keep elite individuals
      nextGeneration.push(...population.slice(0, this.ELITE_SIZE));

      // Create rest of population through crossover and mutation
      while (nextGeneration.length < this.POPULATION_SIZE) {
        const parent1 = this.selectParent(population);
        const parent2 = this.selectParent(population);
        const child = this.crossover(parent1, parent2);
        this.mutate(child, parameterRanges);
        nextGeneration.push(child);
      }

      population = nextGeneration;
    }

    return {
      bestConfig: population[0].chromosome,
      bestFitness: population[0].fitness,
      generationHistory,
    };
  }

  private initializePopulation(
    baseParameters: StrategyParameters,
    parameterRanges: Record<string, { min: number; max: number; step: number }>
  ): Individual[] {
    const population: Individual[] = [];

    for (let i = 0; i < this.POPULATION_SIZE; i++) {
      const chromosome = { ...baseParameters };
      
      // Randomly initialize parameters within their ranges
      for (const [param, range] of Object.entries(parameterRanges)) {
        const steps = Math.floor((range.max - range.min) / range.step);
        const randomSteps = Math.floor(Math.random() * steps);
        chromosome[param] = range.min + randomSteps * range.step;
      }

      population.push({ chromosome, fitness: 0 });
    }

    return population;
  }

  private selectParent(population: Individual[]): Individual {
    // Tournament selection
    const tournamentSize = 5;
    const tournament = Array(tournamentSize)
      .fill(0)
      .map(() => population[Math.floor(Math.random() * population.length)]);
    return tournament.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  private crossover(parent1: Individual, parent2: Individual): Individual {
    const child: Individual = {
      chromosome: { ...parent1.chromosome },
      fitness: 0,
    };

    // Uniform crossover
    for (const param in parent1.chromosome) {
      if (Math.random() < 0.5) {
        child.chromosome[param] = parent2.chromosome[param];
      }
    }

    return child;
  }

  private mutate(
    individual: Individual,
    parameterRanges: Record<string, { min: number; max: number; step: number }>
  ): void {
    for (const [param, range] of Object.entries(parameterRanges)) {
      if (Math.random() < this.MUTATION_RATE) {
        const steps = Math.floor((range.max - range.min) / range.step);
        const randomSteps = Math.floor(Math.random() * steps);
        individual.chromosome[param] = range.min + randomSteps * range.step;
      }
    }
  }
}
