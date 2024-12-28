import axios from 'axios';
import { config } from '../config/config';

interface MarketDataResponse {
  price: number;
  volume: number;
  timestamp: string;
}

interface MarketSentimentResponse {
  sentiment: string;
  socialSentiment: string;
  newsSentiment: string;
  technicalSentiment: string;
  institutionalSentiment: string;
}

interface SentimentResult {
  overall: string;
  social: string;
  news: string;
  technical: string;
  institutional: string;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

interface NewsApiResponse {
  articles: NewsArticle[];
}

interface EconomicCalendarEvent {
  date: string;
  time: string;
  currency: string;
  impact: 'low' | 'medium' | 'high';
  event: string;
  actual?: number;
  forecast?: number;
  previous?: number;
}

interface CorrelationData {
  symbol: string;
  correlations: Array<{
    symbol: string;
    correlation: number;
    timeframe: string;
  }>;
  timeframe: string;
  sampleSize: number;
}

interface VolatilityAnalysis {
  current: number;
  historical: Array<{
    timestamp: string;
    value: number;
  }>;
  forecast: number;
  percentile: number;
}

export class MarketData {
  private newsApiKey = config.env.NEWS_API_KEY;
  private marketApiKey = config.env.MARKET_API_KEY;
  private marketApiUrl = config.env.MARKET_API;

  public async getData(symbol: string, timeframe: string): Promise<MarketDataResponse> {
    try {
      const response = await axios.get<MarketDataResponse>(`${this.marketApiUrl}/data`, {
        params: {
          symbol,
          timeframe,
          apiKey: this.marketApiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {
        price: 0,
        volume: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async getSentiment(symbol: string): Promise<SentimentResult> {
    try {
      const response = await axios.get<MarketSentimentResponse>(`${this.marketApiUrl}/sentiment`, {
        params: { 
          symbol,
          apiKey: this.marketApiKey
        }
      });

      return {
        overall: response.data.sentiment,
        social: response.data.socialSentiment,
        news: response.data.newsSentiment,
        technical: response.data.technicalSentiment,
        institutional: response.data.institutionalSentiment,
      };
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      return {
        overall: 'neutral',
        social: 'neutral',
        news: 'neutral',
        technical: 'neutral',
        institutional: 'neutral',
      };
    }
  }

  public async getRelevantNews(symbol: string): Promise<Pick<NewsArticle, 'title' | 'description' | 'url' | 'source' | 'publishedAt'>[]> {
    try {
      const response = await axios.get<NewsApiResponse>('https://newsapi.org/v2/everything', {
        params: {
          q: symbol,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: 10,
          apiKey: this.newsApiKey
        }
      });

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  public async getMarketData(symbol: string, timeframe: string): Promise<MarketDataResponse> {
    try {
      const response = await axios.get<MarketDataResponse>(`${this.marketApiUrl}/data`, {
        params: {
          symbol,
          timeframe,
          apiKey: this.marketApiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  public async getEconomicCalendar(): Promise<EconomicCalendarEvent[]> {
    try {
      const response = await axios.get(`${this.marketApiUrl}/calendar`, {
        params: {
          apiKey: this.marketApiKey
        }
      });

      return response.data.events;
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      return [];
    }
  }

  public async getMarketCorrelations(symbol: string): Promise<CorrelationData> {
    try {
      const response = await axios.get(`${this.marketApiUrl}/correlations`, {
        params: {
          symbol,
          apiKey: this.marketApiKey
        }
      });

      const correlationSymbol = response.data.symbol;
      const correlationResults = response.data.correlations;
      const timeframe = response.data.timeframe;
      const marketData = response.data.marketData;

      return {
        symbol: correlationSymbol,
        correlations: correlationResults,
        timeframe,
        sampleSize: marketData.length
      };
    } catch (error) {
      console.error('Error fetching correlations:', error);
      return {
        symbol: '',
        correlations: [],
        timeframe: '',
        sampleSize: 0
      };
    }
  }

  public async getVolatilityAnalysis(symbol: string): Promise<VolatilityAnalysis> {
    try {
      const response = await axios.get(`${this.marketApiUrl}/volatility`, {
        params: {
          symbol,
          apiKey: this.marketApiKey
        }
      });

      return {
        current: response.data.currentVolatility,
        historical: response.data.historicalVolatility,
        forecast: response.data.volatilityForecast,
        percentile: response.data.volatilityPercentile,
      };
    } catch (error) {
      console.error('Error fetching volatility analysis:', error);
      return {
        current: 0,
        historical: [],
        forecast: 0,
        percentile: 0,
      };
    }
  }
}
