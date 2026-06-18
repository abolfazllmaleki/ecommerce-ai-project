import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {

    const redis = process.env.REDIS_URL
      ? new Redis(process.env.REDIS_URL)
      : new Redis({
          host: process.env.REDIS_HOST ?? '127.0.0.1',
          port: Number(process.env.REDIS_PORT ?? 6379),
          password: process.env.REDIS_PASSWORD,
          db: Number(process.env.REDIS_DB ?? 0),
        });

    redis.on('ready', () => {
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
    });

    redis.on('close', () => {
      console.warn('⚠️ Redis connection closed');
    });

    return redis;
  },
};
