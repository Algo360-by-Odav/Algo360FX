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

export const portfolioService = {
  createPortfolio: async (data: CreatePortfolioData): Promise<Portfolio> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      const response = await post({
        apiName: 'Algo360FX-API',
        path: '/portfolios',
        options: {
          body: formData
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  },

  getPortfolios: async (): Promise<Portfolio[]> => {
    try {
      const response = await get({
        apiName: 'Algo360FX-API',
        path: '/portfolios'
      });
      return response.data;
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    try {
      const response = await get({
        apiName: 'Algo360FX-API',
        path: `/portfolios/${id}`
      });
      return response.data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: UpdatePortfolioData): Promise<Portfolio> => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await put({
        apiName: 'Algo360FX-API',
        path: `/portfolios/${id}`,
        options: {
          body: formData
        }
      });
      return response.data;
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
