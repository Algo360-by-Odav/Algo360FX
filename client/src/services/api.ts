import { post, get, put, del } from 'aws-amplify/api';
import { type ResourcesConfig } from '@aws-amplify/core';

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

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const jsonData = await response.json() as unknown;
  if (!isApiResponse<T>(jsonData)) {
    throw new Error('Invalid API response format');
  }
  if (!jsonData.success) {
    throw new Error(jsonData.message || 'API request failed');
  }
  return jsonData.data;
}

export const apiService = {
  get: async (path: string) => {
    try {
      const response = await get(API_NAME, path);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async (path: string, data: any) => {
    try {
      const response = await post(API_NAME, path, { body: data });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async (path: string, data: any) => {
    try {
      const response = await put(API_NAME, path, { body: data });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async (path: string) => {
    try {
      const response = await del(API_NAME, path);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};
