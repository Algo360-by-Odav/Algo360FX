import { makeAutoObservable } from 'mobx';
import { api } from './api';
import {
  Trade,
  Position,
  Strategy,
  BacktestConfig,
  BacktestResult,
  TimeFrame,
  MarketEnvironment,
  Portfolio,
  StrategyPerformance,
  MarketData,
  OrderBook,
  Ticker,
} from '@/types/trading';

export class TradingService {
  constructor() {
    makeAutoObservable(this);
  }

  // Market Data Methods
  async getMarketData(symbol: string, timeframe: TimeFrame, limit: number = 1000): Promise<MarketData[]> {
    const response = await api.get(`/market-data/${symbol}`, {
      params: { timeframe, limit },
    });
    return response.data;
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const response = await api.get(`/order-book/${symbol}`);
    return response.data;
  }

  async getTicker(symbol: string): Promise<Ticker> {
    const response = await api.get(`/ticker/${symbol}`);
    return response.data;
  }

  // Trading Methods
  async placeTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
    const response = await api.post('/trades', trade);
    return response.data;
  }

  async closeTrade(tradeId: string, price?: number): Promise<Trade> {
    const response = await api.post(`/trades/${tradeId}/close`, { price });
    return response.data;
  }

  async modifyTrade(tradeId: string, modifications: Partial<Trade>): Promise<Trade> {
    const response = await api.patch(`/trades/${tradeId}`, modifications);
    return response.data;
  }

  async cancelTrade(tradeId: string): Promise<void> {
    await api.delete(`/trades/${tradeId}`);
  }

  // Position Methods
  async getPositions(): Promise<Position[]> {
    const response = await api.get('/positions');
    return response.data;
  }

  async closePosition(symbol: string): Promise<void> {
    await api.post(`/positions/${symbol}/close`);
  }

  async modifyPosition(symbol: string, modifications: Partial<Position>): Promise<Position> {
    const response = await api.patch(`/positions/${symbol}`, modifications);
    return response.data;
  }

  // Strategy Methods
  async getStrategies(): Promise<Strategy[]> {
    const response = await api.get('/strategies');
    return response.data;
  }

  async createStrategy(strategy: Omit<Strategy, 'id'>): Promise<Strategy> {
    const response = await api.post('/strategies', strategy);
    return response.data;
  }

  async updateStrategy(strategyId: string, updates: Partial<Strategy>): Promise<Strategy> {
    const response = await api.patch(`/strategies/${strategyId}`, updates);
    return response.data;
  }

  async deleteStrategy(strategyId: string): Promise<void> {
    await api.delete(`/strategies/${strategyId}`);
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    const response = await api.post('/backtest', config);
    return response.data;
  }

  async optimizeStrategy(
    strategyId: string,
    parameterRanges: Record<string, { min: number; max: number; step: number }>,
    config: Omit<BacktestConfig, 'strategy' | 'parameters'>
  ): Promise<StrategyPerformance[]> {
    const response = await api.post(`/strategies/${strategyId}/optimize`, {
      parameterRanges,
      config,
    });
    return response.data;
  }

  // Portfolio Methods
  async getPortfolio(): Promise<Portfolio> {
    const response = await api.get('/portfolio');
    return response.data;
  }

  async getPortfolioHistory(
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<{ timestamp: Date; equity: number }[]> {
    const response = await api.get('/portfolio/history', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  // Market Analysis Methods
  async getMarketEnvironment(symbol: string): Promise<MarketEnvironment> {
    const response = await api.get(`/market-environment/${symbol}`);
    return response.data;
  }

  async getCorrelationMatrix(symbols: string[]): Promise<Record<string, Record<string, number>>> {
    const response = await api.post('/correlation-matrix', { symbols });
    return response.data;
  }

  async getVolatilityAnalysis(
    symbol: string,
    timeframe: TimeFrame
  ): Promise<{
    historicalVolatility: number;
    impliedVolatility?: number;
    volatilityPercentile: number;
    volatilityTrend: 'increasing' | 'decreasing' | 'stable';
  }> {
    const response = await api.get(`/volatility-analysis/${symbol}`, {
      params: { timeframe },
    });
    return response.data;
  }

  // Risk Management Methods
  async calculatePositionSize(
    symbol: string,
    riskAmount: number,
    stopLoss: number
  ): Promise<{
    positionSize: number;
    riskPercentage: number;
    potentialLoss: number;
    marginRequired: number;
  }> {
    const response = await api.post('/calculate-position-size', {
      symbol,
      riskAmount,
      stopLoss,
    });
    return response.data;
  }

  async getRiskMetrics(): Promise<{
    dailyVaR: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    exposureByAsset: Record<string, number>;
    exposureBySector: Record<string, number>;
    riskConcentration: Record<string, number>;
  }> {
    const response = await api.get('/risk-metrics');
    return response.data;
  }
}

export const tradingService = new TradingService();
