import { makeAutoObservable } from 'mobx';
import { BacktestResult, Trade } from '../../types/trading';

export interface RiskMetrics {
  valueAtRisk: {
    historical: number;
    parametric: number;
    conditionalVaR: number;
    confidenceLevel: number;
  };
  drawdown: {
    maximum: number;
    average: number;
    duration: number;
    recoveryTime: number;
  };
  volatility: {
    historical: number;
    exponential: number;
    parkinson: number;
    garch: number;
  };
  tailRisk: {
    skewness: number;
    kurtosis: number;
    tailDependence: number;
  };
  stressMetrics: {
    worstCase: number;
    stressVaR: number;
    expectedShortfall: number;
  };
  stabilityMetrics: {
    betaToMarket: number;
    treynorRatio: number;
    informationRatio: number;
    omega: number;
  };
  riskAdjusted: {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    sterlingRatio: number;
    burkeRatio: number;
  };
}

class RiskMetricsService {
  constructor() {
    makeAutoObservable(this);
  }

  calculateRiskMetrics(
    backtest: BacktestResult,
    marketReturns: number[],
    riskFreeRate: number = 0.02,
    confidenceLevel: number = 0.95
  ): RiskMetrics {
    const returns = this.calculateReturns(backtest.equityCurve);
    const drawdowns = this.calculateDrawdowns(backtest.equityCurve);

    return {
      valueAtRisk: this.calculateVaR(returns, confidenceLevel),
      drawdown: this.calculateDrawdownMetrics(drawdowns),
      volatility: this.calculateVolatilityMetrics(returns),
      tailRisk: this.calculateTailRisk(returns),
      stressMetrics: this.calculateStressMetrics(returns, confidenceLevel),
      stabilityMetrics: this.calculateStabilityMetrics(returns, marketReturns),
      riskAdjusted: this.calculateRiskAdjustedMetrics(
        returns,
        drawdowns,
        riskFreeRate
      ),
    };
  }

  private calculateReturns(equityCurve: { timestamp: Date; equity: number }[]): number[] {
    return equityCurve.map((point, i, arr) =>
      i === 0 ? 0 : (point.equity - arr[i - 1].equity) / arr[i - 1].equity
    );
  }

  private calculateDrawdowns(
    equityCurve: { timestamp: Date; equity: number }[]
  ): number[] {
    let peak = equityCurve[0].equity;
    return equityCurve.map(point => {
      if (point.equity > peak) {
        peak = point.equity;
        return 0;
      }
      return (peak - point.equity) / peak;
    });
  }

  private calculateVaR(returns: number[], confidenceLevel: number): {
    historical: number;
    parametric: number;
    conditionalVaR: number;
    confidenceLevel: number;
  } {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * returns.length);
    
    const historicalVaR = -sortedReturns[index];
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const parametricVaR = -(mean + stdDev * this.normalInverse(1 - confidenceLevel));
    
    const exceedances = sortedReturns.slice(0, index);
    const conditionalVaR = -exceedances.reduce((sum, r) => sum + r, 0) / exceedances.length;

    return {
      historical: historicalVaR,
      parametric: parametricVaR,
      conditionalVaR,
      confidenceLevel,
    };
  }

  private calculateDrawdownMetrics(drawdowns: number[]): {
    maximum: number;
    average: number;
    duration: number;
    recoveryTime: number;
  } {
    const maximum = Math.max(...drawdowns);
    const average = drawdowns.reduce((sum, d) => sum + d, 0) / drawdowns.length;
    
    let currentDrawdown = 0;
    let maxDuration = 0;
    let currentDuration = 0;
    let recoveryTime = 0;
    
    drawdowns.forEach(dd => {
      if (dd > 0) {
        currentDuration++;
        if (dd > currentDrawdown) {
          currentDrawdown = dd;
          recoveryTime = currentDuration;
        }
      } else {
        maxDuration = Math.max(maxDuration, currentDuration);
        currentDuration = 0;
        currentDrawdown = 0;
      }
    });

    return {
      maximum,
      average,
      duration: maxDuration,
      recoveryTime,
    };
  }

  private calculateVolatilityMetrics(returns: number[]): {
    historical: number;
    exponential: number;
    parkinson: number;
    garch: number;
  } {
    const historical = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / returns.length
    );

    const lambda = 0.94; // Decay factor for exponential volatility
    let expVariance = returns[0] * returns[0];
    returns.forEach(r => {
      expVariance = lambda * expVariance + (1 - lambda) * r * r;
    });
    const exponential = Math.sqrt(expVariance);

    // Parkinson volatility (requires high/low prices)
    const parkinson = historical; // Placeholder, needs actual high/low prices

    // GARCH(1,1) volatility
    const omega = 0.000001;
    const alpha = 0.1;
    const beta = 0.8;
    let garchVariance = historical * historical;
    returns.forEach(r => {
      garchVariance = omega + alpha * r * r + beta * garchVariance;
    });
    const garch = Math.sqrt(garchVariance);

    return {
      historical,
      exponential,
      parkinson,
      garch,
    };
  }

  private calculateTailRisk(returns: number[]): {
    skewness: number;
    kurtosis: number;
    tailDependence: number;
  } {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    const skewness =
      returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 3), 0) /
      returns.length;

    const kurtosis =
      returns.reduce((sum, r) => sum + Math.pow((r - mean) / stdDev, 4), 0) /
      returns.length;

    // Tail dependence coefficient (simplified)
    const threshold = mean - 2 * stdDev;
    const exceedances = returns.filter(r => r < threshold).length;
    const tailDependence = exceedances / returns.length;

    return {
      skewness,
      kurtosis,
      tailDependence,
    };
  }

  private calculateStressMetrics(returns: number[], confidenceLevel: number): {
    worstCase: number;
    stressVaR: number;
    expectedShortfall: number;
  } {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const worstCase = sortedReturns[0];

    const stressIndex = Math.floor(0.01 * returns.length);
    const stressVaR = -sortedReturns[stressIndex];

    const index = Math.floor((1 - confidenceLevel) * returns.length);
    const exceedances = sortedReturns.slice(0, index);
    const expectedShortfall = -exceedances.reduce((sum, r) => sum + r, 0) / exceedances.length;

    return {
      worstCase,
      stressVaR,
      expectedShortfall,
    };
  }

  private calculateStabilityMetrics(returns: number[], marketReturns: number[]): {
    betaToMarket: number;
    treynorRatio: number;
    informationRatio: number;
    omega: number;
  } {
    const covariance = this.calculateCovariance(returns, marketReturns);
    const marketVariance = this.calculateVariance(marketReturns);
    const beta = covariance / marketVariance;

    const excessReturns = returns.map((r, i) => r - marketReturns[i]);
    const trackingError = Math.sqrt(this.calculateVariance(excessReturns));
    const informationRatio =
      (this.calculateMean(returns) - this.calculateMean(marketReturns)) /
      trackingError;

    const positiveReturns = returns.filter(r => r > 0);
    const negativeReturns = returns.filter(r => r < 0);
    const omega =
      positiveReturns.reduce((sum, r) => sum + r, 0) /
      Math.abs(negativeReturns.reduce((sum, r) => sum + r, 0));

    const riskFreeRate = 0.02 / 252; // Daily risk-free rate
    const excessReturn = this.calculateMean(returns) - riskFreeRate;
    const treynorRatio = excessReturn / beta;

    return {
      betaToMarket: beta,
      treynorRatio,
      informationRatio,
      omega,
    };
  }

  private calculateRiskAdjustedMetrics(
    returns: number[],
    drawdowns: number[],
    riskFreeRate: number
  ): {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    sterlingRatio: number;
    burkeRatio: number;
  } {
    const annualFactor = 252; // Trading days per year
    const mean = this.calculateMean(returns);
    const stdDev = Math.sqrt(this.calculateVariance(returns));
    
    const excessReturn = mean - riskFreeRate / annualFactor;
    const sharpeRatio = excessReturn / stdDev * Math.sqrt(annualFactor);

    const downside = returns
      .filter(r => r < 0)
      .map(r => r * r)
      .reduce((sum, r) => sum + r, 0);
    const downsideDeviation = Math.sqrt(downside / returns.length);
    const sortinoRatio = excessReturn / downsideDeviation * Math.sqrt(annualFactor);

    const maxDrawdown = Math.max(...drawdowns);
    const calmarRatio = excessReturn * annualFactor / maxDrawdown;

    const averageDrawdown = drawdowns.reduce((sum, d) => sum + d, 0) / drawdowns.length;
    const sterlingRatio = excessReturn * annualFactor / averageDrawdown;

    const drawdownSquared = drawdowns.reduce((sum, d) => sum + d * d, 0);
    const burkeRatio = excessReturn * annualFactor / Math.sqrt(drawdownSquared);

    return {
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      sterlingRatio,
      burkeRatio,
    };
  }

  // Helper methods
  private calculateMean(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private calculateVariance(values: number[]): number {
    const mean = this.calculateMean(values);
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }

  private calculateCovariance(x: number[], y: number[]): number {
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);
    return x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / x.length;
  }

  private normalInverse(p: number): number {
    // Approximation of the inverse normal distribution
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;

    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;

    const c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;

    const d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;

    const p_low = 0.02425;
    const p_high = 1 - p_low;

    let q, r;

    if (p < 0 || p > 1) {
      throw new Error("Probability out of range");
    } else if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
        (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
        ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
  }
}

export const riskMetricsService = new RiskMetricsService();
