"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalAnalysis = void 0;
const technicalIndicators = __importStar(require("technicalindicators"));
const axios_1 = __importDefault(require("axios"));
class TechnicalAnalysis {
    async getHistoricalData(symbol, timeframe) {
        // Replace with your actual market data provider
        const response = await axios_1.default.get(`${process.env.MARKET_DATA_API}/historical`, {
            params: { symbol, timeframe }
        });
        return response.data;
    }
    async analyze(symbol, timeframe, indicators = []) {
        try {
            const historicalData = await this.getHistoricalData(symbol, timeframe);
            const analysis = {};
            // Default indicators if none specified
            if (indicators.length === 0) {
                indicators = ['sma', 'ema', 'rsi', 'macd', 'bollinger'];
            }
            for (const indicator of indicators) {
                switch (indicator.toLowerCase()) {
                    case 'sma':
                        analysis.sma = this.calculateSMA(historicalData.map((d) => d.close));
                        break;
                    case 'ema':
                        analysis.ema = this.calculateEMA(historicalData.map((d) => d.close));
                        break;
                    case 'rsi':
                        analysis.rsi = this.calculateRSI(historicalData.map((d) => d.close));
                        break;
                    case 'macd':
                        analysis.macd = this.calculateMACD(historicalData.map((d) => d.close));
                        break;
                    case 'bollinger':
                        analysis.bollinger = this.calculateBollingerBands(historicalData.map((d) => d.close));
                        break;
                    case 'atr':
                        analysis.atr = this.calculateATR(historicalData);
                        break;
                    case 'stochastic':
                        analysis.stochastic = this.calculateStochastic(historicalData);
                        break;
                    // Add more indicators as needed
                }
            }
            // Add trend analysis
            analysis.trend = this.analyzeTrend(historicalData, analysis);
            // Add support/resistance levels
            analysis.levels = this.findKeyLevels(historicalData);
            // Add pattern recognition
            analysis.patterns = this.detectPatterns(historicalData);
            return analysis;
        }
        catch (error) {
            console.error('Error in technical analysis:', error);
            throw error;
        }
    }
    calculateSMA(data, period = 20) {
        const sma = [];
        for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma.push(sum / period);
        }
        return sma;
    }
    calculateEMA(data, period = 20) {
        const multiplier = 2 / (period + 1);
        const ema = [data[0]];
        for (let i = 1; i < data.length; i++) {
            ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
        }
        return ema;
    }
    calculateRSI(data, period = 14) {
        const rsi = [];
        const gains = [];
        const losses = [];
        // Calculate price changes
        for (let i = 1; i < data.length; i++) {
            const change = data[i] - data[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? -change : 0);
        }
        // Calculate initial average gain and loss
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
        // Calculate RSI
        for (let i = period; i < data.length; i++) {
            avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
            avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
        }
        return rsi;
    }
    calculateMACD(data) {
        const macdInput = {
            values: data,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: true,
            SimpleMASignal: true
        };
        const macdLine = this.calculateEMA(data, macdInput.fastPeriod)
            .map((fast, i) => fast - this.calculateEMA(data, macdInput.slowPeriod)[i]);
        const signalLine = this.calculateEMA(macdLine, macdInput.signalPeriod);
        const histogram = macdLine.map((macd, i) => macd - signalLine[i]);
        return {
            macdLine,
            signalLine,
            histogram
        };
    }
    calculateBollingerBands(data, period = 20) {
        const sma = this.calculateSMA(data, period);
        const stdDev = this.calculateStandardDeviation(data, period);
        const upperBand = sma.map((sma, i) => sma + (2 * stdDev[i]));
        const lowerBand = sma.map((sma, i) => sma - (2 * stdDev[i]));
        return {
            middle: sma,
            upper: upperBand,
            lower: lowerBand
        };
    }
    calculateStandardDeviation(data, period) {
        const sma = this.calculateSMA(data, period);
        const stdDev = [];
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const squaredDiffs = slice.map(x => Math.pow(x - sma[i - period + 1], 2));
            const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
            stdDev.push(Math.sqrt(variance));
        }
        return stdDev;
    }
    calculateATR(data, period = 14) {
        return technicalIndicators.atr({
            high: data.map(d => d.high),
            low: data.map(d => d.low),
            close: data.map(d => d.close),
            period
        });
    }
    calculateStochastic(data, period = 14) {
        const stochastic = technicalIndicators.stochastic({
            high: data.map(d => d.high),
            low: data.map(d => d.low),
            close: data.map(d => d.close),
            period,
            signalPeriod: 3
        });
        return {
            k: stochastic.map(s => s.k),
            d: stochastic.map(s => s.d)
        };
    }
    analyzeTrend(data, indicators) {
        const closes = data.map(d => d.close);
        const sma20 = this.calculateSMA(data.map(d => d.close), 20);
        const sma50 = this.calculateSMA(data.map(d => d.close), 50);
        const sma200 = this.calculateSMA(data.map(d => d.close), 200);
        return {
            shortTerm: closes[closes.length - 1] > sma20[sma20.length - 1] ? 'bullish' : 'bearish',
            mediumTerm: closes[closes.length - 1] > sma50[sma50.length - 1] ? 'bullish' : 'bearish',
            longTerm: closes[closes.length - 1] > sma200[sma200.length - 1] ? 'bullish' : 'bearish',
            strength: this.calculateTrendStrength(data),
        };
    }
    calculateTrendStrength(data) {
        // Implement trend strength calculation
        // Could use ADX or other trend strength indicators
        return 'moderate'; // placeholder
    }
    findKeyLevels(data) {
        // Implement support/resistance level detection
        return {
            support: [],
            resistance: [],
        };
    }
    detectPatterns(data) {
        // Implement chart pattern recognition
        return [];
    }
    async predict(symbol, timeframe) {
        const historicalData = await this.getHistoricalData(symbol, timeframe);
        // Implement prediction logic here
        return {
            symbol,
            timeframe,
            prediction: {
                direction: 'up',
                probability: 0.75,
                targetPrice: 1.2300,
                timeframe: '4h'
            }
        };
    }
    async generateSignals(symbol, timeframe) {
        const historicalData = await this.getHistoricalData(symbol, timeframe);
        // Implement signal generation logic here
        return {
            symbol,
            timeframe,
            signals: [
                {
                    type: 'buy',
                    entryPrice: 1.2100,
                    stopLoss: 1.2050,
                    takeProfit: 1.2200,
                    timeframe: '1h',
                    confidence: 0.8
                }
            ]
        };
    }
}
exports.TechnicalAnalysis = TechnicalAnalysis;
