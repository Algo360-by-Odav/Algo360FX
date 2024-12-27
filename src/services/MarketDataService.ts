import { Subject, Observable } from 'rxjs';
import WebSocketService from './websocketService';

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

export class MarketDataService {
  private static instance: MarketDataService;
  private tickSubject = new Subject<MarketTick>();
  private orderBookSubject = new Subject<OrderBook>();
  private mockDataInterval: number | null = null;
  private subscribedSymbols: Set<string> = new Set();

  private constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.startMockDataStream();
    } else {
      this.setupMarketDataHandlers();
    }
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private setupMarketDataHandlers() {
    // Subscribe to market data events
    WebSocketService.subscribe('marketData', (data) => {
      if (data.type === 'tick') {
        this.tickSubject.next(data.data as MarketTick);
      } else if (data.type === 'orderbook') {
        this.orderBookSubject.next(data.data as OrderBook);
      }
    });

    // Handle connection status changes
    WebSocketService.subscribeToConnectionStatus((status) => {
      if (status === 'connected') {
        // Resubscribe to all symbols when reconnected
        this.subscribedSymbols.forEach(symbol => {
          this.subscribeToSymbol(symbol);
        });
      }
    });
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

  private subscribeToSymbol(symbol: string) {
    if (WebSocketService.isConnected()) {
      WebSocketService.subscribe('marketData', symbol);
      this.subscribedSymbols.add(symbol);
    } else {
      console.error(`Cannot subscribe to ${symbol}: WebSocket not connected`);
    }
  }

  private unsubscribeFromSymbol(symbol: string) {
    if (WebSocketService.isConnected()) {
      WebSocketService.unsubscribe('marketData', symbol);
      this.subscribedSymbols.delete(symbol);
    } else {
      console.error(`Cannot unsubscribe from ${symbol}: WebSocket not connected`);
    }
  }

  subscribeToTicks(symbol: string): Observable<MarketTick> {
    this.subscribeToSymbol(symbol);
    return this.tickSubject.asObservable();
  }

  subscribeToOrderBook(symbol: string): Observable<OrderBook> {
    this.subscribeToSymbol(symbol);
    return this.orderBookSubject.asObservable();
  }

  unsubscribe(symbol: string) {
    this.unsubscribeFromSymbol(symbol);
  }

  disconnect() {
    if (this.mockDataInterval) {
      window.clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }
    this.subscribedSymbols.clear();
  }
}

export default MarketDataService.getInstance();
