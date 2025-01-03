import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { RequestHandler } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface AuthRequest extends Request {
  user: User;
}

export type AsyncRequestHandler = RequestHandler<any, any, any, any, Record<string, any>>;

export type AsyncHandler = (
  handler: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => RequestHandler;

export type RequestHandlerWithAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface ApiError extends Error {
  status?: number;
  code?: string;
}
