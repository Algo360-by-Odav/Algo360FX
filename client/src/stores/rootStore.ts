import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { authStore } from './authStore';
import { uiStore } from './uiStore';
import { PortfolioStore } from './portfolioStore';
import { analysisStore } from './analysisStore';
import { strategyStore } from './strategyStore';
import { newsStore } from './newsStore';
import { priceStore } from './priceStore';
import { autoTradingStore } from './autoTradingStore';
import { hftStore } from './hftStore';
import { backtestingStore } from './backtestingStore';
import { tradingStore } from './tradingStore';
import { RiskManagementStore } from './riskManagementStore';
import { BrokerStore } from './brokerStore';
import { MoneyManagerStore } from './moneyManagerStore';
import { SignalProviderStore } from './signalProviderStore';
import { InvestorPortalStore } from './investorPortalStore';
import { EbookStore } from './ebookStore';
import { nftStore } from './nftStore';
import { MT5Store } from './mt5Store';
import { subscriptionService } from '../services/subscriptionService';

export class RootStore {
  authStore = authStore;
  uiStore = uiStore;
  portfolioStore: PortfolioStore;
  analysisStore = analysisStore;
  strategyStore = strategyStore;
  newsStore = newsStore;
  priceStore = priceStore;
  autoTradingStore = autoTradingStore;
  hftStore = hftStore;
  backtestingStore = backtestingStore;
  tradingStore = tradingStore;
  riskManagementStore: RiskManagementStore;
  brokerStore: BrokerStore;
  moneyManagerStore: MoneyManagerStore;
  signalProviderStore: SignalProviderStore;
  investorPortalStore: InvestorPortalStore;
  ebookStore: EbookStore;
  nftStore = nftStore;
  mt5Store: MT5Store;
  subscriptionService = subscriptionService;

  constructor() {
    makeAutoObservable(this);
    this.portfolioStore = new PortfolioStore();
    this.riskManagementStore = new RiskManagementStore(this);
    this.brokerStore = new BrokerStore(this);
    this.moneyManagerStore = new MoneyManagerStore(this);
    this.signalProviderStore = new SignalProviderStore(this);
    this.investorPortalStore = new InvestorPortalStore(this);
    this.ebookStore = new EbookStore();
    this.mt5Store = new MT5Store(this);
  }
}

export const rootStore = new RootStore();
export const RootStoreContext = createContext<RootStore | null>(null);
