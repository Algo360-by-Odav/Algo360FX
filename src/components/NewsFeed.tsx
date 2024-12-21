import React, { useEffect, useState, useCallback } from 'react';
import NewsService from '../services/newsService';
import SearchBar from './SearchBar';
import { NewsItem } from '../types/news';
import websocketService from '../services/websocketService';
import './NewsFeed.css';
import soundManager from '../utils/sound';

interface NewsFeedProps {
  category?: string;
  symbol?: string;
  onNewsClick?: (news: NewsItem) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ category: initialCategory, symbol, onNewsClick }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const newsService = new NewsService();
        const fetchedCategories = await newsService.getCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadCategories();
  }, []);

  const fetchNews = async (currentPage: number) => {
    try {
      setLoadingMore(true);
      const newsService = new NewsService();
      const response = await newsService.fetchLatestNews({ 
        category: selectedCategory, 
        symbol,
        search: searchTerm,
        page: currentPage,
        limit: 20 
      });

      if (currentPage === 1) {
        setNews(response.data);
      } else {
        setNews(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setNews([]);
    fetchNews(1);
  }, [selectedCategory, symbol, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'all' ? undefined : category);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const handleNewsUpdate = useCallback((newsItem: NewsItem) => {
    setNews(prevNews => {
      const exists = prevNews.some(item => item.id === newsItem.id);
      if (!exists) {
        setNewItems(prev => new Set(prev).add(newsItem.id));
        if (soundEnabled) {
          soundManager.playNotification();
        }
        setTimeout(() => {
          setNewItems(prev => {
            const updated = new Set(prev);
            updated.delete(newsItem.id);
            return updated;
          });
        }, 30000);
        return [newsItem, ...prevNews];
      }
      return prevNews;
    });
  }, [soundEnabled]);

  useEffect(() => {
    const unsubscribe = websocketService.subscribeToStatus(setWsStatus);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    websocketService.connect();
    
    // Subscribe to news updates
    websocketService.subscribe('news-update', handleNewsUpdate);

    return () => {
      // Cleanup WebSocket subscription
      websocketService.unsubscribe('news-update', handleNewsUpdate);
      websocketService.disconnect();
    };
  }, [handleNewsUpdate]);

  if (loading && page === 1) return <div>Loading news...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-feed">
      <div className="news-controls">
        <SearchBar onSearch={handleSearch} />
        <select 
          value={selectedCategory || 'all'} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="news-controls-secondary">
        <div className="connection-status">
          Status: <span className={`status-${wsStatus}`}>{wsStatus}</span>
        </div>
        <button 
          className={`sound-toggle ${soundEnabled ? 'enabled' : 'disabled'}`}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            soundManager.setEnabled(!soundEnabled);
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {news.map((item) => (
        <div 
          key={item.id} 
          className={`news-item ${newItems.has(item.id) ? 'new' : ''}`}
          onClick={() => onNewsClick?.(item)}
        >
          <h3>
            {item.title}
            {newItems.has(item.id) && <span className="news-badge">New</span>}
          </h3>
          <p>{item.content}</p>
          <div className="news-meta">
            <span>{item.source}</span>
            <span>{new Date(item.timestamp).toLocaleString()}</span>
          </div>
        </div>
      ))}
      
      {hasMore && (
        <button 
          onClick={loadMore} 
          disabled={loadingMore}
          className="load-more-button"
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default NewsFeed; 