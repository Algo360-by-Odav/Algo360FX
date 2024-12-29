"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocumentation = searchDocumentation;
const mongoose_1 = require("mongoose");
const documentationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Add other fields as needed
});
const Documentation = (0, mongoose_1.model)('Documentation', documentationSchema);
async function searchDocumentation(query) {
    try {
        const docs = await Documentation.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        return docs.map(doc => ({
            id: doc._id.toString(),
            type: 'documentation',
            title: doc.title,
            description: doc.description,
            score: doc.__textScore || 0
        }));
    }
    catch (error) {
        console.error('Search documentation error:', error);
        return [];
    }
}
