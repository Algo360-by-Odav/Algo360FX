import { z } from 'zod';
export declare const searchSchema: z.ZodObject<{
    query: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["analytics", "documentation", "portfolios", "strategies", "all"]>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    type?: "analytics" | "documentation" | "portfolios" | "strategies" | "all" | undefined;
}, {
    query: string;
    type?: "analytics" | "documentation" | "portfolios" | "strategies" | "all" | undefined;
}>;
