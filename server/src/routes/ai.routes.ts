import { Router, Request, Response } from 'express';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import { MarketDataService } from '../services/MarketData';
import { RiskManagement } from '../services/RiskManagement';
import { validateRequest } from '../middleware/validateRequest';
import { analyzeSchema, generateSignalSchema, riskAssessmentSchema } from '../schemas/ai.schema';
import { OpenAI } from 'openai';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const technicalAnalysis = new TechnicalAnalysis();
const marketData = new MarketDataService();
const riskManagement = new RiskManagement();
const openai = new OpenAI({ apiKey: config.openaiApiKey });

// Analyze market data
router.post('/analyze', validateRequest(analyzeSchema), asyncHandler(async (req: Request, res: Response) => {
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
}));

// Get AI predictions
router.get('/predict/:symbol', asyncHandler(async (req: Request, res: Response) => {
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
}));

// Get trading signals
router.get('/signals/:symbol', asyncHandler(async (req: Request, res: Response) => {
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
}));

// Risk assessment
router.post('/risk', validateRequest(riskAssessmentSchema), asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router;
