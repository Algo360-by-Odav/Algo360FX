import {
  OptimizationConfig,
  OptimizationResultNew,
  ParameterDistribution,
  PerformanceMetrics,
} from '@/types/optimization';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ProgressCallback = (progress: number) => void;
type ResultCallback = (result: OptimizationResultNew) => void;
type ErrorCallback = (error: string) => void;

export class OptimizationService {
  private progressCallback?: ProgressCallback;
  private resultCallback?: ResultCallback;
  private errorCallback?: ErrorCallback;

  onProgress(callback: ProgressCallback) {
    this.progressCallback = callback;
  }

  onResult(callback: ResultCallback) {
    this.resultCallback = callback;
  }

  onError(callback: ErrorCallback) {
    this.errorCallback = callback;
  }

  private emitProgress(progress: number) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  private emitResult(result: OptimizationResultNew) {
    if (this.resultCallback) {
      this.resultCallback(result);
    }
  }

  private emitError(error: string) {
    if (this.errorCallback) {
      this.errorCallback(error);
    }
  }

  async startOptimization(strategyId: string, config: OptimizationConfig) {
    try {
      const result = await this.optimizeStrategy(strategyId, config);
      this.emitResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
      this.emitError(errorMessage);
      throw error;
    }
  }

  // Mock function to generate realistic-looking optimization results
  private async optimizeStrategy(
    strategyId: string,
    config: OptimizationConfig
  ): Promise<OptimizationResultNew> {
    // Simulate optimization process
    const totalGenerations = config.geneticConfig?.generations || 50;
    const generations = [];

    for (let i = 0; i < totalGenerations; i++) {
      const progress = ((i + 1) / totalGenerations) * 100;
      this.emitProgress(progress);

      const bestFitness = Math.random() * (1 - 0.5) + 0.5 + (i / totalGenerations) * 0.5;
      const averageFitness = bestFitness - Math.random() * 0.2;

      generations.push({
        number: i,
        bestFitness,
        averageFitness,
        parameters: Object.fromEntries(
          config.parameters.map(param => [
            param.name,
            param.min + Math.random() * (param.max - param.min),
          ])
        ),
      });

      // Simulate optimization delay
      await sleep(100);
    }

    // Generate parameter distributions
    const parameterDistribution: ParameterDistribution[] = config.parameters.map(param => {
      const values: number[] = [];
      const frequencies: number[] = [];
      const steps = 10;
      const stepSize = (param.max - param.min) / steps;

      for (let i = 0; i <= steps; i++) {
        values.push(param.min + i * stepSize);
        frequencies.push(Math.random() * 100);
      }

      return {
        parameter: param.name,
        values,
        frequencies,
      };
    });

    // Generate performance metrics
    const performanceMetrics: PerformanceMetrics = {
      profitFactor: 1.5 + Math.random() * 1.5,
      sharpeRatio: 0.8 + Math.random() * 1.2,
      maxDrawdown: -(10 + Math.random() * 20),
      winRate: 45 + Math.random() * 25,
      expectancy: 0.5 + Math.random() * 1,
      trades: Math.floor(100 + Math.random() * 200),
      averageTrade: 10 + Math.random() * 40,
    };

    return {
      id: Math.random().toString(36).substring(7),
      strategyId,
      status: 'completed',
      generations,
      parameterDistribution,
      performanceMetrics,
      bestParameters: generations[generations.length - 1].parameters,
      startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      endTime: new Date().toISOString(),
    };
  }
}
