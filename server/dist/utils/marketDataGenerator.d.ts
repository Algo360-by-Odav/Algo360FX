interface MarketData {
    symbol: string;
    bid: number;
    ask: number;
    last: number;
    high: number;
    low: number;
    volume: number;
    timestamp: string;
}
interface OrderBookEntry {
    price: number;
    size: number;
    total: number;
    percentage: number;
}
interface OrderBook {
    symbol: string;
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    timestamp: string;
}
export declare function generateMarketData(symbol: string): MarketData;
export declare function generateOrderBook(symbol: string): OrderBook;
export {};
