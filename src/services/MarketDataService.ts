import { Subject, Observable } from 'rxjs';

export interface MarketTick {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][]; // [price, volume]
  asks: [number, number][]; // [price, volume]
  timestamp: number;
}

interface WebSocketMessage {
  type: 'tick' | 'orderbook' | 'error';
  data: any;
}

export class MarketDataService {
  private static instance: MarketDataService;
  private ws: WebSocket | null = null;
  private tickSubject = new Subject<MarketTick>();
  private orderBookSubject = new Subject<OrderBook>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private mockDataInterval: number | null = null;

  private constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.startMockDataStream();
    } else {
      this.connect();
    }
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private startMockDataStream() {
    // Generate mock market data every second
    this.mockDataInterval = window.setInterval(() => {
      const basePrice = 1.0550;
      const spread = 0.00020;
      const randomOffset = (Math.random() - 0.5) * 0.0010;
      const price = basePrice + randomOffset;

      const tick: MarketTick = {
        symbol: 'EURUSD',
        price,
        timestamp: Date.now(),
        volume: Math.floor(Math.random() * 1000000),
        bid: price - spread / 2,
        ask: price + spread / 2,
        spread,
      };

      this.tickSubject.next(tick);

      const orderBook: OrderBook = {
        symbol: 'EURUSD',
        timestamp: Date.now(),
        bids: Array.from({ length: 5 }, (_, i) => [
          price - (i + 1) * 0.0001,
          Math.random() * 1000000,
        ]),
        asks: Array.from({ length: 5 }, (_, i) => [
          price + (i + 1) * 0.0001,
          Math.random() * 1000000,
        ]),
      };

      this.orderBookSubject.next(orderBook);
    }, 1000);
  }

  private connect() {
    try {
      this.ws = new WebSocket('wss://your-websocket-server/market-data');

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleDisconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.handleDisconnect();
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'tick':
        this.tickSubject.next(message.data as MarketTick);
        break;
      case 'orderbook':
        this.orderBookSubject.next(message.data as OrderBook);
        break;
      case 'error':
        console.error('Market data error:', message.data);
        break;
      default:
        console.warn('Unknown message type:', message);
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribeToTicks(symbol: string): Observable<MarketTick> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', channel: 'ticks', symbol }));
    }
    return this.tickSubject.asObservable();
  }

  subscribeToOrderBook(symbol: string): Observable<OrderBook> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ type: 'subscribe', channel: 'orderbook', symbol })
      );
    }
    return this.orderBookSubject.asObservable();
  }

  unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  disconnect() {
    if (this.mockDataInterval) {
      window.clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
