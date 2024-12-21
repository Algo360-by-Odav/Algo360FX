import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';
import { config } from '../config/config';
import { io, Socket } from 'socket.io-client';

interface WebSocketSubscription {
  channel: string;
  callback?: (data: any) => void;
}

export class WebSocketStore {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  public isConnected = false;
  public lastError: string | null = null;
  private subscriptions: WebSocketSubscription[] = [];

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  connect = () => {
    try {
      if (this.socket?.connected) {
        console.log('Socket.IO already connected');
        return;
      }

      if (!config.wsBaseUrl) {
        console.log('Socket.IO connection skipped - no wsBaseUrl configured');
        return;
      }

      // Remove the '/socket.io/?transport=websocket' part as Socket.IO client handles this
      const baseUrl = config.wsBaseUrl;
      
      this.socket = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 5000,
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Socket.IO connected');
        this.isConnected = true;
        this.lastError = null;
        this.reconnectAttempts = 0;
        this.resubscribeAll();
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        this.isConnected = false;
        this.handleReconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.lastError = 'Socket.IO connection error';
        this.handleReconnect();
      });

      this.socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
        this.lastError = 'Socket.IO error occurred';
      });

    } catch (error) {
      console.error('Error initializing Socket.IO:', error);
      this.lastError = error instanceof Error ? error.message : 'Failed to initialize Socket.IO';
      this.handleReconnect();
    }
  };

  private handleReconnect = () => {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.lastError = 'Max reconnection attempts reached';
      return;
    }

    console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    this.reconnectAttempts++;
    
    // Socket.IO client handles reconnection automatically
    if (!this.socket?.connected) {
      this.socket?.connect();
    }
  };

  subscribe = (channel: string, callback?: (data: any) => void) => {
    if (!channel) return;

    const subscription: WebSocketSubscription = { channel, callback };
    this.subscriptions.push(subscription);

    if (this.isConnected) {
      this.socket?.emit('subscribe', { channel });
    }

    return () => this.unsubscribe(channel);
  };

  unsubscribe = (channel: string) => {
    this.subscriptions = this.subscriptions.filter(sub => sub.channel !== channel);
    if (this.isConnected) {
      this.socket?.emit('unsubscribe', { channel });
    }
  };

  private resubscribeAll = () => {
    this.subscriptions.forEach(sub => {
      this.socket?.emit('subscribe', { channel: sub.channel });
    });
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  };

  send = (channel: string, data: any) => {
    if (!this.isConnected) {
      console.warn('Cannot send message: WebSocket is not connected');
      return;
    }
    this.socket?.emit(channel, data);
  };
}
