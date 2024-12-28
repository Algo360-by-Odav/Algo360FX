import { TechnicalAnalysis, IndicatorType } from '../technicalAnalysis';
import { MarketData, TimeFrame, MarketStructure } from '../../types/market';

describe('TechnicalAnalysis', () => {
  let technicalAnalysis: TechnicalAnalysis;
  let mockMarketData: MarketData[];

  beforeEach(() => {
    technicalAnalysis = new TechnicalAnalysis();
    mockMarketData = [
      {
        symbol: 'EURUSD',
        timeframe: '1h' as TimeFrame,
        timestamp: new Date('2024-01-01T00:00:00Z'),
        open: 1.10000,
        high: 1.10100,
        low: 1.09900,
        close: 1.10050,
        volume: 1000
      },
      {
        symbol: 'EURUSD',
        timeframe: '1h' as TimeFrame,
        timestamp: new Date('2024-01-01T01:00:00Z'),
        open: 1.10050,
        high: 1.10150,
        low: 1.09950,
        close: 1.10100,
        volume: 1200
      },
      {
        symbol: 'EURUSD',
        timeframe: '1h' as TimeFrame,
        timestamp: new Date('2024-01-01T02:00:00Z'),
        open: 1.10100,
        high: 1.10200,
        low: 1.10000,
        close: 1.10150,
        volume: 1500
      }
    ];

    // Mock the fetchMarketData method
    jest.spyOn(technicalAnalysis as any, 'fetchMarketData').mockResolvedValue(mockMarketData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyze', () => {
    it('should analyze market data and return market structure', async () => {
      const indicators = [
        { type: IndicatorType.SMA },
        { type: IndicatorType.RSI },
        { type: IndicatorType.MACD },
        { type: IndicatorType.BB },
        { type: IndicatorType.VWAP }
      ];

      const result = await technicalAnalysis.analyze('EURUSD', '1h' as TimeFrame, indicators);

      expect(result).toHaveProperty('trend');
      expect(result.trend).toHaveProperty('direction');
      expect(result.trend).toHaveProperty('strength');
      expect(result).toHaveProperty('volatility');
      expect(result).toHaveProperty('momentum');
    });

    it('should throw error when no market data is available', async () => {
      (technicalAnalysis as any).fetchMarketData.mockResolvedValue([]);

      await expect(technicalAnalysis.analyze('EURUSD', '1h' as TimeFrame))
        .rejects
        .toThrow('Insufficient market data for analysis');
    });

    it('should handle API errors gracefully', async () => {
      (technicalAnalysis as any).fetchMarketData.mockRejectedValue(new Error('API Error'));

      await expect(technicalAnalysis.analyze('EURUSD', '1h' as TimeFrame))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('calculateVolatility', () => {
    it('should calculate volatility correctly', () => {
      const volatility = (technicalAnalysis as any).calculateVolatility(mockMarketData);
      expect(typeof volatility).toBe('number');
      expect(volatility).toBeGreaterThan(0);
    });

    it('should return 0 for single data point', () => {
      const singleData = [mockMarketData[0]];
      const volatility = (technicalAnalysis as any).calculateVolatility(singleData);
      expect(volatility).toBe(0);
    });
  });

  describe('analyzeTrend', () => {
    it('should detect uptrend', () => {
      const trend = (technicalAnalysis as any).analyzeTrend(mockMarketData);
      expect(trend.direction).toBe('up');
      expect(trend.strength).toBeGreaterThan(0);
    });

    it('should detect downtrend', () => {
      const downtrendData = mockMarketData.map(data => ({
        ...data,
        close: data.close - 0.001
      })).reverse();
      
      const trend = (technicalAnalysis as any).analyzeTrend(downtrendData);
      expect(trend.direction).toBe('down');
      expect(trend.strength).toBeGreaterThan(0);
    });

    it('should detect sideways trend', () => {
      const sidewaysData = mockMarketData.map(data => ({
        ...data,
        close: 1.10000
      }));
      
      const trend = (technicalAnalysis as any).analyzeTrend(sidewaysData);
      expect(trend.direction).toBe('sideways');
      expect(trend.strength).toBeGreaterThan(0);
    });
  });

  describe('calculateMomentum', () => {
    it('should calculate momentum correctly', () => {
      const momentum = (technicalAnalysis as any).calculateMomentum(mockMarketData);
      expect(momentum).toEqual({
        value: expect.any(Number),
        timestamp: mockMarketData[mockMarketData.length - 1].timestamp
      });
    });

    it('should handle single data point', () => {
      const singleData = [mockMarketData[0]];
      const momentum = (technicalAnalysis as any).calculateMomentum(singleData);
      expect(momentum).toEqual({
        value: 0,
        timestamp: singleData[0].timestamp
      });
    });
  });
});
