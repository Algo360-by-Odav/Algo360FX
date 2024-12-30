import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { searchSchema } from '../schemas/search.schema';
import { searchAnalytics } from '../services/analyticsService';
import { searchDocumentation } from '../services/documentationService';
import { searchPortfolios } from '../services/portfolioService';
import { searchStrategies } from '../services/strategyService';
import { SearchResult } from '../types/search';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Search across all resources
router.post('/', validateRequest(searchSchema), asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { query, type } = req.body;
  let results: SearchResult[] = [];

  // Search based on type
  switch (type) {
    case 'analytics':
      results = await searchAnalytics(query);
      break;
    case 'documentation':
      results = await searchDocumentation(query);
      break;
    case 'portfolios':
      results = await searchPortfolios(query);
      break;
    case 'strategies':
      results = await searchStrategies(query);
      break;
    case 'all':
      // Search across all types
      const [analytics, docs, portfolios, strategies] = await Promise.all([
        searchAnalytics(query),
        searchDocumentation(query),
        searchPortfolios(query),
        searchStrategies(query)
      ]);
      results = [...analytics, ...docs, ...portfolios, ...strategies];
      break;
    default:
      res.status(400).json({ error: 'Invalid search type' });
      return;
  }

  res.json({ results });
}));

export default router;
