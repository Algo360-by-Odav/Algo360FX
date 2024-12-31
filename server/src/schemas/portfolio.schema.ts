import { z } from 'zod';

export const createPortfolioSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  initialBalance: z.number().min(0),
  currency: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  strategies: z.array(z.string()).optional()
});

export const updatePortfolioSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  strategies: z.array(z.string()).optional()
});
