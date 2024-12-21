import { makeAutoObservable } from 'mobx';
import { apiClient } from '../api/apiClient';
import { config } from '../../config/config';

export type SearchResultType = 'strategy' | 'portfolio' | 'documentation' | 'analysis' | 'news';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: SearchResultType;
  url: string;
  icon?: string;
  category?: string;
  timestamp?: Date;
  relevanceScore?: number;
}

export interface SearchFilter {
  types?: SearchResultType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
}

class SearchService {
  private searchHistory: string[] = [];
  private recentSearches: Set<string> = new Set();
  private readonly MAX_HISTORY_ITEMS = 10;
  loading = false;
  searchError: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadSearchHistory();
  }

  async search(
    query: string,
    filters?: SearchFilter
  ): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      this.loading = true;
      this.searchError = null;

      // Add to search history
      this.addToSearchHistory(query);

      // Fetch results from the API
      const response = await apiClient.get('/search', {
        params: {
          q: query,
          ...filters,
        },
      });

      let results = response.data.results;

      // Apply client-side filters if provided
      if (filters) {
        results = this.applyFilters(results, filters);
      }

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      this.searchError = error instanceof Error ? error.message : 'Search failed';
      return [];
    } finally {
      this.loading = false;
    }
  }

  private applyFilters(results: SearchResult[], filters: SearchFilter): SearchResult[] {
    return results.filter(result => {
      // Filter by type
      if (filters.types && !filters.types.includes(result.type)) {
        return false;
      }

      // Filter by category
      if (filters.categories && result.category && 
          !filters.categories.includes(result.category)) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange && result.timestamp) {
        const timestamp = new Date(result.timestamp);
        if (timestamp < filters.dateRange.start || timestamp > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  private loadSearchHistory() {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      this.searchHistory = JSON.parse(history);
      this.recentSearches = new Set(this.searchHistory);
    }
  }

  private addToSearchHistory(query: string) {
    if (!this.recentSearches.has(query)) {
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > this.MAX_HISTORY_ITEMS) {
        this.searchHistory.pop();
      }
      this.recentSearches = new Set(this.searchHistory);
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
  }

  getSearchHistory(): string[] {
    return this.searchHistory;
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.recentSearches.clear();
    localStorage.removeItem('searchHistory');
  }
}

export const searchService = new SearchService();
export default searchService;
