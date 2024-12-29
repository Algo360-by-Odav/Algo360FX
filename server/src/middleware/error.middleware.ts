import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public source?: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`[${err.source}] ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      source: err.source,
      isOperational: err.isOperational
    });
  }

  // Handle unexpected errors
  logger.error('Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    isOperational: false
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
