interface Position {
    symbol: string;
    type: 'long' | 'short';
    entry: number;
    stopLoss: number;
    takeProfit: number;
    size: number;
}
interface RiskMetrics {
    riskAmount: number;
    potentialReward: number;
    riskRewardRatio: number;
    stopLossDistance: number;
    takeProfitDistance: number;
    positionRiskPercent: number;
    recommendedPositionSize: number;
    maxDrawdown: number;
    probabilityOfSuccess: number;
}
interface RiskAnalysis {
    riskRewardRatio: number;
    potentialLoss: number;
    potentialProfit: number;
    riskPercentage: number;
    stopLossPips: number;
    takeProfitPips: number;
    recommendation: string;
}
export declare class RiskManagement {
    private accountBalance;
    private maxRiskPerTrade;
    private maxDrawdown;
    private maxRiskPercentage;
    analyzePosition(position: Position): Promise<RiskMetrics>;
    private calculateRecommendedSize;
    private estimateSuccessProbability;
    private calculateMaxDrawdown;
    validateRiskParameters(position: Position): string[];
    calculatePositionCorrelations(positions: Position[]): Promise<number>;
    generateRiskReport(position: Position, metrics: RiskMetrics): string;
    analyzeRisk(position: Position): Promise<RiskAnalysis>;
    private calculatePipValue;
    private generateRecommendation;
}
export {};
