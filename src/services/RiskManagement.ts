export class RiskManagement {
  calculatePositionRisk(position: any) {
    if (!position) return 0;
    const riskAmount = position.size * Math.abs(position.entryPrice - position.stopLoss);
    return riskAmount;
  }

  calculatePortfolioRisk(positions: any[]) {
    if (!positions?.length) return 0;
    return positions.reduce((total, pos) => total + this.calculatePositionRisk(pos), 0);
  }

  checkPositionSizing(position: any) {
    if (!position) return false;
    const riskAmount = this.calculatePositionRisk(position);
    return riskAmount <= position.maxRiskAmount;
  }
}
