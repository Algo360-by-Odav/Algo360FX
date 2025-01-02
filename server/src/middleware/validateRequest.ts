import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ApiError } from '../types/express';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationError: ApiError = new Error('Validation failed');
      validationError.status = 400;
      validationError.code = 'VALIDATION_ERROR';
      validationError.message = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(validationError);
    }

    next();
  };
};
