import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Higher rate limit for development environment
const getMaxRequests = () => {
  return config.env === 'production' ? 100 : 1000;
};

// Common rate limiter options
const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  skip: (req: any) => config.env === 'development',
};

// Create rate limiters with different configurations
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getMaxRequests(), // Limit each IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  ...commonOptions,
});

// Rate limiter for authentication routes (more lenient)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.env === 'production' ? 50 : 500, // Limit each IP
  message: 'Too many authentication attempts, please try again after an hour',
  ...commonOptions,
});

// Rate limiter for AI routes (more strict due to resource intensity)
export const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: config.env === 'production' ? 30 : 300, // Limit each IP
  message: 'Too many AI requests, please try again after 5 minutes',
  ...commonOptions,
});
