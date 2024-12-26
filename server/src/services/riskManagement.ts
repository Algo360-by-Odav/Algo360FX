import { Position } from '../types/services';

interface RiskMetrics {
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  positionRiskPercent: number;
  recommendedPositionSize: number;
  successProbability: number;
  expectedValue: number;
  warnings: string[];
}

export class RiskManagement {
  private accountBalance: number = 10000; // Default value, should be fetched from user's account
  private maxRiskPerTrade: number = 0.02; // 2% risk per trade
  private maxDrawdown: number = 0.06; // 6% maximum drawdown

  public calculatePositionSize(accountBalance: number, riskPercentage: number): number {
    return accountBalance * (riskPercentage / 100);
  }

  public calculateMaxLeverage(accountBalance: number): number {
    return Math.min(100, accountBalance / 1000); // Simple leverage calculation
  }

  public calculatePortfolioRisk(): number {
    const maxRiskAmount = this.accountBalance * this.maxRiskPerTrade;
    const maxDrawdownAmount = this.accountBalance * this.maxDrawdown;
    return Math.min(maxRiskAmount, maxDrawdownAmount);
  }

  public async analyzePosition(position: Position): Promise<RiskMetrics> {
    const stopLossDistance = Math.abs(position.entryPrice - position.stopLoss);
    const takeProfitDistance = Math.abs(position.takeProfit - position.entryPrice);
    
    // Calculate risk amount
    const riskAmount = position.size * stopLossDistance;
    
    // Calculate reward amount
    const rewardAmount = position.size * takeProfitDistance;
    
    // Calculate risk-reward ratio
    const riskRewardRatio = rewardAmount / riskAmount;
    
    // Calculate position risk as percentage of account
    const positionRiskPercent = (riskAmount / this.accountBalance) * 100;
    
    // Calculate recommended position size based on risk parameters
    const recommendedPositionSize = this.calculatePositionSize(
      this.accountBalance,
      this.maxRiskPerTrade * 100
    );
    
    // Estimate probability of success based on historical data
    const successProbability = await this.estimateSuccessProbability();
    
    // Calculate expected value
    const expectedValue = (successProbability * rewardAmount) - ((1 - successProbability) * riskAmount);
    
    return {
      riskAmount,
      rewardAmount,
      riskRewardRatio,
      positionRiskPercent,
      recommendedPositionSize,
      successProbability,
      expectedValue,
      warnings: this.generateWarnings(position)
    };
  }

  private async estimateSuccessProbability(): Promise<number> {
    // This would normally involve analyzing historical data
    // For now, return a placeholder value
    return 0.6;
  }

  private generateWarnings(position: Position): string[] {
    const warnings: string[] = [];
    
    // Check risk-reward ratio
    const rr = Math.abs(position.takeProfit - position.entryPrice) / 
               Math.abs(position.stopLoss - position.entryPrice);
    if (rr < 1.5) {
      warnings.push('Risk-reward ratio is below recommended minimum of 1.5');
    }
    
    // Check position size
    const riskAmount = position.size * Math.abs(position.entryPrice - position.stopLoss);
    const riskPercent = (riskAmount / this.accountBalance) * 100;
    if (riskPercent > this.maxRiskPerTrade * 100) {
      warnings.push(`Position risk (${riskPercent.toFixed(2)}%) exceeds maximum allowed risk per trade (${this.maxRiskPerTrade * 100}%)`);
    }
    
    // Check stop loss distance
    const stopLossPercent = (Math.abs(position.entryPrice - position.stopLoss) / position.entryPrice) * 100;
    if (stopLossPercent < 0.1) {
      warnings.push('Stop loss is too close to entry price');
    } else if (stopLossPercent > 2) {
      warnings.push('Stop loss is too far from entry price');
    }
    
    return warnings;
  }
}
