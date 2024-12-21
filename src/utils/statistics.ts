/**
 * Statistical utility functions for risk management calculations
 */

export type Matrix = number[][];

/**
 * Calculates the volatility (standard deviation) of a series of returns
 */
export function calculateVolatility(returns: number[], annualize: boolean = true): number {
    if (returns.length < 2) return 0;

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance);

    return annualize ? volatility * Math.sqrt(252) : volatility;
}

/**
 * Calculates correlation between two series of returns
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
    if (returns1.length !== returns2.length || returns1.length < 2) return 0;

    const mean1 = returns1.reduce((sum, r) => sum + r, 0) / returns1.length;
    const mean2 = returns2.reduce((sum, r) => sum + r, 0) / returns2.length;

    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;

    for (let i = 0; i < returns1.length; i++) {
        const diff1 = returns1[i] - mean1;
        const diff2 = returns2[i] - mean2;
        covariance += diff1 * diff2;
        variance1 += diff1 * diff1;
        variance2 += diff2 * diff2;
    }

    covariance /= returns1.length - 1;
    variance1 /= returns1.length - 1;
    variance2 /= returns1.length - 1;

    const stdDev1 = Math.sqrt(variance1);
    const stdDev2 = Math.sqrt(variance2);

    return stdDev1 === 0 || stdDev2 === 0 ? 0 : covariance / (stdDev1 * stdDev2);
}

/**
 * Calculates the correlation matrix for multiple return series
 */
export function calculateCorrelationMatrix(returnSeries: number[][]): Matrix {
    const n = returnSeries.length;
    const matrix: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        matrix[i][i] = 1; // Diagonal is always 1
        for (let j = i + 1; j < n; j++) {
            const correlation = calculateCorrelation(returnSeries[i], returnSeries[j]);
            matrix[i][j] = correlation;
            matrix[j][i] = correlation; // Matrix is symmetric
        }
    }

    return matrix;
}

/**
 * Calculates exponentially weighted moving average
 */
export function calculateEWMA(data: number[], lambda: number = 0.94): number[] {
    if (data.length === 0) return [];
    
    const result: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
        result[i] = lambda * result[i - 1] + (1 - lambda) * data[i];
    }
    return result;
}

/**
 * Calculates Value at Risk using historical simulation method
 */
export function calculateHistoricalVaR(
    returns: number[],
    confidence: number = 0.95,
    amount: number = 1
): number {
    if (returns.length === 0) return 0;

    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor(returns.length * (1 - confidence));
    return -amount * sortedReturns[index];
}

/**
 * Calculates Expected Shortfall (Conditional VaR)
 */
export function calculateExpectedShortfall(
    returns: number[],
    confidence: number = 0.95,
    amount: number = 1
): number {
    if (returns.length === 0) return 0;

    const sortedReturns = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor(returns.length * (1 - confidence));
    const tailReturns = sortedReturns.slice(0, varIndex);
    
    return -amount * (tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length);
}

/**
 * Calculates beta of a return series against a benchmark
 */
export function calculateBeta(returns: number[], benchmarkReturns: number[]): number {
    if (returns.length !== benchmarkReturns.length || returns.length < 2) return 0;

    const correlation = calculateCorrelation(returns, benchmarkReturns);
    const returnVol = calculateVolatility(returns, false);
    const benchmarkVol = calculateVolatility(benchmarkReturns, false);

    return benchmarkVol === 0 ? 0 : correlation * (returnVol / benchmarkVol);
}

/**
 * Calculates drawdown series from return series
 */
export function calculateDrawdownSeries(returns: number[]): number[] {
    let peak = 1;
    let value = 1;
    return returns.map(r => {
        value *= (1 + r);
        peak = Math.max(peak, value);
        return (value - peak) / peak;
    });
}

/**
 * Calculates maximum drawdown and its duration
 */
export interface DrawdownMetrics {
    maxDrawdown: number;
    duration: number;
    currentDrawdown: number;
}

export function calculateDrawdownMetrics(returns: number[]): DrawdownMetrics {
    let peak = 1;
    let value = 1;
    let maxDrawdown = 0;
    let drawdownStart = 0;
    let maxDuration = 0;
    let currentDrawdownStart = 0;

    returns.forEach((r, i) => {
        value *= (1 + r);
        
        if (value > peak) {
            peak = value;
            currentDrawdownStart = i;
        } else {
            const drawdown = (peak - value) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
                maxDuration = i - drawdownStart;
            }
        }
    });

    const currentDrawdown = (peak - value) / peak;

    return {
        maxDrawdown,
        duration: maxDuration,
        currentDrawdown
    };
}
