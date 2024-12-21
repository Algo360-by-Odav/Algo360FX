import { makeAutoObservable, configure } from 'mobx';
import { AuthStore } from './AuthStore';
import { NotificationStore } from './NotificationStore';
import { UserStore } from './UserStore';
import { PortfolioStore } from './PortfolioStore';
import { TradeStore } from './TradeStore';
import { MarketStore } from './MarketStore';
import { StrategyStore } from './StrategyStore';
import { AnalyticsStore } from './AnalyticsStore';
import { WebSocketStore } from './WebSocketStore';
import { AlgoTradingStore } from './AlgoTradingStore';
import { HFTStore } from './HFTStore';
import { UserPreferencesStore } from './UserPreferencesStore';
import { TradingStore } from './TradingStore';
import { OptimizationStore } from './OptimizationStore';
import { SignalProviderStore } from './SignalProviderStore';
import { InvestmentStore } from './InvestmentStore';
import { StockMarketStore } from './StockMarketStore';

// Configure MobX
configure({
  enforceActions: 'never',
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false
});

export class RootStore {
  private static instance: RootStore | null = null;

  // Declare all stores as public
  public authStore: AuthStore;
  public notificationStore: NotificationStore;
  public userStore: UserStore;
  public portfolioStore: PortfolioStore;
  public tradeStore: TradeStore;
  public marketStore: MarketStore;
  public strategyStore: StrategyStore;
  public analyticsStore: AnalyticsStore;
  public webSocketStore: WebSocketStore;
  public algoTradingStore: AlgoTradingStore;
  public hftStore: HFTStore;
  public userPreferencesStore: UserPreferencesStore;
  public tradingStore: TradingStore;
  public optimizationStore: OptimizationStore;
  public signalProviderStore: SignalProviderStore;
  public investmentStore: InvestmentStore;
  public stockMarketStore: StockMarketStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    // Initialize WebSocket first as other stores might depend on it
    this.webSocketStore = new WebSocketStore(this);

    // Initialize stores that don't depend on others
    this.authStore = new AuthStore(this);
    this.notificationStore = new NotificationStore(this);
    this.userStore = new UserStore(this);
    this.userPreferencesStore = new UserPreferencesStore(this);

    // Initialize market-related stores
    this.marketStore = new MarketStore(this);
    this.portfolioStore = new PortfolioStore(this);
    this.stockMarketStore = new StockMarketStore(this);
    
    // Initialize trading-related stores
    this.tradeStore = new TradeStore(this);
    this.tradingStore = new TradingStore(this);
    this.strategyStore = new StrategyStore(this);
    
    // Initialize analysis stores
    this.analyticsStore = new AnalyticsStore(this);
    this.algoTradingStore = new AlgoTradingStore(this);
    this.hftStore = new HFTStore(this);
    this.optimizationStore = new OptimizationStore(this);

    // Initialize signal and investment stores
    this.signalProviderStore = new SignalProviderStore(this);
    this.investmentStore = new InvestmentStore(this);

    // Initialize default data for development
    if (process.env.NODE_ENV === 'development') {
      this.initializeDefaultData();
    }
  }

  static getInstance(): RootStore {
    if (!RootStore.instance) {
      RootStore.instance = new RootStore();
    }
    return RootStore.instance;
  }

  static resetInstance(): void {
    RootStore.instance = null;
  }

  initializeDefaultData() {
    // Initialize default data for development environment
    this.authStore.currentUser = {
      id: 'dev-user',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'admin'
    };

    // Initialize market data
    this.marketStore.initializeDefaultMarkets();

    // Initialize trading data
    this.tradingStore.initializeDefaultState();

    // Initialize WebSocket connections
    this.webSocketStore.connect();
  }
}
