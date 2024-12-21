"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const trading_1 = __importDefault(require("./websocket/trading"));
const optimization_1 = __importDefault(require("./websocket/optimization"));
const search_1 = __importDefault(require("./routes/search"));
const auth_1 = __importDefault(require("./routes/auth"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const market_1 = __importDefault(require("./routes/market"));
const mt5bridge_1 = __importDefault(require("./services/mt5bridge"));
const config_1 = require("./config/config");
const metaapi_cloud_sdk_1 = __importDefault(require("metaapi.cloud-sdk"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const wsServer = new trading_1.default(httpServer);
const optimizationWsServer = new optimization_1.default(httpServer, '/optimization');
mongoose_1.default.connect(config_1.config.mongoUri, {
    retryWrites: true,
    w: 'majority',
    directConnection: false,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((0, body_parser_1.json)());
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/search', search_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/market', market_1.default);
app.post('/api/auth/register', async (_req, res) => {
    const { email, firstName, lastName, verificationCode } = _req.body;
    if (verificationCode !== '123456') {
        return res.status(400).json({ error: 'Invalid verification code' });
    }
    return res.json({
        token: 'dev-token',
        user: {
            id: '1',
            email,
            firstName,
            lastName,
            role: 'USER',
            preferences: {
                theme: 'dark',
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                },
                tradingPreferences: {
                    defaultLeverage: 1,
                    riskLevel: 'medium',
                    autoTrade: false
                },
                displayPreferences: {
                    chartType: 'candlestick',
                    timeframe: '1h',
                    indicators: ['MA', 'RSI']
                }
            }
        }
    });
});
app.post('/api/auth/send-verification', (_req, res) => {
    return res.json({ success: true });
});
app.get('/', (_req, res) => {
    res.send('Algo360FX API Server');
});
(async () => {
    try {
        const api = new metaapi_cloud_sdk_1.default(config_1.config.metaApiToken);
        const accounts = await api.metatraderAccountApi.getAccounts();
        console.log('Available MT5 accounts:', accounts.map(acc => ({
            id: acc.id,
            name: acc.name,
            type: acc.type,
            state: acc.state
        })));
        const mt5Bridge = new mt5bridge_1.default(api);
        await mt5Bridge.start();
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Closing server...');
            mt5Bridge.stop();
            wsServer.close();
            optimizationWsServer.close();
            httpServer.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('Failed to initialize MT5 connection:', error);
    }
})();
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('WebSocket server endpoints:');
    console.log('- Trading: ws://localhost:5000/');
    console.log('- Optimization: ws://localhost:5000/optimization');
});
//# sourceMappingURL=index.js.map