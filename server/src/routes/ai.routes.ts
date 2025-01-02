import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Router } from 'express';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import { MarketDataService } from '../services/MarketData';
import { RiskManagement } from '../services/RiskManagement';
import { validateRequest } from '../middleware/validateRequest';
import { analyzeSchema, generateSignalSchema, riskAssessmentSchema } from '../schemas/ai.schema';
import { OpenAI } from 'openai';
import { config } from '../config/config';
import { AuthRequest } from '../types/express';
import { auth } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { AsyncHandler } from '../types/express';
import { RouteBuilder } from '../utils/routeBuilder';
import { handleError } from '../utils/routeHandler';

const technicalAnalysis = new TechnicalAnalysis();
const marketData = new MarketDataService();
const riskManagement = new RiskManagement();
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

// Analyze market data
const analyzeMarket: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { symbol, timeframe, indicators } = authReq.body;

    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    const analysis = await technicalAnalysis.analyze(symbol, timeframe, indicators);
    res.json({ symbol, timeframe, analysis });
  } catch (error) {
    handleError(error);
  }
};

// Get AI predictions
const getPredictions: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    const prediction = await technicalAnalysis.predict(symbol, timeframe as string);
    res.json({ symbol, timeframe, prediction });
  } catch (error) {
    handleError(error);
  }
};

// Get trading signals
const getSignals: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    const data = await marketData.getMarketData(symbol);
    if (!data) {
      res.status(404).json({ error: 'Market data not found' });
      return;
    }

    const signals = await technicalAnalysis.generateSignals(symbol, timeframe as string);
    res.json({ symbol, timeframe, signals });
  } catch (error) {
    handleError(error);
  }
};

// Risk assessment
const riskAssessment: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { position } = authReq.body;
    const riskAnalysis = await riskManagement.analyzeRisk(position);

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
    handleError(error);
  }
};

// Generate trading strategy
const generateStrategy: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { market, timeframe, riskLevel } = authReq.body;
    const prompt = `Generate a trading strategy for ${market} on ${timeframe} timeframe with ${riskLevel} risk level.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert trading strategy developer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    res.json({ strategy: completion.choices[0].message.content });
  } catch (error) {
    handleError(error);
  }
};

// Analyze market conditions
const analyzeMarketConditions: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { market, data } = authReq.body;

    const prompt = `Analyze market conditions for ${market} with the following data: ${JSON.stringify(data)}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      analysis,
      metadata: {
        market,
        timestamp: new Date()
      }
    });
  } catch (error) {
    handleError(error);
  }
};

// Optimize trading parameters
const optimizeParameters: AsyncHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const { strategy, historicalData } = authReq.body;

    const prompt = `Optimize trading parameters for strategy: ${strategy} using historical data: ${JSON.stringify(historicalData)}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const optimization = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      optimization,
      metadata: {
        strategy,
        timestamp: new Date()
      }
    });
  } catch (error) {
    handleError(error);
  }
};

// Create router with RouteBuilder
const router = new RouteBuilder()
  .use(auth)
  .use(apiLimiter)
  .post('/analyze', analyzeSchema, analyzeMarket)
  .get('/predict/:symbol', getPredictions)
  .get('/signals/:symbol', getSignals)
  .post('/risk', riskAssessmentSchema, riskAssessment)
  .post('/generate-strategy', generateSignalSchema, generateStrategy)
  .post('/analyze-market', analyzeSchema, analyzeMarketConditions)
  .post('/optimize-parameters', riskAssessmentSchema, optimizeParameters)
  .build();

export { router as aiRouter };
