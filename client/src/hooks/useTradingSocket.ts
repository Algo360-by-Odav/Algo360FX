import { useState, useEffect, useCallback, useRef } from 'react';
import tradingSocketService, { MarketDataUpdate } from '../services/tradingSocketService';

interface UseTradingSocketOptions {
  autoConnect?: boolean;
  symbols?: string[];
}

/**
 * Custom hook for connecting to the trading WebSocket and receiving real-time market data
 * @param options Configuration options
 * @returns Object containing market data, connection state, and methods to interact with the socket
 */
export function useTradingSocket(options: UseTradingSocketOptions = {}) {
  const { autoConnect = true, symbols = [] } = options;
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [marketData, setMarketData] = useState<Record<string, MarketDataUpdate['data']>>({});
  const [subscribedSymbols, setSubscribedSymbols] = useState<string[]>([]);
  
  // Use a ref to store the callback to avoid recreating it on every render
  const marketDataCallbackRef = useRef<(data: MarketDataUpdate) => void>((data) => {
    setMarketData(prev => ({
      ...prev,
      [data.symbol]: data.data
    }));
  });

  // Connect to the WebSocket
  const connect = useCallback(() => {
    tradingSocketService.connect();
    setIsConnected(tradingSocketService.isSocketConnected());
    
    // Add listener for market data updates
    tradingSocketService.addListener('marketData', marketDataCallbackRef.current);
    
    // Subscribe to symbols if provided
    if (symbols.length > 0) {
      tradingSocketService.subscribeToSymbols(symbols);
      setSubscribedSymbols(symbols);
    }
  }, [symbols]);

  // Disconnect from the WebSocket
  const disconnect = useCallback(() => {
    tradingSocketService.removeListener('marketData', marketDataCallbackRef.current);
    tradingSocketService.disconnect();
    setIsConnected(false);
    setSubscribedSymbols([]);
  }, []);

  // Subscribe to symbols
  const subscribeToSymbols = useCallback((newSymbols: string[]) => {
    tradingSocketService.subscribeToSymbols(newSymbols);
    setSubscribedSymbols(prev => {
      const uniqueSymbols = new Set([...prev, ...newSymbols]);
      return Array.from(uniqueSymbols);
    });
  }, []);

  // Unsubscribe from symbols
  const unsubscribeFromSymbols = useCallback((symbolsToRemove: string[]) => {
    tradingSocketService.unsubscribeFromSymbols(symbolsToRemove);
    setSubscribedSymbols(prev => prev.filter(symbol => !symbolsToRemove.includes(symbol)));
    
    // Remove market data for unsubscribed symbols
    setMarketData(prev => {
      const newData = { ...prev };
      symbolsToRemove.forEach(symbol => {
        delete newData[symbol];
      });
      return newData;
    });
  }, []);

  // Connect to the WebSocket on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Update connection state when the socket connection changes
  useEffect(() => {
    const checkConnection = () => {
      const connected = tradingSocketService.isSocketConnected();
      setIsConnected(connected);
    };
    
    // Check connection status every second
    const interval = setInterval(checkConnection, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    isConnected,
    marketData,
    subscribedSymbols,
    connect,
    disconnect,
    subscribeToSymbols,
    unsubscribeFromSymbols
  };
}
