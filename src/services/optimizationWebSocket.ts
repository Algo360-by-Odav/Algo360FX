import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

class OptimizationWebSocket {
  private socket: Socket | null = null;
  private isProduction: boolean;
  private wsUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.isProduction = import.meta.env.MODE === 'production';
    this.wsUrl = this.isProduction ? 
      'wss://algo360fx-server.onrender.com' : 
      'ws://localhost:5000';
    this.connect();
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    console.log('Connecting to optimization Socket.IO at', this.wsUrl);

    try {
      this.socket = io(this.wsUrl, {
        path: '/ws',
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        forceNew: true,
        autoConnect: true,
        secure: this.isProduction,
        rejectUnauthorized: false
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
        this.handleReconnect();
      });

      // Force initial connection attempt
      this.socket.connect();

    } catch (error) {
      console.error('Error creating optimization Socket.IO instance:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect optimization socket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached for optimization socket');
      
      // Reset reconnect attempts after a longer delay
      setTimeout(() => {
        console.log('Resetting optimization socket reconnection attempts');
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
    
    console.log(`Reconnecting optimization socket after ${Math.round(delay)}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
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
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Add optimization-specific methods here
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

  onOptimizationProgress(callback: (data: any) => void) {
    this.socket?.on('optimization_progress', callback);
  }

  onOptimizationComplete(callback: (data: any) => void) {
    this.socket?.on('optimization_complete', callback);
  }

  onOptimizationError(callback: (error: any) => void) {
    this.socket?.on('optimization_error', callback);
  }
}

export default new OptimizationWebSocket();
