import express from 'express';
import { searchAnalytics } from '../services/analyticsService';
import { searchDocumentation } from '../services/documentationService';
import { searchPortfolios } from '../services/portfolioService';
import { searchStrategies } from '../services/strategyService';
import { SearchResult } from '../types/search';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = req.query.q as string;
    const type = req.query.type as string;

    let results: SearchResult[] = [];

    // Validate query parameter
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

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
        const searchResults = await searchStrategies(query);
        results = Array.from(searchResults);
        break;
      case 'all':
        const [analytics, docs, portfolios, strategies] = await Promise.all([
          searchAnalytics(query),
          searchDocumentation(query),
          searchPortfolios(query),
          searchStrategies(query)
        ]);
        results = [...analytics, ...docs, ...portfolios, ...strategies];
        break;
      default:
        return res.status(400).json({ error: 'Invalid search type' });
    }

    // Sort results by score
    results.sort((a, b) => b.score - a.score);

    return res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
