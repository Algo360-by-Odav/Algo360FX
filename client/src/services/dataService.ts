import { apiService } from './api';

export interface HistoricalData {
  symbol: string;
  interval: string;
  data: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjustedClose?: number;
  }[];
}

export interface FundamentalData {
  symbol: string;
  company: {
    name: string;
    description: string;
    sector: string;
    industry: string;
    employees: number;
    website: string;
  };
  financials: {
    income: any;
    balance: any;
    cashflow: any;
    ratios: any;
  };
  valuation: {
    marketCap: number;
    enterpriseValue: number;
    peRatio: number;
    pbRatio: number;
    dividendYield: number;
  };
  analysts: {
    targetPrice: number;
    recommendations: {
      buy: number;
      hold: number;
      sell: number;
    };
    priceTargets: {
      low: number;
      average: number;
      high: number;
    };
  };
}

export interface AlternativeData {
  symbol: string;
  sentiment: {
    social: {
      twitter: number;
      reddit: number;
      stocktwits: number;
    };
    news: {
      score: number;
      articles: number;
      impact: number;
    };
  };
  websiteMetrics: {
    traffic: number;
    engagement: number;
    conversion: number;
  };
  satelliteData?: {
    retail: {
      footTraffic: number;
      parkingLot: number;
    };
    industrial: {
      inventory: number;
      shipping: number;
    };
  };
}

class DataService {
  private static instance: DataService;
  private readonly baseUrl = '/data';

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Historical Data
  async getHistoricalData(
    symbol: string,
    interval: string,
    start: string,
    end: string
  ): Promise<HistoricalData> {
    try {
      return await apiService.get(`${this.baseUrl}/historical/${symbol}`, {
        params: { interval, start, end }
      });
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      throw error;
    }
  }

  async getIntradayData(
    symbol: string,
    interval: '1min' | '5min' | '15min' | '30min' | '1hour'
  ): Promise<HistoricalData> {
    try {
      return await apiService.get(`${this.baseUrl}/intraday/${symbol}`, {
        params: { interval }
      });
    } catch (error) {
      console.error('Failed to fetch intraday data:', error);
      throw error;
    }
  }

  // Fundamental Data
  async getFundamentalData(symbol: string): Promise<FundamentalData> {
    try {
      return await apiService.get(`${this.baseUrl}/fundamental/${symbol}`);
    } catch (error) {
      console.error('Failed to fetch fundamental data:', error);
      throw error;
    }
  }

  async getFinancialStatements(
    symbol: string,
    type: 'income' | 'balance' | 'cashflow',
    period: 'annual' | 'quarterly'
  ): Promise<any> {
    try {
      return await apiService.get(`${this.baseUrl}/financials/${symbol}`, {
        params: { type, period }
      });
    } catch (error) {
      console.error('Failed to fetch financial statements:', error);
      throw error;
    }
  }

  // Alternative Data
  async getAlternativeData(symbol: string): Promise<AlternativeData> {
    try {
      return await apiService.get(`${this.baseUrl}/alternative/${symbol}`);
    } catch (error) {
      console.error('Failed to fetch alternative data:', error);
      throw error;
    }
  }

  async getSentimentData(
    symbol: string,
    source: 'social' | 'news' | 'all'
  ): Promise<any> {
    try {
      return await apiService.get(`${this.baseUrl}/sentiment/${symbol}`, {
        params: { source }
      });
    } catch (error) {
      console.error('Failed to fetch sentiment data:', error);
      throw error;
    }
  }

  // Custom Data Feeds
  async subscribeToCustomFeed(feed: {
    name: string;
    symbols: string[];
    interval: string;
    indicators: string[];
  }): Promise<{ feedId: string }> {
    try {
      return await apiService.post(`${this.baseUrl}/feeds/subscribe`, feed);
    } catch (error) {
      console.error('Failed to subscribe to custom feed:', error);
      throw error;
    }
  }

  async unsubscribeFromFeed(feedId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/feeds/unsubscribe`, { feedId });
    } catch (error) {
      console.error('Failed to unsubscribe from feed:', error);
      throw error;
    }
  }

  // Data Export
  async exportData(request: {
    symbols: string[];
    dataTypes: string[];
    format: 'csv' | 'json' | 'excel';
    dateRange?: { start: string; end: string };
  }): Promise<{ url: string }> {
    try {
      return await apiService.post(`${this.baseUrl}/export`, request);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }
}

export const dataService = DataService.getInstance();
