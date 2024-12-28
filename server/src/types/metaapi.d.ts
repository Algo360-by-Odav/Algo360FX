declare module 'metaapi.cloud-sdk' {
    interface MetaApiOptions {
        domain?: string;
        requestTimeout?: number;
        token: string;
    }

    export class MetaApi {
        constructor(options: MetaApiOptions | string);
        metatraderAccountApi: MetatraderAccountApi;
    }

    export interface MetatraderAccountApi {
        createAccount(account: MetatraderAccountCredentials): Promise<MetatraderAccount>;
        getAccount(accountId: string): Promise<MetatraderAccount>;
        getAccounts(): Promise<MetatraderAccount[]>;
    }
    
    export interface MetatraderAccount {
        id: string;
        login: string;
        name: string;
        server: string;
        type: string;
        state: string;
        connectionStatus: string;
        connect(): Promise<void>;
        disconnect(): Promise<void>;
        waitConnected(): Promise<void>;
        createMarketBuyOrder(symbol: string, volume: number, options?: OrderOptions): Promise<TradeResponse>;
        subscribeToMarketData(symbol: string): Promise<void>;
        on(event: string, callback: (data: MarketDataEvent) => void): void;
        off(event: string, callback: (data: MarketDataEvent) => void): void;
    }

    export interface MetatraderAccountCredentials {
        login: string;
        password: string;
        server: string;
        platform: string;
    }

    export interface OrderOptions {
        stopLoss?: number;
        takeProfit?: number;
        comment?: string;
    }

    export interface TradeResponse {
        orderId: string;
        success: boolean;
        message?: string;
    }

    export interface MarketDataEvent {
        symbol: string;
        price: number;
        time: Date;
    }

    const MetaApi: typeof MetaApi;
    export default MetaApi;
}
