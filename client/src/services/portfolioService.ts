import { get, post, put, del } from 'aws-amplify/api';

const API_NAME = 'Algo360FX-API';

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioData {
  name: string;
  description?: string;
  balance: number;
  currency: string;
}

export const portfolioService = {
  listPortfolios: async () => {
    try {
      const response = await get({
        apiName: API_NAME,
        path: '/portfolio'
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('List Portfolios Error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string) => {
    try {
      const response = await get({
        apiName: API_NAME,
        path: `/portfolio/${id}`
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Get Portfolio Error:', error);
      throw error;
    }
  },

  createPortfolio: async (data: CreatePortfolioData) => {
    try {
      const response = await post({
        apiName: API_NAME,
        path: '/portfolio',
        options: {
          body: data
        }
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Create Portfolio Error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, data: Partial<CreatePortfolioData>) => {
    try {
      const response = await put({
        apiName: API_NAME,
        path: `/portfolio/${id}`,
        options: {
          body: data
        }
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Update Portfolio Error:', error);
      throw error;
    }
  },

  deletePortfolio: async (id: string) => {
    try {
      const response = await del({
        apiName: API_NAME,
        path: `/portfolio/${id}`
      }).response;
      
      const { body } = await response;
      return JSON.parse(await body.text());
    } catch (error) {
      console.error('Delete Portfolio Error:', error);
      throw error;
    }
  }
};
