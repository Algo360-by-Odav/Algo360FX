import { post, get, put, del } from 'aws-amplify/api';

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
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'parameters') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      
      const response = await post({
        apiName: 'Algo360FX-API',
        path: '/strategies',
        options: {
          body: formData
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create strategy error:', error);
      throw error;
    }
  },

  getStrategies: async (): Promise<Strategy[]> => {
    try {
      const response = await get({
        apiName: 'Algo360FX-API',
        path: '/strategies'
      });
      return response.data;
    } catch (error) {
      console.error('Get strategies error:', error);
      throw error;
    }
  },

  getStrategy: async (id: string): Promise<Strategy> => {
    try {
      const response = await get({
        apiName: 'Algo360FX-API',
        path: `/strategies/${id}`
      });
      return response.data;
    } catch (error) {
      console.error('Get strategy error:', error);
      throw error;
    }
  },

  updateStrategy: async (id: string, data: UpdateStrategyData): Promise<Strategy> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'parameters') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await put({
        apiName: 'Algo360FX-API',
        path: `/strategies/${id}`,
        options: {
          body: formData
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update strategy error:', error);
      throw error;
    }
  },

  deleteStrategy: async (id: string): Promise<void> => {
    try {
      await del({
        apiName: 'Algo360FX-API',
        path: `/strategies/${id}`
      });
    } catch (error) {
      console.error('Delete strategy error:', error);
      throw error;
    }
  }
};
