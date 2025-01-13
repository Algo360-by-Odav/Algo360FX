import { Socket } from 'socket.io';
import { WebSocket as WS } from 'ws';

declare module 'ws' {
  export interface WebSocket extends WS {
    isAlive?: boolean;
    userId?: string;
  }
}

export interface WebSocketClient {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  lastHeartbeat: Date;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;  // Use unknown instead of any for better type safety
}

export interface MarketDataMessage {
  symbol: string;
  data: {
    bid: number;
    ask: number;
    timestamp: number;
  };
}

export interface OptimizationConfig {
  strategyId: string;
  parameters: Record<string, unknown>;  // Use unknown instead of any
  timeframe: string;
  startDate: string;
  endDate: string;
}

export interface OptimizationStatus {
  id: string;
  config: OptimizationConfig;
  progress: number;
  status: 'running' | 'completed' | 'error';
  error?: string;
}