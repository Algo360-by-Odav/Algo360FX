import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

export interface PriceUpdate {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface OrderType {
  id: string;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL';
  symbol: string;
  price?: number;
  stopPrice?: number;
  quantity: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK';
}

class PriceService {
  private connection: HubConnection | null = null;
  private subscribers: Map<string, Set<(price: PriceUpdate) => void>> = new Map();
  private isDemo = true; // Always use demo mode for now
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    if (this.isDemo) {
      console.log('Starting price simulation (demo mode)');
      this.startPriceSimulation();
      return;
    }

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl('https://api.algo360fx.com/prices')
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === 0) {
              return 0; // First retry immediately
            }
            if (retryContext.previousRetryCount < 3) {
              return 2000; // Then retry after 2 seconds
            }
            return null; // Stop retrying after 3 attempts
          }
        })
        .build();

      this.connection.onclose((error) => {
        console.log('Connection closed, switching to demo mode', error);
        this.isDemo = true;
        this.startPriceSimulation();
      });

      this.connection.on('priceUpdate', (update: PriceUpdate) => {
        this.handlePriceUpdate(update);
      });

      await this.connection.start();
      console.log('Connected to price feed');
    } catch (err) {
      console.log('Error connecting to price feed, using demo mode:', err);
      this.isDemo = true;
      this.startPriceSimulation();
    }
  }

  private handlePriceUpdate(update: PriceUpdate) {
    const subscribers = this.subscribers.get(update.symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(update));
    }
  }

  private startPriceSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
    const baseValues = {
      EURUSD: 1.05134,
      GBPUSD: 1.24976,
      USDJPY: 150.186,
      AUDUSD: 0.63003,
      USDCAD: 1.43665,
    };

    // Generate initial price history
    symbols.forEach(symbol => {
      const baseValue = baseValues[symbol as keyof typeof baseValues];
      const subscribers = this.subscribers.get(symbol);
      if (subscribers) {
        // Generate last 100 candles for initial data
        const now = Date.now();
        for (let i = 100; i >= 0; i--) {
          const time = now - (i * 60000); // One minute intervals
          const variation = (Math.random() - 0.5) * 0.0002;
          const bid = baseValue + variation;
          const ask = bid + 0.00002;
          subscribers.forEach(callback => callback({
            symbol,
            bid,
            ask,
            timestamp: time,
          }));
        }
      }
    });

    // Start real-time updates
    this.simulationInterval = setInterval(() => {
      symbols.forEach(symbol => {
        const baseValue = baseValues[symbol as keyof typeof baseValues];
        const variation = (Math.random() - 0.5) * 0.0001;
        const bid = baseValue + variation;
        const ask = bid + 0.00002;

        this.handlePriceUpdate({
          symbol,
          bid,
          ask,
          timestamp: Date.now(),
        });
      });
    }, 1000);
  }

  subscribe(symbol: string, callback: (price: PriceUpdate) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      if (this.connection?.state === 'Connected') {
        this.connection.invoke('SubscribeToSymbol', symbol).catch(err => {
          console.error('Error subscribing to symbol:', err);
        });
      }
    }
    this.subscribers.get(symbol)!.add(callback);
  }

  unsubscribe(symbol: string, callback: (price: PriceUpdate) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.connection?.state === 'Connected') {
          this.connection.invoke('UnsubscribeFromSymbol', symbol).catch(err => {
            console.error('Error unsubscribing from symbol:', err);
          });
        }
      }
    }
  }

  cleanup() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    if (this.connection) {
      this.connection.stop();
    }
  }
}

export const priceService = new PriceService();
