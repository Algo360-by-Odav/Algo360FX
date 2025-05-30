import { EventEmitter } from 'events';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export type OrderType = 'market' | 'limit' | 'stop' | 'stopLimit';

export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';

export type OrderSide = 'buy' | 'sell';

export interface Order {
  id?: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: TimeInForce;
  status?: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filledQuantity?: number;
  averagePrice?: number;
  commission?: number;
  timestamp?: Date;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  timestamp: Date;
}

export interface AccountInfo {
  accountId: string;
  balance: number;
  equity: number;
  margin: {
    used: number;
    available: number;
    maintenance: number;
  };
  currency: string;
}

export interface BrokerConnection extends EventEmitter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): ConnectionStatus;
  getAccountInfo(): Promise<AccountInfo>;
  getPositions(): Promise<Position[]>;
  placeOrder(order: Omit<Order, 'id' | 'status' | 'timestamp'>): Promise<Order>;
  cancelOrder(orderId: string): Promise<void>;
  getMarketData(symbol: string): Promise<MarketData>;
}

export interface BrokerEvent {
  connected: void;
  disconnected: void;
  error: Error;
  order: Order;
  position: Position;
  marketData: MarketData;
  execution: {
    orderId: string;
    symbol: string;
    quantity: number;
    price: number;
    commission: number;
    timestamp: Date;
  };
}

export interface BrokerMetrics {
  execution: {
    slippage: number;
    fillRate: number;
    latency: number;
    rejectionRate: number;
  };
  connection: {
    uptime: number;
    disconnects: number;
    errors: number;
  };
  costs: {
    commission: number;
    spread: number;
    slippage: number;
    total: number;
  };
}

export interface BrokerConfig {
  name: string;
  type: 'FIX' | 'API' | 'WebSocket';
  apiKey: string;
  apiSecret: string;
  serverUrl: string;
  settings: {
    marginRequirement: number;
    maxLeverage: number;
    minLotSize: number;
    maxLotSize: number;
    commissionPerLot: number;
    swapLong: number;
    swapShort: number;
  };
}
