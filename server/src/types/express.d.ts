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

export type AsyncRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void | Response<ResBody, Locals>>;

export type RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => void | Promise<void> | Response<ResBody, Locals> | Promise<Response<ResBody, Locals>>;
