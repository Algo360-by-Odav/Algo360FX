import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { searchSchema } from '../schemas/search.schema';
import { SearchService } from '../services/Search';

const router = Router();
const searchService = new SearchService();

// Search endpoint
router.get('/', validateRequest(searchSchema), asyncHandler(async (req: Request, res: Response) => {
  const { query, type, limit = 10, page = 1 } = req.query;

  const results = await searchService.search({
    query: query as string,
    type: type as string,
    limit: Number(limit),
    page: Number(page)
  });

  res.json({
    success: true,
    data: results
  });
}));

export default router;
