import { useState, useEffect } from 'react';
import { offlineStorage } from '@/services/OfflineStorage';
import { syncService } from '@/services/SyncService';

export function useOfflineCapability() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Start sync service
    syncService.setupNetworkListeners();
    if (navigator.onLine) {
      syncService.startSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      syncService.stopSync();
    };
  }, []);

  const executeTrade = async (trade: any) => {
    try {
      if (!navigator.onLine) {
        // Save trade locally with pending status
        await offlineStorage.saveTrade({
          ...trade,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          status: 'pending',
        });
        return { success: true, offline: true };
      }

      // Execute trade online
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade),
      });

      if (!response.ok) {
        throw new Error('Failed to execute trade');
      }

      return { success: true, offline: false };
    } catch (error) {
      console.error('Trade execution failed:', error);
      // Save failed trade locally
      await offlineStorage.saveTrade({
        ...trade,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: 'failed',
      });
      return { success: false, offline: true };
    }
  };

  const getMarketData = async (symbol: string) => {
    try {
      if (!navigator.onLine) {
        // Get cached market data
        return await offlineStorage.getMarketData(symbol);
      }

      // Fetch fresh market data
      const response = await fetch(`/api/market-data/${symbol}`);
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const data = await response.json();
      // Cache the fresh data
      await offlineStorage.saveMarketData({
        symbol,
        price: data.price,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Failed to get market data:', error);
      // Return cached data as fallback
      return await offlineStorage.getMarketData(symbol);
    }
  };

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    executeTrade,
    getMarketData,
  };
}
