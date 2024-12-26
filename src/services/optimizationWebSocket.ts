import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

export class OptimizationWebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private wsUrl: string;

  constructor() {
    this.wsUrl = import.meta.env.VITE_WS_URL || config.wsBaseUrl;
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    console.log('Connecting to optimization Socket.IO at', this.wsUrl);

    this.socket = io(this.wsUrl, {
      path: import.meta.env.VITE_WS_PATH || '/ws',
      namespace: '/optimization',
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket'],
      forceNew: true,
      autoConnect: true,
      secure: true
    });

    this.socket.on('connect', () => {
      console.log('Optimization Socket.IO connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Optimization Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Optimization Socket.IO connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Optimization Socket.IO error:', error);
    });

    // Subscribe to optimization events
    this.socket.on('optimization_progress', (data) => {
      console.log('Optimization progress:', data);
    });

    this.socket.on('optimization_complete', (data) => {
      console.log('Optimization complete:', data);
    });

    this.socket.on('optimization_error', (error) => {
      console.error('Optimization error:', error);
    });
  }

  private handleReconnect() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  startOptimization(params: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot start optimization.');
      return;
    }
    this.socket.emit('start_optimization', params);
  }

  stopOptimization() {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot stop optimization.');
      return;
    }
    this.socket.emit('stop_optimization');
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
