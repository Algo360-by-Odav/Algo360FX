import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// Function to sanitize specific request parameters
const sanitizeParam = (req: Request, key: string): void => {
  if (req.body && req.body[key]) {
    req.body[key] = req.body[key].replace(/[<>]/g, '');
  }
};

// Middleware to sanitize request data
export const sanitizer = [
  // Prevent NoSQL injection
  mongoSanitize(),

  // Prevent HTTP Parameter Pollution
  hpp(),

  // Custom sanitization middleware
  (req: Request, res: Response, next: NextFunction) => {
    // Sanitize common fields
    ['email', 'username', 'password', 'name'].forEach(key => sanitizeParam(req, key));

    // Continue to next middleware
    next();
  }
];
