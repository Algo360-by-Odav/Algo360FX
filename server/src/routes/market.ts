import { Router } from 'express';
import { MarketDataModel } from '../models-new/MarketData';
import { authenticateToken, validateRequest } from '../middleware';

const router = Router();

// Get market data for a symbol
router.get('/:symbol', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', limit = 100 } = req.query;
    
    const marketData = await MarketDataModel.findBySymbol(
      symbol,
      timeframe as string,
      Number(limit)
    );
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get latest market data for a symbol
router.get('/:symbol/latest', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;
    
    const marketData = await MarketDataModel.findLatest(symbol, timeframe as string);
    if (!marketData) {
      return res.status(404).json({ error: 'Market data not found' });
    }
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest market data' });
  }
});

// Get market data for multiple symbols
router.post('/batch', authenticateToken, validateRequest, async (req, res) => {
  try {
    const { symbols, timeframe = '1h', limit = 100 } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols must be an array' });
    }
    
    const marketData = await MarketDataModel.findBySymbols(
      symbols,
      timeframe,
      Number(limit)
    );
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get available symbols
router.get('/symbols', authenticateToken, async (req, res) => {
  try {
    const symbols = await MarketDataModel.getAvailableSymbols();
    res.json(symbols);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available symbols' });
  }
});

// Get available timeframes
router.get('/timeframes', authenticateToken, async (req, res) => {
  try {
    const timeframes = await MarketDataModel.getAvailableTimeframes();
    res.json(timeframes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available timeframes' });
  }
});

// Get market data with technical indicators
router.get('/:symbol/indicators', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', limit = 100, indicators } = req.query;
    
    if (!indicators) {
      return res.status(400).json({ error: 'Indicators parameter is required' });
    }
    
    const indicatorsList = (indicators as string).split(',');
    
    const marketData = await MarketDataModel.findWithIndicators(
      symbol,
      timeframe as string,
      Number(limit),
      indicatorsList
    );
    
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data with indicators' });
  }
});

// Get market sentiment
router.get('/:symbol/sentiment', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const sentiment = await MarketDataModel.getSentiment(symbol);
    res.json(sentiment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market sentiment' });
  }
});

// Get market correlations
router.get('/:symbol/correlations', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', limit = 100 } = req.query;
    
    const correlations = await MarketDataModel.getCorrelations(
      symbol,
      timeframe as string,
      Number(limit)
    );
    
    res.json(correlations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market correlations' });
  }
});

export default router;
