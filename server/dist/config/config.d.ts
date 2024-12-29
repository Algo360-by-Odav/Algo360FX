interface Config {
    port: number;
    databaseUrl: string;
    mongoUri?: string;
    jwtSecret: string;
    env: string;
    metaApiToken: string;
    mt5AccountId: string;
    metaApiRetryAttempts: number;
    metaApiRetryDelay: number;
    redisUrl?: string;
    openaiApiKey: string;
}
export declare const config: Config;
export {};
