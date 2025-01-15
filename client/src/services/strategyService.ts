import { post, get, put, del } from 'aws-amplify/api';
import { API_NAME, isApiResponse } from './api.js';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyData {
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
}

export interface UpdateStrategyData {
  name?: string;
  description?: string;
  type?: string;
  parameters?: Record<string, any>;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const strategyService = {
  createStrategy: async (data: CreateStrategyData): Promise<Strategy> => {
    try {
      const apiResponse = await post({
        apiName: API_NAME,
        path: '/strategies',
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Strategy>(jsonData)) {
        throw new Error('Invalid response format from create strategy API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Create strategy error:', error);
      throw error;
    }
  },

  getStrategies: async (): Promise<Strategy[]> => {
    try {
      const apiResponse = await get({
        apiName: API_NAME,
        path: '/strategies'
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Strategy[]>(jsonData)) {
        throw new Error('Invalid response format from get strategies API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Get strategies error:', error);
      throw error;
    }
  },

  getStrategy: async (id: string): Promise<Strategy> => {
    try {
      const apiResponse = await get({
        apiName: API_NAME,
        path: `/strategies/${id}`
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Strategy>(jsonData)) {
        throw new Error('Invalid response format from get strategy API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Get strategy error:', error);
      throw error;
    }
  },

  updateStrategy: async (id: string, data: UpdateStrategyData): Promise<Strategy> => {
    try {
      const apiResponse = await put({
        apiName: API_NAME,
        path: `/strategies/${id}`,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Strategy>(jsonData)) {
        throw new Error('Invalid response format from update strategy API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Update strategy error:', error);
      throw error;
    }
  },

  deleteStrategy: async (id: string): Promise<void> => {
    try {
      await del({
        apiName: API_NAME,
        path: `/strategies/${id}`
      });
    } catch (error) {
      console.error('Delete strategy error:', error);
      throw error;
    }
  }
};
