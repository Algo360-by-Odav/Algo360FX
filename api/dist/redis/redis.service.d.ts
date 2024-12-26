import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    setHash(key: string, field: string, value: string): Promise<number>;
    getHash(key: string, field: string): Promise<string>;
    getAllHash(key: string): Promise<{
        [x: string]: string;
    }>;
    delHash(key: string, field: string): Promise<number>;
    setWithExpiry(key: string, value: string, seconds: number): Promise<string>;
    invalidatePattern(pattern: string): Promise<number>;
}
