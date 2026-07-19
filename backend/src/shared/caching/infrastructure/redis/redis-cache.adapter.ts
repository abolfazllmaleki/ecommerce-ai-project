import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CachePort } from '../../application/ports/cache.port';
import { REDIS_CLIENT } from './redis.provider';

@Injectable()
export class RedisCacheAdapter implements CachePort {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error('Cache parse error for key:', key);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    options?: { ttlSeconds?: number },
  ): Promise<void> {
    const payload = JSON.stringify(value);

    if (options?.ttlSeconds) {
      await this.redis.set(key, payload, 'EX', options.ttlSeconds);
    } else {
      await this.redis.set(key, payload);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async increment(key: string): Promise<number> {
    return this.redis.incr(key);
  }

}
