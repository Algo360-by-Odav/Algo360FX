import { Router } from 'express';
import { PortfolioModel } from '../models-new/Portfolio';
import { authenticateToken, validateRequest } from '../middleware';

const router = Router();

// Get all portfolios for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const portfolios = await PortfolioModel.findByUser(req.user!.id);
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// Get a specific portfolio
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findUnique({ id: req.params.id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Create a new portfolio
router.post('/', authenticateToken, validateRequest, async (req, res) => {
  try {
    const portfolioData = {
      ...req.body,
      userId: req.user!.id,
    };
    const portfolio = await PortfolioModel.create(portfolioData);
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

// Update a portfolio
router.put('/:id', authenticateToken, validateRequest, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findUnique({ id: req.params.id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio' });
    }
    const updatedPortfolio = await PortfolioModel.update(req.params.id, req.body);
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Delete a portfolio
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findUnique({ id: req.params.id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio' });
    }
    await PortfolioModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// Get portfolio performance
router.get('/:id/performance', authenticateToken, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findUnique({ id: req.params.id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio' });
    }
    const performance = await PortfolioModel.getPerformance(req.params.id);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio performance' });
  }
});

// Get portfolio risk metrics
router.get('/:id/risk', authenticateToken, async (req, res) => {
  try {
    const portfolio = await PortfolioModel.findUnique({ id: req.params.id });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    if (portfolio.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized access to portfolio' });
    }
    const riskMetrics = await PortfolioModel.getRiskMetrics(req.params.id);
    res.json(riskMetrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio risk metrics' });
  }
});

export default router;
