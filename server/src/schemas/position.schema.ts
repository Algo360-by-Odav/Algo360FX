import { z } from 'zod';

export const createPositionSchema = z.object({
  symbol: z.string(),
  type: z.enum(['buy', 'sell']),
  lotSize: z.number().min(0.01),
  openPrice: z.number(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  strategy: z.string().optional(),
  portfolio: z.string()
});

export const updatePositionSchema = z.object({
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional()
});
