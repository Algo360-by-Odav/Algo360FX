import { post, get, put, del } from 'aws-amplify/api';

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioData {
  name: string;
  description: string;
  balance: number;
  currency: string;
}

export interface UpdatePortfolioData {
  name?: string;
  description?: string;
  balance?: number;
  currency?: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const portfolioService = {
  createPortfolio: async (data: CreatePortfolioData): Promise<Portfolio> => {
    try {
      const apiResponse = await post({
        apiName: 'Algo360FX-API',
        path: '/portfolios',
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as ApiResponse<Portfolio>;
      return result.data;
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  },

  getPortfolios: async (): Promise<Portfolio[]> => {
    try {
      const apiResponse = await get({
        apiName: 'Algo360FX-API',
        path: '/portfolios'
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as ApiResponse<Portfolio[]>;
      return result.data;
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    try {
      const apiResponse = await get({
        apiName: 'Algo360FX-API',
        path: `/portfolios/${id}`
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as ApiResponse<Portfolio>;
      return result.data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: UpdatePortfolioData): Promise<Portfolio> => {
    try {
      const apiResponse = await put({
        apiName: 'Algo360FX-API',
        path: `/portfolios/${id}`,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as ApiResponse<Portfolio>;
      return result.data;
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw error;
    }
  },

  deletePortfolio: async (id: string): Promise<void> => {
    try {
      await del({
        apiName: 'Algo360FX-API',
        path: `/portfolios/${id}`
      });
    } catch (error) {
      console.error('Delete portfolio error:', error);
      throw error;
    }
  }
};
