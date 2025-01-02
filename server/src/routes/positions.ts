import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { auth } from '../middleware/auth';
import { Position } from '../models/Position';
import { AuthRequest } from '../types/express';
import { validateRequest } from '../middleware/validateRequest';
import { createPositionSchema, updatePositionSchema } from '../schemas/position.schema';

const router = express.Router();

// Get all positions
const getPositions: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const positions = await Position.find({ user: req.user?._id });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching positions' });
  }
};

// Get position by ID
const getPositionById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = await Position.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching position' });
  }
};

// Create position
const createPosition: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = new Position({
      ...req.body,
      user: req.user?._id
    });

    await position.save();
    res.status(201).json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error creating position' });
  }
};

// Update position
const updatePosition: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = await Position.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      { new: true }
    );

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error updating position' });
  }
};

// Close position
const closePosition: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const position = await Position.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }

    position.status = 'closed';
    position.closedAt = new Date();
    position.closePrice = req.body.closePrice;
    await position.save();

    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Error closing position' });
  }
};

// Get position history
const getPositionHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder - replace with actual history from database
    res.json({
      history: [
        {
          id: '1',
          symbol: 'EUR/USD',
          type: 'BUY',
          volume: 0.1,
          openPrice: 1.2000,
          closePrice: 1.2050,
          takeProfit: 1.2100,
          stopLoss: 1.1950,
          profit: 50,
          swap: -2,
          commission: -1,
          openTime: new Date(Date.now() - 86400000),
          closeTime: new Date()
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching position history:', error);
    res.status(500).json({ error: 'Failed to fetch position history' });
  }
};

// Register routes
router.use(auth);

const getPositionsHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return getPositions(authReq, res, next);
};

const getPositionByIdHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return getPositionById(authReq, res, next);
};

const createPositionHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return createPosition(authReq, res, next);
};

const updatePositionHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return updatePosition(authReq, res, next);
};

const closePositionHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return closePosition(authReq, res, next);
};

const getPositionHistoryHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  return getPositionHistory(authReq, res, next);
};

router.get('/', getPositionsHandler);
router.get('/:id', getPositionByIdHandler);
router.post('/', validateRequest(createPositionSchema), createPositionHandler);
router.put('/:id', validateRequest(updatePositionSchema), updatePositionHandler);
router.post('/:id/close', closePositionHandler);
router.get('/history', getPositionHistoryHandler);

export { router as positionRouter };
