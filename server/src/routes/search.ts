import express, { Response, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import prisma from '../config/database';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const searchSchema = Joi.object({
  query: Joi.string().required().min(1).max(100),
  type: Joi.string().valid('strategy', 'position', 'portfolio').required()
});

// Search endpoint
const searchItems: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
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
            ],
            userId: authReq.user.id
          },
          include: {
            positions: true
          }
        });
        break;

      case 'position':
        results = await prisma.position.findMany({
          where: {
            OR: [
              { symbol: { contains: query, mode: 'insensitive' } },
              { notes: { contains: query, mode: 'insensitive' } }
            ],
            userId: authReq.user.id
          },
          include: {
            strategy: true,
            portfolio: true
          }
        });
        break;

      case 'portfolio':
        results = await prisma.portfolio.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ],
            userId: authReq.user.id
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

// Routes
router.get('/', auth, searchItems);

export { router as searchRouter };
