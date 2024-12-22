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

  connect(url: string = config.wsBaseUrl) {
    if (this.socket?.connected) {
      return;
    }

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.notifyStatusChange('connecting');
    
    // Configure Socket.IO client
    this.socket = io(url, {
      path: '/ws',
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket'],
      forceNew: true,
      autoConnect: true
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

    // Handle incoming messages
    this.socket.onAny((eventName, data) => {
      if (this.subscribers.has(eventName)) {
        this.subscribers.get(eventName)?.forEach(callback => callback(data));
      }
    });

    // Handle errors
    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      this.notifyStatusChange('disconnected');
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
    this.reconnectTimer = setTimeout(() => {
      console.log(`Reconnecting after ${delay}ms...`);
      this.connect();
    }, delay);
  }

  subscribe(event: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
      // Subscribe to the event on the server
      this.socket?.emit('subscribe', event);
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
          // Unsubscribe from the event on the server
          this.socket?.emit('unsubscribe', event);
        }
      }
    }
  }

  subscribeToStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.add(callback);
    // Immediately notify the subscriber of the current status
    if (this.socket) {
      callback(this.socket.connected ? 'connected' : 'disconnected');
    } else {
      callback('disconnected');
    }
  }

  unsubscribeFromStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.delete(callback);
  }

  private notifyStatusChange(status: 'connected' | 'disconnected' | 'connecting') {
    this.statusSubscribers.forEach(callback => callback(status));
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.disconnect();
    this.socket = null;
    this.subscribers.clear();
    this.statusSubscribers.clear();
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();