"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStrategies = searchStrategies;
exports.createStrategy = createStrategy;
exports.updateStrategy = updateStrategy;
exports.deleteStrategy = deleteStrategy;
exports.getStrategyById = getStrategyById;
exports.runBacktest = runBacktest;
const mongoose_1 = require("mongoose");
const strategySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    parameters: { type: mongoose_1.Schema.Types.Mixed, required: true },
    backtest: {
        startDate: Date,
        endDate: Date,
        results: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
strategySchema.index({ name: 'text', description: 'text' });
const Strategy = (0, mongoose_1.model)('Strategy', strategySchema);
async function searchStrategies(query) {
    try {
        const strategies = await Strategy.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        return strategies.map(strategy => ({
            id: strategy._id.toString(),
            type: 'strategy',
            title: strategy.name,
            description: strategy.description,
            score: strategy.__textScore || 0
        }));
    }
    catch (error) {
        console.error('Search strategies error:', error);
        return [];
    }
}
async function createStrategy(data) {
    const strategy = new Strategy(data);
    return await strategy.save();
}
async function updateStrategy(id, data) {
    return await Strategy.findByIdAndUpdate(id, data, { new: true });
}
async function deleteStrategy(id) {
    const result = await Strategy.findByIdAndDelete(id);
    return result !== null;
}
async function getStrategyById(id) {
    return await Strategy.findById(id);
}
async function runBacktest(id, startDate, endDate) {
    const strategy = await Strategy.findById(id);
    if (!strategy)
        return null;
    const backtestResults = {
        returns: 0.15,
        sharpeRatio: 1.2,
        maxDrawdown: -0.1,
        trades: 100
    };
    strategy.backtest = {
        startDate,
        endDate,
        results: backtestResults
    };
    return await strategy.save();
}
//# sourceMappingURL=strategyService.js.map