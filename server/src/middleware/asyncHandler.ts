import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next))
      .catch((error) => {
        console.error('Error in async handler:', {
          error,
          stack: error.stack,
          path: req.path,
          method: req.method,
          body: req.body,
          params: req.params,
          query: req.query
        });
        next(error);
      });
  };
