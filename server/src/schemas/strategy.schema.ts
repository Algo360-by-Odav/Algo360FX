import { z } from 'zod';

export const createStrategySchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  type: z.enum(['manual', 'automated']),
  timeframe: z.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']),
  symbols: z.array(z.string()),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  entryRules: z.array(z.string()),
  exitRules: z.array(z.string()),
  riskManagement: z.object({
    maxLotSize: z.number(),
    maxRiskPerTrade: z.number(),
    maxOpenTrades: z.number()
  })
});

export const updateStrategySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  timeframe: z.enum(['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']).optional(),
  symbols: z.array(z.string()).optional(),
  parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  entryRules: z.array(z.string()).optional(),
  exitRules: z.array(z.string()).optional(),
  riskManagement: z.object({
    maxLotSize: z.number(),
    maxRiskPerTrade: z.number(),
    maxOpenTrades: z.number()
  }).optional()
});
