import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { api } from '../services/api';
import { Candle, TimeFrame, MarketData, OrderBook, Ticker } from '../types/trading';

interface PriceSubscription {
  symbol: string;
  callback: (price: MarketData) => void;
}

export class MarketStore {
  private priceMap: Map<string, MarketData> = new Map();
  private candleMap: Map<string, Candle[]> = new Map();
  private orderBookMap: Map<string, OrderBook> = new Map();
  private subscriptions: PriceSubscription[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
      retryOperation: false,
      hasSubscribers: false,
      notifySubscribers: false
    });
    this.initializeDefaultMarkets();
  }

  initializeDefaultMarkets() {
    const defaultSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'];
    defaultSymbols.forEach(symbol => {
      this.priceMap.set(symbol, {
        symbol,
        bid: 0,
        ask: 0,
        timestamp: new Date().toISOString()
      });
    });
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    throw lastError;
  }

  async fetchMarketData(symbol: string) {
    try {
      this.loading = true;
      const response = await this.retryOperation(() => 
        api.get(`/market/${symbol}`)
      );
      runInAction(() => {
        this.priceMap.set(symbol, response.data);
        this.notifySubscribers(symbol, response.data);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch market data';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchHistoricalData(symbol: string, timeframe: TimeFrame, limit: number = 1000): Promise<Candle[]> {
    try {
      this.loading = true;
      const response = await this.retryOperation(() =>
        api.get(`/market/${symbol}/candles`, {
          params: { timeframe, limit },
        })
      );
      
      const candles = response.data.map((candle: any) => ({
        ...candle,
        timestamp: Number(candle.timestamp),
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
        volume: Number(candle.volume),
      }));

      runInAction(() => {
        this.candleMap.set(symbol, candles);
      });

      return candles;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch historical data';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchCandles(symbol: string, timeframe: TimeFrame, limit: number = 1000) {
    try {
      this.loading = true;
      const candles = await this.fetchHistoricalData(symbol, timeframe, limit);
      runInAction(() => {
        this.candleMap.set(symbol, candles);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch candles';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchOrderBook(symbol: string, depth: number = 10) {
    try {
      this.loading = true;
      const response = await this.retryOperation(() =>
        api.get(`/market/${symbol}/orderbook`, {
          params: { depth },
        })
      );
      runInAction(() => {
        this.orderBookMap.set(symbol, response.data);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch order book';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  subscribeToPrice(symbol: string, callback: (price: MarketData) => void) {
    this.subscriptions.push({ symbol, callback });
    const currentPrice = this.priceMap.get(symbol);
    if (currentPrice) {
      callback(currentPrice);
    }
    this.rootStore.webSocketStore.subscribe(`market:${symbol}`);
  }

  unsubscribeFromPrice(symbol: string, callback: (price: MarketData) => void) {
    this.subscriptions = this.subscriptions.filter(
      sub => !(sub.symbol === symbol && sub.callback === callback)
    );
    if (!this.hasSubscribers(symbol)) {
      this.rootStore.webSocketStore.unsubscribe(`market:${symbol}`);
    }
  }

  subscribeToCandles(symbol: string, timeframe: TimeFrame, callback: (candle: Candle) => void) {
    const channel = `market:${symbol}:${timeframe}`;
    
    const handleWebSocketMessage = (message: any) => {
      try {
        const candle = {
          ...message,
          timestamp: Number(message.timestamp),
          open: Number(message.open),
          high: Number(message.high),
          low: Number(message.low),
          close: Number(message.close),
          volume: Number(message.volume),
        };
        callback(candle);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.rootStore.webSocketStore.subscribe(channel, handleWebSocketMessage);

    return () => {
      this.rootStore.webSocketStore.unsubscribe(channel);
    };
  }

  unsubscribeFromCandles(symbol: string, timeframe: TimeFrame) {
    const channel = `market:${symbol}:${timeframe}`;
    this.rootStore.webSocketStore.unsubscribe(channel);
  }

  private hasSubscribers(symbol: string): boolean {
    return this.subscriptions.some(sub => sub.symbol === symbol);
  }

  private notifySubscribers(symbol: string, data: MarketData) {
    this.subscriptions
      .filter(sub => sub.symbol === symbol)
      .forEach(sub => sub.callback(data));
  }

  updateMarketData(symbol: string, data: MarketData) {
    this.priceMap.set(symbol, data);
    this.notifySubscribers(symbol, data);
  }

  updateOrderBook(symbol: string, data: OrderBook) {
    this.orderBookMap.set(symbol, data);
  }

  addCandle(symbol: string, candle: Candle) {
    const candles = this.candleMap.get(symbol) || [];
    candles.push(candle);
    this.candleMap.set(symbol, candles);
  }

  get allPrices(): Map<string, MarketData> {
    return this.priceMap;
  }

  get allCandles(): Map<string, Candle[]> {
    return this.candleMap;
  }

  get allOrderBooks(): Map<string, OrderBook> {
    return this.orderBookMap;
  }

  getPrice(symbol: string): MarketData | undefined {
    return this.priceMap.get(symbol);
  }

  getCandles(symbol: string): Candle[] | undefined {
    return this.candleMap.get(symbol);
  }

  getOrderBook(symbol: string): OrderBook | undefined {
    return this.orderBookMap.get(symbol);
  }

  get availableSymbols(): string[] {
    return Array.from(this.priceMap.keys());
  }

  get topGainers(): Ticker[] {
    return Array.from(this.priceMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        price: data.last,
        change: ((data.last - data.open) / data.open) * 100,
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
  }

  get topLosers(): Ticker[] {
    return Array.from(this.priceMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        price: data.last,
        change: ((data.last - data.open) / data.open) * 100,
      }))
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);
  }

  get mostVolume(): Ticker[] {
    return Array.from(this.priceMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        price: data.last,
        volume: data.volume,
      }))
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 5);
  }

  calculateSpread(symbol: string): number {
    const data = this.priceMap.get(symbol);
    if (!data) return 0;
    return data.ask - data.bid;
  }

  calculateVolatility(symbol: string): number {
    const candles = this.candleMap.get(symbol);
    if (!candles || candles.length < 2) return 0;

    const returns = candles.slice(1).map((candle, i) => {
      const prevCandle = candles[i];
      return Math.log(candle.close / prevCandle.close);
    });

    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }
}
