import { offlineStorage } from './OfflineStorage';

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds

  startSync() {
    if (this.syncInterval) return;
    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, this.SYNC_INTERVAL);
    this.syncAll(); // Initial sync
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async syncAll() {
    if (!navigator.onLine) return;

    try {
      await Promise.all([
        this.syncPendingTrades(),
        this.syncPriceAlerts(),
        this.syncMarketData(),
        this.syncNews(),
        this.syncAccountData(),
      ]);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  private async syncPendingTrades() {
    try {
      // Sync pending trades
      const pendingTrades = await offlineStorage.getPendingTrades();
      for (const trade of pendingTrades) {
        try {
          // Attempt to sync trade with server
          await this.syncTrade(trade);
          await offlineStorage.updateTradeStatus(trade.id, 'synced');
        } catch (error) {
          console.error('Failed to sync trade:', error);
          await offlineStorage.updateTradeStatus(trade.id, 'failed');
        }
      }
    } catch (error) {
      console.error('Failed to sync pending trades:', error);
    }
  }

  private async syncPriceAlerts() {
    try {
      // Get active alerts from server
      const response = await fetch('/api/price-alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const serverAlerts = await response.json();

      // Update local alerts
      for (const alert of serverAlerts) {
        const { id, symbol, condition, price, status } = alert;
        await offlineStorage.updatePriceAlert(id, {
          symbol,
          condition,
          price,
          status,
        });
      }
    } catch (error) {
      console.error('Failed to sync price alerts:', error);
    }
  }

  private async syncMarketData() {
    try {
      // Sync logic for market data
      // TO DO: implement market data sync logic
    } catch (error) {
      console.error('Failed to sync market data:', error);
    }
  }

  private async syncNews() {
    try {
      // Get latest news from server
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const serverNews = await response.json();

      // Save new articles locally
      for (const article of serverNews) {
        await offlineStorage.saveNews({
          title: article.title,
          content: article.content,
          timestamp: article.timestamp,
          category: article.category,
          importance: article.importance,
        });
      }
    } catch (error) {
      console.error('Failed to sync news:', error);
    }
  }

  private async syncAccountData() {
    try {
      // Get account summary from server
      const response = await fetch('/api/account/summary');
      if (!response.ok) throw new Error('Failed to fetch account summary');
      const accountSummary = await response.json();

      // Update local account summary
      await offlineStorage.saveAccountSummary(accountSummary);
    } catch (error) {
      console.error('Failed to sync account data:', error);
    }
  }

  private async syncTrade(trade: any) {
    // Implement your API call here
    const response = await fetch('/api/trades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trade),
    });

    if (!response.ok) {
      throw new Error('Failed to sync trade');
    }

    return response.json();
  }

  // Listen for online/offline events
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('Back online, starting sync...');
      this.syncAll();
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline, stopping sync...');
      this.stopSync();
    });
  }
}

export const syncService = new SyncService();
