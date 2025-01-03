import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

// Function to sanitize specific request parameters
const sanitizeParam = (req: Request, key: string): void => {
  if (req.body && req.body[key]) {
    req.body[key] = req.body[key].replace(/[<>]/g, '');
  }
};

// Custom sanitizer middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Recursively sanitize object values
    const sanitizeObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
      }
      if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
      }
      if (typeof obj === 'string') {
        // Remove any potential NoSQL injection characters
        return obj.replace(/[\${}()]/g, '');
      }
      return obj;
    };

    req.body = sanitizeObject(req.body);
  }
  next();
};

// Middleware to sanitize request data
export const sanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    }
  }
  next();
};
