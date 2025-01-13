export interface Config {
    port: number | string;
    database: {
        url: string;
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
