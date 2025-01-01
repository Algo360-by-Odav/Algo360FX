import { io, Socket } from 'socket.io-client';
import { 
  API_BASE_URL, 
  MAX_RECONNECT_ATTEMPTS, 
  INITIAL_RECONNECT_DELAY, 
  DEFAULT_TIMEOUT,
  SOCKET_CONFIG
} from '../config/constants';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS;
  private reconnectDelay = INITIAL_RECONNECT_DELAY;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  private constructor() {
    this.initializeSocket();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private initializeSocket() {
    try {
      console.log('Connecting to Socket.IO at', API_BASE_URL);
      
      this.socket = io(API_BASE_URL, {
        ...SOCKET_CONFIG,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        auth: {
          timestamp: Date.now()
        }
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      this.handleReconnect();
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = INITIAL_RECONNECT_DELAY;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.handleReconnect();
    });

    // Add custom event listeners
    this.socket.onAny((eventName: string, data: any) => {
      const listeners = this.listeners.get(eventName);
      if (listeners) {
        listeners.forEach(listener => listener(data));
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.initializeSocket(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const eventListeners = this.listeners.get(event)!;
    eventListeners.add(callback as (data: any) => void);

    return () => {
      eventListeners.delete(callback as (data: any) => void);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  public emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Message not sent:', { event, data });
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default WebSocketService.getInstance();
