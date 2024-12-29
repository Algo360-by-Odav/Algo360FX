"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAnalytics = searchAnalytics;
const mongoose_1 = require("mongoose");
const analyticsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    // Add other fields as needed
});
const Analytics = (0, mongoose_1.model)('Analytics', analyticsSchema);
async function searchAnalytics(query) {
    try {
        const analytics = await Analytics.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        return analytics.map(analytic => ({
            id: analytic._id.toString(),
            type: 'analytics',
            title: analytic.name,
            description: analytic.description,
            score: analytic.__textScore || 0
        }));
    }
    catch (error) {
        console.error('Search analytics error:', error);
        return [];
    }
}
