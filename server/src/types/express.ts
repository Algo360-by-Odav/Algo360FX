import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { UserWithStats } from './User';

export interface AuthRequest extends Request {
  user?: User | UserWithStats;
  session?: {
    id: string;
    token: string;
    refreshToken: string;
    expiresAt: Date;
  };
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  message: string;
  details?: any;
  stack?: string;
}

export type AsyncRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type AsyncHandler<T = any> = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<T>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterQuery {
  [key: string]: any;
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
  search?: string;
}
