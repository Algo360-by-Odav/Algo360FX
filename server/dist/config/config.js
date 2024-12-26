"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algo360fx',
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key',
    env: process.env.NODE_ENV || 'development',
    metaApiToken: process.env.META_API_TOKEN || '',
    mt5AccountId: process.env.MT5_ACCOUNT_ID || '',
    metaApiRetryAttempts: 3,
    metaApiRetryDelay: 1000,
};
//# sourceMappingURL=config.js.map