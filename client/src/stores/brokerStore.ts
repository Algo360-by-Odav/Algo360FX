import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import {
  BrokerConnection,
  BrokerConfig,
  BrokerMetrics,
  Order,
  Position,
  AccountInfo,
  MarketData,
  BrokerEvent
} from '../services/brokers/types';
import { BrokerFactory } from '../services/brokers/BrokerFactory';
import { ExecutionAnalysis, ExecutionMetrics } from '../services/analysis/ExecutionAnalysis';
import { HistoricalDataService } from '../services/analysis/HistoricalDataService';
import { MLExecutionAnalysis } from '../services/analysis/MLExecutionAnalysis';

export class BrokerStore {
  rootStore: RootStore;
  brokerConnections: Map<string, BrokerConnection> = new Map();
  brokerConfigs: Map<string, BrokerConfig> = new Map();
  executionMetrics: Map<string, BrokerMetrics> = new Map();
  positions: Map<string, Position[]> = new Map();
  orders: Map<string, Order[]> = new Map();
  accountInfo: Map<string, AccountInfo> = new Map();
  marketData: Map<string, MarketData> = new Map();
  executionAnalysis: Map<string, ExecutionAnalysis> = new Map();
  historicalData: Map<string, HistoricalDataService> = new Map();
  mlAnalysis: Map<string, MLExecutionAnalysis> = new Map();
  isLoading: boolean = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async addBroker(config: BrokerConfig) {
    try {
      this.isLoading = true;
      const broker = await BrokerFactory.createBroker(config);
      
      runInAction(() => {
        this.brokerConnections.set(config.apiKey, broker);
        this.brokerConfigs.set(config.apiKey, config);
      });

      await this.initializeBrokerData(config.apiKey);
      this.setupBrokerEventListeners(broker, config.apiKey);

    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to add broker';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async disconnectBroker(apiKey: string) {
    const broker = this.brokerConnections.get(apiKey);
    if (broker) {
      await broker.disconnect();
      this.brokerConnections.delete(apiKey);
    }
  }

  async deleteBroker(apiKey: string) {
    try {
      this.isLoading = true;
      await this.disconnectBroker(apiKey);
      
      runInAction(() => {
        this.brokerConfigs.delete(apiKey);
        this.executionMetrics.delete(apiKey);
        this.positions.delete(apiKey);
        this.orders.delete(apiKey);
        this.accountInfo.delete(apiKey);
        this.marketData.delete(apiKey);
      });

    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to delete broker';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  private setupBrokerEventListeners(broker: BrokerConnection, apiKey: string) {
    broker.on('connected', () => {
      console.log(`Broker ${apiKey} connected`);
    });

    broker.on('disconnected', () => {
      console.log(`Broker ${apiKey} disconnected`);
    });

    broker.on('error', (error: Error) => {
      console.error(`Broker ${apiKey} error:`, error);
      this.error = error.message;
    });

    broker.on('order', (order: Order) => {
      const orders = this.orders.get(apiKey) || [];
      const index = orders.findIndex(o => o.id === order.id);
      if (index >= 0) {
        orders[index] = order;
      } else {
        orders.push(order);
      }
      this.orders.set(apiKey, orders);
    });

    broker.on('position', (position: Position) => {
      const positions = this.positions.get(apiKey) || [];
      const index = positions.findIndex(p => p.symbol === position.symbol);
      if (index >= 0) {
        positions[index] = position;
      } else {
        positions.push(position);
      }
      this.positions.set(apiKey, positions);
    });

    broker.on('marketData', (data: MarketData) => {
      this.marketData.set(apiKey, data);
    });

    broker.on('execution', (execution: BrokerEvent['execution']) => {
      this.updateExecutionMetrics(apiKey, execution);
    });
  }

  private async initializeBrokerData(apiKey: string) {
    const broker = this.brokerConnections.get(apiKey);
    if (!broker) return;

    try {
      // Fetch initial account info
      const accountInfo = await broker.getAccountInfo();
      runInAction(() => {
        this.accountInfo.set(apiKey, accountInfo);
      });

      // Fetch initial positions
      const positions = await broker.getPositions();
      runInAction(() => {
        this.positions.set(apiKey, positions);
      });

      // Initialize execution metrics
      runInAction(() => {
        this.executionMetrics.set(apiKey, {
          execution: {
            slippage: 0,
            fillRate: 100,
            latency: 0,
            rejectionRate: 0,
          },
          connection: {
            uptime: 100,
            disconnects: 0,
            errors: 0,
          },
          costs: {
            commission: 0,
            spread: 0,
            slippage: 0,
            total: 0,
          },
        });
      });
    } catch (error) {
      console.error('Failed to initialize broker data:', error);
    }
  }

  private updateExecutionMetrics(apiKey: string, execution: BrokerEvent['execution']) {
    const metrics = this.executionMetrics.get(apiKey);
    if (!metrics) return;

    // Get the corresponding order
    const order = this.findOrder(apiKey, execution.orderId);

    // Calculate new metrics
    const slippage = order ? this.calculateSlippage(order, execution) : 0;
    const fillRate = this.calculateFillRate(apiKey);
    const latency = this.calculateLatency(execution);

    runInAction(() => {
      metrics.execution.slippage = slippage;
      metrics.execution.fillRate = fillRate;
      metrics.execution.latency = latency;
      
      metrics.costs.commission += execution.commission;
      metrics.costs.slippage += Math.abs(slippage * execution.quantity);
      metrics.costs.total = metrics.costs.commission + metrics.costs.slippage;
      
      this.executionMetrics.set(apiKey, metrics);
    });
  }

  private calculateFillRate(apiKey: string): number {
    const orders = this.orders.get(apiKey) || [];
    if (orders.length === 0) return 100;

    const filledOrders = orders.filter(o => o.status === 'filled').length;
    return (filledOrders / orders.length) * 100;
  }

  private calculateLatency(execution: BrokerEvent['execution']): number {
    // Implement latency calculation based on execution timestamp
    return new Date().getTime() - execution.timestamp.getTime();
  }

  // Helper methods for execution quality calculations
  private calculateSlippage(order: Order, execution: BrokerEvent['execution']): number {
    const expectedPrice = order.type === 'market' ? order.price || 0 : order.price!;
    return (execution.price - expectedPrice) / expectedPrice;
  }

  private calculateFillTime(order: Order, execution: BrokerEvent['execution']): number {
    const orderTime = order.timestamp!.getTime();
    const executionTime = execution.timestamp.getTime();
    return executionTime - orderTime;
  }

  private calculateMarketImpact(
    order: Order,
    execution: BrokerEvent['execution'],
    marketData: MarketData
  ): number {
    const prePrice = marketData.last;
    const postPrice = execution.price;
    return Math.abs((postPrice - prePrice) / prePrice);
  }

  private findOrder(apiKey: string, orderId: string): Order | undefined {
    const orders = this.orders.get(apiKey) || [];
    return orders.find(o => o.id === orderId);
  }

  // Computed values
  get connectedBrokers() {
    return Array.from(this.brokerConnections.entries())
      .filter(([_, broker]) => broker.getStatus() === 'connected')
      .map(([apiKey]) => this.brokerConfigs.get(apiKey)!);
  }

  get totalExecutionCosts() {
    return Array.from(this.executionMetrics.values())
      .reduce((total, metrics) => total + metrics.costs.total, 0);
  }

  get averageExecutionMetrics() {
    const metrics = Array.from(this.executionMetrics.values());
    if (metrics.length === 0) return null;

    return {
      slippage: metrics.reduce((sum, m) => sum + m.execution.slippage, 0) / metrics.length,
      fillRate: metrics.reduce((sum, m) => sum + m.execution.fillRate, 0) / metrics.length,
      latency: metrics.reduce((sum, m) => sum + m.execution.latency, 0) / metrics.length,
      rejectionRate: metrics.reduce((sum, m) => sum + m.execution.rejectionRate, 0) / metrics.length,
    };
  }

  clearError() {
    this.error = null;
  }
}
