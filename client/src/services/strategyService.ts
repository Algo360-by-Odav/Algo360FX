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

// Mock data
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Moving Average Crossover',
    description: 'Simple MA crossover strategy',
    parameters: {
      timeframe: 'H1',
      rules: [
        {
          id: '1',
          type: 'indicator',
          name: 'Moving Average',
          parameters: {
            Period: 20,
            Type: 'SMA',
            Price: 'Close',
          },
          enabled: true,
        },
        {
          id: '2',
          type: 'indicator',
          name: 'Moving Average',
          parameters: {
            Period: 50,
            Type: 'SMA',
            Price: 'Close',
          },
          enabled: true,
        },
        {
          id: '3',
          type: 'signal',
          name: 'MA Cross',
          parameters: {
            'Fast MA Period': 20,
            'Slow MA Period': 50,
            'MA Type': 'SMA',
          },
          enabled: true,
        },
      ],
    },
    status: 'active',
    createdAt: '2025-01-22T12:00:00Z',
    updatedAt: '2025-01-22T12:00:00Z',
  },
  {
    id: '2',
    name: 'RSI Strategy',
    description: 'RSI Overbought/Oversold strategy',
    parameters: {
      timeframe: 'H4',
      rules: [
        {
          id: '1',
          type: 'indicator',
          name: 'RSI',
          parameters: {
            Period: 14,
            Overbought: 70,
            Oversold: 30,
            Price: 'Close',
          },
          enabled: true,
        },
        {
          id: '2',
          type: 'signal',
          name: 'RSI Overbought',
          parameters: {
            'RSI Period': 14,
            Threshold: 70,
            'Confirmation Bars': 1,
          },
          enabled: true,
        },
        {
          id: '3',
          type: 'signal',
          name: 'RSI Oversold',
          parameters: {
            'RSI Period': 14,
            Threshold: 30,
            'Confirmation Bars': 1,
          },
          enabled: true,
        },
      ],
    },
    status: 'active',
    createdAt: '2025-01-22T14:00:00Z',
    updatedAt: '2025-01-22T14:00:00Z',
  },
];

// Mock API service
export const strategyService = {
  getStrategies: async (): Promise<Strategy[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStrategies;
  },

  getStrategy: async (id: string): Promise<Strategy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const strategy = mockStrategies.find(s => s.id === id);
    if (!strategy) {
      throw new Error('Strategy not found');
    }
    return strategy;
  },

  createStrategy: async (input: CreateStrategyInput): Promise<Strategy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStrategy: Strategy = {
      id: (mockStrategies.length + 1).toString(),
      name: input.name,
      description: input.description,
      parameters: input.parameters,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStrategies.push(newStrategy);
    return newStrategy;
  },

  updateStrategy: async (id: string, input: UpdateStrategyInput): Promise<Strategy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStrategies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    const updatedStrategy = {
      ...mockStrategies[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    mockStrategies[index] = updatedStrategy;
    return updatedStrategy;
  },

  deleteStrategy: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStrategies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    mockStrategies.splice(index, 1);
  },

  activateStrategy: async (id: string): Promise<Strategy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStrategies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    const updatedStrategy = {
      ...mockStrategies[index],
      status: 'active' as const,
      updatedAt: new Date().toISOString(),
    };
    mockStrategies[index] = updatedStrategy;
    return updatedStrategy;
  },

  deactivateStrategy: async (id: string): Promise<Strategy> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStrategies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Strategy not found');
    }
    const updatedStrategy = {
      ...mockStrategies[index],
      status: 'inactive' as const,
      updatedAt: new Date().toISOString(),
    };
    mockStrategies[index] = updatedStrategy;
    return updatedStrategy;
  }
};
