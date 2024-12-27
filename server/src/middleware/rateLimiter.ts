import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Create rate limiter options
const createLimiterOptions = (windowMs: number, max: number, message: string) => ({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
});

// Development limits
const DEV_LIMITS = {
    general: 200,
    auth: 20,
    verification: 10
};

// Production limits
const PROD_LIMITS = {
    general: 100,
    auth: 5,
    verification: 3
};

// Get the appropriate limits based on environment
const limits = config.NODE_ENV === 'development' ? DEV_LIMITS : PROD_LIMITS;

// General rate limiter for all routes
export const generalLimiter = rateLimit(
    createLimiterOptions(
        15 * 60 * 1000, // 15 minutes
        limits.general,
        'Too many requests from this IP, please try again later.'
    )
);

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit(
    createLimiterOptions(
        15 * 60 * 1000, // 15 minutes
        limits.auth,
        'Too many authentication attempts from this IP, please try again after 15 minutes.'
    )
);

// Rate limiter for verification code requests
export const verificationLimiter = rateLimit(
    createLimiterOptions(
        60 * 60 * 1000, // 1 hour
        limits.verification,
        'Too many verification code requests from this IP, please try again after an hour.'
    )
);
