import { makeAutoObservable } from 'mobx';
import { Strategy, StrategyParameters, BacktestResult } from '../../types/trading';
import { backtestingService } from '../backtesting/BacktestingService';

interface FeatureVector {
  marketFeatures: number[];
  technicalFeatures: number[];
  sentimentFeatures: number[];
}

interface TrainingData {
  features: FeatureVector;
  parameters: StrategyParameters;
  performance: number;
}

interface MLOptimizationConfig {
  strategy: Strategy;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  optimizationTarget: 'RETURN' | 'SHARPE' | 'SORTINO' | 'CALMAR';
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  validationSplit: number;
}

interface MLOptimizationResult {
  optimizedParameters: StrategyParameters;
  predictedPerformance: number;
  actualPerformance: BacktestResult;
  featureImportance: { [key: string]: number };
  convergenceHistory: number[];
  validationMetrics: {
    mse: number;
    mae: number;
    r2: number;
  };
}

class MLStrategyOptimizer {
  private trainingData: TrainingData[] = [];
  private model: any = null; // TensorFlow model
  private isTraining: boolean = false;
  private progress: number = 0;
  private optimizationHistory: MLOptimizationResult[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async optimizeStrategy(config: MLOptimizationConfig): Promise<MLOptimizationResult> {
    this.isTraining = true;
    this.progress = 0;

    try {
      // Generate training data
      await this.generateTrainingData(config);

      // Train the model
      await this.trainModel();

      // Generate and evaluate candidate solutions
      const candidates = await this.generateCandidates(config);

      // Select best solution
      const bestCandidate = await this.selectBestCandidate(candidates, config);

      // Validate on out-of-sample data
      const validationResult = await this.validateSolution(bestCandidate, config);

      const result: MLOptimizationResult = {
        optimizedParameters: bestCandidate.parameters,
        predictedPerformance: bestCandidate.performance,
        actualPerformance: validationResult.backtest,
        featureImportance: this.calculateFeatureImportance(),
        convergenceHistory: this.getConvergenceHistory(),
        validationMetrics: validationResult.metrics,
      };

      this.optimizationHistory.push(result);
      return result;

    } finally {
      this.isTraining = false;
      this.progress = 100;
    }
  }

  private async generateTrainingData(config: MLOptimizationConfig): Promise<void> {
    const { strategy, startDate, endDate } = config;
    
    // Generate diverse set of market conditions and parameters
    const marketConditions = await this.generateMarketConditions(startDate, endDate);
    const parameterSets = this.generateParameterSets(strategy, config.populationSize);

    this.trainingData = [];

    for (const condition of marketConditions) {
      for (const parameters of parameterSets) {
        // Run backtest with these parameters
        const backtestResult = await backtestingService.runBacktest({
          strategy,
          parameters,
          startDate: condition.startDate,
          endDate: condition.endDate,
          initialBalance: config.initialBalance,
        });

        // Extract features
        const features = this.extractFeatures(condition, backtestResult);

        // Calculate performance metric
        const performance = this.calculatePerformanceMetric(backtestResult, config.optimizationTarget);

        this.trainingData.push({
          features,
          parameters,
          performance,
        });
      }
    }
  }

  private async trainModel(): Promise<void> {
    // Initialize TensorFlow model
    this.model = await this.createModel();

    // Prepare training data
    const { X_train, y_train, X_val, y_val } = this.prepareTrainingData();

    // Train the model
    await this.model.fit(X_train, y_train, {
      epochs: 100,
      validationData: [X_val, y_val],
      callbacks: {
        onEpochEnd: (epoch: number, logs: any) => {
          this.progress = (epoch + 1) / 100 * 50; // First 50% of progress
        },
      },
    });
  }

  private async generateCandidates(config: MLOptimizationConfig): Promise<{
    parameters: StrategyParameters;
    performance: number;
  }[]> {
    const candidates: {
      parameters: StrategyParameters;
      performance: number;
    }[] = [];

    // Generate initial population
    for (let i = 0; i < config.populationSize; i++) {
      const parameters = this.generateRandomParameters(config.strategy);
      const features = await this.predictFeatures(parameters);
      const predictedPerformance = await this.predictPerformance(features);

      candidates.push({
        parameters,
        performance: predictedPerformance,
      });
    }

    // Evolve population
    for (let generation = 0; generation < config.generations; generation++) {
      const newCandidates = await this.evolvePopulation(
        candidates,
        config.crossoverRate,
        config.mutationRate
      );

      candidates.push(...newCandidates);
      candidates.sort((a, b) => b.performance - a.performance);
      candidates.splice(config.populationSize);

      this.progress = 50 + (generation + 1) / config.generations * 50;
    }

    return candidates;
  }

  private async selectBestCandidate(
    candidates: { parameters: StrategyParameters; performance: number }[],
    config: MLOptimizationConfig
  ): Promise<{ parameters: StrategyParameters; performance: number }> {
    // Sort by predicted performance
    candidates.sort((a, b) => b.performance - a.performance);

    // Validate top candidates
    const validationResults = await Promise.all(
      candidates.slice(0, 5).map(async candidate => {
        const validation = await this.validateSolution(candidate, config);
        return {
          ...candidate,
          validationPerformance: this.calculatePerformanceMetric(
            validation.backtest,
            config.optimizationTarget
          ),
        };
      })
    );

    // Select best performing on validation
    return validationResults.reduce((best, current) => 
      current.validationPerformance > best.validationPerformance ? current : best
    );
  }

  private async validateSolution(
    candidate: { parameters: StrategyParameters; performance: number },
    config: MLOptimizationConfig
  ): Promise<{
    backtest: BacktestResult;
    metrics: { mse: number; mae: number; r2: number };
  }> {
    // Run backtest on validation period
    const validationStart = new Date(config.endDate);
    validationStart.setMonth(validationStart.getMonth() - 1);

    const backtest = await backtestingService.runBacktest({
      strategy: config.strategy,
      parameters: candidate.parameters,
      startDate: validationStart,
      endDate: config.endDate,
      initialBalance: config.initialBalance,
    });

    // Calculate validation metrics
    const actualPerformance = this.calculatePerformanceMetric(backtest, config.optimizationTarget);
    const metrics = {
      mse: Math.pow(candidate.performance - actualPerformance, 2),
      mae: Math.abs(candidate.performance - actualPerformance),
      r2: this.calculateR2(candidate.performance, actualPerformance),
    };

    return { backtest, metrics };
  }

  private calculateFeatureImportance(): { [key: string]: number } {
    // Calculate feature importance using model weights
    const weights = this.model.getWeights();
    const importance: { [key: string]: number } = {};

    // Normalize weights to get relative importance
    const totalWeight = weights.reduce((sum, w) => sum + Math.abs(w), 0);
    
    weights.forEach((weight, index) => {
      importance[`feature_${index}`] = Math.abs(weight) / totalWeight;
    });

    return importance;
  }

  private getConvergenceHistory(): number[] {
    return this.model.history.history.loss;
  }

  private async evolvePopulation(
    candidates: { parameters: StrategyParameters; performance: number }[],
    crossoverRate: number,
    mutationRate: number
  ): Promise<{ parameters: StrategyParameters; performance: number }[]> {
    const newCandidates: { parameters: StrategyParameters; performance: number }[] = [];

    while (newCandidates.length < candidates.length) {
      // Select parents using tournament selection
      const parent1 = this.tournamentSelect(candidates);
      const parent2 = this.tournamentSelect(candidates);

      // Crossover
      let child = Math.random() < crossoverRate
        ? this.crossover(parent1.parameters, parent2.parameters)
        : { ...parent1.parameters };

      // Mutation
      if (Math.random() < mutationRate) {
        child = this.mutate(child);
      }

      // Evaluate new candidate
      const features = await this.predictFeatures(child);
      const performance = await this.predictPerformance(features);

      newCandidates.push({ parameters: child, performance });
    }

    return newCandidates;
  }

  private tournamentSelect(candidates: { parameters: StrategyParameters; performance: number }[]): {
    parameters: StrategyParameters;
    performance: number;
  } {
    const tournamentSize = 3;
    let best = candidates[Math.floor(Math.random() * candidates.length)];

    for (let i = 1; i < tournamentSize; i++) {
      const candidate = candidates[Math.floor(Math.random() * candidates.length)];
      if (candidate.performance > best.performance) {
        best = candidate;
      }
    }

    return best;
  }

  private crossover(parent1: StrategyParameters, parent2: StrategyParameters): StrategyParameters {
    const child: StrategyParameters = {};

    for (const key in parent1) {
      child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key];
    }

    return child;
  }

  private mutate(parameters: StrategyParameters): StrategyParameters {
    const mutated = { ...parameters };
    const key = Object.keys(parameters)[Math.floor(Math.random() * Object.keys(parameters).length)];
    mutated[key] *= 0.8 + Math.random() * 0.4; // Mutate by ±20%
    return mutated;
  }

  private calculateR2(predicted: number, actual: number): number {
    const meanActual = this.trainingData.reduce((sum, data) => sum + data.performance, 0) 
      / this.trainingData.length;
    
    const totalSS = this.trainingData.reduce((sum, data) => 
      sum + Math.pow(data.performance - meanActual, 2), 0);
    
    const residualSS = Math.pow(predicted - actual, 2);
    
    return 1 - (residualSS / totalSS);
  }

  private calculatePerformanceMetric(result: BacktestResult, target: string): number {
    switch (target) {
      case 'RETURN':
        return result.metrics.totalPnL;
      case 'SHARPE':
        return result.metrics.sharpeRatio;
      case 'SORTINO':
        return result.metrics.sortinoRatio;
      case 'CALMAR':
        return result.metrics.calmarRatio;
      default:
        return result.metrics.totalPnL;
    }
  }

  getProgress(): number {
    return this.progress;
  }

  isOptimizing(): boolean {
    return this.isTraining;
  }

  getOptimizationHistory(): MLOptimizationResult[] {
    return this.optimizationHistory;
  }

  clearHistory(): void {
    this.optimizationHistory = [];
  }
}

export const mlStrategyOptimizer = new MLStrategyOptimizer();
