"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiLimiter = exports.authLimiter = exports.standardLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config/config");
// Higher rate limit for development environment
const getMaxRequests = () => {
    return config_1.config.env === 'production' ? 100 : 1000;
};
// Create rate limiters with different configurations
exports.standardLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: getMaxRequests(), // Limit each IP
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter for authentication routes (more lenient)
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: config_1.config.env === 'production' ? 50 : 500, // Limit each IP
    message: 'Too many authentication attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter for AI routes (more strict due to resource intensity)
exports.aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: config_1.config.env === 'production' ? 30 : 300, // Limit each IP
    message: 'Too many AI requests, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
