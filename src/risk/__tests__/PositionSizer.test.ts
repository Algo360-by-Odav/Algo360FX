import { PositionSizer } from '../PositionSizer';
import { Portfolio } from '../../types/trading';
import { DynamicRiskParams } from '../types';

describe('PositionSizer', () => {
    let positionSizer: PositionSizer;
    let mockPortfolio: Portfolio;

    beforeEach(() => {
        positionSizer = new PositionSizer({
            baseRiskPerTrade: 0.02, // 2% risk per trade
            maxPositionSize: 100000,
            volatilityScaling: true,
            correlationAdjustment: true,
            riskLimits: {
                maxLeverage: 5,
                maxDrawdown: 0.15,
                maxPositions: 10,
                maxDailyLoss: 0.05,
                maxExposurePerCurrency: 0.3,
                maxCorrelation: 0.8
            }
        });

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
    });

    describe('Position Size Calculation', () => {
        it('should calculate basic position size correctly', () => {
            const size = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950, // 50 pip stop loss
                mockPortfolio
            );

            // Expected size calculation:
            // Risk amount = 100000 * 0.02 = 2000
            // Risk per unit = 1.2000 - 1.1950 = 0.0050
            // Base size = 2000 / 0.0050 = 400,000
            expect(size).toBeLessThanOrEqual(100000); // Should be capped by maxPositionSize
        });

        it('should return 0 for invalid stop loss', () => {
            const size = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.2000, // Invalid stop loss (same as entry)
                mockPortfolio
            );

            expect(size).toBe(0);
        });

        it('should respect position limits', () => {
            // Add existing positions to approach limit
            mockPortfolio.positions = Array(9).fill({
                symbol: 'GBPUSD',
                size: 10000,
                entryPrice: 1.3000,
                currentPrice: 1.3000,
                unrealizedPnL: 0,
                notionalValue: 13000
            });

            const size = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            expect(size).toBeGreaterThan(0); // Should still allow one more position
            
            // Add one more position to reach limit
            mockPortfolio.positions.push({
                symbol: 'USDJPY',
                size: 10000,
                entryPrice: 110.00,
                currentPrice: 110.00,
                unrealizedPnL: 0,
                notionalValue: 11000
            });

            const sizeAtLimit = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            expect(sizeAtLimit).toBe(0); // Should not allow more positions
        });
    });

    describe('Dynamic Risk Adjustment', () => {
        it('should adjust position size based on market conditions', () => {
            const normalSize = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            positionSizer.updateDynamicParams({
                marketVolatility: 0.2,
                tradingPerformance: -0.1,
                marketCondition: 'volatile',
                adjustmentFactor: 0.5
            });

            const adjustedSize = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            expect(adjustedSize).toBeLessThan(normalSize);
        });

        it('should handle extreme market conditions', () => {
            positionSizer.updateDynamicParams({
                marketVolatility: 0.5,
                tradingPerformance: -0.2,
                marketCondition: 'crisis',
                adjustmentFactor: 0.2
            });

            const size = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            expect(size).toBeLessThanOrEqual(normalSize * 0.2);
        });
    });

    describe('Risk Limit Validation', () => {
        it('should respect leverage limits', () => {
            // Add positions to approach leverage limit
            mockPortfolio.positions = [{
                symbol: 'EURUSD',
                size: 400000,
                entryPrice: 1.2000,
                currentPrice: 1.2000,
                unrealizedPnL: 0,
                notionalValue: 480000 // 4.8x leverage
            }];

            const size = positionSizer.calculatePositionSize(
                'GBPUSD',
                1.3000,
                1.2950,
                mockPortfolio
            );

            expect(size).toBe(0); // Should not allow position that would exceed leverage limit
        });

        it('should handle zero equity case', () => {
            mockPortfolio.equity = 0;

            const size = positionSizer.calculatePositionSize(
                'EURUSD',
                1.2000,
                1.1950,
                mockPortfolio
            );

            expect(size).toBe(0);
        });
    });
});
