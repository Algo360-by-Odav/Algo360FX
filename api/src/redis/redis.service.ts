import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;
  private readonly logger = new Logger(RedisService.name);
  private isRedisAvailable = false;
  private mockStore = new Map<string, { value: any; expires?: number }>();

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL');
    
    if (redisUrl) {
      try {
        this.client = createClient({
          url: redisUrl,
        });

        this.client.on('error', (error) => {
          this.logger.error('Redis Client Error:', error);
          this.isRedisAvailable = false;
        });
        
        this.isRedisAvailable = true;
      } catch (error) {
        this.logger.warn('Failed to initialize Redis client, running in mock mode', error);
        this.isRedisAvailable = false;
      }
    } else {
      this.logger.warn('REDIS_URL not configured, running in mock mode');
      this.isRedisAvailable = false;
    }
  }

  async onModuleInit() {
    if (this.client) {
      try {
        await this.client.connect();
        this.logger.log('Redis client connected successfully');
      } catch (error) {
        this.logger.error('Failed to connect to Redis:', error);
        this.isRedisAvailable = false;
      }
    }
  }

  async onModuleDestroy() {
    if (this.client && this.client.isOpen) {
      await this.client.quit();
    }
  }

  private checkAndCleanExpired() {
    const now = Date.now();
    for (const [key, data] of this.mockStore.entries()) {
      if (data.expires && data.expires < now) {
        this.mockStore.delete(key);
      }
    }
  }

  async set(key: string, value: string, ttl?: number) {
    if (this.isRedisAvailable && this.client) {
      try {
        if (ttl) {
          await this.client.set(key, value, { EX: ttl });
          return;
        } else {
          await this.client.set(key, value);
          return;
        }
      } catch (error) {
        this.logger.error('Error in Redis set operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    this.mockStore.set(key, {
      value,
      expires: ttl ? Date.now() + ttl * 1000 : undefined,
    });
  }

  async get(key: string): Promise<string | null> {
    if (this.isRedisAvailable && this.client) {
      try {
        return await this.client.get(key);
      } catch (error) {
        this.logger.error('Error in Redis get operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    this.checkAndCleanExpired();
    const data = this.mockStore.get(key);
    if (data && (!data.expires || data.expires > Date.now())) {
      return data.value;
    }
    return null;
  }

  async del(key: string): Promise<number> {
    if (this.isRedisAvailable && this.client) {
      try {
        return await this.client.del(key);
      } catch (error) {
        this.logger.error('Error in Redis del operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    const existed = this.mockStore.has(key);
    this.mockStore.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    if (this.isRedisAvailable && this.client) {
      try {
        return await this.client.exists(key);
      } catch (error) {
        this.logger.error('Error in Redis exists operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    this.checkAndCleanExpired();
    return this.mockStore.has(key) ? 1 : 0;
  }

  async setHash(key: string, field: string, value: string): Promise<number> {
    if (this.isRedisAvailable && this.client) {
      try {
        return await this.client.hSet(key, field, value);
      } catch (error) {
        this.logger.error('Error in Redis hSet operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    const current = (this.mockStore.get(key)?.value || {}) as Record<string, string>;
    current[field] = value;
    this.mockStore.set(key, { value: current });
    return 1;
  }

  async getHash(key: string, field: string): Promise<string | null> {
    if (this.isRedisAvailable && this.client) {
      try {
        return await this.client.hGet(key, field);
      } catch (error) {
        this.logger.error('Error in Redis hGet operation:', error);
        this.isRedisAvailable = false;
        // Fall through to mock implementation
      }
    }
    
    // Mock implementation
    const data = this.mockStore.get(key)?.value;
    return data && typeof data === 'object' ? data[field] || null : null;
  }
}
