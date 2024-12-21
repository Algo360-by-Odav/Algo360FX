import { apiClient } from './apiClient';
import { SearchResult, SearchFilter } from '../search/SearchService';

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchRequest {
  query: string;
  filter?: SearchFilter;
  page?: number;
  pageSize?: number;
}

class SearchApi {
  private readonly BASE_PATH = '/api/search';

  async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await apiClient.get<SearchResponse>(this.BASE_PATH, {
        params: {
          q: request.query,
          ...request.filter,
          page: request.page || 1,
          pageSize: request.pageSize || 10,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  }

  async getStrategies(query: string): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<SearchResult[]>(`${this.BASE_PATH}/strategies`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Strategy search error:', error);
      throw error;
    }
  }

  async getPortfolios(query: string): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<SearchResult[]>(`${this.BASE_PATH}/portfolios`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Portfolio search error:', error);
      throw error;
    }
  }

  async getDocumentation(query: string): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<SearchResult[]>(`${this.BASE_PATH}/documentation`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Documentation search error:', error);
      throw error;
    }
  }

  async getAnalytics(query: string): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<SearchResult[]>(`${this.BASE_PATH}/analytics`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Analytics search error:', error);
      throw error;
    }
  }
}

export const searchApi = new SearchApi();
export default searchApi;
