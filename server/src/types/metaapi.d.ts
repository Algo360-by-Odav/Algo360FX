declare module 'metaapi.cloud-sdk' {
    interface MetaApiOptions {
        domain?: string;
        requestTimeout?: number;
        token: string;
    }

    export interface MetaApi {
        new(options: MetaApiOptions | string): MetaApi;
        metatraderAccountApi: MetatraderAccountApi;
    }

    export interface MetatraderAccountApi {
        createAccount(account: any): Promise<MetatraderAccount>;
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
        createMarketBuyOrder(symbol: string, volume: number, options?: any): Promise<any>;
        subscribeToMarketData(symbol: string): Promise<void>;
        on(event: string, callback: (data: any) => void): void;
        off(event: string, callback: (data: any) => void): void;
    }

    const MetaApi: MetaApi;
    export default MetaApi;
}
