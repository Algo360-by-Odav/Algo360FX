import { makeAutoObservable, runInAction } from 'mobx';
import { PriceUpdate } from '../services/priceService';

export interface Position {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: Date;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  price?: number;
  quantity: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: Date;
  pnl?: number;
}

export interface SubmitOrderParams {
  symbol: string;
  type: string;
  side: string;
  quantity: number;
  price?: number;
}

export class TradingStore {
  prices: { [symbol: string]: PriceUpdate } = {};
  previousPrices: { [symbol: string]: PriceUpdate } = {};
  positions: Position[] = [];
  tradeHistory: Trade[] = [];
  availableSymbols: string[] = [
    // Forex Pairs
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD', 'NZDUSD',
    // US Stocks
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'BAC', 'WMT',
    // Malaysia Stocks (KLSE)
    'MAYBANK.KL', 'PBBANK.KL', 'TENAGA.KL', 'PCHEM.KL', 'CIMB.KL',
    'TOPGLOV.KL', 'AXIATA.KL', 'DIGI.KL', 'MAXIS.KL', 'GENTING.KL',
    // Nigeria Stocks (NGX)
    'DANGCEM.LG', 'MTNN.LG', 'BUACEMENT.LG', 'AIRTEL.LG', 'GTCO.LG',
    'ZENITHBA.LG', 'BUAFOODS.LG', 'NESTLE.LG', 'FBNH.LG', 'UBA.LG'
  ];
  selectedSymbol: string = 'EURUSD';
  isLoading: boolean = false;
  lastOrderId: number = 0;
  instrumentType: { [symbol: string]: 'forex' | 'stock' } = {
    // Forex Pairs
    'EURUSD': 'forex', 'GBPUSD': 'forex', 'USDJPY': 'forex',
    'AUDUSD': 'forex', 'USDCHF': 'forex', 'USDCAD': 'forex', 'NZDUSD': 'forex',
    // US Stocks
    'AAPL': 'stock', 'MSFT': 'stock', 'GOOGL': 'stock',
    'AMZN': 'stock', 'META': 'stock', 'TSLA': 'stock',
    'NVDA': 'stock', 'JPM': 'stock', 'BAC': 'stock', 'WMT': 'stock',
    // Malaysia Stocks
    'MAYBANK.KL': 'stock', 'PBBANK.KL': 'stock', 'TENAGA.KL': 'stock',
    'PCHEM.KL': 'stock', 'CIMB.KL': 'stock', 'TOPGLOV.KL': 'stock',
    'AXIATA.KL': 'stock', 'DIGI.KL': 'stock', 'MAXIS.KL': 'stock',
    'GENTING.KL': 'stock',
    // Nigeria Stocks
    'DANGCEM.LG': 'stock', 'MTNN.LG': 'stock', 'BUACEMENT.LG': 'stock',
    'AIRTEL.LG': 'stock', 'GTCO.LG': 'stock', 'ZENITHBA.LG': 'stock',
    'BUAFOODS.LG': 'stock', 'NESTLE.LG': 'stock', 'FBNH.LG': 'stock',
    'UBA.LG': 'stock'
  };

  constructor() {
    makeAutoObservable(this);
  }

  getInstrumentType(symbol: string): 'forex' | 'stock' {
    return this.instrumentType[symbol] || 'forex';
  }

  getMarket(symbol: string): 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID' | null {
    if (this.getInstrumentType(symbol) === 'forex') return null;
    return stockService.getSymbolMarket(symbol);
  }

  formatPrice(price: number, symbol: string): string {
    if (this.getInstrumentType(symbol) === 'forex') {
      return price.toFixed(5);
    }
    const market = this.getMarket(symbol);
    if (!market) return price.toFixed(2);
    return stockService.formatPriceForMarket(price, market);
  }

  getMinQuantity(symbol: string): number {
    if (this.getInstrumentType(symbol) === 'forex') return 0.01;
    const market = this.getMarket(symbol);
    return 1;
  }

  getMaxQuantity(symbol: string): number {
    if (this.getInstrumentType(symbol) === 'forex') return 100;
    const market = this.getMarket(symbol);
    switch (market) {
      case 'US':
        return 10000;
      case 'MY':
        return 1000000;
      case 'NG':
        return 10000000;
      case 'JP':
      case 'KR':
        return 100000;
      case 'CN':
        return 1000000;
      case 'IN':
        return 500000;
      case 'ID':
        return 500000;
      case 'ZA':
        return 100000;
      case 'KE':
        return 1000000;
      default:
        return 10000;
    }
  }

  getQuantityStep(symbol: string): number {
    return this.getInstrumentType(symbol) === 'forex' ? 0.01 : 1;
  }

  async placeOrder(params: {
    symbol: string;
    type: 'MARKET' | 'LIMIT' | 'STOP';
    side: 'BUY' | 'SELL';
    volume: number;
    price?: number;
  }): Promise<Order> {
    this.isLoading = true;
    
    try {
      const currentPrice = this.prices[params.symbol] || { ask: 0, bid: 0 };
      const executionPrice = params.side === 'BUY' ? currentPrice.ask : currentPrice.bid;
      
      const order: Order = {
        id: (++this.lastOrderId).toString(),
        symbol: params.symbol,
        side: params.side.toLowerCase() as 'buy' | 'sell',
        type: params.type.toLowerCase() as 'market' | 'limit' | 'stop',
        quantity: params.volume,
        price: executionPrice,
        status: 'filled',
        createdAt: new Date(),
      };

      const trade: Trade = {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        price: executionPrice,
        quantity: order.quantity,
        timestamp: new Date(),
      };

      const positionIndex = this.positions.findIndex(p => p.symbol === params.symbol);
      if (positionIndex === -1) {
        this.positions.push({
          symbol: params.symbol,
          side: params.side === 'BUY' ? 'long' : 'short',
          quantity: params.volume,
          entryPrice: executionPrice,
          currentPrice: executionPrice,
          pnl: 0,
          pnlPercentage: 0,
          timestamp: new Date(),
        });
      } else {
        const position = this.positions[positionIndex];
        if (params.side === 'BUY') {
          position.quantity += params.volume;
        } else {
          position.quantity -= params.volume;
        }
        
        if (position.quantity === 0) {
          this.positions.splice(positionIndex, 1);
        }
      }

      this.tradeHistory.unshift(trade);

      return order;
    } catch (error) {
      console.error('Order placement failed:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  updatePrice(symbol: string, update: PriceUpdate) {
    runInAction(() => {
      this.previousPrices[symbol] = this.prices[symbol] || update;
      this.prices[symbol] = update;
      
      this.positions.forEach(position => {
        if (position.symbol === symbol) {
          position.currentPrice = position.side === 'long' ? update.bid : update.ask;
          const priceDiff = position.currentPrice - position.entryPrice;
          position.pnl = priceDiff * position.quantity;
          position.pnlPercentage = (priceDiff / position.entryPrice) * 100;
        }
      });
    });
  }

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
  }

  async fetchActiveOrders() {
    try {
      this.isLoading = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      this.isLoading = false;
    }
  }

  async fetchPositions() {
    try {
      this.isLoading = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      this.isLoading = false;
    }
  }

  async closePosition(symbol: string) {
    try {
      this.isLoading = true;
      this.positions = this.positions.filter(p => p.symbol !== symbol);
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to close position:', error);
      this.isLoading = false;
    }
  }

  async placeOrderLegacy(order: Omit<Order, 'id' | 'status' | 'createdAt'>) {
    try {
      this.isLoading = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to place order:', error);
      this.isLoading = false;
    }
  }

  async cancelOrder(orderId: string) {
    try {
      this.isLoading = true;
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      this.isLoading = false;
    }
  }

  async setRiskSettings(settings: any) {
    try {
      runInAction(() => {
      });
    } catch (error) {
      console.error('Failed to update risk settings:', error);
      throw error;
    }
  }

  clearError() {
  }
}

export const tradingStore = new TradingStore();
