import { apiService } from './api';

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioInput {
  name: string;
  description?: string;
  initialBalance: number;
  currency: string;
}

export interface UpdatePortfolioInput {
  name?: string;
  description?: string;
  balance?: number;
}

export const portfolioService = {
  getPortfolios: async (): Promise<Portfolio[]> => {
    try {
      return await apiService.get<Portfolio[]>('/portfolios');
    } catch (error) {
      console.error('Get portfolios error:', error);
      throw error;
    }
  },

  getPortfolio: async (id: string): Promise<Portfolio> => {
    try {
      return await apiService.get<Portfolio>(`/portfolios/${id}`);
    } catch (error) {
      console.error('Get portfolio error:', error);
      throw error;
    }
  },

  createPortfolio: async (input: CreatePortfolioInput): Promise<Portfolio> => {
    try {
      return await apiService.post<Portfolio>('/portfolios', input);
    } catch (error) {
      console.error('Create portfolio error:', error);
      throw error;
    }
  },

  updatePortfolio: async (id: string, input: UpdatePortfolioInput): Promise<Portfolio> => {
    try {
      return await apiService.put<Portfolio>(`/portfolios/${id}`, input);
    } catch (error) {
      console.error('Update portfolio error:', error);
      throw error;
    }
  },

  deletePortfolio: async (id: string): Promise<void> => {
    try {
      await apiService.delete<void>(`/portfolios/${id}`);
    } catch (error) {
      console.error('Delete portfolio error:', error);
      throw error;
    }
  }
};
