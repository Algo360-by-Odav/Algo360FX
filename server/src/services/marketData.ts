import axios from 'axios';
import { config } from '../config/config';

export class MarketData {
  private newsApiKey = config.env.NEWS_API_KEY;
  private marketApiKey = config.env.MARKET_API_KEY;
  private marketApiUrl = config.env.MARKET_API;

  public async getData(symbol: string, timeframe: string) {
    try {
      const response = await axios.get(`${this.marketApiUrl}/data`, {
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

  public async getSentiment(symbol: string) {
    try {
      // Replace with your actual market sentiment API
      const response = await axios.get(`${this.marketApiUrl}/sentiment`, {
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

  public async getRelevantNews(symbol: string) {
    try {
      // Using NewsAPI for market news
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: symbol,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: 10,
          apiKey: this.newsApiKey
        }
      });

      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  public async getMarketData(symbol: string, timeframe: string) {
    try {
      // Replace with your actual market data provider
      const response = await axios.get(`${this.marketApiUrl}/data`, {
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

  public async getEconomicCalendar() {
    try {
      // Replace with your economic calendar API
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

  public async getMarketCorrelations(symbol: string) {
    try {
      // Replace with your correlation data API
      const response = await axios.get(`${this.marketApiUrl}/correlations`, {
        params: {
          symbol,
          apiKey: this.marketApiKey
        }
      });

      return response.data.correlations;
    } catch (error) {
      console.error('Error fetching correlations:', error);
      return {};
    }
  }

  public async getVolatilityAnalysis(symbol: string) {
    try {
      // Replace with your volatility analysis API
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