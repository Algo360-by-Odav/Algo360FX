import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Create a limiter that applies to all routes (temporarily disabled for testing)
export const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100000, // Very high limit for testing
  message: 'Too many requests from this IP, please try again later.'
});

// Create a more strict limiter for auth routes (temporarily disabled for testing)
export const authLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100000, // Very high limit for testing
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Create a limiter for API routes (temporarily disabled for testing)
export const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100000, // Very high limit for testing
  message: 'Too many API requests from this IP, please try again later'
});
