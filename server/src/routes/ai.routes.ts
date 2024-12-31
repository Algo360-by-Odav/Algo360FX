import express from 'express';
import { Router, Request, Response } from 'express';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import { MarketDataService } from '../services/MarketData';
import { RiskManagement } from '../services/RiskManagement';
import { validateRequest } from '../middleware/validateRequest';
import { analyzeSchema, generateSignalSchema, riskAssessmentSchema } from '../schemas/ai.schema';
import { OpenAI } from 'openai';
import { config } from '../config/config';
import { AsyncRequestHandler } from '../types/express';
import { auth } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();
const technicalAnalysis = new TechnicalAnalysis();
const marketData = new MarketDataService();
const riskManagement = new RiskManagement();
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

// Analyze market data
router.post('/analyze', validateRequest(analyzeSchema), (async (req: Request, res: Response) => {
  try {
    const { symbol, timeframe, indicators } = req.body;

    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    // Perform technical analysis
    const analysis = await technicalAnalysis.analyze(symbol, timeframe, indicators);

    res.json({
      symbol,
      timeframe,
      analysis
    });
  } catch (error) {
    console.error('Error in analysis:', error);
    res.status(500).json({ error: 'Failed to analyze market data' });
  }
}) as AsyncRequestHandler);

// Get AI predictions
router.get('/predict/:symbol', (async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    // Generate prediction
    const prediction = await technicalAnalysis.predict(symbol, timeframe as string);

    res.json({
      symbol,
      timeframe,
      prediction
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
}) as AsyncRequestHandler);

// Get trading signals
router.get('/signals/:symbol', (async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    // Get market data
    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    // Generate signals
    const signals = await technicalAnalysis.generateSignals(symbol, timeframe as string);

    res.json({
      symbol,
      timeframe,
      signals
    });
  } catch (error) {
    console.error('Error in signals:', error);
    res.status(500).json({ error: 'Failed to generate signals' });
  }
}) as AsyncRequestHandler);

// Risk assessment
router.post('/risk', validateRequest(riskAssessmentSchema), (async (req: Request, res: Response) => {
  try {
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

    res.json({
      assessment: completion.choices[0].message.content,
      riskAnalysis,
      metadata: {
        position,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error in risk assessment:', error);
    res.status(500).json({ error: 'Failed to generate risk assessment' });
  }
}) as AsyncRequestHandler);

// Generate trading strategy
const generateStrategy: AsyncRequestHandler = async (req, res) => {
  try {
    const { market, timeframe, riskLevel } = req.body;

    const prompt = `Generate a trading strategy for ${market} market with ${timeframe} timeframe and ${riskLevel} risk level. Include entry/exit rules, risk management, and technical indicators.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional forex trading expert." },
        { role: "user", content: prompt }
      ]
    });

    const strategy = completion.choices[0].message.content;

    res.json({
      success: true,
      strategy
    });
  } catch (error) {
    console.error('Error generating strategy:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating trading strategy'
    });
  }
};

// Analyze market conditions
const analyzeMarket: AsyncRequestHandler = async (req, res) => {
  try {
    const { market, data } = req.body;

    const prompt = `Analyze the current market conditions for ${market} using the following data: ${JSON.stringify(data)}. Provide insights on trend, support/resistance levels, and potential trading opportunities.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional market analyst." },
        { role: "user", content: prompt }
      ]
    });

    const analysis = completion.choices[0].message.content;

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing market:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing market conditions'
    });
  }
};

// Optimize trading parameters
const optimizeParameters: AsyncRequestHandler = async (req, res) => {
  try {
    const { strategy, historicalData } = req.body;

    const prompt = `Optimize the parameters for the following trading strategy: ${strategy} using this historical data: ${JSON.stringify(historicalData)}. Provide optimized values for all parameters.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a trading system optimization expert." },
        { role: "user", content: prompt }
      ]
    });

    const optimization = completion.choices[0].message.content;

    res.json({
      success: true,
      optimization
    });
  } catch (error) {
    console.error('Error optimizing parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Error optimizing trading parameters'
    });
  }
};

// Register routes
router.use(auth);
router.use(apiLimiter);

router.post('/generate-strategy', generateStrategy);
router.post('/analyze-market', analyzeMarket);
router.post('/optimize-parameters', optimizeParameters);

export { router as aiRouter };
