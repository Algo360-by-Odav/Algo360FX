import { Portfolio, Position, RebalanceStrategy, RebalanceConfig, RebalanceResult, TradeOrder } from '../../types/portfolio';
import { MarketData } from '../../types/market';
import { calculatePortfolioMetrics } from './PortfolioAnalyzer';

export class PortfolioRebalancer {
  private portfolio: Portfolio;
  private marketData: MarketData;
  private config: RebalanceConfig;

  constructor(portfolio: Portfolio, marketData: MarketData, config: RebalanceConfig) {
    this.portfolio = portfolio;
    this.marketData = marketData;
    this.config = config;
  }

  public async rebalance(): Promise<RebalanceResult> {
    const currentAllocation = this.calculateCurrentAllocation();
    const targetAllocation = await this.calculateTargetAllocation();
    const trades = this.calculateRequiredTrades(currentAllocation, targetAllocation);
    const metrics = this.calculateRebalanceMetrics(trades);

    return {
      trades,
      metrics,
      currentAllocation,
      targetAllocation,
      timestamp: new Date(),
    };
  }

  private calculateCurrentAllocation(): Record<string, number> {
    const totalValue = this.portfolio.positions.reduce(
      (sum, pos) => sum + pos.quantity * this.marketData.prices[pos.symbol],
      0
    );

    return this.portfolio.positions.reduce((alloc, pos) => {
      alloc[pos.symbol] = (pos.quantity * this.marketData.prices[pos.symbol]) / totalValue;
      return alloc;
    }, {} as Record<string, number>);
  }

  private async calculateTargetAllocation(): Promise<Record<string, number>> {
    switch (this.config.strategy) {
      case RebalanceStrategy.EQUAL_WEIGHT:
        return this.calculateEqualWeight();
      case RebalanceStrategy.RISK_PARITY:
        return this.calculateRiskParity();
      case RebalanceStrategy.MINIMUM_VARIANCE:
        return this.calculateMinimumVariance();
      case RebalanceStrategy.MAXIMUM_SHARPE:
        return this.calculateMaximumSharpe();
      case RebalanceStrategy.MOMENTUM:
        return this.calculateMomentumAllocation();
      case RebalanceStrategy.DYNAMIC:
        return this.calculateDynamicAllocation();
      default:
        throw new Error(`Unsupported rebalance strategy: ${this.config.strategy}`);
    }
  }

  private calculateEqualWeight(): Record<string, number> {
    const weight = 1 / this.portfolio.positions.length;
    return this.portfolio.positions.reduce((alloc, pos) => {
      alloc[pos.symbol] = weight;
      return alloc;
    }, {} as Record<string, number>);
  }

  private async calculateRiskParity(): Promise<Record<string, number>> {
    const returns = await this.calculateHistoricalReturns();
    const covariance = this.calculateCovarianceMatrix(returns);
    const riskContributions = this.calculateRiskContributions(covariance);
    
    return this.optimizeRiskParity(riskContributions);
  }

  private async calculateMinimumVariance(): Promise<Record<string, number>> {
    const returns = await this.calculateHistoricalReturns();
    const covariance = this.calculateCovarianceMatrix(returns);
    
    return this.optimizeMinimumVariance(covariance);
  }

  private async calculateMaximumSharpe(): Promise<Record<string, number>> {
    const returns = await this.calculateHistoricalReturns();
    const covariance = this.calculateCovarianceMatrix(returns);
    const expectedReturns = this.calculateExpectedReturns(returns);
    
    return this.optimizeMaximumSharpe(expectedReturns, covariance);
  }

  private async calculateMomentumAllocation(): Promise<Record<string, number>> {
    const momentumScores = await this.calculateMomentumScores();
    const totalScore = Object.values(momentumScores).reduce((sum, score) => sum + score, 0);
    
    return Object.entries(momentumScores).reduce((alloc, [symbol, score]) => {
      alloc[symbol] = score / totalScore;
      return alloc;
    }, {} as Record<string, number>);
  }

  private async calculateDynamicAllocation(): Promise<Record<string, number>> {
    const marketRegime = await this.detectMarketRegime();
    const volatility = await this.calculateVolatility();
    const correlation = await this.calculateCorrelation();
    
    return this.optimizeDynamicAllocation(marketRegime, volatility, correlation);
  }

  private calculateRequiredTrades(
    currentAllocation: Record<string, number>,
    targetAllocation: Record<string, number>
  ): TradeOrder[] {
    const trades: TradeOrder[] = [];
    const totalValue = this.calculatePortfolioValue();

    for (const symbol in targetAllocation) {
      const currentValue = currentAllocation[symbol] * totalValue;
      const targetValue = targetAllocation[symbol] * totalValue;
      const pricePrecision = this.getPricePrecision(symbol);
      const quantityPrecision = this.getQuantityPrecision(symbol);

      if (Math.abs(targetValue - currentValue) > this.config.minTradeValue) {
        const currentPrice = this.marketData.prices[symbol];
        const quantity = this.roundToStep(
          (targetValue - currentValue) / currentPrice,
          quantityPrecision
        );

        if (Math.abs(quantity) * currentPrice >= this.config.minTradeValue) {
          trades.push({
            symbol,
            side: quantity > 0 ? 'buy' : 'sell',
            quantity: Math.abs(quantity),
            price: currentPrice,
            timestamp: new Date(),
            type: 'rebalance',
          });
        }
      }
    }

    return this.optimizeTrades(trades);
  }

  private calculateRebalanceMetrics(trades: TradeOrder[]): Record<string, number> {
    const totalValue = this.calculatePortfolioValue();
    const turnover = trades.reduce(
      (sum, trade) => sum + trade.quantity * trade.price,
      0
    );

    return {
      turnover: turnover / totalValue,
      tradeCount: trades.length,
      estimatedCost: this.estimateTransactionCosts(trades),
      trackingError: this.calculateTrackingError(),
      riskContribution: this.calculateRiskContribution(),
    };
  }

  private optimizeTrades(trades: TradeOrder[]): TradeOrder[] {
    // Optimize trade execution to minimize costs and market impact
    const optimizedTrades = [...trades];
    
    // Sort trades by value to execute larger trades first
    optimizedTrades.sort((a, b) => b.quantity * b.price - a.quantity * a.price);
    
    // Split large trades if necessary
    return this.splitLargeTrades(optimizedTrades);
  }

  private splitLargeTrades(trades: TradeOrder[]): TradeOrder[] {
    const splitTrades: TradeOrder[] = [];
    
    for (const trade of trades) {
      if (trade.quantity * trade.price > this.config.maxTradeValue) {
        const numSplits = Math.ceil(
          (trade.quantity * trade.price) / this.config.maxTradeValue
        );
        const splitQuantity = trade.quantity / numSplits;
        
        for (let i = 0; i < numSplits; i++) {
          splitTrades.push({
            ...trade,
            quantity: splitQuantity,
            timestamp: new Date(trade.timestamp.getTime() + i * this.config.tradeInterval),
          });
        }
      } else {
        splitTrades.push(trade);
      }
    }
    
    return splitTrades;
  }

  private estimateTransactionCosts(trades: TradeOrder[]): number {
    return trades.reduce((total, trade) => {
      const value = trade.quantity * trade.price;
      const spread = this.marketData.spreads[trade.symbol] || 0;
      const commission = Math.max(
        this.config.minCommission,
        value * this.config.commissionRate
      );
      const slippage = value * this.estimateSlippage(trade);
      
      return total + spread + commission + slippage;
    }, 0);
  }

  private estimateSlippage(trade: TradeOrder): number {
    const volume = this.marketData.volumes[trade.symbol];
    const tradeValue = trade.quantity * trade.price;
    const participation = tradeValue / volume;
    
    // Simple square-root price impact model
    return this.config.slippageFactor * Math.sqrt(participation);
  }

  private calculatePortfolioValue(): number {
    return this.portfolio.positions.reduce(
      (sum, pos) => sum + pos.quantity * this.marketData.prices[pos.symbol],
      0
    );
  }

  private roundToStep(value: number, precision: number): number {
    const step = Math.pow(10, -precision);
    return Math.round(value / step) * step;
  }

  private getPricePrecision(symbol: string): number {
    return this.marketData.pricePrecision[symbol] || 8;
  }

  private getQuantityPrecision(symbol: string): number {
    return this.marketData.quantityPrecision[symbol] || 8;
  }
}
