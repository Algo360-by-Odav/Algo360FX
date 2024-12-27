import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

type WebSocketCallback = (data: any) => void;
type ConnectionStatusCallback = (status: 'connected' | 'disconnected' | 'connecting') => void;

class WebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<string, WebSocketCallback[]> = new Map();
  private statusSubscribers: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private wsUrl: string;

  constructor() {
    this.wsUrl = import.meta.env.VITE_WS_URL || config.wsBaseUrl;
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
      path: import.meta.env.VITE_WS_PATH || '/ws',
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      forceNew: true,
      autoConnect: true,
      secure: true
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
      return;
    }

    // Implement exponential backoff
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    console.log(`Reconnecting after ${delay}ms...`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  subscribe(event: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
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
        if (callbacks.length === 0) {
          this.subscribers.delete(event);
          this.socket?.emit('unsubscribe', event);
        }
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Message not sent:', { event, data });
    }
  }

  subscribeToStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.add(callback);
    if (this.socket) {
      callback(this.socket.connected ? 'connected' : 'disconnected');
    }
  }

  unsubscribeFromStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.delete(callback);
  }

  private notifyStatusChange(status: 'connected' | 'disconnected' | 'connecting') {
    this.statusSubscribers.forEach(callback => callback(status));
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.subscribers.clear();
    this.statusSubscribers.clear();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();