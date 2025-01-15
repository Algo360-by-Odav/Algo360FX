import { post, get, put, del } from 'aws-amplify/api';
import { type RestApiResponse } from '@aws-amplify/api/rest';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const API_NAME = 'Algo360FX-API';

export function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'success' in data &&
    typeof data.success === 'boolean'
  );
}

export async function handleApiResponse<T>(response: RestApiResponse): Promise<T> {
  const jsonData = await response.body.json() as unknown;
  if (!isApiResponse<T>(jsonData)) {
    throw new Error('Invalid API response format');
  }
  if (!jsonData.success) {
    throw new Error(jsonData.message || 'API request failed');
  }
  return jsonData.data;
}

export const apiService = {
  get: async <T>(path: string) => {
    try {
      const response = await get({
        apiName: API_NAME,
        path
      }).response;
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async <T>(path: string, data: unknown) => {
    try {
      const response = await post({
        apiName: API_NAME,
        path,
        options: {
          body: data
        }
      }).response;
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async <T>(path: string, data: unknown) => {
    try {
      const response = await put({
        apiName: API_NAME,
        path,
        options: {
          body: data
        }
      }).response;
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async <T>(path: string) => {
    try {
      const response = await del({
        apiName: API_NAME,
        path
      }).response;
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};
