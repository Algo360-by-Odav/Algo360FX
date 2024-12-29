"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataService = void 0;
const axios_1 = __importDefault(require("axios"));
class MarketDataService {
    constructor() {
        this.newsApiKey = process.env.NEWS_API_KEY;
        this.marketApiKey = process.env.MARKET_API_KEY;
        // Initialize any required connections or configurations
    }
    async getMarketData(symbol, timeframe = '1h') {
        try {
            // Replace with your actual market data provider
            const response = await axios_1.default.get(`${process.env.MARKET_API}/data`, {
                params: {
                    symbol,
                    timeframe,
                    apiKey: this.marketApiKey
                }
            });
            return response.data;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get market data';
            throw new Error(errorMessage);
        }
    }
    async getSentiment(symbol) {
        try {
            // Replace with your actual market sentiment API
            const response = await axios_1.default.get(`${process.env.MARKET_API}/sentiment`, {
                params: {
                    symbol,
                    apiKey: this.marketApiKey
                }
            });
            return {
                overall: response.data.sentiment,
                social: response.data.socialSentiment,
                news: response.data.newsSentiment,
                technical: response.data.technicalSentiment,
                institutional: response.data.institutionalSentiment,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get market sentiment';
            throw new Error(errorMessage);
        }
    }
    async getRelevantNews(symbol) {
        try {
            // Using NewsAPI for market news
            const response = await axios_1.default.get('https://newsapi.org/v2/everything', {
                params: {
                    q: symbol,
                    language: 'en',
                    sortBy: 'relevancy',
                    pageSize: 10,
                    apiKey: this.newsApiKey
                }
            });
            return response.data.articles.map((article) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                publishedAt: article.publishedAt,
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get relevant news';
            throw new Error(errorMessage);
        }
    }
    async getEconomicCalendar() {
        try {
            // Replace with your economic calendar API
            const response = await axios_1.default.get(`${process.env.MARKET_API}/calendar`, {
                params: {
                    apiKey: this.marketApiKey
                }
            });
            return response.data.events;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get economic calendar';
            throw new Error(errorMessage);
        }
    }
    async getMarketCorrelations(symbol) {
        try {
            // Replace with your correlation data API
            const response = await axios_1.default.get(`${process.env.MARKET_API}/correlations`, {
                params: {
                    symbol,
                    apiKey: this.marketApiKey
                }
            });
            return response.data.correlations;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get correlations';
            throw new Error(errorMessage);
        }
    }
    async getVolatilityAnalysis(symbol) {
        try {
            // Replace with your volatility analysis API
            const response = await axios_1.default.get(`${process.env.MARKET_API}/volatility`, {
                params: {
                    symbol,
                    apiKey: this.marketApiKey
                }
            });
            return {
                current: response.data.currentVolatility,
                historical: response.data.historicalVolatility,
                forecast: response.data.volatilityForecast,
                percentile: response.data.volatilityPercentile,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get volatility analysis';
            throw new Error(errorMessage);
        }
    }
}
exports.MarketDataService = MarketDataService;
