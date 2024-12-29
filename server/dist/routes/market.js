"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MarketData_1 = require("../services/MarketData");
const TechnicalAnalysis_1 = require("../services/TechnicalAnalysis");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const marketData = new MarketData_1.MarketDataService();
const technicalAnalysis = new TechnicalAnalysis_1.TechnicalAnalysis();
// Get market data for a symbol
router.get('/:symbol', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = await marketData.getMarketData(symbol);
        return res.json(data);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}));
// Get technical analysis for a symbol
router.get('/:symbol/analysis', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { symbol } = req.params;
        const { timeframe = '1h', indicators = [] } = req.query;
        const analysis = await technicalAnalysis.analyze(symbol, timeframe, Array.isArray(indicators) ? indicators.map(i => String(i)) : [String(indicators)]);
        return res.json(analysis);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}));
exports.default = router;
