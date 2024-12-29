"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const trading_1 = __importDefault(require("./websocket/trading"));
const optimization_1 = __importDefault(require("./websocket/optimization"));
const search_1 = __importDefault(require("./routes/search"));
const auth_1 = __importDefault(require("./routes/auth"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const market_1 = __importDefault(require("./routes/market"));
const user_1 = __importDefault(require("./routes/user"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
console.log('Express app created');
const httpServer = (0, http_1.createServer)(app);
console.log('HTTP server created');
// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://algo360fx-client.onrender.com',
    'https://algo360fx-frontend.onrender.com',
    'https://algo360fx.onrender.com'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Initialize Socket.IO server
console.log('Initializing Socket.IO server...');
const io = new socket_io_1.Server(httpServer, {
    path: '/ws',
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket', 'polling']
});
console.log('Socket.IO server initialized');
// Initialize and start WebSocket servers
console.log('Initializing Trading WebSocket server...');
const tradingWS = new trading_1.default(io);
tradingWS.initialize();
console.log('Trading WebSocket server initialized');
console.log('Initializing Optimization WebSocket server...');
const optimizationWS = new optimization_1.default(io);
optimizationWS.initialize();
console.log('Optimization WebSocket server initialized');
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/market', market_1.default);
app.use('/api/search', search_1.default);
app.use('/api/user', user_1.default);
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Error handling middleware
app.use((err, _req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
    next(err);
});
// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose_1.default.connect(config_1.config.databaseUrl, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
    maxPoolSize: 50,
    retryWrites: true,
    retryReads: true,
})
    .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    const PORT = config_1.config.port;
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('WebSocket server endpoints:');
        console.log('- Trading: /ws');
        console.log('- Optimization: /ws');
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
