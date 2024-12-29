import { z } from 'zod';

export const analyzeSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  indicators: z.array(z.string())
});

export const generateSignalSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  strategy: z.string()
});

export const riskAssessmentSchema = z.object({
  position: z.object({
    symbol: z.string(),
    type: z.enum(['buy', 'sell']),
    size: z.number(),
    entryPrice: z.number(),
    stopLoss: z.number().optional(),
    takeProfit: z.number().optional()
  })
});
