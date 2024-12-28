import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

type WebSocketEvent = 
  | 'market_data'
  | 'order_book'
  | 'ticker'
  | 'trade_update'
  | 'position_update'
  | 'portfolio_update'
  | 'error'
  | string;

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface WebSocketConfig {
  path: string;
  reconnection: boolean;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  timeout: number;
  transports: string[];
  forceNew: boolean;
  autoConnect: boolean;
  secure: boolean;
  rejectUnauthorized: boolean;
}

interface MarketData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
}

interface OrderBook {
  symbol: string;
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: number;
}

interface Ticker {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  timestamp: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  volume: number;
  timestamp: number;
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  volume: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  timestamp: number;
}

interface Portfolio {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  positions: Position[];
  timestamp: number;
}

type WebSocketData = 
  | MarketData
  | OrderBook
  | Ticker
  | Trade
  | Position
  | Portfolio
  | { error: string };

type WebSocketCallback<T extends WebSocketData = WebSocketData> = (data: T) => void;
type ConnectionStatusCallback = (status: ConnectionStatus) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<WebSocketEvent, Set<WebSocketCallback>> = new Map();
  private statusSubscribers: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private wsUrl: string;
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.MODE === 'production';
    this.wsUrl = this.isProduction ? 
      'wss://algo360fx-server.onrender.com' : 
      'ws://localhost:5000';
  }

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    // Disconnect and clean up any existing socket
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Reset reconnect attempts
    this.reconnectAttempts = 0;

    console.log('Connecting to Socket.IO at', this.wsUrl);
    this.notifyStatusChange('connecting');

    try {
      const config: WebSocketConfig = {
        path: '/ws',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ['websocket'],
        forceNew: true,
        autoConnect: false,
        secure: this.isProduction,
        rejectUnauthorized: false
      };

      this.socket = io(this.wsUrl, config);

      // Set up event handlers before connecting
      this.setupSocketHandlers();

      // Now connect
      this.socket.connect();

    } catch (error) {
      console.error('Error creating Socket.IO instance:', error);
      this.handleReconnect();
    }
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.reconnectAttempts = 0;
      this.notifyStatusChange('connected');
      
      // Resubscribe to all events after reconnection
      this.subscribers.forEach((_, type) => {
        this.socket?.emit('subscribe', type);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      this.notifyStatusChange('disconnected');
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket.IO connection error:', error);
      this.notifyStatusChange('disconnected');
      this.handleReconnect();
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket.IO error:', error);
      this.notifyStatusChange('disconnected');
      this.handleReconnect();
    });

    // Handle incoming messages
    this.socket.onAny((eventName: string, data: WebSocketData) => {
      if (this.subscribers.has(eventName as WebSocketEvent)) {
        this.subscribers.get(eventName as WebSocketEvent)?.forEach(callback => callback(data));
      }
    });
  }

  private handleReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.notifyStatusChange('disconnected');
      
      // Reset reconnect attempts after a longer delay
      setTimeout(() => {
        console.log('Resetting reconnection attempts');
        this.reconnectAttempts = 0;
        this.connect();
      }, 30000); // Wait 30 seconds before trying again
      
      return;
    }

    // Implement exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const jitter = Math.random() * 1000;
    const delay = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempts) + jitter, maxDelay);
    
    console.log(`Reconnecting after ${Math.round(delay)}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe<T extends WebSocketData>(event: WebSocketEvent, callback: WebSocketCallback<T>): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
      // Only emit subscribe if we're connected
      if (this.socket?.connected) {
        this.socket.emit('subscribe', event);
      }
    }
    this.subscribers.get(event)?.add(callback as WebSocketCallback);
  }

  unsubscribe<T extends WebSocketData>(event: WebSocketEvent, callback: WebSocketCallback<T>): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.delete(callback as WebSocketCallback);
      if (callbacks.size === 0) {
        this.subscribers.delete(event);
        if (this.socket?.connected) {
          this.socket.emit('unsubscribe', event);
        }
      }
    }
  }

  subscribeToConnectionStatus(callback: ConnectionStatusCallback): void {
    this.statusSubscribers.add(callback);
  }

  unsubscribeFromConnectionStatus(callback: ConnectionStatusCallback): void {
    this.statusSubscribers.delete(callback);
  }

  private notifyStatusChange(status: ConnectionStatus): void {
    this.statusSubscribers.forEach(callback => callback(status));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.notifyStatusChange('disconnected');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();