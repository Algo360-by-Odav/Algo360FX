import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
}

export interface StockPosition {
  id: string;
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profit: number;
  profitPercent: number;
  openDate: Date;
}

export interface StockWatchlist {
  id: string;
  name: string;
  stocks: string[];
}

export interface StockAnalysis {
  symbol: string;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  targetPrice: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  fundamentals: {
    eps: number;
    peRatio: number;
    pbRatio: number;
    debtToEquity: number;
    dividendYield: number;
  };
  technicals: {
    rsi: number;
    macd: number;
    movingAverage50: number;
    movingAverage200: number;
  };
}

export class StockMarketStore {
  stocks: Map<string, Stock> = new Map();
  positions: StockPosition[] = [];
  watchlists: StockWatchlist[] = [];
  analyses: Map<string, StockAnalysis> = new Map();

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadMockData(); // For demonstration
  }

  addPosition(symbol: string, shares: number, price: number) {
    const stock = this.stocks.get(symbol);
    if (!stock) return;

    const position: StockPosition = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      shares,
      averagePrice: price,
      currentPrice: stock.price,
      totalValue: shares * stock.price,
      profit: shares * (stock.price - price),
      profitPercent: ((stock.price - price) / price) * 100,
      openDate: new Date(),
    };

    this.positions.push(position);
  }

  updatePosition(positionId: string, shares?: number) {
    const position = this.positions.find(p => p.id === positionId);
    if (!position) return;

    const stock = this.stocks.get(position.symbol);
    if (!stock) return;

    if (shares !== undefined) {
      position.shares = shares;
    }

    position.currentPrice = stock.price;
    position.totalValue = position.shares * stock.price;
    position.profit = position.shares * (stock.price - position.averagePrice);
    position.profitPercent = ((stock.price - position.averagePrice) / position.averagePrice) * 100;
  }

  closePosition(positionId: string) {
    const index = this.positions.findIndex(p => p.id === positionId);
    if (index !== -1) {
      this.positions.splice(index, 1);
    }
  }

  createWatchlist(name: string) {
    const watchlist: StockWatchlist = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      stocks: [],
    };
    this.watchlists.push(watchlist);
    return watchlist;
  }

  addToWatchlist(watchlistId: string, symbol: string) {
    const watchlist = this.watchlists.find(w => w.id === watchlistId);
    if (watchlist && !watchlist.stocks.includes(symbol)) {
      watchlist.stocks.push(symbol);
    }
  }

  removeFromWatchlist(watchlistId: string, symbol: string) {
    const watchlist = this.watchlists.find(w => w.id === watchlistId);
    if (watchlist) {
      const index = watchlist.stocks.indexOf(symbol);
      if (index !== -1) {
        watchlist.stocks.splice(index, 1);
      }
    }
  }

  getAnalysis(symbol: string): StockAnalysis | undefined {
    return this.analyses.get(symbol);
  }

  private loadMockData() {
    // Mock stocks
    const mockStocks: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.25,
        change: 2.35,
        changePercent: 1.36,
        volume: 52436789,
        marketCap: 2850000000000,
        pe: 28.5,
        sector: 'Technology',
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 338.12,
        change: 4.25,
        changePercent: 1.27,
        volume: 23456789,
        marketCap: 2520000000000,
        pe: 32.4,
        sector: 'Technology',
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 132.45,
        change: -1.23,
        changePercent: -0.92,
        volume: 18234567,
        marketCap: 1680000000000,
        pe: 25.6,
        sector: 'Technology',
      },
    ];

    mockStocks.forEach(stock => this.stocks.set(stock.symbol, stock));

    // Mock analyses
    mockStocks.forEach(stock => {
      this.analyses.set(stock.symbol, {
        symbol: stock.symbol,
        recommendation: 'Buy',
        targetPrice: stock.price * 1.15,
        riskLevel: 'Medium',
        fundamentals: {
          eps: stock.price / stock.pe,
          peRatio: stock.pe,
          pbRatio: 5.2,
          debtToEquity: 1.2,
          dividendYield: 1.5,
        },
        technicals: {
          rsi: 58,
          macd: 0.5,
          movingAverage50: stock.price * 0.98,
          movingAverage200: stock.price * 0.95,
        },
      });
    });

    // Mock watchlist
    this.createWatchlist('Tech Stocks');
    this.addToWatchlist(this.watchlists[0].id, 'AAPL');
    this.addToWatchlist(this.watchlists[0].id, 'MSFT');

    // Mock position
    this.addPosition('AAPL', 10, 170.50);
  }
}
