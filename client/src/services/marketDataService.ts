import WebSocketService from './webSocketService';

export interface MarketDataUpdate {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: number;
}

export interface OrderBookUpdate {
  symbol: string;
  bids: Array<[number, number]>; // [price, size]
  asks: Array<[number, number]>; // [price, size]
  timestamp: number;
}

export interface TradeUpdate {
  symbol: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface HistoricalDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class MarketDataService {
  private static instance: MarketDataService;
  private ws: WebSocketService;
  private subscribedSymbols: Set<string> = new Set();
  private subscriptions: Map<string, Set<Function>> = new Map();

  private constructor() {
    this.ws = WebSocketService.getInstance();
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Subscribe to real-time price updates for a symbol
  public subscribePriceUpdates(symbol: string, callback: (update: MarketDataUpdate) => void) {
    const channel = `price.${symbol}`;
    
    // Initialize subscriptions for this channel if not exists
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    
    this.subscriptions.get(channel)?.add(callback);
    
    if (!this.subscribedSymbols.has(symbol)) {
      this.ws.send('subscribe', { channel, symbol });
      this.subscribedSymbols.add(symbol);
    }
  }

  // Unsubscribe from price updates
  public unsubscribePriceUpdates(symbol: string, callback?: (update: MarketDataUpdate) => void) {
    const channel = `price.${symbol}`;
    
    if (callback && this.subscriptions.has(channel)) {
      this.subscriptions.get(channel)?.delete(callback);
    }
    
    // If no more subscribers or no specific callback provided, clean up completely
    if (!callback || (this.subscriptions.get(channel)?.size === 0)) {
      this.ws.send('unsubscribe', { channel, symbol });
      this.subscribedSymbols.delete(symbol);
      this.subscriptions.delete(channel);
    }
  }

  // Request latest market data for a symbol
  public requestMarketData(symbol: string) {
    this.ws.send('request_market_data', { symbol });
  }

  // Get historical data for a symbol
  public async requestHistoricalData(symbol: string): Promise<HistoricalDataPoint[]> {
    // For now, return mock data
    const now = new Date();
    const mockData: HistoricalDataPoint[] = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const basePrice = symbol === 'EUR/USD' ? 1.0921 :
                       symbol === 'GBP/USD' ? 1.2734 :
                       symbol === 'USD/JPY' ? 148.12 :
                       symbol === 'USD/CHF' ? 0.8654 : 1.0000;
      
      const randomChange = (Math.random() - 0.5) * 0.02;
      const price = basePrice + randomChange;
      
      mockData.push({
        time: date.toISOString().split('T')[0],
        open: price,
        high: price * (1 + Math.random() * 0.005),
        low: price * (1 - Math.random() * 0.005),
        close: price * (1 + (Math.random() - 0.5) * 0.003),
        volume: Math.floor(Math.random() * 10000),
      });
    }
    
    return mockData;
  }

  // Subscribe to order book updates
  public subscribeOrderBook(symbol: string, callback: (update: OrderBookUpdate) => void) {
    const channel = `orderbook.${symbol}`;
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)?.add(callback);
    this.ws.send('subscribe', { channel, symbol });
  }

  // Unsubscribe from order book updates
  public unsubscribeOrderBook(symbol: string, callback: (update: OrderBookUpdate) => void) {
    const channel = `orderbook.${symbol}`;
    if (this.subscriptions.has(channel)) {
      this.subscriptions.get(channel)?.delete(callback);
      if (this.subscriptions.get(channel)?.size === 0) {
        this.ws.send('unsubscribe', { channel, symbol });
        this.subscriptions.delete(channel);
      }
    }
  }

  // Subscribe to trade updates
  public subscribeTrades(symbol: string, callback: (update: TradeUpdate) => void) {
    const channel = `trades.${symbol}`;
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
    }
    this.subscriptions.get(channel)?.add(callback);
    this.ws.send('subscribe', { channel, symbol });
  }

  // Unsubscribe from trade updates
  public unsubscribeTrades(symbol: string, callback: (update: TradeUpdate) => void) {
    const channel = `trades.${symbol}`;
    if (this.subscriptions.has(channel)) {
      this.subscriptions.get(channel)?.delete(callback);
      if (this.subscriptions.get(channel)?.size === 0) {
        this.ws.send('unsubscribe', { channel, symbol });
        this.subscriptions.delete(channel);
      }
    }
  }
}

export default MarketDataService.getInstance();
