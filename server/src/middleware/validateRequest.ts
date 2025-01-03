import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../types/express';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const validationError: ApiError = new Error('Validation failed');
      validationError.status = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.message = error.errors
        .map((err: any) => err.message)
        .join(', ');
      return next(validationError);
    }
  };
};
