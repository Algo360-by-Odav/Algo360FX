import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserPayload } from '../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
    
    // Ensure we have both id and _id for compatibility
    if (decoded._id && !decoded.id) {
      decoded.id = decoded._id;
    } else if (decoded.id && !decoded._id) {
      decoded._id = decoded.id;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;
