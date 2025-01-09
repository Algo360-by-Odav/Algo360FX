import { get, post, put, del } from 'aws-amplify/api';

const API_NAME = 'Algo360FX-API';

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyData {
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export const strategyService = {
  listStrategies: async () => {
    try {
      const response = await get({
        apiName: API_NAME,
        path: '/strategy'
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('List Strategies Error:', error);
      throw error;
    }
  },

  getStrategy: async (id: string) => {
    try {
      const response = await get({
        apiName: API_NAME,
        path: `/strategy/${id}`
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Get Strategy Error:', error);
      throw error;
    }
  },

  createStrategy: async (data: CreateStrategyData) => {
    try {
      const response = await post({
        apiName: API_NAME,
        path: '/strategy',
        options: {
          body: data
        }
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Create Strategy Error:', error);
      throw error;
    }
  },

  updateStrategy: async (id: string, data: Partial<CreateStrategyData>) => {
    try {
      const response = await put({
        apiName: API_NAME,
        path: `/strategy/${id}`,
        options: {
          body: data
        }
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Update Strategy Error:', error);
      throw error;
    }
  },

  deleteStrategy: async (id: string) => {
    try {
      const response = await del({
        apiName: API_NAME,
        path: `/strategy/${id}`
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Delete Strategy Error:', error);
      throw error;
    }
  }
};
