import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { config } from '../config/config';

// Use the same WebSocket URL from config
const WS_URL = config.wsBaseUrl;

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptions: Set<string> = new Set();

  constructor() {
    if (WS_URL) {
      this.initialize();
    } else {
      console.log('WebSocket URL not configured, skipping initialization');
    }
  }

  private initialize() {
    this.socket = io(WS_URL, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Resubscribe to previous subscriptions
      this.subscriptions.forEach(channel => {
        this.subscribe(channel);
      });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to server. Please check your connection.');
      }
    });
  }

  public subscribe(channel: string) {
    if (!this.socket?.connected) {
      console.warn(`Cannot subscribe to ${channel}: socket not connected`);
      return;
    }

    this.socket.emit('subscribe', channel);
    this.subscriptions.add(channel);
  }

  public unsubscribe(channel: string) {
    if (!this.socket?.connected) {
      console.warn(`Cannot unsubscribe from ${channel}: socket not connected`);
      return;
    }

    this.socket.emit('unsubscribe', channel);
    this.subscriptions.delete(channel);
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  public emit(event: string, ...args: any[]) {
    if (!this.socket?.connected) {
      console.warn(`Cannot emit ${event}: socket not connected`);
      return;
    }

    this.socket.emit(event, ...args);
  }

  public disconnect() {
    this.socket?.disconnect();
  }

  public get connected(): boolean {
    return this.socket?.connected || false;
  }
}

export const WebSocketClient = new WebSocketManager();
