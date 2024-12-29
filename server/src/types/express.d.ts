import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): Promise<any> | any;
  }
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response> | void | Response;

export interface AuthenticatedRequest extends Express.Request {
  user: User;
}

export interface TypedRequest<T = any> extends Express.Request {
  body: T;
}

export interface TypedResponse<T = any> extends Express.Response {
  json: (body: T) => Express.Response;
}

export interface AuthRequest extends Express.Request {
  user: User;
  body: any;
  params: any;
  query: any;
}
