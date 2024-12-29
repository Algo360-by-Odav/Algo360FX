"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get user preferences
router.get('/preferences', auth_1.auth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        // For now, return default preferences
        // In a real app, you would fetch this from the database
        return res.json({
            preferences: {
                theme: 'light',
                notifications: true,
                riskLevel: 'moderate',
                tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
                timeframes: ['1h', '4h', '1d'],
                indicators: ['RSI', 'MACD', 'Moving Average']
            }
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}));
// Update user preferences
router.put('/preferences', auth_1.auth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const preferences = req.body;
        // In a real app, you would save this to the database
        return res.json({ preferences });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}));
exports.default = router;
