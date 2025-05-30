import CacheService from './cacheService';
import { API_BASE_URL } from '../config/constants';

interface RequestOptions extends RequestInit {
  skipCache?: boolean;
  cacheTTL?: number;
}

class ApiService {
  private static instance: ApiService;
  private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private getCacheKey(endpoint: string, options?: RequestOptions): string {
    return `${options?.method || 'GET'}-${endpoint}-${JSON.stringify(options?.body || '')}`;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipCache = false, cacheTTL = this.defaultCacheTTL, ...fetchOptions } = options;
    const cacheKey = this.getCacheKey(endpoint, fetchOptions);

    // Try cache first if not skipping
    if (!skipCache && fetchOptions.method?.toUpperCase() === 'GET') {
      const cachedData = CacheService.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      // Add default headers
      const headers = new Headers(fetchOptions.headers);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers
      });

      const data = await this.handleResponse(response);

      // Cache successful GET requests
      if (fetchOptions.method?.toUpperCase() === 'GET' && !skipCache) {
        CacheService.set(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Convenience methods
  public async get<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, data: any, options: RequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async put<T>(endpoint: string, data: any, options: RequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  public async delete<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Clear cache for specific endpoint or all cache
  public clearCache(endpoint?: string) {
    if (endpoint) {
      const cacheKey = this.getCacheKey(endpoint);
      CacheService.remove(cacheKey);
    } else {
      CacheService.clear();
    }
  }
}

export default ApiService.getInstance();
