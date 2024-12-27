import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

type WebSocketCallback = (data: any) => void;
type ConnectionStatusCallback = (status: 'connected' | 'disconnected' | 'connecting') => void;

class WebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<string, WebSocketCallback[]> = new Map();
  private statusSubscribers: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private wsUrl: string;
  private isProduction: boolean;

  constructor() {
    this.isProduction = import.meta.env.MODE === 'production';
    this.wsUrl = this.isProduction ? config.wsUrl : 'ws://localhost:5000';
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

    console.log('Connecting to Socket.IO at', this.wsUrl);

    this.socket = io(this.wsUrl, {
      path: config.wsPath,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket'],
      forceNew: true,
      autoConnect: true,
      secure: this.isProduction
    });

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

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.notifyStatusChange('disconnected');
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      this.notifyStatusChange('disconnected');
      this.handleReconnect();
    });

    // Handle incoming messages
    this.socket.onAny((eventName, data) => {
      if (this.subscribers.has(eventName)) {
        this.subscribers.get(eventName)?.forEach(callback => callback(data));
      }
    });
  }

  private handleReconnect() {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.notifyStatusChange('disconnected');
      return;
    }

    // Implement exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const jitter = Math.random() * 1000;
    const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts) + jitter, maxDelay);
    
    console.log(`Reconnecting after ${Math.round(delay)}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(event: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
      // Only emit subscribe if we're connected
      if (this.socket?.connected) {
        this.socket.emit('subscribe', event);
      }
    }
    this.subscribers.get(event)?.push(callback);
  }

  unsubscribe(event: string, callback: WebSocketCallback) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.subscribers.delete(event);
        this.socket?.emit('unsubscribe', event);
      }
    }
  }

  subscribeToConnectionStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.add(callback);
    // Immediately notify of current status
    if (this.socket) {
      callback(this.socket.connected ? 'connected' : 'disconnected');
    } else {
      callback('disconnected');
    }
  }

  unsubscribeFromConnectionStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.delete(callback);
  }

  private notifyStatusChange(status: 'connected' | 'disconnected' | 'connecting') {
    this.statusSubscribers.forEach(callback => callback(status));
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
    this.notifyStatusChange('disconnected');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();