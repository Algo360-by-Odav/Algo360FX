"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metaapi_1 = require("../services/metaapi");
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.get('/:symbol', async (req, res) => {
    const { symbol } = req.params;
    if (!symbol) {
        return res.status(400).json({
            error: 'Missing symbol',
            details: 'Symbol parameter is required'
        });
    }
    if (!config_1.config.metaApiToken || !config_1.config.mt5AccountId) {
        return res.status(500).json({
            error: 'MetaAPI configuration missing',
            details: 'MetaAPI token or account ID not configured'
        });
    }
    try {
        const connection = await (0, metaapi_1.getMetaApiConnection)();
        const account = await connection.metatraderAccountApi.getAccount(config_1.config.mt5AccountId);
        if (!account) {
            return res.status(404).json({
                error: 'Account not found',
                details: `Account ${config_1.config.mt5AccountId} not found`
            });
        }
        await account.deploy();
        await account.waitDeployed();
        const stream = account.getStreamingConnection();
        await stream.connect();
        await stream.waitSynchronized();
        const price = await stream.getSymbolPrice(symbol);
        if (!price) {
            return res.status(404).json({
                error: 'Market data not found',
                details: `No data available for symbol ${symbol}`
            });
        }
        return res.json({
            symbol,
            ask: price.ask,
            bid: price.bid,
            time: price.time,
            brokerTime: price.brokerTime,
            spread: price.ask - price.bid
        });
    }
    catch (error) {
        console.error('Error fetching market data:', {
            error: error.message,
            stack: error.stack,
            config: {
                metaApiToken: config_1.config.metaApiToken ? 'present' : 'missing',
                mt5AccountId: config_1.config.mt5AccountId
            }
        });
        return res.status(500).json({
            error: 'Failed to fetch market data',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
//# sourceMappingURL=market.js.map