import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { prisma } from '../config/database';
import { z } from 'zod';
import { AuthRequest } from '../types/express';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Validation schema
const portfolioSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean(),
  config: z.record(z.unknown()).optional(),
  balance: z.number().default(0),
  currency: z.string().default('USD')
});

// Get all portfolios for the authenticated user
router.get('/', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = authReq.user.id;
  console.log('Portfolio request received:', {
    userId,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  const portfolios = await prisma.portfolio.findMany({
    where: {
      userId
    },
    include: {
      positions: true,
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  } satisfies Prisma.PortfolioFindManyArgs);

  return res.json(portfolios);
}));

// Get a specific portfolio
router.get('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id,
      userId: authReq.user.id
    },
    include: {
      positions: true,
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  } satisfies Prisma.PortfolioFindFirstArgs);

  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  return res.json(portfolio);
}));

// Create a new portfolio
router.post('/', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const validatedData = portfolioSchema.parse(req.body);

  const portfolio = await prisma.portfolio.create({
    data: {
      ...validatedData,
      userId: authReq.user.id
    },
    include: {
      positions: true,
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  } satisfies Prisma.PortfolioCreateArgs);

  return res.status(201).json(portfolio);
}));

// Update a portfolio
router.put('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const validatedData = portfolioSchema.parse(req.body);

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id,
      userId: authReq.user.id
    }
  } satisfies Prisma.PortfolioFindFirstArgs);

  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  const updatedPortfolio = await prisma.portfolio.update({
    where: { id },
    data: validatedData,
    include: {
      positions: true,
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  } satisfies Prisma.PortfolioUpdateArgs);

  return res.json(updatedPortfolio);
}));

// Delete a portfolio
router.delete('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id,
      userId: authReq.user.id
    }
  } satisfies Prisma.PortfolioFindFirstArgs);

  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }

  // Delete all positions first
  await prisma.position.deleteMany({
    where: {
      portfolioId: id
    }
  } satisfies Prisma.PositionDeleteManyArgs);

  // Then delete the portfolio
  await prisma.portfolio.delete({
    where: { id }
  } satisfies Prisma.PortfolioDeleteArgs);

  return res.status(204).send();
}));

export default router;
