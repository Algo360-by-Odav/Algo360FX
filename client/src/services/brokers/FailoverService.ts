import { EventEmitter } from 'events';
import { BrokerConnection, BrokerConfig, Order, Position } from './types';
import { BrokerFactory } from './BrokerFactory';

interface FailoverConfig {
  primary: BrokerConfig;
  backup: BrokerConfig;
  failoverConditions: {
    maxLatency: number;        // Maximum acceptable latency in ms
    maxErrorRate: number;      // Maximum error rate per minute
    minFillRate: number;       // Minimum acceptable fill rate (0-100)
    maxDisconnects: number;    // Maximum disconnects per hour
    recoveryThreshold: number; // Time in ms to wait before attempting recovery
  };
  syncStrategy: 'full' | 'positions' | 'none';
}

export class FailoverService extends EventEmitter {
  private primaryBroker: BrokerConnection | null = null;
  private backupBroker: BrokerConnection | null = null;
  private config: FailoverConfig;
  private activeBroker: 'primary' | 'backup' = 'primary';
  private isFailoverEnabled: boolean = true;
  private healthMetrics = {
    latency: new Array<number>(),
    errors: new Array<{ timestamp: number }>(),
    disconnects: new Array<{ timestamp: number }>(),
    fills: new Array<{ success: boolean, timestamp: number }>(),
  };
  private recoveryTimer: NodeJS.Timeout | null = null;
  private metricsCleanupInterval: NodeJS.Timeout;

  constructor(config: FailoverConfig) {
    super();
    this.config = config;
    
    // Clean up old metrics every hour
    this.metricsCleanupInterval = setInterval(() => this.cleanupOldMetrics(), 3600000);
  }

  async initialize(): Promise<void> {
    try {
      // Initialize both brokers
      this.primaryBroker = await BrokerFactory.createBroker(this.config.primary);
      this.backupBroker = await BrokerFactory.createBroker(this.config.backup);

      // Set up event listeners
      this.setupEventListeners(this.primaryBroker, 'primary');
      this.setupEventListeners(this.backupBroker, 'backup');

      // Connect primary broker
      await this.primaryBroker.connect();

      // Connect backup broker if using full sync
      if (this.config.syncStrategy === 'full') {
        await this.backupBroker.connect();
      }

      this.emit('initialized');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    this.isFailoverEnabled = false;
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
    clearInterval(this.metricsCleanupInterval);

    try {
      if (this.primaryBroker) {
        await this.primaryBroker.disconnect();
      }
      if (this.backupBroker) {
        await this.backupBroker.disconnect();
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

  private setupEventListeners(broker: BrokerConnection, type: 'primary' | 'backup'): void {
    broker.on('connected', () => {
      this.emit('broker:connected', { type });
    });

    broker.on('disconnected', () => {
      this.recordDisconnect();
      this.emit('broker:disconnected', { type });
      
      if (type === this.activeBroker && this.isFailoverEnabled) {
        this.handleDisconnect();
      }
    });

    broker.on('error', (error) => {
      this.recordError();
      this.emit('broker:error', { type, error });
      
      if (type === this.activeBroker && this.isFailoverEnabled) {
        this.evaluateFailoverConditions();
      }
    });

    broker.on('execution', (execution) => {
      this.recordExecution(execution);
      this.emit('broker:execution', { type, execution });
    });

    // Mirror orders and positions if using full sync
    if (this.config.syncStrategy === 'full') {
      broker.on('order', (order) => {
        if (type === this.activeBroker) {
          this.mirrorOrder(order);
        }
      });

      broker.on('position', (position) => {
        if (type === this.activeBroker) {
          this.mirrorPosition(position);
        }
      });
    }
  }

  private async handleDisconnect(): Promise<void> {
    if (this.activeBroker === 'primary') {
      await this.failover();
    } else {
      await this.attemptRecovery();
    }
  }

  private async failover(): Promise<void> {
    try {
      // Ensure backup broker is connected
      if (this.backupBroker && this.backupBroker.getStatus() !== 'connected') {
        await this.backupBroker.connect();
      }

      // Sync positions if needed
      if (this.config.syncStrategy !== 'none') {
        await this.syncPositions();
      }

      this.activeBroker = 'backup';
      this.emit('failover:completed', { to: 'backup' });

      // Start recovery timer
      this.startRecoveryTimer();
    } catch (error) {
      this.emit('failover:failed', error);
    }
  }

  private async attemptRecovery(): Promise<void> {
    try {
      if (!this.primaryBroker) return;

      await this.primaryBroker.connect();
      
      // Verify connection health
      const isHealthy = await this.verifyConnectionHealth();
      
      if (isHealthy) {
        // Sync positions if needed
        if (this.config.syncStrategy !== 'none') {
          await this.syncPositions();
        }

        this.activeBroker = 'primary';
        this.emit('recovery:completed');
      } else {
        throw new Error('Primary broker health check failed');
      }
    } catch (error) {
      this.emit('recovery:failed', error);
      this.startRecoveryTimer();
    }
  }

  private async syncPositions(): Promise<void> {
    try {
      const sourceBroker = this.activeBroker === 'primary' ? this.primaryBroker : this.backupBroker;
      const targetBroker = this.activeBroker === 'primary' ? this.backupBroker : this.primaryBroker;

      if (!sourceBroker || !targetBroker) return;

      const sourcePositions = await sourceBroker.getPositions();
      const targetPositions = await targetBroker.getPositions();

      // Close positions that don't exist in source
      for (const targetPos of targetPositions) {
        const sourcePos = sourcePositions.find(p => p.symbol === targetPos.symbol);
        if (!sourcePos) {
          await this.closePosition(targetBroker, targetPos);
        }
      }

      // Open or adjust positions to match source
      for (const sourcePos of sourcePositions) {
        const targetPos = targetPositions.find(p => p.symbol === sourcePos.symbol);
        if (!targetPos) {
          await this.openPosition(targetBroker, sourcePos);
        } else if (targetPos.quantity !== sourcePos.quantity) {
          await this.adjustPosition(targetBroker, targetPos, sourcePos);
        }
      }
    } catch (error) {
      this.emit('sync:failed', error);
    }
  }

  private async closePosition(broker: BrokerConnection, position: Position): Promise<void> {
    await broker.placeOrder({
      symbol: position.symbol,
      quantity: -position.quantity,
      type: 'market',
      timeInForce: 'ioc',
      side: position.quantity > 0 ? 'sell' : 'buy',
    });
  }

  private async openPosition(broker: BrokerConnection, position: Position): Promise<void> {
    await broker.placeOrder({
      symbol: position.symbol,
      quantity: position.quantity,
      type: 'market',
      timeInForce: 'ioc',
      side: position.quantity > 0 ? 'buy' : 'sell',
    });
  }

  private async adjustPosition(
    broker: BrokerConnection,
    currentPos: Position,
    targetPos: Position
  ): Promise<void> {
    const diffQuantity = targetPos.quantity - currentPos.quantity;
    await broker.placeOrder({
      symbol: targetPos.symbol,
      quantity: Math.abs(diffQuantity),
      type: 'market',
      timeInForce: 'ioc',
      side: diffQuantity > 0 ? 'buy' : 'sell',
    });
  }

  private async mirrorOrder(order: Order): Promise<void> {
    const inactiveBroker = this.activeBroker === 'primary' ? this.backupBroker : this.primaryBroker;
    if (!inactiveBroker || this.config.syncStrategy !== 'full') return;

    try {
      await inactiveBroker.placeOrder({
        symbol: order.symbol,
        quantity: order.quantity,
        type: order.type,
        price: order.price,
        stopPrice: order.stopPrice,
        timeInForce: order.timeInForce,
        side: order.side,
      });
    } catch (error) {
      this.emit('mirror:failed', { type: 'order', error });
    }
  }

  private async mirrorPosition(position: Position): Promise<void> {
    const inactiveBroker = this.activeBroker === 'primary' ? this.backupBroker : this.primaryBroker;
    if (!inactiveBroker || this.config.syncStrategy !== 'full') return;

    try {
      const currentPositions = await inactiveBroker.getPositions();
      const existingPosition = currentPositions.find(p => p.symbol === position.symbol);

      if (existingPosition) {
        await this.adjustPosition(inactiveBroker, existingPosition, position);
      } else {
        await this.openPosition(inactiveBroker, position);
      }
    } catch (error) {
      this.emit('mirror:failed', { type: 'position', error });
    }
  }

  private recordLatency(latency: number): void {
    this.healthMetrics.latency.push(latency);
  }

  private recordError(): void {
    this.healthMetrics.errors.push({ timestamp: Date.now() });
  }

  private recordDisconnect(): void {
    this.healthMetrics.disconnects.push({ timestamp: Date.now() });
  }

  private recordExecution(execution: any): void {
    this.healthMetrics.fills.push({
      success: execution.status === 'filled',
      timestamp: Date.now(),
    });
  }

  private evaluateFailoverConditions(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    // Calculate metrics
    const recentLatency = this.healthMetrics.latency
      .slice(-10)
      .reduce((sum, val) => sum + val, 0) / 10;

    const errorRate = this.healthMetrics.errors
      .filter(e => e.timestamp > oneMinuteAgo)
      .length;

    const disconnectRate = this.healthMetrics.disconnects
      .filter(d => d.timestamp > oneHourAgo)
      .length;

    const recentFills = this.healthMetrics.fills
      .filter(f => f.timestamp > oneMinuteAgo);
    const fillRate = recentFills.length > 0
      ? (recentFills.filter(f => f.success).length / recentFills.length) * 100
      : 100;

    // Check conditions
    const shouldFailover = 
      recentLatency > this.config.failoverConditions.maxLatency ||
      errorRate > this.config.failoverConditions.maxErrorRate ||
      fillRate < this.config.failoverConditions.minFillRate ||
      disconnectRate > this.config.failoverConditions.maxDisconnects;

    if (shouldFailover && this.activeBroker === 'primary') {
      this.failover();
      return true;
    }

    return false;
  }

  private async verifyConnectionHealth(): Promise<boolean> {
    if (!this.primaryBroker) return false;

    try {
      // Test market data connection
      const testSymbol = 'EURUSD';
      const marketData = await this.primaryBroker.getMarketData(testSymbol);
      if (!marketData || !marketData.bid || !marketData.ask) {
        return false;
      }

      // Test account info
      const accountInfo = await this.primaryBroker.getAccountInfo();
      if (!accountInfo || !accountInfo.balance) {
        return false;
      }

      // Reset health metrics
      this.healthMetrics = {
        latency: [],
        errors: [],
        disconnects: [],
        fills: [],
      };

      return true;
    } catch (error) {
      return false;
    }
  }

  private startRecoveryTimer(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }

    this.recoveryTimer = setTimeout(
      () => this.attemptRecovery(),
      this.config.failoverConditions.recoveryThreshold
    );
  }

  private cleanupOldMetrics(): void {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    // Keep only last hour of metrics
    this.healthMetrics.latency = this.healthMetrics.latency.slice(-100);
    this.healthMetrics.errors = this.healthMetrics.errors.filter(e => e.timestamp > oneHourAgo);
    this.healthMetrics.disconnects = this.healthMetrics.disconnects.filter(d => d.timestamp > oneHourAgo);
    this.healthMetrics.fills = this.healthMetrics.fills.filter(f => f.timestamp > oneHourAgo);
  }

  getActiveBroker(): BrokerConnection | null {
    return this.activeBroker === 'primary' ? this.primaryBroker : this.backupBroker;
  }

  getFailoverStatus() {
    return {
      activeBroker: this.activeBroker,
      primaryStatus: this.primaryBroker?.getStatus() || 'disconnected',
      backupStatus: this.backupBroker?.getStatus() || 'disconnected',
      syncStrategy: this.config.syncStrategy,
      healthMetrics: {
        latency: this.calculateAverageLatency(),
        errorRate: this.calculateErrorRate(),
        disconnectRate: this.calculateDisconnectRate(),
        fillRate: this.calculateFillRate(),
      },
    };
  }

  private calculateAverageLatency(): number {
    const recentLatency = this.healthMetrics.latency.slice(-10);
    return recentLatency.length > 0
      ? recentLatency.reduce((sum, val) => sum + val, 0) / recentLatency.length
      : 0;
  }

  private calculateErrorRate(): number {
    const oneMinuteAgo = Date.now() - 60000;
    return this.healthMetrics.errors.filter(e => e.timestamp > oneMinuteAgo).length;
  }

  private calculateDisconnectRate(): number {
    const oneHourAgo = Date.now() - 3600000;
    return this.healthMetrics.disconnects.filter(d => d.timestamp > oneHourAgo).length;
  }

  private calculateFillRate(): number {
    const oneMinuteAgo = Date.now() - 60000;
    const recentFills = this.healthMetrics.fills.filter(f => f.timestamp > oneMinuteAgo);
    return recentFills.length > 0
      ? (recentFills.filter(f => f.success).length / recentFills.length) * 100
      : 100;
  }
}
