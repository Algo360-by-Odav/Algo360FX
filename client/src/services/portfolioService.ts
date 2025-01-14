import { API } from 'aws-amplify';
import type { Portfolio, CreatePortfolioData, UpdatePortfolioData } from '../types/portfolio';

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
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      
      const response = await API.post('Algo360FX-API', '/portfolios', {
        body: formData
      });
      return response.data;
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  },

  getPortfolios: async (): Promise<Portfolio[]> => {
    try {
      const response = await API.get('Algo360FX-API', '/portfolios', {});
      return response.data;
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    try {
      const response = await API.get('Algo360FX-API', `/portfolios/${id}`, {});
      return response.data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: UpdatePortfolioData): Promise<Portfolio> => {
    try {
      const response = await API.put('Algo360FX-API', `/portfolios/${id}`, {
        body: data
      });
      return response.data;
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw error;
    }
  },

  deletePortfolio: async (id: string): Promise<void> => {
    try {
      await API.del('Algo360FX-API', `/portfolios/${id}`, {});
    } catch (error) {
      console.error('Delete portfolio error:', error);
      throw error;
    }
  }
};
