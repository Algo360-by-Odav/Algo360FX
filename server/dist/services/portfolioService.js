"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPortfolios = searchPortfolios;
exports.createPortfolio = createPortfolio;
exports.updatePortfolio = updatePortfolio;
exports.deletePortfolio = deletePortfolio;
const mongoose_1 = require("mongoose");
const portfolioSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
portfolioSchema.index({ name: 'text', description: 'text' });
const Portfolio = (0, mongoose_1.model)('Portfolio', portfolioSchema);
async function searchPortfolios(query) {
    try {
        const portfolios = await Portfolio.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        return portfolios.map(portfolio => ({
            id: portfolio._id.toString(),
            type: 'portfolio',
            title: portfolio.name,
            description: portfolio.description,
            score: portfolio.__textScore || 0
        }));
    }
    catch (error) {
        console.error('Search portfolios error:', error);
        return [];
    }
}
async function createPortfolio(data) {
    const portfolio = new Portfolio(data);
    return await portfolio.save();
}
async function updatePortfolio(id, data) {
    return await Portfolio.findByIdAndUpdate(id, data, { new: true });
}
async function deletePortfolio(id) {
    const result = await Portfolio.findByIdAndDelete(id);
    return result !== null;
}
