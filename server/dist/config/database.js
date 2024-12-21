"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const config_1 = require("./config");
let mongoServer;
const connectDatabase = async () => {
    try {
        if (config_1.config.env === 'development') {
            mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose_1.default.connect(mongoUri);
        }
        else {
            await mongoose_1.default.connect(config_1.config.mongoUri);
        }
        console.log('Connected to MongoDB Memory Server');
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
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        if (mongoServer) {
            await mongoServer.stop();
        }
    }
    catch (error) {
        console.error('Error disconnecting from database:', error);
        process.exit(1);
    }
};
exports.disconnectDatabase = disconnectDatabase;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
});
process.on('SIGINT', async () => {
    try {
        await mongoose_1.default.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});
//# sourceMappingURL=database.js.map