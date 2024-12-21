import { io, Socket } from 'socket.io-client';

type WebSocketCallback = (data: any) => void;
type ConnectionStatusCallback = (status: 'connected' | 'disconnected' | 'connecting') => void;

class WebSocketService {
  private socket: Socket | null = null;
  private subscribers: Map<string, WebSocketCallback[]> = new Map();
  private statusSubscribers: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(url: string = 'http://localhost:3004') {
    if (this.socket?.connected) {
      return;
    }

    this.notifyStatusChange('connecting');
    this.socket = io(url, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
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
    });

    // Handle incoming messages
    this.socket.onAny((eventName, data) => {
      if (this.subscribers.has(eventName)) {
        this.subscribers.get(eventName)?.forEach(callback => callback(data));
      }
    });
  }

  subscribe(type: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
      // Only emit subscribe if we're connected
      if (this.socket?.connected) {
        this.socket.emit('subscribe', type);
      }
    }
    
    const callbacks = this.subscribers.get(type);
    // Avoid duplicate subscriptions
    if (callbacks && !callbacks.includes(callback)) {
      callbacks.push(callback);
    }
  }

  unsubscribe(type: string, callback: WebSocketCallback) {
    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        if (callbacks.length === 0) {
          this.subscribers.delete(type);
          if (this.socket?.connected) {
            this.socket.emit('unsubscribe', type);
          }
        }
      }
    }
  }

  subscribeToStatus(callback: ConnectionStatusCallback) {
    this.statusSubscribers.add(callback);
  }

  unsubscribeFromStatus(callback: ConnectionStatusCallback) {
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
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit event: socket is not connected');
    }
  }
}

export default new WebSocketService();