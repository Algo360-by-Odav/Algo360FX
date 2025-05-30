// WebSocket server URL
const WS_URL = 'ws://localhost:8080/ws';

export interface MarketDataUpdate {
  symbol: string;
  data: {
    bid: number;
    ask: number;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  };
}

class TradingSocketService {
  private static instance: TradingSocketService;
  private socket: WebSocket | null = null;
  private isConnected = false;
  private subscribedSymbols: Set<string> = new Set();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): TradingSocketService {
    if (!TradingSocketService.instance) {
      TradingSocketService.instance = new TradingSocketService();
    }
    return TradingSocketService.instance;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('Connected to trading socket');
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Resubscribe to symbols if reconnecting
        if (this.subscribedSymbols.size > 0) {
          this.subscribeToSymbols(Array.from(this.subscribedSymbols));
        }
      };

      this.socket.onclose = () => {
        console.log('Disconnected from trading socket');
        this.isConnected = false;
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('Socket error:', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'marketData') {
            this.notifyListeners('marketData', message.data);
          } else if (message.type === 'subscribeConfirm') {
            console.log('Subscription confirmed for symbols:', message.symbols);
          } else if (message.type === 'unsubscribeConfirm') {
            console.log('Unsubscription confirmed for symbols:', message.symbols);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnect attempts reached, giving up');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.subscribedSymbols.clear();
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }

  public subscribeToSymbols(symbols: string[]): void {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot subscribe');
      symbols.forEach(symbol => this.subscribedSymbols.add(symbol));
      return;
    }

    // Filter out symbols we're already subscribed to
    const newSymbols = symbols.filter(symbol => !this.subscribedSymbols.has(symbol));
    
    if (newSymbols.length === 0) {
      return;
    }

    // Add symbols to our set
    newSymbols.forEach(symbol => this.subscribedSymbols.add(symbol));
    
    // Send subscribe message
    this.socket.send(JSON.stringify({
      type: 'subscribe',
      symbols: newSymbols
    }));
    
    console.log(`Sent subscription request for symbols: ${newSymbols.join(', ')}`);
  }

  public unsubscribeFromSymbols(symbols: string[]): void {
    if (!this.socket || !this.isConnected) {
      console.warn('Socket not connected, cannot unsubscribe');
      return;
    }

    // Filter to only include symbols we're actually subscribed to
    const symbolsToUnsubscribe = symbols.filter(symbol => this.subscribedSymbols.has(symbol));
    
    if (symbolsToUnsubscribe.length === 0) {
      return;
    }

    // Remove symbols from our set
    symbolsToUnsubscribe.forEach(symbol => this.subscribedSymbols.delete(symbol));
    
    // Send unsubscribe message
    this.socket.send(JSON.stringify({
      type: 'unsubscribe',
      symbols: symbolsToUnsubscribe
    }));
    
    console.log(`Sent unsubscription request for symbols: ${symbolsToUnsubscribe.join(', ')}`);
  }

  public addListener(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  public removeListener(event: string, callback: (data: any) => void): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  private notifyListeners(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error);
        }
      });
    }
  }

  public isSocketConnected(): boolean {
    return this.isConnected;
  }

  public getSubscribedSymbols(): string[] {
    return Array.from(this.subscribedSymbols);
  }
}

export default TradingSocketService.getInstance();
