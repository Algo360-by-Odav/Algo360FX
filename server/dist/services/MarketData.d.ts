export interface MarketData {
    getMarketData(symbol: string, timeframe?: string): Promise<any>;
    getSentiment(symbol: string): Promise<any>;
    getRelevantNews(symbol: string): Promise<any>;
    getEconomicCalendar(): Promise<any>;
    getMarketCorrelations(symbol: string): Promise<any>;
    getVolatilityAnalysis(symbol: string): Promise<any>;
}
export declare class MarketDataService implements MarketData {
    private newsApiKey;
    private marketApiKey;
    constructor();
    getMarketData(symbol: string, timeframe?: string): Promise<any>;
    getSentiment(symbol: string): Promise<any>;
    getRelevantNews(symbol: string): Promise<any>;
    getEconomicCalendar(): Promise<any>;
    getMarketCorrelations(symbol: string): Promise<any>;
    getVolatilityAnalysis(symbol: string): Promise<any>;
}
