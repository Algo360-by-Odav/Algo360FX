import express, { Request, Response, NextFunction } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import OpenAI from 'openai';
import Joi from 'joi';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

// Validation schemas
const promptSchema = Joi.object({
  prompt: Joi.string().required().min(1).max(1000)
});

const analyzeSchema = Joi.object({
  trades: Joi.array().items(Joi.object()).required(),
  timeframe: Joi.string().valid('day', 'week', 'month', 'year').required()
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate trading ideas
router.post('/generate-ideas', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate trading ideas for: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ ideas: completion.choices[0].text });
  } catch (error) {
    console.error('Generate ideas error:', error);
    return res.status(500).json({ error: 'Failed to generate trading ideas' });
  }
}));

// Analyze market sentiment
router.post('/analyze-sentiment', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Analyze market sentiment for: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ sentiment: completion.choices[0].text });
  } catch (error) {
    console.error('Analyze sentiment error:', error);
    return res.status(500).json({ error: 'Failed to analyze market sentiment' });
  }
}));

// Predict trends
router.post('/predict', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Predict market trends for: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ prediction: completion.choices[0].text });
  } catch (error) {
    console.error('Predict trends error:', error);
    return res.status(500).json({ error: 'Failed to predict market trends' });
  }
}));

// Analyze trading performance
router.post('/analyze-trades', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = analyzeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { trades, timeframe } = value;
    const tradesStr = JSON.stringify(trades);

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Analyze these trades over ${timeframe} timeframe: ${tradesStr}`,
      max_tokens: 1000
    });

    return res.json({ analysis: completion.choices[0].text });
  } catch (error) {
    console.error('Analyze trades error:', error);
    return res.status(500).json({ error: 'Failed to analyze trades' });
  }
}));

// Generate risk assessment
router.post('/risk-assessment', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Generate risk assessment for: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ assessment: completion.choices[0].text });
  } catch (error) {
    console.error('Risk assessment error:', error);
    return res.status(500).json({ error: 'Failed to generate risk assessment' });
  }
}));

// Generate trading strategy optimization suggestions
router.post('/optimize-strategy', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Suggest optimizations for trading strategy: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ suggestions: completion.choices[0].text });
  } catch (error) {
    console.error('Strategy optimization error:', error);
    return res.status(500).json({ error: 'Failed to generate optimization suggestions' });
  }
}));

// Generate market analysis
router.post('/market-analysis', auth, asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = promptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Provide detailed market analysis for: ${value.prompt}`,
      max_tokens: 1000
    });

    return res.json({ analysis: completion.choices[0].text });
  } catch (error) {
    console.error('Market analysis error:', error);
    return res.status(500).json({ error: 'Failed to generate market analysis' });
  }
}));

// General AI completion endpoint
router.post('/completion', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return res.json({ content: completion.choices[0]?.message?.content || '' });
  } catch (error) {
    console.error('AI completion error:', error);
    return res.status(500).json({ error: 'Failed to generate AI response' });
  }
}));

export { router as aiRouter };
