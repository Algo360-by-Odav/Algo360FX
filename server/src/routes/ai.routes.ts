import { Router } from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import { MarketData } from '../services/MarketData';
import { RiskManagement } from '../services/RiskManagement';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validation schemas
const analyzeMarketSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  indicators: z.array(z.string()).optional(),
});

const generateSignalSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  strategy: z.string().optional(),
});

const riskAssessmentSchema = z.object({
  position: z.object({
    symbol: z.string(),
    type: z.enum(['long', 'short']),
    entry: z.number(),
    stopLoss: z.number(),
    takeProfit: z.number(),
    size: z.number(),
  }),
});

// Market Analysis Endpoint
router.post('/analyze', aiLimiter, validateRequest(analyzeMarketSchema), (req, res, next) => {
  try {
    const { symbol, timeframe, indicators } = req.body;
    
    // Get technical analysis data
    const technicalAnalysis = new TechnicalAnalysis();
    technicalAnalysis.analyze(symbol, timeframe, indicators)
      .then(analysis => {
        // Get market sentiment and news
        const marketData = new MarketData();
        marketData.getSentiment(symbol)
          .then(sentiment => {
            marketData.getRelevantNews(symbol)
              .then(news => {
                // Generate AI analysis
                const prompt = `
                  Analyze the following market data for ${symbol} on ${timeframe} timeframe:
                  Technical Analysis: ${JSON.stringify(analysis)}
                  Market Sentiment: ${JSON.stringify(sentiment)}
                  Recent News: ${JSON.stringify(news)}
                  
                  Provide a comprehensive trading analysis including:
                  1. Current market trend and key levels
                  2. Important technical signals
                  3. Market sentiment impact
                  4. Potential trading opportunities
                  5. Key risk factors to consider
                `;

                openai.chat.completions.create({
                  model: "gpt-4",
                  messages: [
                    { 
                      role: "system", 
                      content: "You are an expert forex trading analyst with deep knowledge of technical and fundamental analysis. Provide clear, actionable insights." 
                    },
                    { role: "user", content: prompt }
                  ],
                  temperature: 0.7,
                })
                .then(completion => {
                  res.json({
                    analysis: completion.choices[0].message.content,
                    technicalData: analysis,
                    sentiment,
                    news,
                    metadata: {
                      symbol,
                      timeframe,
                      timestamp: new Date(),
                    }
                  });
                })
                .catch(next);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  } catch (error) {
    console.error('Error in market analysis:', error);
    next(error);
  }
});

// Trading Signal Generation
router.post('/signal', validateRequest(generateSignalSchema), async (req, res) => {
  try {
    const { symbol, timeframe, strategy } = req.body;
    
    // Get market data
    const technicalAnalysis = new TechnicalAnalysis();
    const analysis = await technicalAnalysis.analyze(symbol, timeframe);
    
    // Generate AI signal
    const prompt = `
      Generate a trading signal for ${symbol} on ${timeframe} timeframe.
      Technical Analysis: ${JSON.stringify(analysis)}
      ${strategy ? `Using strategy: ${strategy}` : ''}
      
      Provide:
      1. Signal type (buy/sell)
      2. Entry price range
      3. Stop loss level
      4. Take profit targets
      5. Risk/reward ratio
      6. Confidence level
      7. Key reasons for the signal
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert trading signal generator. Provide precise, data-driven trading signals with clear entry and exit points." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
    });

    res.json({
      signal: completion.choices[0].message.content,
      technicalData: analysis,
      metadata: {
        symbol,
        timeframe,
        strategy,
        timestamp: new Date(),
      }
    });
  } catch (error) {
    console.error('Error generating signal:', error);
    res.status(500).json({ error: 'Failed to generate trading signal' });
  }
});

// Risk Assessment
router.post('/risk', aiLimiter, validateRequest(riskAssessmentSchema), (req, res, next) => {
  try {
    const { position } = req.body;
    
    // Calculate risk metrics
    const riskManager = new RiskManagement();
    riskManager.analyzePosition(position)
      .then(riskMetrics => {
        // Generate AI risk assessment
        const prompt = `
          Analyze the risk for this trading position:
          Position Details: ${JSON.stringify(position)}
          Risk Metrics: ${JSON.stringify(riskMetrics)}
          
          Provide:
          1. Risk assessment summary
          2. Position sizing recommendations
          3. Risk management suggestions
          4. Alternative stop loss/take profit levels
          5. Portfolio impact analysis
        `;

        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { 
              role: "system", 
              content: "You are an expert risk manager. Provide thorough risk assessments and practical risk management advice." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.5,
        })
        .then(completion => {
          res.json({
            assessment: completion.choices[0].message.content,
            riskMetrics,
            metadata: {
              position,
              timestamp: new Date(),
            }
          });
        })
        .catch(next);
      })
      .catch(next);
  } catch (error) {
    console.error('Error in risk assessment:', error);
    next(error);
  }
});

export default router;
