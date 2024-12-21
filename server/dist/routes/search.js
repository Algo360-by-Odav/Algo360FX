"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticsService_1 = require("../services/analyticsService");
const documentationService_1 = require("../services/documentationService");
const portfolioService_1 = require("../services/portfolioService");
const strategyService_1 = require("../services/strategyService");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        const type = req.query.type;
        let results = [];
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
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
        results.sort((a, b) => b.score - a.score);
        return res.json(results);
    }
    catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map