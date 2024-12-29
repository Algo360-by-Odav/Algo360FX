import { WebSocket } from 'ws';

export interface WebSocketClient {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  heartbeat: Date;
}

export interface BaseMessage {
  type: string;
}

export interface OrderMessage extends BaseMessage {
  type: 'placeOrder' | 'cancelOrder' | 'modifyOrder';
  orderId?: string;
  symbol?: string;
  orderType?: 'market' | 'limit' | 'stop' | 'stopLimit';
  side?: 'buy' | 'sell';
  quantity?: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface OptimizationMessage extends BaseMessage {
  type: 'startOptimization' | 'stopOptimization' | 'getOptimizationStatus';
  optimizationId?: string;
  strategy?: string;
  parameters?: {
    timeframe?: string;
    symbol?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  };
}
