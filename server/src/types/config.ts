export interface Config {
    port: number | string;
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    openai: {
        apiKey: string;
    };
    cors: {
        origin: string;
    };
}
