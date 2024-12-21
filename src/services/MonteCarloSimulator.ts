import { Trade } from '../types/trading';

export interface MonteCarloResult {
  confidenceIntervals: {
    level: number;
    lower: number[];
    upper: number[];
  }[];
  expectedEquityCurve: number[];
  worstCase: number[];
  bestCase: number[];
  drawdownDistribution: {
    maxDrawdown: number;
    frequency: number;
  }[];
  finalEquityDistribution: {
    value: number;
    frequency: number;
  }[];
}

export class MonteCarloSimulator {
  private readonly CONFIDENCE_LEVELS = [0.95, 0.90, 0.80];
  private readonly NUM_SIMULATIONS = 1000;

  simulateStrategy(
    trades: Trade[],
    initialEquity: number,
    timeHorizon: number
  ): MonteCarloResult {
    const returns = this.calculateReturns(trades);
    const simulations: number[][] = [];

    // Run Monte Carlo simulations
    for (let i = 0; i < this.NUM_SIMULATIONS; i++) {
      simulations.push(this.runSimulation(returns, initialEquity, timeHorizon));
    }

    // Calculate confidence intervals for each time step
    const confidenceIntervals = this.CONFIDENCE_LEVELS.map(level => {
      const intervals = this.calculateConfidenceIntervals(simulations, level);
      return {
        level,
        lower: intervals.lower,
        upper: intervals.upper,
      };
    });

    // Calculate expected equity curve (mean of all simulations)
    const expectedEquityCurve = this.calculateExpectedEquityCurve(simulations);

    // Find worst and best case scenarios
    const worstCase = this.findWorstCase(simulations);
    const bestCase = this.findBestCase(simulations);

    // Calculate drawdown distribution
    const drawdownDistribution = this.calculateDrawdownDistribution(simulations);

    // Calculate final equity distribution
    const finalEquityDistribution = this.calculateFinalEquityDistribution(simulations);

    return {
      confidenceIntervals,
      expectedEquityCurve,
      worstCase,
      bestCase,
      drawdownDistribution,
      finalEquityDistribution,
    };
  }

  private calculateReturns(trades: Trade[]): number[] {
    return trades.map(trade => trade.profit / trade.entryPrice);
  }

  private runSimulation(
    returns: number[],
    initialEquity: number,
    timeHorizon: number
  ): number[] {
    const equity = [initialEquity];
    let currentEquity = initialEquity;

    for (let i = 0; i < timeHorizon; i++) {
      // Randomly sample a return from historical returns
      const randomReturn = returns[Math.floor(Math.random() * returns.length)];
      currentEquity *= 1 + randomReturn;
      equity.push(currentEquity);
    }

    return equity;
  }

  private calculateConfidenceIntervals(
    simulations: number[][],
    confidenceLevel: number
  ): { lower: number[]; upper: number[] } {
    const timeSteps = simulations[0].length;
    const lower: number[] = [];
    const upper: number[] = [];

    for (let t = 0; t < timeSteps; t++) {
      const values = simulations.map(sim => sim[t]).sort((a, b) => a - b);
      const lowerIndex = Math.floor(((1 - confidenceLevel) / 2) * this.NUM_SIMULATIONS);
      const upperIndex = Math.floor((1 - (1 - confidenceLevel) / 2) * this.NUM_SIMULATIONS);

      lower.push(values[lowerIndex]);
      upper.push(values[upperIndex]);
    }

    return { lower, upper };
  }

  private calculateExpectedEquityCurve(simulations: number[][]): number[] {
    const timeSteps = simulations[0].length;
    const expectedCurve: number[] = [];

    for (let t = 0; t < timeSteps; t++) {
      const mean =
        simulations.reduce((sum, sim) => sum + sim[t], 0) / this.NUM_SIMULATIONS;
      expectedCurve.push(mean);
    }

    return expectedCurve;
  }

  private findWorstCase(simulations: number[][]): number[] {
    return simulations.reduce((worst, current) =>
      current[current.length - 1] < worst[worst.length - 1] ? current : worst
    );
  }

  private findBestCase(simulations: number[][]): number[] {
    return simulations.reduce((best, current) =>
      current[current.length - 1] > best[best.length - 1] ? current : best
    );
  }

  private calculateDrawdownDistribution(simulations: number[][]): { maxDrawdown: number; frequency: number }[] {
    const drawdowns = simulations.map(sim => this.calculateMaxDrawdown(sim));
    const distribution = new Map<number, number>();

    // Round drawdowns to nearest percentage point for binning
    drawdowns.forEach(dd => {
      const roundedDD = Math.round(dd * 100) / 100;
      distribution.set(roundedDD, (distribution.get(roundedDD) || 0) + 1);
    });

    return Array.from(distribution.entries())
      .map(([maxDrawdown, frequency]) => ({
        maxDrawdown,
        frequency: frequency / this.NUM_SIMULATIONS,
      }))
      .sort((a, b) => a.maxDrawdown - b.maxDrawdown);
  }

  private calculateMaxDrawdown(equity: number[]): number {
    let maxDrawdown = 0;
    let peak = equity[0];

    for (const value of equity) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private calculateFinalEquityDistribution(simulations: number[][]): { value: number; frequency: number }[] {
    const finalValues = simulations.map(sim => sim[sim.length - 1]);
    const distribution = new Map<number, number>();

    // Round final values to nearest 1000 for binning
    finalValues.forEach(value => {
      const roundedValue = Math.round(value / 1000) * 1000;
      distribution.set(roundedValue, (distribution.get(roundedValue) || 0) + 1);
    });

    return Array.from(distribution.entries())
      .map(([value, frequency]) => ({
        value,
        frequency: frequency / this.NUM_SIMULATIONS,
      }))
      .sort((a, b) => a.value - b.value);
  }
}
