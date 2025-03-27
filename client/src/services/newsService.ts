import axios, { AxiosError } from 'axios';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  categories: string[];
  currencies: string[];
  location?: string;
}

const generateMockNews = (): NewsItem[] => {
  const mockNews: NewsItem[] = [];
  const baseNews = [
    {
      title: 'Fed Signals Potential Rate Cuts in 2024',
      description: 'The Federal Reserve indicated it may cut interest rates three times in 2024 as inflation continues to cool.',
      source: 'Financial Times',
      sentiment: 'positive',
      impact: 'high',
      categories: ['monetary policy', 'central banks'],
      currencies: ['USD', 'EUR'],
      location: 'United States'
    },
    {
      title: 'ECB Maintains Hawkish Stance on Inflation',
      description: 'European Central Bank President Christine Lagarde maintains a hawkish tone despite market expectations for rate cuts.',
      source: 'Reuters',
      sentiment: 'negative',
      impact: 'medium',
      categories: ['monetary policy', 'central banks'],
      currencies: ['EUR', 'GBP'],
      location: 'European Union'
    },
    {
      title: 'Bank of Japan Hints at Policy Shift',
      description: 'The Bank of Japan suggests it may move away from negative interest rates as inflation picks up.',
      source: 'Bloomberg',
      sentiment: 'neutral',
      impact: 'high',
      categories: ['monetary policy', 'central banks'],
      currencies: ['JPY', 'USD'],
      location: 'Japan'
    },
    {
      title: 'Swiss Franc Strengthens Amid Global Uncertainty',
      description: 'Safe-haven flows boost the Swiss Franc as global economic concerns persist.',
      source: 'Reuters',
      sentiment: 'positive',
      impact: 'medium',
      categories: ['market sentiment', 'safe havens'],
      currencies: ['CHF', 'USD'],
      location: 'Switzerland'
    },
    {
      title: 'Australian Dollar Weakens on China Data',
      description: 'The AUD falls as Chinese economic indicators show slower growth than expected.',
      source: 'Bloomberg',
      sentiment: 'negative',
      impact: 'medium',
      categories: ['economic data', 'commodities'],
      currencies: ['AUD', 'USD'],
      location: 'Australia'
    }
  ];

  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    baseNews.forEach((news, index) => {
      mockNews.push({
        id: `${i}-${index}`,
        title: news.title,
        description: news.description,
        source: news.source,
        url: `https://example.com/news/${i}-${index}`,
        imageUrl: null,
        publishedAt: date.toISOString(),
        sentiment: news.sentiment as 'positive' | 'negative' | 'neutral',
        impact: news.impact as 'high' | 'medium' | 'low',
        categories: news.categories,
        currencies: news.currencies,
        location: news.location
      });
    });
  }

  return mockNews;
};

const MOCK_NEWS = generateMockNews();

class NewsService {
  private apiKey: string | undefined;
  private baseUrl: string;
  private mockNewsIndex = 0;

  constructor() {
    this.apiKey = import.meta.env.VITE_MARKETAUX_API_KEY;
    this.baseUrl = import.meta.env.VITE_API_GATEWAY_URL ? 
      `${import.meta.env.VITE_API_GATEWAY_URL}/news` : 
      '/api/news';
  }

  async getForexNews(page: number = 1, limit: number = 10): Promise<NewsItem[]> {
    try {
      if (!this.apiKey || import.meta.env.MODE === 'development') {
        console.log('Using mock data for news');
        const start = (page - 1) * limit;
        return MOCK_NEWS.slice(start, start + limit);
      }

      const response = await axios.get(`${this.baseUrl}/forex`, {
        params: {
          page,
          limit,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Invalid response format from news API, using mock data');
        const start = (page - 1) * limit;
        return MOCK_NEWS.slice(start, start + limit);
      }

      return response.data.data.map((item: any) => ({
        id: item.uuid || item.id,
        title: item.title,
        description: item.description,
        source: item.source,
        url: item.url,
        imageUrl: item.image_url || item.imageUrl,
        publishedAt: item.published_at || item.publishedAt,
        sentiment: this.analyzeSentiment(item),
        impact: this.determineImpact(item),
        categories: this.extractCategories(item),
        currencies: this.extractCurrencies(item),
        location: item.country || item.location
      }));
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? `Error fetching news: ${error.message}`
        : 'Error fetching news';
      console.error(errorMessage, error);
      
      // Return mock data as fallback
      const start = (page - 1) * limit;
      return MOCK_NEWS.slice(start, start + limit);
    }
  }

  async searchNews(query: string): Promise<NewsItem[]> {
    try {
      if (!this.apiKey || import.meta.env.MODE === 'development') {
        return MOCK_NEWS.filter(news => 
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          query,
          limit: 10,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Invalid response format from news search API, using mock data');
        return MOCK_NEWS.filter(news => 
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.description.toLowerCase().includes(query.toLowerCase())
        );
      }

      return response.data.data.map((item: any) => ({
        id: item.uuid || item.id,
        title: item.title,
        description: item.description,
        source: item.source,
        url: item.url,
        imageUrl: item.image_url || item.imageUrl,
        publishedAt: item.published_at || item.publishedAt,
        sentiment: this.analyzeSentiment(item),
        impact: this.determineImpact(item),
        categories: this.extractCategories(item),
        currencies: this.extractCurrencies(item),
        location: item.country || item.location
      }));
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? `Error searching news: ${error.message}`
        : 'Error searching news';
      console.error(errorMessage, error);
      
      // Return filtered mock data as fallback
      return MOCK_NEWS.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  private analyzeSentiment(item: any): 'positive' | 'negative' | 'neutral' {
    if (item.sentiment) {
      const score = parseFloat(item.sentiment);
      if (score > 0.2) return 'positive';
      if (score < -0.2) return 'negative';
      return 'neutral';
    }
    return item.sentiment || 'neutral';
  }

  private determineImpact(item: any): 'high' | 'medium' | 'low' {
    if (item.relevance_score) {
      const score = parseFloat(item.relevance_score);
      if (score > 80) return 'high';
      if (score > 50) return 'medium';
      return 'low';
    }
    return item.impact || 'medium';
  }

  private extractCategories(item: any): string[] {
    if (item.entities) {
      return item.entities
        .filter((entity: any) => entity.type === 'topic')
        .map((entity: any) => entity.name);
    }
    return item.categories || ['forex'];
  }

  private extractCurrencies(item: any): string[] {
    if (item.entities) {
      return item.entities
        .filter((entity: any) => entity.type === 'currency')
        .map((entity: any) => entity.name);
    }
    return item.currencies || ['USD'];
  }
}

export const newsService = new NewsService();
