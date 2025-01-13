import axios from 'axios';
import { MarketData as PrismaMarketData, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { openAIService } from './ai/openai.service';
import { Cache } from '../utils/cache';
import { MarketDataResponse, MarketDataPoint, NewsItem, TechnicalIndicator } from '../types-new/MarketData';

type MarketData = PrismaMarketData;
type MarketDataCreateInput = Prisma.MarketDataUncheckedCreateInput;
type MarketDataUpdateInput = Prisma.MarketDataUncheckedUpdateInput;
type MarketDataWhereInput = Prisma.MarketDataWhereInput;

interface MarketDataOptions {
  limit?: number;
  offset?: number;
  startTime?: Date;
  endTime?: Date;
}

interface MarketDataResponse {
  data: MarketDataPoint[];
  status: number;
  message?: string;
}

export class MarketDataService {
  private static instance: MarketDataService;
  private static marketApiKey: string;
  private static newsApiKey: string;
  private static cache: Cache;
  private readonly apiUrl: string;

  private constructor() {
    MarketDataService.marketApiKey = process.env.MARKET_API_KEY || '';
    MarketDataService.newsApiKey = process.env.NEWS_API_KEY || '';
    MarketDataService.cache = new Cache();
    this.apiUrl = process.env.MARKET_DATA_API || '';
    if (!this.apiUrl) {
      throw new Error('MARKET_DATA_API environment variable is not set');
    }
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private static async getCachedMarketData(key: string): Promise<any> {
    return MarketDataService.cache.get(key);
  }

  private static async updateMarketData(key: string, data: any, ttl?: number): Promise<void> {
    await MarketDataService.cache.set(key, data, ttl);
  }

  public async getMarketData(symbol: string, timeframe: number = 1440): Promise<MarketDataPoint[]> {
    try {
      const cacheKey = `marketData:${symbol}:${timeframe}`;
      
      // Try to get from cache first
      const cachedData = await MarketDataService.getCachedMarketData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API if not in cache
      const response = await axios.get<MarketDataResponse>(`${this.apiUrl}/data`, {
        params: {
          symbol,
          timeframe,
          apiKey: MarketDataService.marketApiKey
        }
      });

      const marketData = response.data.data;
      
      // Cache the data
      await MarketDataService.updateMarketData(cacheKey, marketData, 300); // Cache for 5 minutes
      
      return marketData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch market data: ${error.message}`);
      }
      throw error;
    }
  }

  public async getHistoricalData(symbol: string, options?: MarketDataOptions): Promise<MarketDataPoint[]> {
    try {
      const { limit = 1000, offset = 0, startTime, endTime } = options || {};
      
      const cacheKey = `historicalData:${symbol}:${limit}:${offset}:${startTime?.getTime()}:${endTime?.getTime()}`;
      
      // Try to get from cache first
      const cachedData = await MarketDataService.getCachedMarketData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API if not in cache
      const params = {
        symbol,
        timeframe: '1d', // Default to 1 day timeframe
        limit: limit || 100 // Default to 100 if limit is not provided
      };

      const response = await axios.get<MarketDataResponse>(`${this.apiUrl}/historical`, { params });
      const historicalData = response.data.data;
      
      // Cache the data
      await MarketDataService.updateMarketData(cacheKey, historicalData, 3600); // Cache for 1 hour
      
      return historicalData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch historical data: ${error.message}`);
      }
      throw error;
    }
  }

  public async getLatestPrice(symbol: string): Promise<MarketDataPoint> {
    try {
      const response = await axios.get<MarketDataResponse>(`${this.apiUrl}/latest`, {
        params: { symbol }
      });

      if (!response.data.data.length) {
        throw new Error('No data available for the specified symbol');
      }

      return response.data.data[0];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch latest price: ${error.message}`);
      }
      throw error;
    }
  }

  public async getMarketAnalysis(symbol: string): Promise<MarketDataResponse> {
    try {
      const response = await axios.get<MarketDataResponse>(`${this.apiUrl}/analysis`, {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch market analysis: ${error.message}`);
      }
      throw error;
    }
  }

  public async getNews(symbol: string): Promise<NewsItem[]> {
    try {
      const cacheKey = `news:${symbol}`;
      
      // Try to get from cache first
      const cachedData = await MarketDataService.getCachedMarketData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API if not in cache
      const response = await axios.get(`${process.env.NEWS_API_URL}/news`, {
        params: {
          symbol,
          apiKey: MarketDataService.newsApiKey
        }
      });

      const news = response.data.articles;
      
      // Cache the data
      await MarketDataService.updateMarketData(cacheKey, news, 1800); // Cache for 30 minutes
      
      return news;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch news: ${error.message}`);
      }
      throw error;
    }
  }

  public async getIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    try {
      const cacheKey = `indicators:${symbol}`;
      
      // Try to get from cache first
      const cachedData = await MarketDataService.getCachedMarketData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch market data first
      const marketData = await this.getMarketData(symbol);
      
      // Calculate indicators
      const indicators: TechnicalIndicator[] = [
        // Add your indicator calculations here
      ];
      
      // Cache the data
      await MarketDataService.updateMarketData(cacheKey, indicators, 300); // Cache for 5 minutes
      
      return indicators;
    } catch (error) {
      throw new Error(`Failed to calculate indicators: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async saveMarketData(data: MarketDataCreateInput): Promise<MarketData> {
    return prisma.marketData.create({
      data
    });
  }

  public async updateMarketDataById(id: string, data: MarketDataUpdateInput): Promise<MarketData> {
    return prisma.marketData.update({
      where: { id },
      data
    });
  }

  public async getMarketDataById(id: string): Promise<MarketData | null> {
    return prisma.marketData.findUnique({
      where: { id }
    });
  }

  public async deleteMarketDataById(id: string): Promise<MarketData> {
    return prisma.marketData.delete({
      where: { id }
    });
  }

  public async findMarketData(where: MarketDataWhereInput): Promise<MarketData[]> {
    return prisma.marketData.findMany({
      where
    });
  }
}
