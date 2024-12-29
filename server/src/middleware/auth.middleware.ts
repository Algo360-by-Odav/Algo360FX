import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Authentication token missing', 'Authentication');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new AppError(401, 'Invalid authentication token', 'Authentication'));
  }
};

export const authenticateWS = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      resolve(decoded);
    } catch (error) {
      reject(new AppError(401, 'Invalid WebSocket authentication token', 'Authentication'));
    }
  });
};
