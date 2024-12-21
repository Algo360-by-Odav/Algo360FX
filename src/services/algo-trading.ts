import { api } from './api';
import WebSocketService from './websocket';
import TradingService from './trading';
import {
  TradingStrategy,
  Signal,
  BacktestParams,
  BacktestResult,
  SignalType,
  IndicatorType,
  IndicatorParams,
} from '../types/algo-trading';

class AlgoTradingService {
  private static instance: AlgoTradingService;
  private ws = WebSocketService;
  private tradingService = TradingService;

  private constructor() {
    this.setupWebSocketListeners();
  }

  public static getInstance(): AlgoTradingService {
    if (!AlgoTradingService.instance) {
      AlgoTradingService.instance = new AlgoTradingService();
    }
    return AlgoTradingService.instance;
  }

  private setupWebSocketListeners() {
    const socket = this.ws.getSocket();
    if (!socket) return;

    socket.on('strategy_signal', (signal: Signal) => {
      this.handleStrategySignal(signal);
    });

    socket.on('strategy_status', (update: { id: string; status: string }) => {
      document.dispatchEvent(
        new CustomEvent('strategyStatusUpdate', { detail: update })
      );
    });
  }

  private async handleStrategySignal(signal: Signal) {
    try {
      // Get strategy details
      const strategy = await this.getStrategy(signal.strategyId);
      if (!strategy || strategy.status !== 'ACTIVE') return;

      // Calculate position size based on risk management
      const positionSize = this.calculatePositionSize(strategy, signal);

      // Execute trade based on signal
      switch (signal.type) {
        case SignalType.BUY:
          await this.tradingService.placeMarketOrder(
            signal.symbol,
            'BUY',
            positionSize
          );
          break;
        case SignalType.SELL:
          await this.tradingService.placeMarketOrder(
            signal.symbol,
            'SELL',
            positionSize
          );
          break;
      }

      // Emit signal event
      document.dispatchEvent(new CustomEvent('strategySignal', { detail: signal }));
    } catch (error) {
      console.error('Error handling strategy signal:', error);
    }
  }

  private calculatePositionSize(strategy: TradingStrategy, signal: Signal): number {
    const { maxPositionSize } = strategy.riskManagement;
    // Adjust position size based on confidence and risk parameters
    return maxPositionSize * (signal.confidence || 1);
  }

  // Strategy Management
  public async createStrategy(strategy: Omit<TradingStrategy, 'id'>): Promise<TradingStrategy> {
    try {
      const response = await api.post('/algo-trading/strategies', strategy);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateStrategy(id: string, updates: Partial<TradingStrategy>): Promise<TradingStrategy> {
    try {
      const response = await api.put(`/algo-trading/strategies/${id}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getStrategy(id: string): Promise<TradingStrategy> {
    try {
      const response = await api.get(`/algo-trading/strategies/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getStrategies(): Promise<TradingStrategy[]> {
    try {
      const response = await api.get('/algo-trading/strategies');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async deleteStrategy(id: string): Promise<boolean> {
    try {
      await api.delete(`/algo-trading/strategies/${id}`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Strategy Control
  public async startStrategy(id: string): Promise<boolean> {
    try {
      await api.post(`/algo-trading/strategies/${id}/start`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async stopStrategy(id: string): Promise<boolean> {
    try {
      await api.post(`/algo-trading/strategies/${id}/stop`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async pauseStrategy(id: string): Promise<boolean> {
    try {
      await api.post(`/algo-trading/strategies/${id}/pause`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Backtesting
  public async runBacktest(
    strategyId: string,
    params: BacktestParams
  ): Promise<BacktestResult> {
    try {
      const response = await api.post(
        `/algo-trading/strategies/${strategyId}/backtest`,
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Technical Indicators
  public async calculateIndicator(
    symbol: string,
    type: IndicatorType,
    params: IndicatorParams
  ): Promise<number[]> {
    try {
      const response = await api.post('/algo-trading/indicators/calculate', {
        symbol,
        type,
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Strategy Templates
  public async getStrategyTemplates(): Promise<Partial<TradingStrategy>[]> {
    try {
      const response = await api.get('/algo-trading/strategies/templates');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Performance Analytics
  public async getStrategyPerformance(
    id: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await api.get(
        `/algo-trading/strategies/${id}/performance?${params}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    const message =
      error.response?.data?.message || error.message || 'Algo trading operation failed';
    return new Error(message);
  }
}

export default AlgoTradingService.getInstance();
