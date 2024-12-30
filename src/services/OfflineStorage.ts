import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Algo360FXDB extends DBSchema {
  trades: {
    key: string;
    value: {
      id: string;
      symbol: string;
      type: 'BUY' | 'SELL';
      amount: number;
      price: number;
      timestamp: number;
      status: 'pending' | 'synced' | 'failed';
    };
    indexes: { 'by-status': string };
  };
  marketData: {
    key: string;
    value: {
      symbol: string;
      price: number;
      timestamp: number;
    };
  };
  priceAlerts: {
    key: string;
    value: {
      id: string;
      symbol: string;
      condition: 'above' | 'below';
      price: number;
      status: 'active' | 'triggered' | 'deleted';
      createdAt: number;
      triggeredAt?: number;
    };
    indexes: { 'by-symbol': string; 'by-status': string };
  };
  news: {
    key: string;
    value: {
      id: string;
      title: string;
      content: string;
      timestamp: number;
      category: string;
      importance: 'high' | 'medium' | 'low';
      read: boolean;
    };
    indexes: { 'by-timestamp': number; 'by-category': string };
  };
  accountSummary: {
    key: string;
    value: {
      balance: number;
      equity: number;
      margin: number;
      freeMargin: number;
      marginLevel: number;
      positions: Array<{
        symbol: string;
        type: 'BUY' | 'SELL';
        volume: number;
        openPrice: number;
        currentPrice: number;
        profit: number;
      }>;
      lastUpdate: number;
    };
  };
  userPreferences: {
    key: string;
    value: {
      theme: 'light' | 'dark';
      favoriteSymbols: string[];
      chartSettings: Record<string, any>;
      alertSettings: {
        sound: boolean;
        push: boolean;
        email: boolean;
      };
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<Algo360FXDB> | null = null;
  private readonly DB_NAME = 'algo360fx-db';
  private readonly VERSION = 1;

  async init() {
    this.db = await openDB<Algo360FXDB>(this.DB_NAME, this.VERSION, {
      upgrade(db) {
        // Create trades store
        const tradesStore = db.createObjectStore('trades', {
          keyPath: 'id',
        });
        tradesStore.createIndex('by-status', 'status');

        // Create market data store
        db.createObjectStore('marketData', {
          keyPath: 'symbol',
        });

        // Create price alerts store
        const alertsStore = db.createObjectStore('priceAlerts', {
          keyPath: 'id',
        });
        alertsStore.createIndex('by-symbol', 'symbol');
        alertsStore.createIndex('by-status', 'status');

        // Create news store
        const newsStore = db.createObjectStore('news', {
          keyPath: 'id',
        });
        newsStore.createIndex('by-timestamp', 'timestamp');
        newsStore.createIndex('by-category', 'category');

        // Create account summary store
        db.createObjectStore('accountSummary', {
          keyPath: 'id',
        });

        // Create user preferences store
        db.createObjectStore('userPreferences', {
          keyPath: 'id',
        });
      },
    });
  }

  async saveTrade(trade: Algo360FXDB['trades']['value']) {
    if (!this.db) await this.init();
    await this.db!.put('trades', trade);
  }

  async getPendingTrades() {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('trades', 'by-status', 'pending');
  }

  async updateTradeStatus(id: string, status: 'synced' | 'failed') {
    if (!this.db) await this.init();
    const trade = await this.db!.get('trades', id);
    if (trade) {
      trade.status = status;
      await this.db!.put('trades', trade);
    }
  }

  async saveMarketData(data: Algo360FXDB['marketData']['value']) {
    if (!this.db) await this.init();
    await this.db!.put('marketData', data);
  }

  async getMarketData(symbol: string) {
    if (!this.db) await this.init();
    return this.db!.get('marketData', symbol);
  }

  async saveUserPreferences(prefs: Algo360FXDB['userPreferences']['value']) {
    if (!this.db) await this.init();
    await this.db!.put('userPreferences', { id: 'user-prefs', ...prefs });
  }

  async getUserPreferences() {
    if (!this.db) await this.init();
    return this.db!.get('userPreferences', 'user-prefs');
  }

  // Price Alerts methods
  async createPriceAlert(alert: Omit<Algo360FXDB['priceAlerts']['value'], 'id' | 'status' | 'createdAt'>) {
    if (!this.db) await this.init();
    const newAlert = {
      ...alert,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: Date.now(),
    };
    await this.db!.put('priceAlerts', newAlert);
    return newAlert;
  }

  async getPriceAlerts(symbol?: string) {
    if (!this.db) await this.init();
    if (symbol) {
      return this.db!.getAllFromIndex('priceAlerts', 'by-symbol', symbol);
    }
    return this.db!.getAll('priceAlerts');
  }

  async updatePriceAlert(id: string, update: Partial<Algo360FXDB['priceAlerts']['value']>) {
    if (!this.db) await this.init();
    const alert = await this.db!.get('priceAlerts', id);
    if (alert) {
      await this.db!.put('priceAlerts', { ...alert, ...update });
    }
  }

  // News methods
  async saveNews(news: Omit<Algo360FXDB['news']['value'], 'id' | 'read'>) {
    if (!this.db) await this.init();
    const newNews = {
      ...news,
      id: crypto.randomUUID(),
      read: false,
    };
    await this.db!.put('news', newNews);
    return newNews;
  }

  async getNews(category?: string) {
    if (!this.db) await this.init();
    if (category) {
      return this.db!.getAllFromIndex('news', 'by-category', category);
    }
    return this.db!.getAllFromIndex('news', 'by-timestamp');
  }

  async markNewsAsRead(id: string) {
    if (!this.db) await this.init();
    const news = await this.db!.get('news', id);
    if (news) {
      await this.db!.put('news', { ...news, read: true });
    }
  }

  // Account Summary methods
  async saveAccountSummary(summary: Algo360FXDB['accountSummary']['value']) {
    if (!this.db) await this.init();
    await this.db!.put('accountSummary', { ...summary, id: 'current', lastUpdate: Date.now() });
  }

  async getAccountSummary() {
    if (!this.db) await this.init();
    return this.db!.get('accountSummary', 'current');
  }
}

export const offlineStorage = new OfflineStorage();
