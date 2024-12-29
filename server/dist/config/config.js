"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '5000'),
    databaseUrl: process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
    env: process.env.NODE_ENV || 'development',
    metaApiToken: process.env.META_API_TOKEN || '',
    mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
    metaApiRetryAttempts: 3,
    metaApiRetryDelay: 1000,
    redisUrl: process.env.REDIS_URL,
    openaiApiKey: process.env.OPENAI_API_KEY || ''
};
