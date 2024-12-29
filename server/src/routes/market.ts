import { Router, Request, Response } from 'express';
import { MarketDataService } from '../services/MarketData';
import { TechnicalAnalysis } from '../services/TechnicalAnalysis';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const marketData = new MarketDataService();
const technicalAnalysis = new TechnicalAnalysis();

// Get market data for a symbol
router.get('/:symbol', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const data = await marketData.getMarketData(symbol);
    return res.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

// Get technical analysis for a symbol
router.get('/:symbol/analysis', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h', indicators = [] } = req.query;
    
    const analysis = await technicalAnalysis.analyze(
      symbol,
      timeframe as string,
      Array.isArray(indicators) ? indicators.map(i => String(i)) : [String(indicators)]
    );
    
    return res.json(analysis);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}));

export default router;
