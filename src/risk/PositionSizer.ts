import { makeAutoObservable } from 'mobx';
import { DynamicRiskParams, RiskLimits } from './types';
import { Portfolio, Position } from '../types/trading';
import { calculateVolatility } from '../utils/statistics';

interface PositionSizeConfig {
  baseRiskPerTrade: number;
  maxPositionSize: number;
  volatilityScaling: boolean;
  correlationAdjustment: boolean;
  riskLimits: RiskLimits;
}

export class PositionSizer {
  private config: PositionSizeConfig;
  private dynamicParams: DynamicRiskParams | null = null;

  constructor(config: PositionSizeConfig) {
    this.config = config;
    makeAutoObservable(this);
  }

  calculatePositionSize(
    symbol: string,
    price: number,
    stopLoss: number,
    portfolio: Portfolio
  ): number {
    try {
      // Calculate base position size
      let size = this.calculateBaseSize(price, stopLoss);

      // Apply volatility scaling if enabled
      if (this.config.volatilityScaling) {
        size = this.applyVolatilityScaling(size, symbol);
      }

      // Apply correlation adjustment if enabled
      if (this.config.correlationAdjustment) {
        size = this.applyCorrelationAdjustment(size, symbol, portfolio);
      }

      // Apply dynamic risk adjustment
      if (this.dynamicParams) {
        size *= this.dynamicParams.adjustmentFactor;
      }

      // Apply position limits
      size = Math.min(size, this.config.maxPositionSize);

      // Validate against risk limits
      if (!this.validateRiskLimits(size, price, portfolio)) {
        return 0;
      }

      return size;
    } catch (error) {
      console.error('Error calculating position size:', error);
      return 0;
    }
  }

  private calculateBaseSize(price: number, stopLoss: number): number {
    const riskAmount = this.config.baseRiskPerTrade;
    const riskPerUnit = Math.abs(price - stopLoss);
    return riskAmount / riskPerUnit;
  }

  private applyVolatilityScaling(size: number, symbol: string): number {
    // Implementation needed: Scale size based on asset volatility
    return size;
  }

  private applyCorrelationAdjustment(
    size: number,
    symbol: string,
    portfolio: Portfolio
  ): number {
    // Implementation needed: Adjust size based on portfolio correlations
    return size;
  }

  private validateRiskLimits(
    size: number,
    price: number,
    portfolio: Portfolio
  ): boolean {
    const notionalValue = size * price;
    const totalExposure = this.calculateTotalExposure(portfolio) + notionalValue;
    
    // Check leverage limit
    if (totalExposure / portfolio.equity > this.config.riskLimits.maxLeverage) {
      return false;
    }

    // Check position count limit
    if (portfolio.positions.length >= this.config.riskLimits.maxPositions) {
      return false;
    }

    return true;
  }

  private calculateTotalExposure(portfolio: Portfolio): number {
    return portfolio.positions.reduce(
      (total, position) => total + Math.abs(position.notionalValue),
      0
    );
  }

  // Public methods for external access
  updateDynamicParams(params: DynamicRiskParams) {
    this.dynamicParams = params;
  }

  getConfig(): PositionSizeConfig {
    return this.config;
  }
}
