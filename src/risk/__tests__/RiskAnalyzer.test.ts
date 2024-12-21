import { RiskAnalyzer } from '../RiskAnalyzer';
import { Portfolio } from '../../types/trading';

describe('RiskAnalyzer', () => {
    let riskAnalyzer: RiskAnalyzer;
    let mockPortfolio: Portfolio;

    beforeEach(() => {
        riskAnalyzer = new RiskAnalyzer();
        mockPortfolio = {
            id: 'test-portfolio',
            name: 'Test Portfolio',
            positions: [
                {
                    symbol: 'EURUSD',
                    size: 100000,
                    entryPrice: 1.2000,
                    currentPrice: 1.2100,
                    unrealizedPnL: 1000,
                    notionalValue: 121000
                },
                {
                    symbol: 'GBPUSD',
                    size: 50000,
                    entryPrice: 1.3000,
                    currentPrice: 1.3050,
                    unrealizedPnL: 250,
                    notionalValue: 65250
                }
            ],
            equity: 100000,
            balance: 98750,
            unrealizedPnL: 1250,
            realizedPnL: -1250,
            marginUsed: 18625,
            freeMargin: 81375
        };
    });

    describe('Risk-Adjusted Metrics', () => {
        it('should calculate all risk-adjusted metrics', () => {
            const metrics = riskAnalyzer.calculateRiskAdjustedMetrics(mockPortfolio);
            
            expect(metrics.sharpeRatio).toBeDefined();
            expect(metrics.sortinoRatio).toBeDefined();
            expect(metrics.informationRatio).toBeDefined();
            expect(metrics.calmarRatio).toBeDefined();
            expect(metrics.maxDrawdown).toBeDefined();
            expect(metrics.recoveryFactor).toBeDefined();
        });

        it('should handle zero volatility case', () => {
            // Create a portfolio with no price changes
            const flatPortfolio = {
                ...mockPortfolio,
                positions: mockPortfolio.positions.map(pos => ({
                    ...pos,
                    currentPrice: pos.entryPrice,
                    unrealizedPnL: 0
                }))
            };

            const metrics = riskAnalyzer.calculateRiskAdjustedMetrics(flatPortfolio);
            
            expect(metrics.sharpeRatio).toBe(0);
            expect(metrics.sortinoRatio).toBe(0);
        });
    });

    describe('Currency Risk Analysis', () => {
        it('should analyze currency risk exposure', () => {
            const currencyRisk = riskAnalyzer.analyzeCurrencyRisk(mockPortfolio);
            
            expect(currencyRisk.exposureByBase).toBeDefined();
            expect(currencyRisk.hedgeRatios).toBeDefined();
            expect(currencyRisk.correlationMatrix).toBeDefined();
            expect(currencyRisk.volatilityImpact).toBeGreaterThanOrEqual(0);
        });

        it('should identify overexposed currencies', () => {
            // Add a large USD exposure
            const highExposurePortfolio = {
                ...mockPortfolio,
                positions: [
                    ...mockPortfolio.positions,
                    {
                        symbol: 'USDJPY',
                        size: 500000,
                        entryPrice: 110.00,
                        currentPrice: 110.50,
                        unrealizedPnL: 2272.73,
                        notionalValue: 552500
                    }
                ]
            };

            const currencyRisk = riskAnalyzer.analyzeCurrencyRisk(highExposurePortfolio);
            const usdExposure = currencyRisk.exposureByBase['USD'];
            
            expect(usdExposure).toBeDefined();
            expect(usdExposure).toBeGreaterThan(0.5); // Over 50% exposure
        });
    });

    describe('Historical Data Management', () => {
        it('should manage historical data correctly', () => {
            const symbol = 'EURUSD';
            const data = [0.01, -0.02, 0.03, -0.01, 0.02];
            
            riskAnalyzer.addHistoricalData(symbol, data);
            riskAnalyzer.addRiskMetrics({
                volatility: 0.15,
                valueAtRisk: 0.02,
                expectedShortfall: 0.03,
                beta: 1.1,
                correlations: [[1, 0.5], [0.5, 1]],
                drawdown: {
                    current: 0.05,
                    maximum: 0.1,
                    duration: 5
                }
            });

            const history = riskAnalyzer.getRiskMetricsHistory();
            expect(history.length).toBeGreaterThan(0);
            expect(history[history.length - 1].volatility).toBe(0.15);
        });

        it('should limit historical data storage', () => {
            // Add more than 100 metrics
            for (let i = 0; i < 150; i++) {
                riskAnalyzer.addRiskMetrics({
                    volatility: 0.15 + i * 0.01,
                    valueAtRisk: 0.02,
                    expectedShortfall: 0.03,
                    beta: 1.1,
                    correlations: [[1, 0.5], [0.5, 1]],
                    drawdown: {
                        current: 0.05,
                        maximum: 0.1,
                        duration: 5
                    }
                });
            }

            const history = riskAnalyzer.getRiskMetricsHistory();
            expect(history.length).toBeLessThanOrEqual(100);
            
            // Verify we kept the most recent metrics
            const lastMetric = history[history.length - 1];
            expect(lastMetric.volatility).toBeGreaterThan(0.15);
        });
    });
});
