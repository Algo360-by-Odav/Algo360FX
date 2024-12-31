import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional()
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  notifications: z.boolean().optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'zh']).optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  defaultLotSize: z.number().min(0.01).max(100).optional(),
  tradingPairs: z.array(z.string()).optional()
});
