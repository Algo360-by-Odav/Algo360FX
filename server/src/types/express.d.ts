import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface TypedResponse<T = any> extends Response {
  json: (body: T) => Response;
}

export interface AuthRequest extends Request {
  user: User;
  body: any;
  params: any;
  query: any;
}

export type AsyncHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type RequestHandlerWithAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export interface ApiError extends Error {
  status?: number;
  code?: string;
}
