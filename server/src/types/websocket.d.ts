import { Socket } from 'socket.io';
import { WebSocket } from 'ws';

declare module 'ws' {
  interface WebSocket {
    readyState: number;
    OPEN: number;
  }
}

interface WebSocketClient {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  lastHeartbeat: Date;
}

interface WebSocketMessage {
  type: string;
  payload: any;
}

interface MarketDataMessage {
  symbol: string;
  data: {
    bid: number;
    ask: number;
    timestamp: number;
  };
}

interface OptimizationConfig {
  strategyId: string;
  parameters: Record<string, any>;
  timeframe: string;
  startDate: string;
  endDate: string;
}

interface OptimizationStatus {
  id: string;
  config: OptimizationConfig;
  progress: number;
  status: 'running' | 'completed' | 'error';
  error?: string;
}

export {
  WebSocketClient,
  WebSocketMessage,
  MarketDataMessage,
  OptimizationConfig,
  OptimizationStatus
};
