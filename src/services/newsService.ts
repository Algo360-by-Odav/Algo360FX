import News, { INews } from '../models/News';
import { NewsItem } from '../types/news';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

class NewsService {
  async fetchLatestNews(filters: {
    category?: string;
    symbol?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<NewsItem>> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const skip = (page - 1) * limit;
      
      const query: Record<string, any> = {};

      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { content: { $regex: filters.search, $options: 'i' } }
        ];
      }

      if (filters.category) {
        query.categories = filters.category;
      }

      if (filters.symbol) {
        query.relatedSymbols = filters.symbol;
      }

      if (filters.startDate || filters.endDate) {
        query.publishedAt = {};
        if (filters.startDate) {
          query.publishedAt.$gte = filters.startDate;
        }
        if (filters.endDate) {
          query.publishedAt.$lte = filters.endDate;
        }
      }

      const [news, total] = await Promise.all([
        News.find(query)
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        News.countDocuments(query)
      ]);

      return {
        data: news.map(this.mapNewsItemFromDB),
        total,
        page,
        limit,
        hasMore: total > skip + news.length
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  }

  async getBreakingNews(): Promise<NewsItem[]> {
    try {
      const breakingNews = await News.find()
        .sort({ publishedAt: -1 })
        .limit(10)
        .lean();

      return breakingNews.map(this.mapNewsItemFromDB);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      throw new Error('Failed to fetch breaking news');
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await News.distinct('categories');
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  private mapNewsItemFromDB(dbNews: INews): NewsItem {
    return {
      id: dbNews._id.toString(),
      title: dbNews.title,
      content: dbNews.content,
      source: dbNews.source,
      timestamp: dbNews.publishedAt,
      category: dbNews.categories,
      relatedSymbols: dbNews.relatedSymbols,
      sentiment: dbNews.sentiment
    };
  }
}

export default NewsService;