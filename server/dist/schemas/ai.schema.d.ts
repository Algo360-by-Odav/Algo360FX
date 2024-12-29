import { z } from 'zod';
export declare const analyzeSchema: z.ZodObject<{
    symbol: z.ZodString;
    timeframe: z.ZodString;
    indicators: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    timeframe: string;
    indicators: string[];
}, {
    symbol: string;
    timeframe: string;
    indicators: string[];
}>;
export declare const generateSignalSchema: z.ZodObject<{
    symbol: z.ZodString;
    timeframe: z.ZodString;
    strategy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    strategy: string;
    timeframe: string;
}, {
    symbol: string;
    strategy: string;
    timeframe: string;
}>;
export declare const riskAssessmentSchema: z.ZodObject<{
    position: z.ZodObject<{
        symbol: z.ZodString;
        type: z.ZodEnum<["buy", "sell"]>;
        size: z.ZodNumber;
        entryPrice: z.ZodNumber;
        stopLoss: z.ZodOptional<z.ZodNumber>;
        takeProfit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        type: "buy" | "sell";
        size: number;
        entryPrice: number;
        stopLoss?: number | undefined;
        takeProfit?: number | undefined;
    }, {
        symbol: string;
        type: "buy" | "sell";
        size: number;
        entryPrice: number;
        stopLoss?: number | undefined;
        takeProfit?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    position: {
        symbol: string;
        type: "buy" | "sell";
        size: number;
        entryPrice: number;
        stopLoss?: number | undefined;
        takeProfit?: number | undefined;
    };
}, {
    position: {
        symbol: string;
        type: "buy" | "sell";
        size: number;
        entryPrice: number;
        stopLoss?: number | undefined;
        takeProfit?: number | undefined;
    };
}>;
