import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Create a limiter that applies to all routes
export const limiter = rateLimit({
  windowMs: config.rateLimits.windowMs,
  max: config.rateLimits.maxRequests,
  message: 'Too many requests from this IP, please try again later.'
});

// Create a more strict limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Create a limiter for API routes
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: 'Too many API requests from this IP, please try again later'
});
