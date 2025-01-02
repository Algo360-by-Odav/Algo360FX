import express from 'express';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const router = express.Router();

// Validation schemas
const portfolioSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean(),
  config: z.record(z.unknown())
});

// Get all portfolios for the authenticated user
const getPortfolios = async (req: AuthRequest, res: any) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        AND: [
          { user: { is: { id: req.user.id } } }
        ]
      },
      include: {
        positions: true
      }
    });
    res.json(portfolios);
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ error: 'Failed to retrieve portfolios' });
  }
};

// Get a specific portfolio
const getPortfolio = async (req: AuthRequest, res: any) => {
  const { id } = req.params;

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        AND: [
          { id },
          { user: { is: { id: req.user.id } } }
        ]
      },
      include: {
        positions: true
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to retrieve portfolio' });
  }
};

// Create a new portfolio
const createPortfolio = async (req: AuthRequest, res: any) => {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
};

// Update a portfolio
const updatePortfolio = async (req: AuthRequest, res: any) => {
  const { id } = req.params;

  try {
    const validatedData = portfolioSchema.parse(req.body);

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        AND: [
          { id },
          { user: { is: { id: req.user.id } } }
        ]
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
};

// Delete a portfolio
const deletePortfolio = async (req: AuthRequest, res: any) => {
  const { id } = req.params;

  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        AND: [
          { id },
          { user: { is: { id: req.user.id } } }
        ]
      }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    await prisma.portfolio.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
};

// Routes
router.get('/', auth, getPortfolios);
router.get('/:id', auth, getPortfolio);
router.post('/', auth, createPortfolio);
router.put('/:id', auth, updatePortfolio);
router.delete('/:id', auth, deletePortfolio);

export { router as portfolioRouter };
