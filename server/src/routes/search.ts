import express from 'express';
import { Request, Response } from 'express';
import { AsyncRequestHandler } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { searchSchema } from '../schemas/search.schema';
import { apiLimiter } from '../middleware/rateLimiter';
import { SearchService } from '../services/Search';

const router = express.Router();
const searchService = new SearchService();

// Search endpoint
router.get(
  '/',
  apiLimiter,
  validateRequest(searchSchema),
  (async (req: Request, res: Response) => {
    try {
      const { query, type, limit = 10, page = 1 } = req.query;
      const results = await searchService.search({
        query: query as string,
        type: type as string,
        limit: Number(limit),
        page: Number(page)
      });
      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        error: 'Search failed'
      });
    }
  }) as AsyncRequestHandler
);

export default router;
