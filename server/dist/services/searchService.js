"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
const analyticsService_1 = require("./analyticsService");
const documentationService_1 = require("./documentationService");
const portfolioService_1 = require("./portfolioService");
const strategyService_1 = require("./strategyService");
async function search(query) {
    try {
        const [analytics, docs, portfolios, strategies] = await Promise.all([
            (0, analyticsService_1.searchAnalytics)(query),
            (0, documentationService_1.searchDocumentation)(query),
            (0, portfolioService_1.searchPortfolios)(query),
            (0, strategyService_1.searchStrategies)(query)
        ]);
        const results = [...analytics, ...docs, ...portfolios, ...strategies];
        return results.sort((a, b) => b.score - a.score);
    }
    catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
//# sourceMappingURL=searchService.js.map