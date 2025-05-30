import { post, get, put, del } from '@aws-amplify/api';

export interface CustomApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const API_NAME = 'Algo360FX-API';

export function isApiResponse<T>(data: unknown): data is CustomApiResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'success' in data &&
    typeof data.success === 'boolean'
  );
}

export async function handleApiResponse<T>(response: any): Promise<T> {
  const jsonData = await response.response.body.json() as unknown;
  if (!isApiResponse<T>(jsonData)) {
    throw new Error('Invalid API response format');
  }
  if (!jsonData.success) {
    throw new Error(jsonData.message || 'API request failed');
  }
  return jsonData.data;
}

export const apiService = {
  get: async <T>(path: string): Promise<T> => {
    try {
      const response = await get({
        apiName: API_NAME,
        path
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async <T>(path: string, data: unknown): Promise<T> => {
    try {
      const response = await post({
        apiName: API_NAME,
        path,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async <T>(path: string, data: unknown): Promise<T> => {
    try {
      const response = await put({
        apiName: API_NAME,
        path,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async <T>(path: string): Promise<T> => {
    try {
      const response = await del({
        apiName: API_NAME,
        path
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};
