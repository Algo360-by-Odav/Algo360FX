"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = void 0;
const zod_1 = require("zod");
exports.searchSchema = zod_1.z.object({
    query: zod_1.z.string(),
    type: zod_1.z.enum(['analytics', 'documentation', 'portfolios', 'strategies', 'all']).optional()
});
