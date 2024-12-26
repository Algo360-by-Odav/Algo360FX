import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });

    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async exists(key: string) {
    return this.client.exists(key);
  }

  async setHash(key: string, field: string, value: string) {
    return this.client.hSet(key, field, value);
  }

  async getHash(key: string, field: string) {
    return this.client.hGet(key, field);
  }

  async getAllHash(key: string) {
    return this.client.hGetAll(key);
  }

  async delHash(key: string, field: string) {
    return this.client.hDel(key, field);
  }

  async setWithExpiry(key: string, value: string, seconds: number) {
    return this.client.set(key, value, { EX: seconds });
  }

  async invalidatePattern(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      return this.client.del(keys);
    }
    return 0;
  }
}
