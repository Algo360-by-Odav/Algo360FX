import { post, get, put, del } from 'aws-amplify/api';
import { API_NAME, type ApiResponse, isApiResponse } from './api.js';

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

export const portfolioService = {
  createPortfolio: async (data: CreatePortfolioData): Promise<Portfolio> => {
    try {
      const apiResponse = await post({
        apiName: API_NAME,
        path: '/portfolios',
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Portfolio>(jsonData)) {
        throw new Error('Invalid response format from create portfolio API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  },

  getPortfolios: async (): Promise<Portfolio[]> => {
    try {
      const apiResponse = await get({
        apiName: API_NAME,
        path: '/portfolios'
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Portfolio[]>(jsonData)) {
        throw new Error('Invalid response format from get portfolios API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    try {
      const apiResponse = await get({
        apiName: API_NAME,
        path: `/portfolios/${id}`
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Portfolio>(jsonData)) {
        throw new Error('Invalid response format from get portfolio API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: UpdatePortfolioData): Promise<Portfolio> => {
    try {
      const apiResponse = await put({
        apiName: API_NAME,
        path: `/portfolios/${id}`,
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json() as unknown;
      if (!isApiResponse<Portfolio>(jsonData)) {
        throw new Error('Invalid response format from update portfolio API');
      }
      return jsonData.data;
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw error;
    }
  },

  deletePortfolio: async (id: string): Promise<void> => {
    try {
      await del({
        apiName: API_NAME,
        path: `/portfolios/${id}`
      });
    } catch (error) {
      console.error('Delete portfolio error:', error);
      throw error;
    }
  }
};
