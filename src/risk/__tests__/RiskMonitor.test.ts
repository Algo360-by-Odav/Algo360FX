import { RiskMonitor } from '../RiskMonitor';
import { RiskMonitorConfig } from '../types';
import { Portfolio } from '../../types/trading';

describe('RiskMonitor', () => {
    let riskMonitor: RiskMonitor;
    let mockConfig: RiskMonitorConfig;
    let mockPortfolio: Portfolio;

    beforeEach(() => {
        mockConfig = {
            updateInterval: 1000,
            alertThresholds: {
                leverage: 3,
                drawdown: 0.1,
                volatility: 0.2,
                correlation: 0.7
            },
            riskLimits: {
                maxLeverage: 5,
                maxDrawdown: 0.15,
                maxPositions: 10,
                maxDailyLoss: 0.05,
                maxExposurePerCurrency: 0.3,
                maxCorrelation: 0.8
            }
        };

        mockPortfolio = {
            id: 'test-portfolio',
            name: 'Test Portfolio',
            positions: [],
            equity: 100000,
            balance: 100000,
            unrealizedPnL: 0,
            realizedPnL: 0,
            marginUsed: 0,
            freeMargin: 100000
        };

        riskMonitor = new RiskMonitor(mockConfig);
    });

    afterEach(() => {
        riskMonitor.stopMonitoring();
    });

    describe('Monitoring Control', () => {
        it('should start and stop monitoring correctly', () => {
            expect(riskMonitor.isMonitoring).toBe(false);
            
            riskMonitor.startMonitoring(mockPortfolio);
            expect(riskMonitor.isMonitoring).toBe(true);
            
            riskMonitor.stopMonitoring();
            expect(riskMonitor.isMonitoring).toBe(false);
        });

        it('should not start monitoring twice', () => {
            riskMonitor.startMonitoring(mockPortfolio);
            const firstLastUpdate = riskMonitor.lastUpdate;
            
            // Wait a bit and try to start again
            jest.advanceTimersByTime(100);
            riskMonitor.startMonitoring(mockPortfolio);
            
            expect(riskMonitor.lastUpdate).toBe(firstLastUpdate);
        });
    });

    describe('Risk Metrics Calculation', () => {
        it('should calculate initial risk metrics', () => {
            riskMonitor.startMonitoring(mockPortfolio);
            const metrics = riskMonitor.getRiskMetrics();
            
            expect(metrics).not.toBeNull();
            if (metrics) {
                expect(metrics.volatility).toBeGreaterThanOrEqual(0);
                expect(metrics.valueAtRisk).toBeGreaterThanOrEqual(0);
                expect(metrics.drawdown.current).toBeGreaterThanOrEqual(0);
            }
        });

        it('should update risk metrics periodically', () => {
            jest.useFakeTimers();
            riskMonitor.startMonitoring(mockPortfolio);
            
            const initialUpdate = riskMonitor.lastUpdate;
            jest.advanceTimersByTime(mockConfig.updateInterval);
            
            expect(riskMonitor.lastUpdate).toBeGreaterThan(initialUpdate);
            
            jest.useRealTimers();
        });
    });

    describe('Alert System', () => {
        it('should generate alerts when limits are exceeded', () => {
            // Create a portfolio that exceeds drawdown limit
            const riskyPortfolio = {
                ...mockPortfolio,
                equity: 80000, // 20% drawdown from initial 100000
                unrealizedPnL: -20000
            };

            riskMonitor.startMonitoring(riskyPortfolio);
            const alerts = riskMonitor.getAlerts();
            
            expect(alerts.length).toBeGreaterThan(0);
            expect(alerts[0].type).toBe('drawdown');
            expect(alerts[0].severity).toBe('high');
        });

        it('should maintain alert history', () => {
            for (let i = 0; i < 150; i++) {
                riskMonitor.startMonitoring({
                    ...mockPortfolio,
                    equity: 100000 - (i * 1000)
                });
            }

            const alerts = riskMonitor.getAlerts();
            expect(alerts.length).toBeLessThanOrEqual(100); // Max 100 alerts
            expect(alerts[alerts.length - 1].timestamp).toBeGreaterThan(alerts[0].timestamp);
        });
    });

    describe('Dynamic Risk Parameters', () => {
        it('should update dynamic risk parameters', () => {
            riskMonitor.startMonitoring(mockPortfolio);
            const params = riskMonitor.getDynamicParams();
            
            expect(params).not.toBeNull();
            if (params) {
                expect(params.marketCondition).toBeDefined();
                expect(params.adjustmentFactor).toBeGreaterThan(0);
            }
        });

        it('should adjust parameters based on market conditions', () => {
            // Simulate volatile market conditions
            const volatilePortfolio = {
                ...mockPortfolio,
                positions: [
                    {
                        symbol: 'TEST',
                        size: 1,
                        entryPrice: 100,
                        currentPrice: 120,
                        unrealizedPnL: 20,
                        notionalValue: 120
                    }
                ]
            };

            riskMonitor.startMonitoring(volatilePortfolio);
            const params = riskMonitor.getDynamicParams();
            
            expect(params?.marketCondition).toBe('volatile');
            expect(params?.adjustmentFactor).toBeLessThan(1);
        });
    });
});
