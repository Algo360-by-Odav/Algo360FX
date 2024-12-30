import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Validating request body:', req.body);
    await schema.parseAsync(req.body);
    console.log('Request validation successful');
    return next();
  } catch (error) {
    console.error('Request validation failed:', error);
    return res.status(400).json({ 
      error: 'Validation failed',
      details: error.errors || error.message || error
    });
  }
};
