"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../middleware/validateRequest");
const search_schema_1 = require("../schemas/search.schema");
const analyticsService_1 = require("../services/analyticsService");
const documentationService_1 = require("../services/documentationService");
const portfolioService_1 = require("../services/portfolioService");
const strategyService_1 = require("../services/strategyService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// Search across all resources
router.post('/', (0, validateRequest_1.validateRequest)(search_schema_1.searchSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const { query, type } = req.body;
        let results = [];
        // Search based on type
        switch (type) {
            case 'analytics':
                results = await (0, analyticsService_1.searchAnalytics)(query);
                break;
            case 'documentation':
                results = await (0, documentationService_1.searchDocumentation)(query);
                break;
            case 'portfolios':
                results = await (0, portfolioService_1.searchPortfolios)(query);
                break;
            case 'strategies':
                results = await (0, strategyService_1.searchStrategies)(query);
                break;
            case 'all':
                // Search across all types
                const [analytics, docs, portfolios, strategies] = await Promise.all([
                    (0, analyticsService_1.searchAnalytics)(query),
                    (0, documentationService_1.searchDocumentation)(query),
                    (0, portfolioService_1.searchPortfolios)(query),
                    (0, strategyService_1.searchStrategies)(query)
                ]);
                results = [...analytics, ...docs, ...portfolios, ...strategies];
                break;
            default:
                return res.status(400).json({ error: 'Invalid search type' });
        }
        return res.json({ results });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return res.status(500).json({ error: errorMessage });
    }
}));
exports.default = router;
