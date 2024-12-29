"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TechnicalAnalysis_1 = require("../services/TechnicalAnalysis");
const MarketData_1 = require("../services/MarketData");
const RiskManagement_1 = require("../services/RiskManagement");
const validateRequest_1 = require("../middleware/validateRequest");
const ai_schema_1 = require("../schemas/ai.schema");
const openai_1 = require("openai");
const config_1 = require("../config/config");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const technicalAnalysis = new TechnicalAnalysis_1.TechnicalAnalysis();
const marketData = new MarketData_1.MarketDataService();
const riskManagement = new RiskManagement_1.RiskManagement();
const openai = new openai_1.OpenAI({ apiKey: config_1.config.openaiApiKey });
// Analyze market data
router.post('/analyze', (0, validateRequest_1.validateRequest)(ai_schema_1.analyzeSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { symbol, timeframe, indicators } = req.body;
    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
        return res.status(404).json({ error: 'Market data not found' });
    }
    // Perform technical analysis
    const analysis = await technicalAnalysis.analyze(symbol, timeframe, indicators);
    return res.json({
        symbol,
        timeframe,
        analysis
    });
}));
// Get AI predictions
router.get('/predict/:symbol', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;
    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
        return res.status(404).json({ error: 'Market data not found' });
    }
    // Generate prediction
    const prediction = await technicalAnalysis.predict(symbol, timeframe);
    return res.json({
        symbol,
        timeframe,
        prediction
    });
}));
// Get trading signals
router.get('/signals/:symbol', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;
    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
        return res.status(404).json({ error: 'Market data not found' });
    }
    // Generate signals
    const signals = await technicalAnalysis.generateSignals(symbol, timeframe);
    return res.json({
        symbol,
        timeframe,
        signals
    });
}));
// Risk assessment
router.post('/risk', (0, validateRequest_1.validateRequest)(ai_schema_1.riskAssessmentSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { position } = req.body;
    // Analyze risk
    const riskAnalysis = await riskManagement.analyzeRisk(position);
    // Generate AI risk assessment
    const prompt = `
    Analyze the risk for this trading position:
    Position Details: ${JSON.stringify(position)}
    Risk Analysis: ${JSON.stringify(riskAnalysis)}
    
    Provide:
    1. Risk assessment summary
    2. Position sizing recommendations
    3. Risk management suggestions
    4. Alternative stop loss/take profit levels
    5. Portfolio impact analysis
  `;
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are an expert risk manager. Provide thorough risk assessments and practical risk management advice."
            },
            { role: "user", content: prompt }
        ],
        temperature: 0.5,
    });
    return res.json({
        assessment: completion.choices[0].message.content,
        riskAnalysis,
        metadata: {
            position,
            timestamp: new Date()
        }
    });
}));
exports.default = router;
