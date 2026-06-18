import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { RedisCacheAdapter } from './redis-cache.adapter';

import { CACHE_PORT } from '../../application/ports/cache.port';
import {
  CACHE_INVALIDATOR_PORT,
} from '../../application/ports/cache-invalidator.port';

import { CacheVersionService } from './cache-version.service';
import { CacheInvalidatorService } from './cache-invalidator.service';

@Module({
  providers: [
    RedisProvider,
    RedisCacheAdapter,
    CacheVersionService,
    CacheInvalidatorService,

    {
      provide: CACHE_PORT,
      useExisting: RedisCacheAdapter,
    },

    {
      provide: CACHE_INVALIDATOR_PORT,
      useExisting: CacheInvalidatorService,
    },
  ],

  exports: [
    CACHE_PORT,
    CACHE_INVALIDATOR_PORT,
    CacheVersionService,
  ],
})
export class RedisModule {}
