import { TechnicalAnalysis } from '../services/technicalAnalysis';
import { MarketData, MarketStructure, TimeFrame } from '../types/market';

describe('TechnicalAnalysis', () => {
  let technicalAnalysis: TechnicalAnalysis;
  let mockMarketData: MarketData[];

  beforeEach(() => {
    technicalAnalysis = new TechnicalAnalysis();
    mockMarketData = [
      {
        symbol: 'EURUSD',
        timeframe: TimeFrame.H1,
        timestamp: new Date('2024-01-01T00:00:00Z'),
        open: 1.10000,
        high: 1.10100,
        low: 1.09900,
        close: 1.10050,
        volume: 1000
      },
      {
        symbol: 'EURUSD',
        timeframe: TimeFrame.H1,
        timestamp: new Date('2024-01-01T01:00:00Z'),
        open: 1.10050,
        high: 1.10150,
        low: 1.09950,
        close: 1.10100,
        volume: 1200
      },
      {
        symbol: 'EURUSD',
        timeframe: TimeFrame.H1,
        timestamp: new Date('2024-01-01T02:00:00Z'),
        open: 1.10100,
        high: 1.10200,
        low: 1.10000,
        close: 1.10150,
        volume: 1500
      }
    ] as MarketData[];

    // Mock the fetchMarketData method
    jest.spyOn(technicalAnalysis as any, 'fetchMarketData').mockResolvedValue(mockMarketData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyze', () => {
    it('should analyze market data and return market structure', async () => {
      const result = await technicalAnalysis.analyze('EURUSD', TimeFrame.H1);

      expect(result).toHaveProperty('trend');
      expect(result.trend).toHaveProperty('direction');
      expect(result.trend).toHaveProperty('strength');
      expect(result).toHaveProperty('volatility');
      expect(result).toHaveProperty('momentum');
    });

    it('should throw error when no market data is available', async () => {
      (technicalAnalysis as any).fetchMarketData.mockResolvedValue([]);

      await expect(technicalAnalysis.analyze('EURUSD', TimeFrame.H1))
        .rejects
        .toThrow('Insufficient market data for analysis');
    });
  });

  describe('calculateVWAP', () => {
    it('should calculate VWAP correctly', () => {
      const vwap = (technicalAnalysis as any).calculateVWAP(mockMarketData);
      expect(typeof vwap).toBe('number');
      expect(vwap).toBeGreaterThan(0);
    });
  });
});
