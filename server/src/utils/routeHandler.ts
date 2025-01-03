import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest, AsyncHandler, ApiError } from '../types/express';

export const createHandler = (handler: AsyncHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest;
      await handler(authReq, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    const apiError: ApiError = error;
    apiError.status = apiError.status || 500;
    throw apiError;
  }
  throw new Error('Unknown error occurred');
};
