import WebSocket from 'ws';

export interface WebSocketClient {
  ws: WebSocket;
  id: string;
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
  orderType?: 'market' | 'limit' | 'stop';
  side?: 'buy' | 'sell';
  price?: number;
  quantity?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OptimizationMessage extends BaseMessage {
  type: 'start_optimization' | 'stop_optimization' | 'get_optimization_status';
  optimizationId?: string;
  config?: {
    strategy: string;
    timeframe: string;
    symbol: string;
    startDate: string;
    endDate: string;
    parameters: {
      [key: string]: {
        start: number;
        end: number;
        step: number;
      };
    };
  };
}
