import { makeAutoObservable } from 'mobx';
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

export class RootStore {
  authStore: AuthStore;
  notificationStore: NotificationStore;
  userStore: UserStore;
  portfolioStore: PortfolioStore;
  tradeStore: TradeStore;
  marketStore: MarketStore;
  strategyStore: StrategyStore;
  analyticsStore: AnalyticsStore;
  webSocketStore: WebSocketStore;
  algoTradingStore: AlgoTradingStore;
  hftStore: HFTStore;
  userPreferencesStore: UserPreferencesStore;
  tradingStore: TradingStore;

  constructor() {
    makeAutoObservable(this);
    
    // Initialize stores with default development user
    this.authStore = new AuthStore(this);
    this.notificationStore = new NotificationStore(this);
    this.userStore = new UserStore(this);
    this.portfolioStore = new PortfolioStore(this);
    this.tradeStore = new TradeStore(this);
    this.marketStore = new MarketStore(this);
    this.strategyStore = new StrategyStore(this);
    this.analyticsStore = new AnalyticsStore(this);
    this.webSocketStore = new WebSocketStore(this);
    this.algoTradingStore = new AlgoTradingStore(this);
    this.hftStore = new HFTStore(this);
    this.userPreferencesStore = new UserPreferencesStore(this);
    this.tradingStore = new TradingStore(this);

    // Set default user for development
    if (process.env.NODE_ENV === 'development') {
      this.authStore.currentUser = {
        id: '1',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        role: 'user'
      };
      this.authStore.loading = false;
    }
  }
}
