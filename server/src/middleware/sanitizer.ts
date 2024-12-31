import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// Sanitize data to prevent NoSQL injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: (req: Request, key: string) => {
    console.warn(`Warning: NoSQL injection attempt detected! Key: ${key}`);
  }
});

// Prevent HTTP Parameter Pollution
export const preventParamPollution = hpp({
  whitelist: [
    // Add parameters that are allowed to be repeated
    'orderBy',
    'sort',
    'fields',
    'filter'
  ]
});

// Custom sanitizer for request body
export const sanitizeRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Remove any keys containing prohibited characters
    const sanitized = JSON.parse(JSON.stringify(req.body).replace(/[${}]/g, ''));
    req.body = sanitized;
  }
  next();
};

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Replace potentially dangerous characters
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
    }
  }
  next();
};
