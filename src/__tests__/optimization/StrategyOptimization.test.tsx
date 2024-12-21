import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RootStore } from '../../stores/RootStore';
import { StoreProvider } from '../../contexts/StoreContext';
import StrategyOptimizationDashboard from '../../components/algo-trading/optimization/StrategyOptimizationDashboard';
import { TradingStrategyNew, OptimizationMethod, OptimizationObjective } from '../../types/optimization';

// Mock the WebSocket
jest.mock('../../services/optimizationWebSocket', () => {
  return {
    OptimizationWebSocket: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      startOptimization: jest.fn().mockResolvedValue('test-optimization-id'),
      onProgress: jest.fn(),
      onResult: jest.fn(),
      onError: jest.fn(),
      removeHandlers: jest.fn(),
      disconnect: jest.fn(),
    })),
  };
});

describe('StrategyOptimizationDashboard', () => {
  let rootStore: RootStore;
  const mockStrategy: TradingStrategyNew = {
    id: 'test-strategy',
    name: 'Test Strategy',
    description: 'A test strategy',
    parameters: [
      {
        name: 'stopLoss',
        min: 10,
        max: 100,
        step: 5,
        current: 50,
      },
      {
        name: 'takeProfit',
        min: 20,
        max: 200,
        step: 10,
        current: 100,
      },
    ],
    method: 'genetic',
    objective: 'sharpe',
    metrics: {
      sharpeRatio: 1.5,
      sortino: 2.0,
      maxDrawdown: -0.1,
      returns: 0.2,
      winRate: 0.6,
      profitFactor: 1.8,
    },
  };

  beforeEach(() => {
    rootStore = new RootStore();
    rootStore.optimizationStore.addStrategy(mockStrategy);
  });

  it('renders without crashing', () => {
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    expect(screen.getByText('Strategy Selection')).toBeInTheDocument();
  });

  it('allows strategy selection', () => {
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    const option = screen.getByText('Test Strategy');
    fireEvent.click(option);
    
    expect(screen.getByText('Strategy Optimization')).toBeInTheDocument();
  });

  it('shows optimization form after strategy selection', async () => {
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    const option = screen.getByText('Test Strategy');
    fireEvent.click(option);
    
    expect(screen.getByText('Optimization Method')).toBeInTheDocument();
    expect(screen.getByText('Optimization Objective')).toBeInTheDocument();
  });

  it('starts optimization when form is submitted', async () => {
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    // Select strategy
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    const option = screen.getByText('Test Strategy');
    fireEvent.click(option);
    
    // Configure optimization
    const methodSelect = screen.getByLabelText('Optimization Method');
    fireEvent.mouseDown(methodSelect);
    fireEvent.click(screen.getByText('Genetic Algorithm'));
    
    const objectiveSelect = screen.getByLabelText('Optimization Objective');
    fireEvent.mouseDown(objectiveSelect);
    fireEvent.click(screen.getByText('Sharpe Ratio'));
    
    // Start optimization
    const startButton = screen.getByText('Start Optimization');
    fireEvent.click(startButton);
    
    // Check if optimization started
    await waitFor(() => {
      expect(screen.getByText('Optimization Progress')).toBeInTheDocument();
    });
  });

  it('shows error message when optimization fails', async () => {
    const error = 'Optimization failed';
    jest.spyOn(rootStore.optimizationStore, 'startOptimization').mockRejectedValue(new Error(error));
    
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    // Select strategy and start optimization
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('Test Strategy'));
    
    const startButton = screen.getByText('Start Optimization');
    fireEvent.click(startButton);
    
    // Check if error message is shown
    await waitFor(() => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  it('updates progress bar during optimization', async () => {
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    // Select strategy and start optimization
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('Test Strategy'));
    
    const startButton = screen.getByText('Start Optimization');
    fireEvent.click(startButton);
    
    // Check if progress bar is shown and updates
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    rootStore.optimizationStore.optimizationProgress = 50;
    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  it('shows results after optimization completes', async () => {
    const mockResults = {
      generations: [],
      parameterDistribution: [],
      bestParameters: {},
      finalPerformance: {
        sharpeRatio: 2.0,
        sortino: 2.5,
        maxDrawdown: -0.08,
        returns: 0.3,
        winRate: 0.65,
        profitFactor: 2.0,
      },
    };
    
    render(
      <StoreProvider rootStore={rootStore}>
        <StrategyOptimizationDashboard />
      </StoreProvider>
    );
    
    // Select strategy and complete optimization
    const select = screen.getByLabelText('Select Strategy');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText('Test Strategy'));
    
    rootStore.optimizationStore.isOptimizing = false;
    const strategy = rootStore.optimizationStore.getStrategy('test-strategy');
    if (strategy) {
      strategy.results = mockResults;
    }
    
    // Check if results are shown
    await waitFor(() => {
      expect(screen.getByText('Optimization Results')).toBeInTheDocument();
      expect(screen.getByText('2.0')).toBeInTheDocument(); // Sharpe Ratio
      expect(screen.getByText('65%')).toBeInTheDocument(); // Win Rate
    });
  });
});
