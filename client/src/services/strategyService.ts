import { apiService } from './api';

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyInput {
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export interface UpdateStrategyInput {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  status?: 'active' | 'inactive';
}

export const strategyService = {
  getStrategies: () => {
    return apiService.get<Strategy[]>('/strategies');
  },

  getStrategy: (id: string) => {
    return apiService.get<Strategy>(`/strategies/${id}`);
  },

  createStrategy: (input: CreateStrategyInput) => {
    return apiService.post<Strategy>('/strategies', input);
  },

  updateStrategy: (id: string, input: UpdateStrategyInput) => {
    return apiService.put<Strategy>(`/strategies/${id}`, input);
  },

  deleteStrategy: (id: string) => {
    return apiService.delete<void>(`/strategies/${id}`);
  },

  activateStrategy: (id: string) => {
    return apiService.put<Strategy>(`/strategies/${id}/activate`, {});
  },

  deactivateStrategy: (id: string) => {
    return apiService.put<Strategy>(`/strategies/${id}/deactivate`, {});
  }
};
