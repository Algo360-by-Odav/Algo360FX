import {
  OptimizationConfig,
  OptimizationResultNew,
  ParameterDistribution,
  PerformanceMetrics,
} from '../types/optimization';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock function to generate realistic-looking optimization results
export async function optimizeStrategy(
  strategyId: string,
  config: OptimizationConfig
): Promise<OptimizationResultNew> {
  // Simulate optimization process
  const totalGenerations = config.geneticConfig?.generations || 50;
  const generations = [];

  for (let i = 0; i < totalGenerations; i++) {
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

  // Generate final performance metrics
  const finalPerformance: PerformanceMetrics = {
    sharpeRatio: 1.8 + Math.random() * 0.4,
    sortino: 2.2 + Math.random() * 0.5,
    maxDrawdown: -(0.1 + Math.random() * 0.05),
    returns: 0.25 + Math.random() * 0.15,
    winRate: 0.6 + Math.random() * 0.1,
    profitFactor: 1.8 + Math.random() * 0.4,
  };

  // Generate best parameters
  const bestParameters = Object.fromEntries(
    config.parameters.map(param => [
      param.name,
      param.min + Math.random() * (param.max - param.min),
    ])
  );

  return {
    generations,
    parameterDistribution,
    bestParameters,
    finalPerformance,
  };
}
