"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarketData = generateMarketData;
exports.generateOrderBook = generateOrderBook;
const baselinePrices = {
    'EURUSD': 1.0950,
    'GBPUSD': 1.2650,
    'USDJPY': 148.50,
    'AUDUSD': 0.6550,
    'USDCAD': 1.3550,
};
function generateMarketData(symbol) {
    const basePrice = baselinePrices[symbol] || 1.0000;
    const volatility = basePrice * 0.0002;
    const bid = basePrice + (Math.random() - 0.5) * volatility;
    const spread = basePrice * 0.0001;
    const ask = bid + spread;
    return {
        symbol,
        bid: Number(bid.toFixed(5)),
        ask: Number(ask.toFixed(5)),
        last: Number(((bid + ask) / 2).toFixed(5)),
        high: Number((ask + volatility / 2).toFixed(5)),
        low: Number((bid - volatility / 2).toFixed(5)),
        volume: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
    };
}
function generateOrderBook(symbol) {
    const marketData = generateMarketData(symbol);
    const levels = 15;
    const bids = [];
    const asks = [];
    let totalBidSize = 0;
    let totalAskSize = 0;
    for (let i = 0; i < levels; i++) {
        const price = marketData.bid - (i * 0.0001);
        const size = Math.floor(Math.random() * 1000000);
        totalBidSize += size;
        bids.push({
            price: Number(price.toFixed(5)),
            size,
            total: totalBidSize,
            percentage: 0,
        });
    }
    for (let i = 0; i < levels; i++) {
        const price = marketData.ask + (i * 0.0001);
        const size = Math.floor(Math.random() * 1000000);
        totalAskSize += size;
        asks.push({
            price: Number(price.toFixed(5)),
            size,
            total: totalAskSize,
            percentage: 0,
        });
    }
    bids.forEach(bid => {
        bid.percentage = (bid.total / totalBidSize) * 100;
    });
    asks.forEach(ask => {
        ask.percentage = (ask.total / totalAskSize) * 100;
    });
    return {
        symbol,
        bids,
        asks,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=marketDataGenerator.js.map