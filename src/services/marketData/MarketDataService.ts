import axios from 'axios';
import { Subject } from 'rxjs';

export interface MarketData {
  symbol: string;
  price: number;
  timestamp: number;
  bid: number;
  ask: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export interface MarketDataProvider {
  name: string;
  getRealtimePrice(symbol: string): Promise<MarketData>;
  getHistoricalData(
    symbol: string,
    timeframe: TimeFrame,
    start: Date,
    end: Date
  ): Promise<CandleData[]>;
  subscribeToPrice(symbol: string): Subject<MarketData>;
}

class AlphaVantageProvider implements MarketDataProvider {
  private readonly API_KEY: string;
  private readonly BASE_URL = 'https://www.alphavantage.co/query';
  private priceSubjects: Map<string, Subject<MarketData>> = new Map();

  constructor(apiKey: string) {
    this.API_KEY = apiKey;
  }

  name = 'Alpha Vantage';

  async getRealtimePrice(symbol: string): Promise<MarketData> {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.API_KEY,
        },
      });

      const quote = response.data['Global Quote'];
      return {
        symbol,
        price: parseFloat(quote['05. price']),
        timestamp: Date.now(),
        bid: parseFloat(quote['05. price']) - 0.0001, // Simulated
        ask: parseFloat(quote['05. price']) + 0.0001, // Simulated
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        close: parseFloat(quote['05. price']),
      };
    } catch (error) {
      console.error('Error fetching realtime price:', error);
      throw error;
    }
  }

  async getHistoricalData(
    symbol: string,
    timeframe: TimeFrame,
    start: Date,
    end: Date
  ): Promise<CandleData[]> {
    try {
      const interval = this.convertTimeframe(timeframe);
      const response = await axios.get(this.BASE_URL, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: this.API_KEY,
          outputsize: 'full',
        },
      });

      const timeSeries = response.data[`Time Series (${interval})`];
      return Object.entries(timeSeries)
        .filter(([timestamp]) => {
          const date = new Date(timestamp);
          return date >= start && date <= end;
        })
        .map(([timestamp, data]: [string, any]) => ({
          timestamp: new Date(timestamp).getTime(),
          open: parseFloat(data['1. open']),
          high: parseFloat(data['2. high']),
          low: parseFloat(data['3. low']),
          close: parseFloat(data['4. close']),
          volume: parseInt(data['5. volume']),
        }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  subscribeToPrice(symbol: string): Subject<MarketData> {
    if (!this.priceSubjects.has(symbol)) {
      const subject = new Subject<MarketData>();
      this.priceSubjects.set(symbol, subject);
      this.startPriceUpdates(symbol);
    }
    return this.priceSubjects.get(symbol)!;
  }

  private startPriceUpdates(symbol: string) {
    const updateInterval = setInterval(async () => {
      try {
        const price = await this.getRealtimePrice(symbol);
        this.priceSubjects.get(symbol)?.next(price);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 5000); // Update every 5 seconds

    // Cleanup when all subscribers are gone
    this.priceSubjects.get(symbol)?.subscribe({
      complete: () => {
        clearInterval(updateInterval);
        this.priceSubjects.delete(symbol);
      },
    });
  }

  private convertTimeframe(timeframe: TimeFrame): string {
    switch (timeframe) {
      case '1m':
        return '1min';
      case '5m':
        return '5min';
      case '15m':
        return '15min';
      case '1h':
        return '60min';
      default:
        throw new Error(`Unsupported timeframe: ${timeframe}`);
    }
  }
}

class FXCMProvider implements MarketDataProvider {
  private readonly API_KEY: string;
  private readonly BASE_URL = 'https://api-demo.fxcm.com';
  private priceSubjects: Map<string, Subject<MarketData>> = new Map();

  constructor(apiKey: string) {
    this.API_KEY = apiKey;
  }

  name = 'FXCM';

  async getRealtimePrice(symbol: string): Promise<MarketData> {
    try {
      const response = await axios.get(`${this.BASE_URL}/quotes`, {
        params: {
          pairs: symbol,
        },
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });

      const quote = response.data.quotes[0];
      return {
        symbol,
        price: (quote.bid + quote.ask) / 2,
        timestamp: Date.now(),
        bid: quote.bid,
        ask: quote.ask,
        volume: quote.volume,
        high: quote.high,
        low: quote.low,
        open: quote.open,
        close: quote.close,
      };
    } catch (error) {
      console.error('Error fetching realtime price:', error);
      throw error;
    }
  }

  async getHistoricalData(
    symbol: string,
    timeframe: TimeFrame,
    start: Date,
    end: Date
  ): Promise<CandleData[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/candles`, {
        params: {
          pair: symbol,
          period: this.convertTimeframe(timeframe),
          from: start.getTime(),
          to: end.getTime(),
        },
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
        },
      });

      return response.data.candles.map((candle: any) => ({
        timestamp: candle.timestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  subscribeToPrice(symbol: string): Subject<MarketData> {
    if (!this.priceSubjects.has(symbol)) {
      const subject = new Subject<MarketData>();
      this.priceSubjects.set(symbol, subject);
      this.startPriceUpdates(symbol);
    }
    return this.priceSubjects.get(symbol)!;
  }

  private startPriceUpdates(symbol: string) {
    const updateInterval = setInterval(async () => {
      try {
        const price = await this.getRealtimePrice(symbol);
        this.priceSubjects.get(symbol)?.next(price);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 1000); // Update every second

    // Cleanup when all subscribers are gone
    this.priceSubjects.get(symbol)?.subscribe({
      complete: () => {
        clearInterval(updateInterval);
        this.priceSubjects.delete(symbol);
      },
    });
  }

  private convertTimeframe(timeframe: TimeFrame): string {
    switch (timeframe) {
      case '1m':
        return 'm1';
      case '5m':
        return 'm5';
      case '15m':
        return 'm15';
      case '1h':
        return 'H1';
      case '4h':
        return 'H4';
      case '1d':
        return 'D1';
      case '1w':
        return 'W1';
      default:
        throw new Error(`Unsupported timeframe: ${timeframe}`);
    }
  }
}

class MarketDataService {
  private providers: Map<string, MarketDataProvider> = new Map();
  private defaultProvider: string;

  constructor() {
    // Initialize providers with API keys from environment variables
    this.providers.set(
      'alphavantage',
      new AlphaVantageProvider(process.env.ALPHA_VANTAGE_API_KEY || '')
    );
    this.providers.set(
      'fxcm',
      new FXCMProvider(process.env.FXCM_API_KEY || '')
    );
    this.defaultProvider = 'alphavantage';
  }

  setDefaultProvider(providerName: string) {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider ${providerName} not found`);
    }
    this.defaultProvider = providerName;
  }

  getProvider(providerName?: string): MarketDataProvider {
    const provider = this.providers.get(providerName || this.defaultProvider);
    if (!provider) {
      throw new Error('No market data provider available');
    }
    return provider;
  }

  async getRealtimePrice(
    symbol: string,
    providerName?: string
  ): Promise<MarketData> {
    return this.getProvider(providerName).getRealtimePrice(symbol);
  }

  async getHistoricalData(
    symbol: string,
    timeframe: TimeFrame,
    start: Date,
    end: Date,
    providerName?: string
  ): Promise<CandleData[]> {
    return this.getProvider(providerName).getHistoricalData(
      symbol,
      timeframe,
      start,
      end
    );
  }

  subscribeToPrice(
    symbol: string,
    providerName?: string
  ): Subject<MarketData> {
    return this.getProvider(providerName).subscribeToPrice(symbol);
  }
}

export const marketDataService = new MarketDataService();
