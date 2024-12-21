import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketClient extends EventEmitter {
  private socket: Socket | null = null;
  private subscriptions: Set<string> = new Set();
  private messageQueue: WebSocketMessage[] = [];
  private isConnected: boolean = false;
  private wsUrl: string;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 5;

  constructor() {
    super();
    this.wsUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(this.wsUrl, {
        reconnection: true,
        reconnectionAttempts: this.maxConnectionAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        timeout: 60000,
        transports: ['websocket', 'polling'],
        autoConnect: true
      });
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
      this.emit('error', new Error('Failed to initialize Socket.IO connection'));
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.emit('connected');
      this.resubscribe();
      this.flushMessageQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.emit('error', error);
    });

    this.socket.on('message', (data) => {
      this.emit('message', data);
    });
  }

  private resubscribe() {
    for (const channel of this.subscriptions) {
      this.socket?.emit('subscribe', channel);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  public subscribe(channel: string) {
    if (!this.socket?.connected) {
      this.subscriptions.add(channel);
      return;
    }
    this.socket.emit('subscribe', channel);
    this.subscriptions.add(channel);
  }

  public unsubscribe(channel: string) {
    if (!this.socket?.connected) {
      this.subscriptions.delete(channel);
      return;
    }
    this.socket.emit('unsubscribe', channel);
    this.subscriptions.delete(channel);
  }

  public send(message: WebSocketMessage) {
    if (!this.socket?.connected) {
      this.messageQueue.push(message);
      return;
    }
    this.socket.emit('message', message);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.subscriptions.clear();
      this.messageQueue = [];
    }
  }

  public reconnect() {
    this.disconnect();
    this.initializeSocket();
  }

  public isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

// Create a singleton instance
export const wsClient = new WebSocketClient();
