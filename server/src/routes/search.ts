import express, { Response, RequestHandler, Router } from 'express';
import { SearchService } from '../services-new/Search';
import { authenticateToken, validateRequest } from '../middleware';
import prisma from '../config/database';
import Joi from 'joi';

const router = Router();
const searchService = new SearchService();

// Validation schemas
const searchSchema = Joi.object({
  query: Joi.string().required().min(1).max(100),
  type: Joi.string().valid('strategy', 'position', 'portfolio').required()
});

// Search endpoint
const searchItems: RequestHandler = async (req, res) => {
  try {
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { query, type } = value;

    let results;
    switch (type) {
      case 'strategy':
        results = await prisma.strategy.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          },
          include: {
            positions: true
          }
        });
        break;

      case 'position':
        if (!req.user) {
          throw new Error('User not authenticated');
        }
        results = await prisma.position.findMany({
          where: {
            OR: [
              { symbol: { contains: query, mode: 'insensitive' } }
            ],
            portfolio: {
              userId: req.user.id
            }
          },
          include: {
            strategy: true,
            portfolio: true
          }
        });
        break;

      case 'portfolio':
        if (!req.user) {
          throw new Error('User not authenticated');
        }
        results = await prisma.portfolio.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ],
            userId: req.user.id
          },
          include: {
            positions: {
              include: {
                strategy: true
              }
            }
          }
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid search type' });
    }

    return res.json({
      type,
      query,
      results,
      count: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
};

// Search across all resources
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await searchService.search(query as string, type as string, req.user!.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// Search portfolios
router.get('/portfolios', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await searchService.searchPortfolios(query as string, req.user!.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search portfolios' });
  }
});

// Search strategies
router.get('/strategies', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await searchService.searchStrategies(query as string, req.user!.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search strategies' });
  }
});

// Search positions
router.get('/positions', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await searchService.searchPositions(query as string, req.user!.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search positions' });
  }
});

// Search market data
router.get('/market', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await searchService.searchMarketData(query as string);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search market data' });
  }
});

export { router as searchRouter };
