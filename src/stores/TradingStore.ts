import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import TradingService, { Order, Position, OrderSide, OrderType, OrderStatus } from '../services/trading';
import WebSocketService from '../services/websocket';

export interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: string;
}

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
}

export class TradingStore {
  private rootStore: RootStore;
  private _positions: Map<string, Position> = new Map();
  private _orders: Map<string, Order> = new Map();
  public marketData: Map<string, MarketData> = new Map();
  public accountInfo: AccountInfo | null = null;
  public loading: boolean = false;
  public error: string | null = null;
  public isConnected: boolean = false;
  public isInitialized: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
      setupWebSocket: false
    });
    this.setupWebSocket();
    this.initializeDefaultState();
  }

  initializeDefaultState() {
    // Initialize with empty positions and orders
    this._positions.clear();
    this._orders.clear();
    this.marketData.clear();
    this.accountInfo = null;
    this.loading = false;
    this.error = null;
    this.isConnected = false;
    this.isInitialized = true;

    // Add sample data in development
    if (process.env.NODE_ENV === 'development') {
      this.initializeSampleData();
    }
  }

  subscribeToMarketData(symbols: string[]) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected. Attempting to connect...');
      this.setupWebSocket();
    }

    symbols.forEach(symbol => {
      WebSocketService.emit('subscribe_market_data', symbol);
    });
  }

  unsubscribeFromMarketData(symbols: string[]) {
    symbols.forEach(symbol => {
      WebSocketService.emit('unsubscribe_market_data', symbol);
    });
  }

  // Computed properties to convert Maps to Arrays
  get positions(): Position[] {
    return Array.from(this._positions.values());
  }

  get orders(): Order[] {
    return Array.from(this._orders.values());
  }

  get activePositions(): Position[] {
    return this.positions.filter(position => position.quantity !== 0);
  }

  get activeOrders(): Order[] {
    return this.orders.filter(order => 
      order.status === OrderStatus.PENDING || 
      order.status === OrderStatus.PARTIALLY_FILLED
    );
  }

  private setupWebSocket() {
    const ws = WebSocketService;

    ws.on('connect', () => {
      runInAction(() => {
        this.isConnected = true;
        this.error = null;
      });
    });

    ws.on('disconnect', () => {
      runInAction(() => {
        this.isConnected = false;
      });
    });

    // Position updates
    ws.on('position_update', (position: Position) => {
      runInAction(() => {
        this._positions.set(position.symbol, position);
      });
    });

    // Order updates
    ws.on('order_update', (order: Order) => {
      runInAction(() => {
        this._orders.set(order.id, order);
      });
    });

    // Market data updates
    ws.on('market_data', (data: MarketData) => {
      runInAction(() => {
        this.marketData.set(data.symbol, data);
        console.log(`Received market data update for ${data.symbol}: ${data.bid} / ${data.ask}`);
      });
    });

    // Account updates
    ws.on('account_update', (accountInfo: AccountInfo) => {
      runInAction(() => {
        this.accountInfo = accountInfo;
      });
    });
  }

  private initializeSampleData() {
    // Sample market data
    const sampleMarketData: MarketData[] = [
      { symbol: 'EURUSD', bid: 1.0921, ask: 1.0923, timestamp: new Date().toISOString() },
      { symbol: 'GBPUSD', bid: 1.2673, ask: 1.2675, timestamp: new Date().toISOString() },
      { symbol: 'USDJPY', bid: 142.15, ask: 142.17, timestamp: new Date().toISOString() },
      { symbol: 'AUDUSD', bid: 0.6712, ask: 0.6714, timestamp: new Date().toISOString() },
      { symbol: 'USDCAD', bid: 1.3412, ask: 1.3414, timestamp: new Date().toISOString() },
    ];

    // Initialize market data
    sampleMarketData.forEach(data => {
      this.marketData.set(data.symbol, data);
    });

    // Sample account info
    this.accountInfo = {
      balance: 10000,
      equity: 10050,
      margin: 500,
      freeMargin: 9550,
      marginLevel: 2010,
      currency: 'USD'
    };
  }

  // Public methods for managing positions and orders
  async placeOrder(order: Omit<Order, 'id' | 'status' | 'filledQuantity' | 'timestamp'>) {
    try {
      this.loading = true;
      const response = await TradingService.placeOrder(order);
      runInAction(() => {
        this._orders.set(response.id, response);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to place order';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async cancelOrder(orderId: string) {
    try {
      this.loading = true;
      await TradingService.cancelOrder(orderId);
      runInAction(() => {
        const order = this._orders.get(orderId);
        if (order) {
          order.status = OrderStatus.CANCELLED;
          this._orders.set(orderId, order);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to cancel order';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async closePosition(symbol: string) {
    try {
      this.loading = true;
      await TradingService.closePosition(symbol);
      runInAction(() => {
        this._positions.delete(symbol);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to close position';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Hook for easy store access
  static useTradingStore = () => {
    const rootStore = RootStore.getInstance();
    return rootStore.tradeStore;
  };
}
