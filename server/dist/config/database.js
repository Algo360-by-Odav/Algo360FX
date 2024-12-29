"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const connectToDatabase = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
            maxPoolSize: 50,
            retryWrites: true,
            retryReads: true,
        };
        await mongoose_1.default.connect(config_1.config.mongoUri || config_1.config.databaseUrl, options);
        console.log('Connected to MongoDB');
        // Create indexes for all models
        await Promise.all([
            mongoose_1.default.model('Strategy').createIndexes(),
            mongoose_1.default.model('Portfolio').createIndexes(),
            mongoose_1.default.model('Documentation').createIndexes(),
            mongoose_1.default.model('Analytics').createIndexes(),
        ]);
        console.log('Database indexes created successfully');
    }
    catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
};
exports.connectToDatabase = connectToDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error disconnecting from database:', error);
        process.exit(1);
    }
};
exports.disconnectDatabase = disconnectDatabase;
// Handle database connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
// Gracefully close the connection when the app is shutting down
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});
