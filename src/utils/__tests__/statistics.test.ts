import {
    calculateVolatility,
    calculateCorrelation,
    calculateCorrelationMatrix,
    calculateEWMA,
    calculateHistoricalVaR,
    calculateExpectedShortfall,
    calculateBeta,
    calculateDrawdownSeries,
    calculateDrawdownMetrics
} from '../statistics';

describe('Statistics Utility Functions', () => {
    describe('calculateVolatility', () => {
        it('should calculate annualized volatility correctly', () => {
            const returns = [0.01, -0.02, 0.03, -0.01, 0.02];
            const volatility = calculateVolatility(returns, true);
            expect(volatility).toBeCloseTo(0.3162, 4); // √252 * std
        });

        it('should return 0 for empty or single-element arrays', () => {
            expect(calculateVolatility([])).toBe(0);
            expect(calculateVolatility([0.01])).toBe(0);
        });
    });

    describe('calculateCorrelation', () => {
        it('should calculate correlation correctly', () => {
            const series1 = [1, 2, 3, 4, 5];
            const series2 = [2, 4, 6, 8, 10];
            const correlation = calculateCorrelation(series1, series2);
            expect(correlation).toBe(1); // Perfect positive correlation
        });

        it('should handle negative correlation', () => {
            const series1 = [1, 2, 3, 4, 5];
            const series2 = [-2, -4, -6, -8, -10];
            const correlation = calculateCorrelation(series1, series2);
            expect(correlation).toBe(-1); // Perfect negative correlation
        });

        it('should return 0 for uncorrelated series', () => {
            const series1 = [1, 2, 3, 4, 5];
            const series2 = [0, 0, 0, 0, 0];
            const correlation = calculateCorrelation(series1, series2);
            expect(correlation).toBe(0);
        });
    });

    describe('calculateCorrelationMatrix', () => {
        it('should create a valid correlation matrix', () => {
            const series = [
                [1, 2, 3],
                [2, 4, 6],
                [3, 6, 9]
            ];
            const matrix = calculateCorrelationMatrix(series);
            
            // Check matrix properties
            expect(matrix.length).toBe(3);
            expect(matrix[0].length).toBe(3);
            
            // Check diagonal elements
            matrix.forEach((row, i) => {
                expect(row[i]).toBe(1);
            });
            
            // Check symmetry
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    expect(matrix[i][j]).toBe(matrix[j][i]);
                }
            }
        });
    });

    describe('calculateEWMA', () => {
        it('should calculate EWMA correctly', () => {
            const data = [1, 2, 3, 4, 5];
            const lambda = 0.5;
            const ewma = calculateEWMA(data, lambda);
            
            expect(ewma.length).toBe(data.length);
            expect(ewma[0]).toBe(data[0]);
            
            // Manual calculation for second element
            const expectedSecond = lambda * data[0] + (1 - lambda) * data[1];
            expect(ewma[1]).toBeCloseTo(expectedSecond, 10);
        });
    });

    describe('calculateHistoricalVaR', () => {
        it('should calculate VaR correctly', () => {
            const returns = [-0.05, -0.03, -0.02, -0.01, 0, 0.01, 0.02, 0.03, 0.04, 0.05];
            const var95 = calculateHistoricalVaR(returns, 0.95);
            
            // At 95% confidence, should be close to the 5th percentile loss
            expect(var95).toBeCloseTo(0.04, 4);
        });
    });

    describe('calculateExpectedShortfall', () => {
        it('should calculate Expected Shortfall correctly', () => {
            const returns = [-0.05, -0.04, -0.03, -0.02, -0.01, 0, 0.01, 0.02, 0.03, 0.04];
            const es95 = calculateExpectedShortfall(returns, 0.95);
            
            // ES should be larger than VaR
            const var95 = calculateHistoricalVaR(returns, 0.95);
            expect(es95).toBeGreaterThan(var95);
        });
    });

    describe('calculateBeta', () => {
        it('should calculate beta correctly', () => {
            const returns = [0.01, 0.02, -0.01, 0.03, -0.02];
            const benchmark = [0.005, 0.01, -0.005, 0.015, -0.01];
            const beta = calculateBeta(returns, benchmark);
            
            // Returns are exactly twice the benchmark
            expect(beta).toBeCloseTo(2, 4);
        });
    });

    describe('calculateDrawdownSeries', () => {
        it('should calculate drawdown series correctly', () => {
            const returns = [0.1, -0.2, 0.15, -0.1];
            const drawdowns = calculateDrawdownSeries(returns);
            
            expect(drawdowns.length).toBe(returns.length);
            expect(drawdowns[0]).toBe(0); // First value should be 0
            expect(Math.min(...drawdowns)).toBeLessThan(0); // Should have negative values
        });
    });

    describe('calculateDrawdownMetrics', () => {
        it('should calculate drawdown metrics correctly', () => {
            const returns = [0.1, -0.2, 0.15, -0.1];
            const metrics = calculateDrawdownMetrics(returns);
            
            expect(metrics.maxDrawdown).toBeGreaterThan(0);
            expect(metrics.duration).toBeGreaterThanOrEqual(0);
            expect(metrics.currentDrawdown).toBeGreaterThanOrEqual(0);
        });
    });
});
