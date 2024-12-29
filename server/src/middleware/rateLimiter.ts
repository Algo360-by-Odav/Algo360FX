import rateLimit from 'express-rate-limit';
import { config } from '../config/config';

// Create rate limiter options
const createLimiterOptions = (windowMs: number, max: number, message: string) => ({
    windowMs,
    max,
    message: JSON.stringify({ error: message }),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, res: any) => {
        res.status(429).json({
            error: message,
            retryAfter: Math.ceil(windowMs / 1000),
        });
    },
});

// Development limits
const DEV_LIMITS = {
    general: 1000,
    auth: 100,
    verification: 50
};

// Production limits
const PROD_LIMITS = {
    general: 300,
    auth: 20,
    verification: 10
};

// Get the appropriate limits based on environment
const limits = config.NODE_ENV === 'development' ? DEV_LIMITS : PROD_LIMITS;

// General rate limiter for all routes
export const generalLimiter = rateLimit(
    createLimiterOptions(
        5 * 60 * 1000, // 5 minutes
        limits.general,
        'Too many requests from this IP, please try again in 5 minutes.'
    )
);

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit(
    createLimiterOptions(
        5 * 60 * 1000, // 5 minutes
        limits.auth,
        'Too many authentication attempts from this IP, please try again in 5 minutes.'
    )
);

// Rate limiter for verification code requests
export const verificationLimiter = rateLimit(
    createLimiterOptions(
        15 * 60 * 1000, // 15 minutes
        limits.verification,
        'Too many verification code requests from this IP, please try again in 15 minutes.'
    )
);
