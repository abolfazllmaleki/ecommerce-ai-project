import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { CACHE_PORT } from '../../application/ports/cache.port';

@Module({
  providers: [
    RedisProvider,
    RedisCacheAdapter,
    {
      provide: CACHE_PORT,
      useExisting: RedisCacheAdapter,
    },
  ],
  exports: [CACHE_PORT],
})
export class RedisModule {}
