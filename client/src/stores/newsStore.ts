import { makeAutoObservable, runInAction } from 'mobx';
import { newsService } from '../services/newsService';

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

export interface NewsNotification {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
  type: 'high_impact' | 'breaking' | 'price_alert';
}

export interface PriceData {
  timestamp: string;
  price: number;
  currency: string;
}

export class NewsStore {
  news: NewsItem[] = [];
  loading = false;
  error: string | null = null;
  bookmarkedNews = new Set<string>();
  selectedFilters: string[] = [];
  notifications: NewsNotification[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  hasMorePages: boolean = true;
  prices: PriceData[] = [];
  refreshInterval: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeStore();
  }

  private initializeStore() {
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedNews');
    if (savedBookmarks) {
      this.bookmarkedNews = new Set(JSON.parse(savedBookmarks));
    }

    // Start auto-refresh
    this.startAutoRefresh();

    // Initial news fetch
    this.fetchNews(1);
  }

  private startAutoRefresh() {
    // Refresh news every 5 minutes
    this.refreshInterval = window.setInterval(() => {
      this.fetchNews(1);
    }, 5 * 60 * 1000);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setNews(news: NewsItem[]) {
    this.news = news;
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
    if (term) {
      this.searchNews(term);
    } else {
      this.fetchNews(1);
    }
  }

  toggleBookmark(newsId: string) {
    if (this.bookmarkedNews.has(newsId)) {
      this.bookmarkedNews.delete(newsId);
    } else {
      this.bookmarkedNews.add(newsId);
    }
    // Persist bookmarks to localStorage
    localStorage.setItem('bookmarkedNews', JSON.stringify(Array.from(this.bookmarkedNews)));
  }

  toggleFilter(filter: string) {
    const index = this.selectedFilters.indexOf(filter);
    if (index > -1) {
      this.selectedFilters.splice(index, 1);
    } else {
      this.selectedFilters.push(filter);
    }
  }

  async fetchNews(page: number = 1) {
    if (this.loading) return;
    
    this.setLoading(true);
    try {
      const newsItems = await newsService.getForexNews(page);
      runInAction(() => {
        if (page === 1) {
          this.news = newsItems;
        } else {
          this.news = [...this.news, ...newsItems];
        }
        this.currentPage = page;
        this.hasMorePages = newsItems.length > 0;
        this.error = null;

        // Update notifications for high impact news
        this.updateNotifications(newsItems);
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch news. Please try again later.';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async searchNews(query: string) {
    if (this.loading) return;

    this.setLoading(true);
    try {
      const results = await newsService.searchNews(query);
      runInAction(() => {
        this.news = results;
        this.hasMorePages = false;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to search news. Please try again later.';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  getFilteredNews(): NewsItem[] {
    return this.news.filter(item => {
      if (this.selectedFilters.length === 0) return true;
      return this.selectedFilters.some(filter => 
        item.categories.includes(filter) || 
        item.currencies.includes(filter)
      );
    });
  }

  getHighImpactNews(): NewsItem[] {
    return this.news.filter(item => item.impact === 'high');
  }

  getBookmarkedNews(): NewsItem[] {
    return this.news.filter(item => this.bookmarkedNews.has(item.id));
  }

  private updateNotifications(newsItems: NewsItem[]) {
    const newNotifications: NewsNotification[] = newsItems
      .filter(item => 
        item.impact === 'high' && 
        !this.notifications.some(n => n.id === item.id)
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        timestamp: item.publishedAt,
        read: false,
        type: 'high_impact'
      }));

    if (newNotifications.length > 0) {
      this.notifications = [...newNotifications, ...this.notifications];
      // Keep only last 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }
    }
  }

  markNotificationAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  dispose() {
    if (this.refreshInterval !== null) {
      clearInterval(this.refreshInterval);
    }
  }
}

export const newsStore = new NewsStore();
