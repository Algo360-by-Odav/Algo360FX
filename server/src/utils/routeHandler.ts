import { Response, NextFunction } from 'express';
import { AuthRequest, AsyncHandler } from '../types/express';

interface PaginationResponse {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

interface BaseApiResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface DataApiResponse<T> extends BaseApiResponse {
  data: T;
  meta?: PaginationResponse;
}

type ApiResponse<T> = DataApiResponse<T>;

export const routeHandler = <T>(handler: AsyncHandler<T>) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);
      
      // If the response has already been sent, return
      if (res.headersSent) {
        return;
      }

      // Format the response
      const response: ApiResponse<T> = {
        success: true,
        data: result
      };

      // Add pagination metadata if available
      if (result && typeof result === 'object' && 'meta' in result) {
        response.meta = result.meta as PaginationResponse;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
};

export const paginatedRouteHandler = <T>(handler: AsyncHandler<{ data: T[]; total: number }>) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || 'createdAt';
      const order = (req.query.order as 'asc' | 'desc') || 'desc';

      const result = await handler(req, res, next);
      
      // If the response has already been sent, return
      if (res.headersSent) {
        return;
      }

      // Format the response with pagination metadata
      const response: ApiResponse<T[]> = {
        success: true,
        data: result.data,
        meta: {
          page,
          limit,
          total: result.total,
          hasMore: page * limit < result.total
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = (error: any, _req: AuthRequest, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  };

  res.status(status).json(response);
};
