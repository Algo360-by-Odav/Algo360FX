export declare class TechnicalAnalysis {
    private getHistoricalData;
    analyze(symbol: string, timeframe: string, indicators?: string[]): Promise<Record<string, any>>;
    private calculateSMA;
    private calculateEMA;
    private calculateRSI;
    private calculateMACD;
    private calculateBollingerBands;
    private calculateStandardDeviation;
    private calculateATR;
    private calculateStochastic;
    private analyzeTrend;
    private calculateTrendStrength;
    private findKeyLevels;
    private detectPatterns;
    predict(symbol: string, timeframe: string): Promise<any>;
    generateSignals(symbol: string, timeframe: string): Promise<any>;
}
