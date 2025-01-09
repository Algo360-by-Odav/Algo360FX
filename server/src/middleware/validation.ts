import { Request, Response, NextFunction } from 'express';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  // Add any additional validation logic here
  // For example, checking required fields, data types, etc.

  next();
};
