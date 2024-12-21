import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { checkRateLimit, RateLimitError } from './rateLimiter';
import { API_BASE_URL } from '../../config';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

export class ApiClient {
  private axios: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryableStatuses: [408, 429, 500, 502, 503, 504],
    };

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      async (config) => {
        // Check network connectivity
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network.');
        }

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Check rate limit before making request
        const userId = localStorage.getItem('userId') || 'anonymous';
        const endpoint = this.getEndpointFromUrl(config.url || '');
        try {
          await checkRateLimit(endpoint, userId);
        } catch (error) {
          if (error instanceof RateLimitError) {
            throw error;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const config = error.config as AxiosRequestConfig & { _retry?: number };

        // Network error handling
        if (!error.response) {
          if (!navigator.onLine) {
            // Wait for network to come back online
            await new Promise<void>((resolve) => {
              const handleOnline = () => {
                window.removeEventListener('online', handleOnline);
                resolve();
              };
              window.addEventListener('online', handleOnline);
            });
            return this.axios(config);
          }
          throw new Error('Network error. Please check your connection.');
        }

        // Check if we should retry the request
        if (
          config &&
          this.retryConfig.retryableStatuses.includes(error.response?.status) &&
          (!config._retry || config._retry < this.retryConfig.maxRetries)
        ) {
          config._retry = (config._retry || 0) + 1;

          // Exponential backoff
          const delay =
            this.retryConfig.retryDelay * Math.pow(2, config._retry - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.axios(config);
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  private getEndpointFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[1] || 'default';
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(url, config);
    return response.data;
  }

  // Upload files with progress tracking
  async upload(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
  }

  // Download files with progress tracking
  async download(
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const response = await this.axios.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
