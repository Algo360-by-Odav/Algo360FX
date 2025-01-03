import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Skip rate limiting in development
const skipDevelopment = (req: any) => {
  return true; // Temporarily disable rate limiting for all environments
};

// Standard rate limiter for most API endpoints
export const standardLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10000, // Significantly increased limit per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDevelopment,
  message: { error: 'Too many requests. Please wait a minute and try again.' },
  trustProxy: true // Trust X-Forwarded-For header
});

// More permissive limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Significantly increased limit per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDevelopment,
  message: { 
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
    retryAfter: '15 minutes'
  },
  trustProxy: true // Trust X-Forwarded-For header
});

// Stricter limiter for AI-related endpoints
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // Increased limit per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDevelopment,
  message: { error: 'Too many AI requests. Please wait 5 minutes and try again.' },
  trustProxy: true // Trust X-Forwarded-For header
});
