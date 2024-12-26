import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

type OptimizationCallback = (data: any) => void;

class OptimizationWebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<string, OptimizationCallback[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const wsUrl = isLocalhost ? 'ws://localhost:5000' : config.wsUrl;
    
    console.log('Connecting to optimization Socket.IO at', wsUrl);

    this.socket = io(wsUrl, {
      path: config.wsPath,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      forceNew: true,
      autoConnect: true,
      secure: !isLocalhost
    });

    this.socket.on('connect', () => {
      console.log('Optimization Socket.IO connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Optimization Socket.IO disconnected');
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.log('Optimization Socket.IO connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Optimization Socket.IO error:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      
      const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts / 2), 30000);
      this.reconnectTimer = setTimeout(() => {
        console.log(`Reconnecting after ${backoffTime}ms...`);
        this.reconnectAttempts = 0;
        this.connect();
      }, backoffTime);
      
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    this.connect();
  }

  subscribe(event: string, callback: OptimizationCallback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  unsubscribe(event: string, callback: OptimizationCallback) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export default new OptimizationWebSocketService();
