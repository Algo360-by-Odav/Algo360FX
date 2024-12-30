import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string(),
  type: z.enum(['analytics', 'documentation', 'portfolios', 'strategies', 'all']).optional()
});
