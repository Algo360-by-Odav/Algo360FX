import { auth } from './auth';
import { apiLimiter } from './rateLimiter';
import { validateRequest } from './validateRequest';
import { RequestHandler } from 'express';

export const commonMiddleware = [
  auth,
  apiLimiter
];

export const validateBody = (schema: any): RequestHandler[] => [
  ...commonMiddleware,
  validateRequest(schema)
];
