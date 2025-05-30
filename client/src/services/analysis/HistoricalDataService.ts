import { MarketData, Order, Position } from '../brokers/types';

interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketState {
  volatility: number;
  trend: number;
  volumeProfile: number;
  spreadWidth: number;
  marketHours: 'asia' | 'london' | 'ny' | 'off';
}

interface ExecutionQuality {
  slippage: number;
  fillTime: number;
  impact: number;
  cost: number;
}

export class HistoricalDataService {
  private historicalData: Map<string, OHLCV[]> = new Map();
  private executionHistory: Map<string, Array<Order & ExecutionQuality>> = new Map();
  private marketStates: Map<string, MarketState[]> = new Map();
  private volatilityWindow: number = 20; // periods for volatility calculation
  private trendWindow: number = 50;      // periods for trend calculation

  async loadHistoricalData(
    symbol: string,
    startDate: Date,
    endDate: Date,
    timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  ): Promise<OHLCV[]> {
    // In a real implementation, this would fetch from a database or external provider
    const data = await this.fetchHistoricalData(symbol, startDate, endDate, timeframe);
    this.historicalData.set(symbol, data);
    return data;
  }

  async addExecution(
    order: Order,
    marketData: MarketData,
    executionQuality: ExecutionQuality
  ): Promise<void> {
    const executions = this.executionHistory.get(order.symbol) || [];
    executions.push({ ...order, ...executionQuality });
    this.executionHistory.set(order.symbol, executions);

    // Update market state
    await this.updateMarketState(order.symbol, marketData);
  }

  async analyzeMarketConditions(
    symbol: string,
    timestamp: Date
  ): Promise<MarketState> {
    const data = this.historicalData.get(symbol);
    if (!data) throw new Error(`No historical data for ${symbol}`);

    // Find the relevant data window
    const endIndex = data.findIndex(d => d.timestamp > timestamp);
    if (endIndex === -1) throw new Error('Timestamp outside data range');

    const startIndex = Math.max(0, endIndex - this.volatilityWindow);
    const window = data.slice(startIndex, endIndex);

    return {
      volatility: this.calculateVolatility(window),
      trend: this.calculateTrend(window),
      volumeProfile: this.calculateVolumeProfile(window),
      spreadWidth: this.calculateSpreadWidth(window),
      marketHours: this.determineMarketHours(timestamp),
    };
  }

  async analyzeExecutionPatterns(symbol: string): Promise<{
    timeOfDay: { [hour: number]: ExecutionQuality };
    marketConditions: { [condition: string]: ExecutionQuality };
    volumeQuantiles: { [quantile: string]: ExecutionQuality };
  }> {
    const executions = this.executionHistory.get(symbol) || [];
    const marketStates = this.marketStates.get(symbol) || [];

    // Group executions by hour
    const byHour = this.groupExecutionsByHour(executions);

    // Group executions by market conditions
    const byConditions = this.groupExecutionsByMarketConditions(executions, marketStates);

    // Group executions by volume
    const byVolume = this.groupExecutionsByVolume(executions);

    return {
      timeOfDay: byHour,
      marketConditions: byConditions,
      volumeQuantiles: byVolume,
    };
  }

  async generateExecutionRecommendations(
    symbol: string,
    orderSize: number,
    currentMarketData: MarketData
  ): Promise<{
    optimal: {
      timing: Date;
      orderType: 'market' | 'limit';
      expectedCost: number;
      confidence: number;
    };
    alternatives: Array<{
      timing: Date;
      orderType: 'market' | 'limit';
      expectedCost: number;
      confidence: number;
    }>;
  }> {
    const executions = this.executionHistory.get(symbol) || [];
    const marketStates = this.marketStates.get(symbol) || [];
    const currentState = await this.analyzeMarketConditions(symbol, new Date());

    // Find similar historical market conditions
    const similarStates = this.findSimilarMarketStates(currentState, marketStates);

    // Analyze execution quality in similar conditions
    const historicalPerformance = this.analyzeHistoricalPerformance(
      executions,
      similarStates,
      orderSize
    );

    // Generate recommendations
    return this.generateRecommendations(historicalPerformance, currentMarketData);
  }

  private async fetchHistoricalData(
    symbol: string,
    startDate: Date,
    endDate: Date,
    timeframe: string
  ): Promise<OHLCV[]> {
    // Placeholder implementation
    return [];
  }

  private async updateMarketState(
    symbol: string,
    marketData: MarketData
  ): Promise<void> {
    const states = this.marketStates.get(symbol) || [];
    const currentState = await this.analyzeMarketConditions(symbol, new Date(marketData.timestamp));
    states.push(currentState);
    this.marketStates.set(symbol, states);
  }

  private calculateVolatility(data: OHLCV[]): number {
    if (data.length < 2) return 0;

    const returns = data.slice(1).map((d, i) => 
      Math.log(d.close / data[i].close)
    );

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }

  private calculateTrend(data: OHLCV[]): number {
    if (data.length < 2) return 0;

    const prices = data.map(d => d.close);
    const x = Array.from({ length: prices.length }, (_, i) => i);
    
    // Simple linear regression
    const n = prices.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = prices.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * prices[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private calculateVolumeProfile(data: OHLCV[]): number {
    if (data.length === 0) return 0;

    const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length;
    const currentVolume = data[data.length - 1].volume;
    
    return currentVolume / avgVolume;
  }

  private calculateSpreadWidth(data: OHLCV[]): number {
    if (data.length === 0) return 0;

    // Estimate spread from high-low range
    return (data[data.length - 1].high - data[data.length - 1].low) / data[data.length - 1].close;
  }

  private determineMarketHours(timestamp: Date): MarketState['marketHours'] {
    const hour = timestamp.getUTCHours();
    
    if (hour >= 0 && hour < 8) return 'asia';
    if (hour >= 8 && hour < 16) return 'london';
    if (hour >= 13 && hour < 21) return 'ny';
    return 'off';
  }

  private groupExecutionsByHour(
    executions: Array<Order & ExecutionQuality>
  ): { [hour: number]: ExecutionQuality } {
    const result: { [hour: number]: Array<ExecutionQuality> } = {};
    
    executions.forEach(exec => {
      const hour = new Date(exec.timestamp!).getUTCHours();
      if (!result[hour]) result[hour] = [];
      result[hour].push({
        slippage: exec.slippage,
        fillTime: exec.fillTime,
        impact: exec.impact,
        cost: exec.cost,
      });
    });

    // Calculate averages
    return Object.fromEntries(
      Object.entries(result).map(([hour, qualities]) => [
        hour,
        {
          slippage: qualities.reduce((sum, q) => sum + q.slippage, 0) / qualities.length,
          fillTime: qualities.reduce((sum, q) => sum + q.fillTime, 0) / qualities.length,
          impact: qualities.reduce((sum, q) => sum + q.impact, 0) / qualities.length,
          cost: qualities.reduce((sum, q) => sum + q.cost, 0) / qualities.length,
        },
      ])
    );
  }

  private groupExecutionsByMarketConditions(
    executions: Array<Order & ExecutionQuality>,
    marketStates: MarketState[]
  ): { [condition: string]: ExecutionQuality } {
    const result: { [condition: string]: Array<ExecutionQuality> } = {
      highVolatility: [],
      lowVolatility: [],
      upTrend: [],
      downTrend: [],
      highVolume: [],
      lowVolume: [],
    };

    executions.forEach((exec, i) => {
      const state = marketStates[i];
      if (!state) return;

      const quality = {
        slippage: exec.slippage,
        fillTime: exec.fillTime,
        impact: exec.impact,
        cost: exec.cost,
      };

      if (state.volatility > 0.2) result.highVolatility.push(quality);
      else result.lowVolatility.push(quality);

      if (state.trend > 0) result.upTrend.push(quality);
      else result.downTrend.push(quality);

      if (state.volumeProfile > 1.2) result.highVolume.push(quality);
      else result.lowVolume.push(quality);
    });

    // Calculate averages
    return Object.fromEntries(
      Object.entries(result).map(([condition, qualities]) => [
        condition,
        {
          slippage: qualities.reduce((sum, q) => sum + q.slippage, 0) / qualities.length,
          fillTime: qualities.reduce((sum, q) => sum + q.fillTime, 0) / qualities.length,
          impact: qualities.reduce((sum, q) => sum + q.impact, 0) / qualities.length,
          cost: qualities.reduce((sum, q) => sum + q.cost, 0) / qualities.length,
        },
      ])
    );
  }

  private groupExecutionsByVolume(
    executions: Array<Order & ExecutionQuality>
  ): { [quantile: string]: ExecutionQuality } {
    const sortedByVolume = [...executions].sort((a, b) => a.quantity - b.quantity);
    const third = Math.floor(sortedByVolume.length / 3);

    const groups = {
      small: sortedByVolume.slice(0, third),
      medium: sortedByVolume.slice(third, third * 2),
      large: sortedByVolume.slice(third * 2),
    };

    return Object.fromEntries(
      Object.entries(groups).map(([size, execs]) => [
        size,
        {
          slippage: execs.reduce((sum, e) => sum + e.slippage, 0) / execs.length,
          fillTime: execs.reduce((sum, e) => sum + e.fillTime, 0) / execs.length,
          impact: execs.reduce((sum, e) => sum + e.impact, 0) / execs.length,
          cost: execs.reduce((sum, e) => sum + e.cost, 0) / execs.length,
        },
      ])
    );
  }

  private findSimilarMarketStates(
    currentState: MarketState,
    historicalStates: MarketState[]
  ): MarketState[] {
    return historicalStates.filter(state => {
      const volatilityDiff = Math.abs(state.volatility - currentState.volatility);
      const trendDiff = Math.abs(state.trend - currentState.trend);
      const volumeDiff = Math.abs(state.volumeProfile - currentState.volumeProfile);
      
      return (
        volatilityDiff < 0.05 &&
        trendDiff < 0.02 &&
        volumeDiff < 0.2 &&
        state.marketHours === currentState.marketHours
      );
    });
  }

  private analyzeHistoricalPerformance(
    executions: Array<Order & ExecutionQuality>,
    similarStates: MarketState[],
    orderSize: number
  ): Array<Order & ExecutionQuality> {
    // Filter executions that occurred during similar market states
    return executions.filter((exec, i) => {
      const sizeRatio = exec.quantity / orderSize;
      return (
        similarStates[i] &&
        sizeRatio >= 0.8 &&
        sizeRatio <= 1.2
      );
    });
  }

  private generateRecommendations(
    historicalPerformance: Array<Order & ExecutionQuality>,
    currentMarketData: MarketData
  ) {
    // Group by order type
    const byOrderType = historicalPerformance.reduce((acc, exec) => {
      if (!acc[exec.type]) acc[exec.type] = [];
      acc[exec.type].push(exec);
      return acc;
    }, {} as { [key: string]: Array<Order & ExecutionQuality> });

    // Calculate average performance for each type
    const performance = Object.entries(byOrderType).map(([type, execs]) => ({
      orderType: type as 'market' | 'limit',
      avgCost: execs.reduce((sum, e) => sum + e.cost, 0) / execs.length,
      avgFillTime: execs.reduce((sum, e) => sum + e.fillTime, 0) / execs.length,
      confidence: execs.length / historicalPerformance.length,
    }));

    // Sort by cost and fill time
    performance.sort((a, b) => 
      (a.avgCost + a.avgFillTime * 0.0001) - (b.avgCost + b.avgFillTime * 0.0001)
    );

    return {
      optimal: {
        timing: new Date(),
        orderType: performance[0].orderType,
        expectedCost: performance[0].avgCost,
        confidence: performance[0].confidence,
      },
      alternatives: performance.slice(1).map(p => ({
        timing: new Date(),
        orderType: p.orderType,
        expectedCost: p.avgCost,
        confidence: p.confidence,
      })),
    };
  }
}
