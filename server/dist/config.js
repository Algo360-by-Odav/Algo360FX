"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    metaApiToken: process.env.META_API_TOKEN || '',
    mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
    metaApiRetryAttempts: parseInt(process.env.META_API_RETRY_ATTEMPTS || '3'),
    metaApiRetryDelay: parseInt(process.env.META_API_RETRY_DELAY || '5000'),
    port: parseInt(process.env.PORT || '3000'),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
