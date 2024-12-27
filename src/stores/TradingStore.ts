import { makeAutoObservable, runInAction, observable, action } from 'mobx';
import { RootStore } from './RootStore';
import { tradingService } from '@/services/TradingService';
import WebSocketService from '@/services/websocketService';
import {
  Trade,
  Position,
  Strategy,
  BacktestConfig,
  BacktestResult,
  TimeFrame,
  MarketEnvironment,
  Portfolio,
  StrategyPerformance,
  MarketData,
  OrderBook,
  Ticker,
} from '@/types/trading';

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
}

export class TradingStore {
  private rootStore: RootStore;
  private _positions: Map<string, Position> = new Map();
  private _trades: Map<string, Trade> = new Map();
  private _strategies: Map<string, Strategy> = new Map();
  public marketData: Map<string, MarketData> = new Map();
  public orderBook: Map<string, OrderBook> = new Map();
  public tickers: Map<string, Ticker> = new Map();
  public accountInfo: AccountInfo | null = null;
  public portfolio: Portfolio | null = null;
  public loading: boolean = false;
  public error: string | null = null;
  public isConnected: boolean = false;
  public isInitialized: boolean = false;
  @observable activeSymbol: string = 'EURUSD';
  @observable timeframe: TimeFrame = '1h';
  @observable marketEnvironment: MarketEnvironment | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
      setupWebSocket: false,
    });
    this.setupWebSocket();
    this.initializeDefaultState();
  }

  private async initializeDefaultState() {
    try {
      this.setLoading(true);
      const [portfolio, positions, strategies] = await Promise.all([
        tradingService.getPortfolio(),
        tradingService.getPositions(),
        tradingService.getStrategies(),
      ]);

      runInAction(() => {
        this.portfolio = portfolio;
        positions.forEach(pos => this._positions.set(pos.symbol, pos));
        strategies.forEach(strat => this._strategies.set(strat.id, strat));
        this.isInitialized = true;
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to initialize trading store');
    } finally {
      this.setLoading(false);
    }
  }

  // Market Data Methods
  async fetchMarketData(symbol: string, timeframe: TimeFrame, limit: number = 1000) {
    try {
      this.setLoading(true);
      const data = await tradingService.getMarketData(symbol, timeframe, limit);
      runInAction(() => {
        data.forEach(candle => {
          if (!this.marketData.has(symbol)) {
            this.marketData.set(symbol, candle);
          }
        });
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to fetch market data');
    } finally {
      this.setLoading(false);
    }
  }

  async fetchOrderBook(symbol: string) {
    try {
      const orderBook = await tradingService.getOrderBook(symbol);
      runInAction(() => {
        this.orderBook.set(symbol, orderBook);
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to fetch order book');
    }
  }

  async fetchTicker(symbol: string) {
    try {
      const ticker = await tradingService.getTicker(symbol);
      runInAction(() => {
        this.tickers.set(symbol, ticker);
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to fetch ticker');
    }
  }

  // Trading Methods
  async placeTrade(trade: Omit<Trade, 'id'>) {
    try {
      this.setLoading(true);
      const newTrade = await tradingService.placeTrade(trade);
      runInAction(() => {
        this._trades.set(newTrade.id, newTrade);
      });
      return newTrade;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to place trade');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async closeTrade(tradeId: string, price?: number) {
    try {
      this.setLoading(true);
      const closedTrade = await tradingService.closeTrade(tradeId, price);
      runInAction(() => {
        this._trades.set(closedTrade.id, closedTrade);
      });
      return closedTrade;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to close trade');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Position Methods
  async closePosition(symbol: string) {
    try {
      this.setLoading(true);
      await tradingService.closePosition(symbol);
      runInAction(() => {
        this._positions.delete(symbol);
      });
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to close position');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // Strategy Methods
  async createStrategy(strategy: Omit<Strategy, 'id'>) {
    try {
      this.setLoading(true);
      const newStrategy = await tradingService.createStrategy(strategy);
      runInAction(() => {
        this._strategies.set(newStrategy.id, newStrategy);
      });
      return newStrategy;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to create strategy');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    try {
      this.setLoading(true);
      return await tradingService.runBacktest(config);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Failed to run backtest');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  // WebSocket setup
  private setupWebSocket() {
    WebSocketService.connect();

    WebSocketService.subscribeToConnectionStatus((status) => {
      runInAction(() => {
        this.isConnected = status === 'connected';
        if (!this.isConnected) {
          this.error = 'WebSocket disconnected';
        } else {
          this.error = null;
        }
      });
    });

    WebSocketService.subscribe('market_data', (data: MarketData) => {
      runInAction(() => {
        this.marketData.set(data.symbol, data);
      });
    });

    WebSocketService.subscribe('order_book', (data: OrderBook) => {
      runInAction(() => {
        this.orderBook.set(data.symbol, data);
      });
    });

    WebSocketService.subscribe('ticker', (data: Ticker) => {
      runInAction(() => {
        this.tickers.set(data.symbol, data);
      });
    });

    WebSocketService.subscribe('trade_update', (data: Trade) => {
      runInAction(() => {
        this._trades.set(data.id, data);
      });
    });

    WebSocketService.subscribe('position_update', (data: Position) => {
      runInAction(() => {
        this._positions.set(data.symbol, data);
      });
    });

    WebSocketService.subscribe('portfolio_update', (data: Portfolio) => {
      runInAction(() => {
        this.portfolio = data;
      });
    });
  }

  // Computed getters
  get positions(): Position[] {
    return Array.from(this._positions.values());
  }

  get trades(): Trade[] {
    return Array.from(this._trades.values());
  }

  get strategies(): Strategy[] {
    return Array.from(this._strategies.values());
  }

  get activePositions(): Position[] {
    return this.positions.filter(position => position.size !== 0);
  }

  get openTrades(): Trade[] {
    return this.trades.filter(trade => trade.status === 'OPEN');
  }

  // Actions
  @action setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action setError(error: string | null) {
    this.error = error;
  }

  @action setActiveSymbol(symbol: string) {
    this.activeSymbol = symbol;
  }

  @action setTimeframe(timeframe: TimeFrame) {
    this.timeframe = timeframe;
  }

  // Static helper
  static useTradingStore = () => {
    const rootStore = RootStore.getInstance();
    return rootStore.tradeStore;
  };
}
