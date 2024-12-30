import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Skip rate limiting in development
const skipDevelopment = () => config.env === 'development';

// Standard rate limiter for most API endpoints
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit per window
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { error: 'Too many requests. Please wait a few minutes and try again.' }
});

// More permissive limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 300, // Limit each IP to 300 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { 
    error: 'Too many authentication attempts. Please wait an hour or try again later.',
    retryAfter: '60 minutes'
  }
});

// Stricter limiter for AI-related endpoints
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Limit each IP to 30 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { error: 'Too many AI requests. Please wait 5 minutes and try again.' }
});
