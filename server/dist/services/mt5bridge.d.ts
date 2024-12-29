import MetaApi from 'metaapi.cloud-sdk';
export declare class MT5Bridge {
    private wss;
    private metaApi;
    private connections;
    constructor(metaApi: MetaApi);
    start(): Promise<void>;
    private handleMessage;
    private startUpdates;
    stop(): void;
}
export default MT5Bridge;
