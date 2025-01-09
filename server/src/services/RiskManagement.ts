import { Position } from '../types-new/Position';
import { Portfolio } from '../types-new/Portfolio';
import { Strategy } from '../types-new/Strategy';
import { InputJsonValue } from '@prisma/client/runtime/library';

export interface RiskParameters {
  maxPositionSize: number;
  maxDrawdown: number;
  maxLeverage: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

export class RiskManagement {
  private static readonly DEFAULT_PARAMETERS: RiskParameters = {
    maxPositionSize: 0.02, // 2% of portfolio
    maxDrawdown: 0.20, // 20%
    maxLeverage: 10, // 10x
    stopLossPercent: 2, // 2%
    takeProfitPercent: 6 // 6%
  };

  private parameters: RiskParameters;
  private accountBalance: number = 10000; // Default value, should be fetched from user's account

  constructor(parameters: Partial<RiskParameters> = {}) {
    this.parameters = { ...RiskManagement.DEFAULT_PARAMETERS, ...parameters };
  }

  public analyzePosition(position: Position, portfolio: Portfolio): { isValid: boolean; message: string } {
    if (!position || !portfolio) {
      return { isValid: false, message: 'Invalid position or portfolio data' };
    }

    // Validate stop loss and take profit
    if (!position.stopLoss && !position.takeProfit) {
      return { isValid: false, message: 'Position must have either stop loss or take profit set' };
    }

    // Calculate position size as percentage of portfolio
    const positionValue = position.size * position.entryPrice;
    const portfolioValue = portfolio.balance;
    const positionSizePercent = (positionValue / portfolioValue) * 100;

    if (positionSizePercent > this.parameters.maxPositionSize) {
      return {
        isValid: false,
        message: `Position size (${positionSizePercent.toFixed(2)}%) exceeds maximum allowed (${this.parameters.maxPositionSize}%)`
      };
    }

    return { isValid: true, message: 'Position meets risk parameters' };
  }

  public generateRiskReport(position: Position): InputJsonValue {
    const riskReport: Record<string, any> = {
      timestamp: new Date(),
      positionId: position.id,
      metrics: {}
    };

    // Calculate risk metrics if stop loss is set
    if (position.stopLoss) {
      const riskAmount = Math.abs(position.entryPrice - position.stopLoss) * position.size;
      riskReport.metrics.riskAmount = riskAmount;
      
      if (position.takeProfit) {
        const rewardAmount = Math.abs(position.takeProfit - position.entryPrice) * position.size;
        riskReport.metrics.rewardAmount = rewardAmount;
        riskReport.metrics.riskRewardRatio = rewardAmount / (riskAmount || 1); // Avoid division by zero
      }
    }

    // Add position details
    riskReport.position = {
      entryPrice: position.entryPrice,
      size: position.size,
      type: position.type,
      stopLoss: position.stopLoss || null,
      takeProfit: position.takeProfit || null
    };

    return riskReport as InputJsonValue;
  }

  public validateRiskParameters(stopLoss: number | null, takeProfit: number | null, entryPrice: number): boolean {
    if (!stopLoss && !takeProfit) {
      return false;
    }

    if (stopLoss) {
      const stopLossPercent = Math.abs((entryPrice - stopLoss) / entryPrice) * 100;
      if (stopLossPercent > this.parameters.stopLossPercent) {
        return false;
      }
    }

    if (takeProfit) {
      const takeProfitPercent = Math.abs((takeProfit - entryPrice) / entryPrice) * 100;
      if (takeProfitPercent > this.parameters.takeProfitPercent) {
        return false;
      }
    }

    return true;
  }
}
