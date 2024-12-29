"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskAssessmentSchema = exports.generateSignalSchema = exports.analyzeSchema = void 0;
const zod_1 = require("zod");
exports.analyzeSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    timeframe: zod_1.z.string(),
    indicators: zod_1.z.array(zod_1.z.string())
});
exports.generateSignalSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    timeframe: zod_1.z.string(),
    strategy: zod_1.z.string()
});
exports.riskAssessmentSchema = zod_1.z.object({
    position: zod_1.z.object({
        symbol: zod_1.z.string(),
        type: zod_1.z.enum(['buy', 'sell']),
        size: zod_1.z.number(),
        entryPrice: zod_1.z.number(),
        stopLoss: zod_1.z.number().optional(),
        takeProfit: zod_1.z.number().optional()
    })
});
