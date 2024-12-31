import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Base rate limiter settings
const baseRateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: false,
  skip: (req: any) => config.nodeEnv === 'development',
};

// Auth endpoints rate limiter (more strict)
export const authLimiter = rateLimit({
  ...baseRateLimiter,
  max: 5, // 5 requests per 15 minutes
  windowMs: 15 * 60 * 1000,
  message: 'Too many authentication attempts, please try again later.',
});

// API endpoints rate limiter (moderate)
export const apiLimiter = rateLimit({
  ...baseRateLimiter,
  max: 100, // 100 requests per 15 minutes
});

// Search endpoints rate limiter (less strict)
export const searchLimiter = rateLimit({
  ...baseRateLimiter,
  max: 30, // 30 requests per 15 minutes
  windowMs: 15 * 60 * 1000,
});

// AI endpoints rate limiter (very strict due to resource intensity)
export const aiLimiter = rateLimit({
  ...baseRateLimiter,
  max: 10, // 10 requests per 15 minutes
  windowMs: 15 * 60 * 1000,
  message: 'Too many AI requests, please try again later.',
});
