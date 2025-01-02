import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler, AuthRequest } from '../types/express';

type AsyncAuthHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncAuthHandler): AsyncRequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};
