import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Trade, Position, RiskMetrics, PositionSizing } from '../types/trading';

export class RiskManagementStore {
  private maxDrawdown: number = 0;
  private currentDrawdown: number = 0;
  private dailyPnL: Map<string, number> = new Map();
  private riskPerTrade: number = 0.02; // 2% risk per trade
  private maxRiskPerDay: number = 0.06; // 6% max risk per day
  private maxPositions: number = 5;
  loading: boolean = false;
  error: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  calculatePositionSize(
    accountBalance: number,
    entryPrice: number,
    stopLoss: number,
    symbol: string
  ): PositionSizing {
    const riskAmount = accountBalance * this.riskPerTrade;
    const pipValue = this.calculatePipValue(symbol, entryPrice);
    const stopLossPips = Math.abs(entryPrice - stopLoss) / pipValue;
    const positionSize = riskAmount / (stopLossPips * pipValue);

    return {
      positionSize,
      riskAmount,
      stopLossPips,
      pipValue,
      margin: this.calculateMargin(positionSize, entryPrice, symbol),
    };
  }

  calculatePipValue(symbol: string, price: number): number {
    // This is a simplified calculation. In reality, pip values vary by currency pair
    return symbol.includes('JPY') ? 0.01 : 0.0001;
  }

  calculateMargin(positionSize: number, price: number, symbol: string, leverage: number = 100): number {
    return (positionSize * price) / leverage;
  }

  updateDrawdown(equity: number, balance: number) {
    const drawdown = (balance - equity) / balance;
    this.currentDrawdown = drawdown;
    if (drawdown > this.maxDrawdown) {
      this.maxDrawdown = drawdown;
    }
  }

  updateDailyPnL(date: string, pnl: number) {
    this.dailyPnL.set(date, (this.dailyPnL.get(date) || 0) + pnl);
  }

  calculateRiskMetrics(positions: Position[], balance: number): RiskMetrics {
    const totalExposure = positions.reduce((sum, pos) => sum + Math.abs(pos.notionalValue), 0);
    const exposureRatio = totalExposure / balance;
    
    const correlationRisk = this.calculateCorrelationRisk(positions);
    const concentrationRisk = this.calculateConcentrationRisk(positions);
    
    return {
      exposureRatio,
      correlationRisk,
      concentrationRisk,
      currentDrawdown: this.currentDrawdown,
      maxDrawdown: this.maxDrawdown,
      sharpeRatio: this.calculateSharpeRatio(),
      valueAtRisk: this.calculateValueAtRisk(positions, balance),
    };
  }

  private calculateCorrelationRisk(positions: Position[]): number {
    // Simplified correlation risk calculation
    // In reality, this would use historical price data to calculate correlations
    const symbols = positions.map(p => p.symbol);
    const uniqueSymbols = new Set(symbols);
    return 1 - (uniqueSymbols.size / positions.length);
  }

  private calculateConcentrationRisk(positions: Position[]): number {
    const totalValue = positions.reduce((sum, pos) => sum + Math.abs(pos.notionalValue), 0);
    const maxPosition = Math.max(...positions.map(pos => Math.abs(pos.notionalValue)));
    return maxPosition / totalValue;
  }

  private calculateSharpeRatio(): number {
    const returns = Array.from(this.dailyPnL.values());
    if (returns.length < 2) return 0;

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / (returns.length - 1)
    );

    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
  }

  private calculateValueAtRisk(positions: Position[], balance: number): number {
    // Simplified VaR calculation using historical simulation
    // In reality, this would use more sophisticated methods
    const confidence = 0.95;
    const lookbackDays = 252;
    const dailyReturns = Array.from(this.dailyPnL.values())
      .map(pnl => pnl / balance)
      .sort((a, b) => a - b);

    if (dailyReturns.length < lookbackDays) return 0;

    const varIndex = Math.floor(dailyReturns.length * (1 - confidence));
    return -dailyReturns[varIndex] * balance;
  }

  validateTrade(trade: Trade): { valid: boolean; reason?: string } {
    // Check if we're within daily risk limit
    const todayPnL = this.dailyPnL.get(new Date().toISOString().split('T')[0]) || 0;
    if (Math.abs(todayPnL) >= this.maxRiskPerDay) {
      return { valid: false, reason: 'Daily risk limit reached' };
    }

    // Check if we're within maximum positions limit
    const openPositions = this.rootStore.tradeStore.positions.length;
    if (openPositions >= this.maxPositions) {
      return { valid: false, reason: 'Maximum positions limit reached' };
    }

    // Check if we have sufficient margin
    const requiredMargin = this.calculateMargin(
      trade.size,
      trade.entryPrice,
      trade.symbol
    );
    const availableMargin = this.rootStore.tradeStore.availableMargin;
    if (requiredMargin > availableMargin) {
      return { valid: false, reason: 'Insufficient margin' };
    }

    return { valid: true };
  }

  // Getters
  get currentRiskMetrics(): RiskMetrics {
    return this.calculateRiskMetrics(
      this.rootStore.tradeStore.positions,
      this.rootStore.tradeStore.balance
    );
  }

  get dailyRiskUsage(): number {
    const todayPnL = this.dailyPnL.get(new Date().toISOString().split('T')[0]) || 0;
    return Math.abs(todayPnL) / this.maxRiskPerDay;
  }

  // Settings
  setRiskPerTrade(value: number) {
    if (value > 0 && value < 1) {
      this.riskPerTrade = value;
    }
  }

  setMaxRiskPerDay(value: number) {
    if (value > 0 && value < 1) {
      this.maxRiskPerDay = value;
    }
  }

  setMaxPositions(value: number) {
    if (value > 0) {
      this.maxPositions = value;
    }
  }
}
