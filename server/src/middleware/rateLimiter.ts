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

// Development limits (very high numbers to effectively disable rate limiting)
const DEV_LIMITS = {
    general: 1000000,
    auth: 1000000,
    verification: 1000000
};

// Production limits (very high numbers for testing)
const PROD_LIMITS = {
    general: 1000000,
    auth: 1000000,
    verification: 1000000
};

// Get the appropriate limits based on environment
const limits = config.NODE_ENV === 'development' ? DEV_LIMITS : PROD_LIMITS;

// General rate limiter for all routes
export const generalLimiter = rateLimit(
    createLimiterOptions(
        60 * 60 * 1000, // 1 hour window
        limits.general,
        'Too many requests from this IP, please try again later.'
    )
);

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit(
    createLimiterOptions(
        60 * 60 * 1000, // 1 hour window
        limits.auth,
        'Too many authentication attempts from this IP, please try again later.'
    )
);

// Rate limiter for verification routes
export const verificationLimiter = rateLimit(
    createLimiterOptions(
        60 * 60 * 1000, // 1 hour window
        limits.verification,
        'Too many verification attempts from this IP, please try again later.'
    )
);
