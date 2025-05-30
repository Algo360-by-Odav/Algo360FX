// mt5StoreJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

import { makeAutoObservable } from 'mobx';

class MT5StoreJs {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.isConnected = false;
    this.accountInfo = null;
    this.error = null;
    this.chartData = {};
    
    // Mock accounts for development
    this.accounts = [
      { login: '12345', name: 'Demo Account 1' },
      { login: '67890', name: 'Demo Account 2' },
    ];
    
    // Available symbols
    this.symbols = [
      'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 
      'USDCHF', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY',
      'XAUUSD', 'BTCUSD', 'ETHUSD'
    ];
    
    makeAutoObservable(this);
  }

  connect = async (accountId, password) => {
    try {
      // In a real app, this would make an API call to connect to MT5
      // For now, we'll mock it
      console.log(`Connecting to MT5 with account ${accountId}`);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isConnected = true;
      
      // Get account info after connecting
      await this.getAccountInfo();
      
      return true;
    } catch (error) {
      this.error = error.message || 'Failed to connect';
      return false;
    }
  };

  disconnect = async () => {
    // In a real app, this would make an API call to disconnect from MT5
    this.isConnected = false;
    this.accountInfo = null;
    return true;
  };

  getAccountInfo = async () => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    
    // Mock account info
    this.accountInfo = {
      balance: 10000 + Math.random() * 2000,
      equity: 10500 + Math.random() * 1500,
      margin: 1000 + Math.random() * 500,
      freeMargin: 9500 + Math.random() * 500,
      marginLevel: 950 + Math.random() * 50,
      positions: this.generateMockPositions(),
      orders: this.generateMockOrders(),
      trades: this.generateMockTrades(),
    };
    
    return this.accountInfo;
  };

  generateMockPositions = () => {
    // Generate 0-5 random positions
    const count = Math.floor(Math.random() * 6);
    return Array.from({ length: count }, (_, i) => {
      const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const openPrice = 1 + Math.random();
      const currentPrice = openPrice * (1 + (Math.random() * 0.02 - 0.01));
      const volume = Math.round(Math.random() * 10) / 10 + 0.1;
      
      return {
        id: `pos-${i}`,
        symbol,
        type,
        volume,
        openPrice: parseFloat(openPrice.toFixed(5)),
        currentPrice: parseFloat(currentPrice.toFixed(5)),
        stopLoss: Math.random() > 0.3 ? parseFloat((openPrice * (type === 'buy' ? 0.99 : 1.01)).toFixed(5)) : null,
        takeProfit: Math.random() > 0.3 ? parseFloat((openPrice * (type === 'buy' ? 1.01 : 0.99)).toFixed(5)) : null,
        profit: parseFloat((type === 'buy' ? currentPrice - openPrice : openPrice - currentPrice) * volume * 10000).toFixed(2),
        swap: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        commission: parseFloat((Math.random() * 5).toFixed(2)),
      };
    });
  };

  generateMockOrders = () => {
    // Generate 0-3 random orders
    const count = Math.floor(Math.random() * 4);
    return Array.from({ length: count }, (_, i) => {
      const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const openPrice = 1 + Math.random();
      const volume = Math.round(Math.random() * 10) / 10 + 0.1;
      
      return {
        ticket: 1000000 + i,
        symbol,
        type,
        volume,
        openPrice: parseFloat(openPrice.toFixed(5)),
        stopLoss: Math.random() > 0.3 ? parseFloat((openPrice * (type === 'buy' ? 0.99 : 1.01)).toFixed(5)) : null,
        takeProfit: Math.random() > 0.3 ? parseFloat((openPrice * (type === 'buy' ? 1.01 : 0.99)).toFixed(5)) : null,
        comment: `Order ${i+1}`,
      };
    });
  };

  generateMockTrades = () => {
    // Generate 0-10 random trades
    const count = Math.floor(Math.random() * 11);
    return Array.from({ length: count }, (_, i) => {
      const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const openPrice = 1 + Math.random();
      const closePrice = openPrice * (1 + (Math.random() * 0.04 - 0.02));
      const volume = Math.round(Math.random() * 10) / 10 + 0.1;
      
      // Generate random dates within the last 30 days
      const now = new Date();
      const openTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const closeTime = new Date(openTime.getTime() + Math.random() * (now.getTime() - openTime.getTime()));
      
      return {
        ticket: 2000000 + i,
        symbol,
        type,
        volume,
        openPrice: parseFloat(openPrice.toFixed(5)),
        closePrice: parseFloat(closePrice.toFixed(5)),
        profit: parseFloat((type === 'buy' ? closePrice - openPrice : openPrice - closePrice) * volume * 10000).toFixed(2),
        swap: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        commission: parseFloat((Math.random() * 5).toFixed(2)),
        openTime,
        closeTime,
      };
    });
  };

  placeOrder = async (orderData) => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    
    // In a real app, this would make an API call to place an order
    console.log('Placing order:', orderData);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success
    return {
      success: true,
      ticket: Math.floor(Math.random() * 1000000),
      message: 'Order placed successfully',
    };
  };

  modifyPosition = async (positionId, stopLoss, takeProfit) => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    
    // In a real app, this would make an API call to modify a position
    console.log('Modifying position:', positionId, stopLoss, takeProfit);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success
    return {
      success: true,
      message: 'Position modified successfully',
    };
  };

  closePosition = async (positionId) => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    
    // In a real app, this would make an API call to close a position
    console.log('Closing position:', positionId);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success
    return {
      success: true,
      message: 'Position closed successfully',
    };
  };

  cancelOrder = async (ticket) => {
    if (!this.isConnected) {
      throw new Error('Not connected to MT5');
    }
    
    // In a real app, this would make an API call to cancel an order
    console.log('Cancelling order:', ticket);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success
    return {
      success: true,
      message: 'Order cancelled successfully',
    };
  };

  getChartData = async (symbol, timeframe) => {
    // In a real app, this would make an API call to get chart data
    const key = `${symbol}-${timeframe}`;
    
    if (this.chartData[key]) {
      return this.chartData[key];
    }
    
    // Generate mock chart data
    const count = 100;
    const data = [];
    let lastClose = 1 + Math.random();
    
    for (let i = 0; i < count; i++) {
      const time = new Date();
      time.setHours(time.getHours() - (count - i));
      
      const open = lastClose;
      const close = open * (1 + (Math.random() * 0.02 - 0.01));
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      const volume = Math.floor(Math.random() * 1000) + 100;
      
      data.push({
        time: time.toISOString(),
        open: parseFloat(open.toFixed(5)),
        high: parseFloat(high.toFixed(5)),
        low: parseFloat(low.toFixed(5)),
        close: parseFloat(close.toFixed(5)),
        volume,
      });
      
      lastClose = close;
    }
    
    this.chartData[key] = data;
    return data;
  };
}

// Create and export the store
const mt5Store = new MT5StoreJs();
export default mt5Store;
