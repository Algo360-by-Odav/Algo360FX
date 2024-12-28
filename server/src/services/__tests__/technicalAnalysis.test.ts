import { TechnicalAnalysis, IndicatorType, TrendStrength, TrendDirection } from '../technicalAnalysis';
import { MarketData } from '../../types/market';
import { TimeFrame } from '../strategyService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
        open: 1.1000,
        high: 1.1100,
        low: 1.0900,
        close: 1.1050,
        volume: 1000
      },
      {
        symbol: 'EURUSD',
        timeframe: TimeFrame.H1,
        timestamp: new Date('2024-01-01T01:00:00Z'),
        open: 1.1050,
        high: 1.1150,
        low: 1.0950,
        close: 1.1100,
        volume: 1200
      },
      // Add more mock data as needed
    ];

    // Mock axios response
    mockedAxios.get.mockResolvedValue({ data: mockMarketData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyze', () => {
    it('should analyze market data with all indicators', async () => {
      const result = await technicalAnalysis.analyze(
        'EURUSD',
        TimeFrame.H1,
        [IndicatorType.SMA, IndicatorType.RSI, IndicatorType.MACD, IndicatorType.BB, IndicatorType.VWAP]
      );

      expect(result).toBeDefined();
      expect(result.price).toBeDefined();
      expect(result.indicators).toBeDefined();
      expect(result.structure).toBeDefined();
      expect(result.levels).toBeDefined();
      expect(result.volume).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(technicalAnalysis.analyze('EURUSD', TimeFrame.H1))
        .rejects
        .toThrow('Failed to fetch historical data');
    });
  });

  describe('Market Structure Analysis', () => {
    it('should detect uptrend correctly', async () => {
      // Create uptrend data
      const uptrendData = Array.from({ length: 20 }, (_, i) => ({
        symbol: 'EURUSD',
        timeframe: TimeFrame.H1,
        timestamp: new Date(Date.now() + i * 3600000),
        open: 1.1000 + i * 0.0010,
        high: 1.1100 + i * 0.0010,
        low: 1.0900 + i * 0.0010,
        close: 1.1050 + i * 0.0010,
        volume: 1000 + i * 100
      }));

      mockedAxios.get.mockResolvedValue({ data: uptrendData });

      const result = await technicalAnalysis.analyze('EURUSD', TimeFrame.H1);
      expect(result.structure.trend.direction).toBe(TrendDirection.Up);
      expect(result.structure.trend.strength).toBeGreaterThanOrEqual(TrendStrength.Strong);
    });

    it('should detect support and resistance levels', async () => {
      const result = await technicalAnalysis.analyze('EURUSD', TimeFrame.H1);
      
      expect(result.levels.support).toBeDefined();
      expect(result.levels.support.length).toBeGreaterThan(0);
      expect(result.levels.resistance).toBeDefined();
      expect(result.levels.resistance.length).toBeGreaterThan(0);

      // Check level properties
      const supportLevel = result.levels.support[0];
      expect(supportLevel.price).toBeDefined();
      expect(supportLevel.strength).toBeGreaterThan(0);
      expect(supportLevel.touches).toBeGreaterThan(0);
    });

    it('should calculate volume profile', async () => {
      const result = await technicalAnalysis.analyze('EURUSD', TimeFrame.H1);
      
      expect(result.volume.profile).toBeDefined();
      expect(result.volume.profile.length).toBeGreaterThan(0);
      expect(result.volume.vwap).toBeDefined();

      // Check volume profile properties
      const profilePoint = result.volume.profile[0];
      expect(profilePoint.price).toBeDefined();
      expect(profilePoint.volume).toBeGreaterThan(0);
      expect(profilePoint.timestamp).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty data', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      await expect(technicalAnalysis.analyze('EURUSD', TimeFrame.H1))
        .rejects
        .toThrow('No historical data available');
    });

    it('should handle missing environment variables', async () => {
      process.env.MARKET_DATA_API = '';

      await expect(technicalAnalysis.analyze('EURUSD', TimeFrame.H1))
        .rejects
        .toThrow('MARKET_DATA_API environment variable not set');
    });

    it('should handle invalid timeframes', async () => {
      await expect(technicalAnalysis.analyze('EURUSD', 'invalid' as TimeFrame))
        .rejects
        .toThrow();
    });
  });
});
