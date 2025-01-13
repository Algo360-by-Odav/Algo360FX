import { Request, Response } from 'express';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationOptions;
}

export const handlePaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationOptions
): void => {
  res.json({
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || data.length,
      hasMore: pagination.hasMore || false
    }
  });
};

export const handleError = (res: Response, error: unknown): void => {
  const errorResponse = {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    status: 500
  };

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      errorResponse.status = 404;
    } else if (error.message.includes('unauthorized') || error.message.includes('invalid token')) {
      errorResponse.status = 401;
    } else if (error.message.includes('forbidden')) {
      errorResponse.status = 403;
    } else if (error.message.includes('validation')) {
      errorResponse.status = 400;
    }
  }

  res.status(errorResponse.status).json({ message: errorResponse.message });
};
