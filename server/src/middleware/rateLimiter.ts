import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Skip rate limiting in development
const skipDevelopment = () => config.env === 'development';

// Standard rate limiter for most API endpoints
export const standardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased limit per window
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { error: 'Too many requests, please try again later.' }
});

// More permissive limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { error: 'Too many authentication attempts, please try again later.' }
});

// Stricter limiter for AI-related endpoints
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: skipDevelopment,
  message: { error: 'Too many AI requests, please try again later.' }
});
