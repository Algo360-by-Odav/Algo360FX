import express from 'express';
import { authenticateToken } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = express.Router();

// Validation schema
const portfolioSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean(),
  config: z.record(z.unknown())
});

// Get all portfolios for the authenticated user
router.get('/', authenticateToken, asyncHandler(async (req: any, res) => {
  try {
    const userId = req.user.id;
    console.log('Portfolio request received:', {
      userId,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    const portfolios = await prisma.portfolio.findMany({
      where: {
        user: {
          id: userId
        }
      },
      include: {
        positions: true
      }
    });

    res.json(portfolios);
  } catch (error: any) {
    console.error('Get portfolios error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to retrieve portfolios',
      message: error.message
    });
  }
}));

// Get a specific portfolio
router.get('/:id', authenticateToken, asyncHandler(async (req: any, res) => {
  const { id } = req.params;

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        user: {
          id: req.user.id
        }
      },
      include: {
        positions: true
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error: any) {
    console.error('Get portfolio error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to retrieve portfolio',
      message: error.message
    });
  }
}));

// Create a new portfolio
router.post('/', authenticateToken, asyncHandler(async (req: any, res) => {
  try {
    const validatedData = portfolioSchema.parse(req.body);

    const portfolio = await prisma.portfolio.create({
      data: {
        ...validatedData,
        user: {
          connect: {
            id: req.user.id
          }
        },
        positions: {
          create: []
        }
      },
      include: {
        positions: true
      }
    });

    res.status(201).json(portfolio);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create portfolio error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to create portfolio',
      message: error.message
    });
  }
}));

// Update a portfolio
router.put('/:id', authenticateToken, asyncHandler(async (req: any, res) => {
  const { id } = req.params;

  try {
    const validatedData = portfolioSchema.parse(req.body);

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        user: {
          id: req.user.id
        }
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: validatedData,
      include: {
        positions: true
      }
    });

    res.json(updatedPortfolio);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update portfolio error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to update portfolio',
      message: error.message
    });
  }
}));

// Delete a portfolio
router.delete('/:id', authenticateToken, asyncHandler(async (req: any, res) => {
  const { id } = req.params;

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id,
        user: {
          id: req.user.id
        }
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    await prisma.portfolio.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete portfolio error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Failed to delete portfolio',
      message: error.message
    });
  }
}));

export default router;
