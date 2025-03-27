import Redis from 'ioredis';
import { config } from './config';
import logger from '../utils/logger';

let redisClient: Redis | null = null;

export const initializeRedis = async (): Promise<Redis | null> => {
  if (process.env.NODE_ENV === 'development' && !config.redis?.url) {
    logger.warn('Redis is not configured. Running in development mode without Redis.');
    return null;
  }

  try {
    redisClient = new Redis(config.redis.url, {
      password: config.redis.password,
      db: config.redis.db,
      keyPrefix: config.redis.prefix,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    redisClient.on('error', (error: Error) => {
      logger.error('Redis Client Error:', error);
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis successfully');
    });

    await redisClient.ping();
    return redisClient;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Failed to connect to Redis. Running in development mode without Redis.');
      return null;
    }
    throw error;
  }
};

export const getRedisClient = (): Redis | null => {
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
