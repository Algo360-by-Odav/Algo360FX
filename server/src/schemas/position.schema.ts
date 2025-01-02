import { z } from 'zod';

export const createPositionSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  type: z.enum(['buy', 'sell'], {
    required_error: 'Position type must be either buy or sell'
  }),
  lotSize: z.number()
    .min(0.01, 'Lot size must be at least 0.01')
    .max(100, 'Lot size cannot exceed 100'),
  openPrice: z.number()
    .positive('Open price must be positive'),
  stopLoss: z.number()
    .positive('Stop loss must be positive')
    .optional(),
  takeProfit: z.number()
    .positive('Take profit must be positive')
    .optional(),
  strategy: z.string()
    .min(1, 'Strategy name is required')
    .optional(),
  portfolio: z.string()
    .min(1, 'Portfolio is required'),
  timestamp: z.date()
    .default(() => new Date()),
  status: z.enum(['open', 'closed', 'pending'])
    .default('open')
});

export const updatePositionSchema = z.object({
  stopLoss: z.number()
    .positive('Stop loss must be positive')
    .optional(),
  takeProfit: z.number()
    .positive('Take profit must be positive')
    .optional(),
  status: z.enum(['open', 'closed', 'pending'])
    .optional()
});
