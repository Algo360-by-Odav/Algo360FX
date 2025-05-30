import { Order, Position, MarketData } from '../brokers/types';

export interface ExecutionMetrics {
  slippage: {
    average: number;
    standardDeviation: number;
    percentile95: number;
    worstCase: number;
    byTimeOfDay: { [hour: number]: number };
    byVolumeQuantile: { [quantile: string]: number };
  };
  fillRate: {
    overall: number;
    byOrderType: { [type: string]: number };
    byTimeWindow: { [window: string]: number };
    partialFills: number;
  };
  latency: {
    average: number;
    median: number;
    percentile95: number;
    byTimeOfDay: { [hour: number]: number };
    byMarketVolatility: { [volatility: string]: number };
  };
  costAnalysis: {
    totalCommission: number;
    averageCommissionPerLot: number;
    totalSlippageCost: number;
    averageSpreadCost: number;
    implicitCosts: number;
    costPerMillionTraded: number;
  };
  marketImpact: {
    averagePriceMove: number;
    volumeParticipationRate: number;
    priceReversion: number;
    temporaryImpact: number;
    permanentImpact: number;
  };
  opportunityCost: {
    delayedExecution: number;
    missedTrades: number;
    priceImprovement: number;
  };
}

export interface MarketConditions {
  volatility: number;
  spread: number;
  depth: number;
  volume: number;
  timeOfDay: number;
  isMarketHours: boolean;
}

export class ExecutionAnalysis {
  private executions: Array<{
    order: Order;
    marketData: MarketData;
    timestamp: Date;
    marketConditions: MarketConditions;
  }> = [];

  private readonly MARKET_HOURS = {
    ASIA: { start: 1, end: 10 },    // 1:00-10:00 UTC
    LONDON: { start: 8, end: 17 },  // 8:00-17:00 UTC
    NY: { start: 13, end: 22 },     // 13:00-22:00 UTC
  };

  addExecution(order: Order, marketData: MarketData, marketConditions: MarketConditions): void {
    this.executions.push({
      order,
      marketData,
      timestamp: new Date(),
      marketConditions,
    });
  }

  analyzeExecutionQuality(): ExecutionMetrics {
    const slippageData = this.calculateSlippage();
    const fillRateData = this.calculateFillRate();
    const latencyData = this.calculateLatency();
    const costData = this.calculateTradingCosts();
    const marketImpactData = this.calculateMarketImpact();
    const opportunityCostData = this.calculateOpportunityCost();

    return {
      slippage: slippageData,
      fillRate: fillRateData,
      latency: latencyData,
      costAnalysis: costData,
      marketImpact: marketImpactData,
      opportunityCost: opportunityCostData,
    };
  }

  private calculateSlippage(): ExecutionMetrics['slippage'] {
    const slippages = this.executions.map(e => {
      const expectedPrice = e.order.type === 'market' ? e.marketData.last : e.order.price!;
      const actualPrice = e.order.averagePrice!;
      return ((actualPrice - expectedPrice) / expectedPrice) * 10000; // In basis points
    });

    const byTimeOfDay = this.groupByTimeOfDay(slippages);
    const byVolumeQuantile = this.groupByVolumeQuantile(slippages);

    return {
      average: this.average(slippages),
      standardDeviation: this.standardDeviation(slippages),
      percentile95: this.percentile(slippages, 0.95),
      worstCase: Math.max(...slippages),
      byTimeOfDay,
      byVolumeQuantile,
    };
  }

  private calculateFillRate(): ExecutionMetrics['fillRate'] {
    const fillRates = {
      overall: 0,
      byOrderType: {} as { [type: string]: number },
      byTimeWindow: {} as { [window: string]: number },
      partialFills: 0,
    };

    // Calculate overall fill rate
    const filledOrders = this.executions.filter(e => e.order.status === 'filled');
    fillRates.overall = filledOrders.length / this.executions.length;

    // Calculate fill rate by order type
    const orderTypes = ['market', 'limit', 'stop', 'stopLimit'];
    orderTypes.forEach(type => {
      const typeOrders = this.executions.filter(e => e.order.type === type);
      const filledTypeOrders = typeOrders.filter(e => e.order.status === 'filled');
      fillRates.byOrderType[type] = filledTypeOrders.length / typeOrders.length;
    });

    // Calculate fill rate by time window
    const timeWindows = ['ASIA', 'LONDON', 'NY'];
    timeWindows.forEach(window => {
      const windowOrders = this.executions.filter(e => 
        this.isInTimeWindow(e.timestamp, this.MARKET_HOURS[window as keyof typeof this.MARKET_HOURS])
      );
      const filledWindowOrders = windowOrders.filter(e => e.order.status === 'filled');
      fillRates.byTimeWindow[window] = filledWindowOrders.length / windowOrders.length;
    });

    // Calculate partial fills
    const partialFills = this.executions.filter(e => 
      e.order.status === 'filled' && e.order.filledQuantity! < e.order.quantity
    );
    fillRates.partialFills = partialFills.length / filledOrders.length;

    return fillRates;
  }

  private calculateLatency(): ExecutionMetrics['latency'] {
    const latencies = this.executions.map(e => {
      const orderTime = e.timestamp.getTime();
      const executionTime = e.order.timestamp!.getTime();
      return executionTime - orderTime; // in milliseconds
    });

    const byTimeOfDay = this.groupByTimeOfDay(latencies);
    const byMarketVolatility = this.groupByVolatility(latencies);

    return {
      average: this.average(latencies),
      median: this.percentile(latencies, 0.5),
      percentile95: this.percentile(latencies, 0.95),
      byTimeOfDay,
      byMarketVolatility,
    };
  }

  private calculateTradingCosts(): ExecutionMetrics['costAnalysis'] {
    const totalVolume = this.executions.reduce((sum, e) => sum + Math.abs(e.order.quantity), 0);
    const totalNotional = this.executions.reduce((sum, e) => 
      sum + Math.abs(e.order.quantity * e.order.averagePrice!), 0
    );

    const totalCommission = this.executions.reduce((sum, e) => sum + (e.order.commission || 0), 0);
    const totalSlippage = this.executions.reduce((sum, e) => {
      const expectedPrice = e.order.type === 'market' ? e.marketData.last : e.order.price!;
      const actualPrice = e.order.averagePrice!;
      return sum + Math.abs((actualPrice - expectedPrice) * e.order.quantity);
    }, 0);

    const spreadCosts = this.executions.reduce((sum, e) => 
      sum + ((e.marketData.ask - e.marketData.bid) * Math.abs(e.order.quantity)), 0
    );

    return {
      totalCommission,
      averageCommissionPerLot: totalCommission / totalVolume,
      totalSlippageCost: totalSlippage,
      averageSpreadCost: spreadCosts / this.executions.length,
      implicitCosts: totalSlippage + spreadCosts,
      costPerMillionTraded: (totalCommission + totalSlippage + spreadCosts) / (totalNotional / 1000000),
    };
  }

  private calculateMarketImpact(): ExecutionMetrics['marketImpact'] {
    const impacts = this.executions.map(e => {
      const prePrice = e.marketData.last;
      const postPrice = e.order.averagePrice!;
      const priceMove = (postPrice - prePrice) / prePrice * 10000; // basis points
      return Math.abs(priceMove);
    });

    return {
      averagePriceMove: this.average(impacts),
      volumeParticipationRate: 0, // Requires market volume data
      priceReversion: 0, // Requires post-trade price data
      temporaryImpact: this.average(impacts),
      permanentImpact: 0, // Requires post-trade price data
    };
  }

  private calculateOpportunityCost(): ExecutionMetrics['opportunityCost'] {
    return {
      delayedExecution: 0, // Requires benchmark price data
      missedTrades: 0, // Requires intended trade data
      priceImprovement: 0, // Requires benchmark price data
    };
  }

  // Helper functions
  private average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  private standardDeviation(arr: number[]): number {
    const avg = this.average(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (arr.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  }

  private groupByTimeOfDay(values: number[]): { [hour: number]: number } {
    const result: { [hour: number]: number } = {};
    this.executions.forEach((e, i) => {
      const hour = e.timestamp.getUTCHours();
      if (!result[hour]) {
        result[hour] = [];
      }
      result[hour].push(values[i]);
    });

    Object.keys(result).forEach(hour => {
      result[parseInt(hour)] = this.average(result[parseInt(hour)]);
    });

    return result;
  }

  private groupByVolumeQuantile(values: number[]): { [quantile: string]: number } {
    const result: { [quantile: string]: number } = {
      'Low': [],
      'Medium': [],
      'High': [],
    };

    const volumes = this.executions.map(e => e.marketConditions.volume);
    const lowThreshold = this.percentile(volumes, 0.33);
    const highThreshold = this.percentile(volumes, 0.66);

    this.executions.forEach((e, i) => {
      if (e.marketConditions.volume <= lowThreshold) {
        result['Low'].push(values[i]);
      } else if (e.marketConditions.volume <= highThreshold) {
        result['Medium'].push(values[i]);
      } else {
        result['High'].push(values[i]);
      }
    });

    Object.keys(result).forEach(quantile => {
      result[quantile] = this.average(result[quantile]);
    });

    return result;
  }

  private groupByVolatility(values: number[]): { [volatility: string]: number } {
    const result: { [volatility: string]: number } = {
      'Low': [],
      'Medium': [],
      'High': [],
    };

    const volatilities = this.executions.map(e => e.marketConditions.volatility);
    const lowThreshold = this.percentile(volatilities, 0.33);
    const highThreshold = this.percentile(volatilities, 0.66);

    this.executions.forEach((e, i) => {
      if (e.marketConditions.volatility <= lowThreshold) {
        result['Low'].push(values[i]);
      } else if (e.marketConditions.volatility <= highThreshold) {
        result['Medium'].push(values[i]);
      } else {
        result['High'].push(values[i]);
      }
    });

    Object.keys(result).forEach(volatility => {
      result[volatility] = this.average(result[volatility]);
    });

    return result;
  }

  private isInTimeWindow(timestamp: Date, window: { start: number; end: number }): boolean {
    const hour = timestamp.getUTCHours();
    return hour >= window.start && hour < window.end;
  }
}
