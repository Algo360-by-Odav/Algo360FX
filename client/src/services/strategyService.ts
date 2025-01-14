import { API } from 'aws-amplify';
import type { Strategy, CreateStrategyData, UpdateStrategyData } from '../types/strategy';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyData {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface UpdateStrategyData {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
}

export const strategyService = {
  createStrategy: async (data: CreateStrategyData): Promise<Strategy> => {
    try {
      const response = await API.post('Algo360FX-API', '/strategies', {
        body: data
      });
      return response.data;
    } catch (error) {
      console.error('Create strategy error:', error);
      throw error;
    }
  },

  getStrategies: async (): Promise<Strategy[]> => {
    try {
      const response = await API.get('Algo360FX-API', '/strategies', {});
      return response.data;
    } catch (error) {
      console.error('Get strategies error:', error);
      throw error;
    }
  },

  getStrategy: async (id: string): Promise<Strategy> => {
    try {
      const response = await API.get('Algo360FX-API', `/strategies/${id}`, {});
      return response.data;
    } catch (error) {
      console.error('Get strategy error:', error);
      throw error;
    }
  },

  updateStrategy: async (id: string, data: UpdateStrategyData): Promise<Strategy> => {
    try {
      const response = await API.put('Algo360FX-API', `/strategies/${id}`, {
        body: data
      });
      return response.data;
    } catch (error) {
      console.error('Update strategy error:', error);
      throw error;
    }
  },

  deleteStrategy: async (id: string): Promise<void> => {
    try {
      await API.del('Algo360FX-API', `/strategies/${id}`, {});
    } catch (error) {
      console.error('Delete strategy error:', error);
      throw error;
    }
  }
};
