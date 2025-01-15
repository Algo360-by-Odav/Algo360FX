import { post, get, put, del } from 'aws-amplify/api';
import { type Operation } from '@aws-amplify/api/internals';

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

export async function handleApiResponse<T>(operation: Operation<any>): Promise<T> {
  const response = await operation.response;
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
      const operation = get({
        apiName: API_NAME,
        path
      });
      return handleApiResponse<T>(operation);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async <T>(path: string, data: unknown) => {
    try {
      const operation = post({
        apiName: API_NAME,
        path,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
      return handleApiResponse<T>(operation);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async <T>(path: string, data: unknown) => {
    try {
      const operation = put({
        apiName: API_NAME,
        path,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
      return handleApiResponse<T>(operation);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async <T>(path: string) => {
    try {
      const operation = del({
        apiName: API_NAME,
        path
      });
      return handleApiResponse<T>(operation);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};
