import { Inject, Injectable } from '@nestjs/common';
import {
  CACHE_INVALIDATOR_PORT,
  CacheInvalidatorPort,
} from '../../application/ports/cache-invalidator.port';
import { CACHE_PORT, CachePort } from '../../application/ports/cache.port';
import { CacheKeyBuilder } from './cache-key.builder';
import { CacheVersionService } from './cache-version.service';

@Injectable()
export class CacheInvalidatorService implements CacheInvalidatorPort {
  constructor(
    @Inject(CACHE_PORT)
    private readonly cache: CachePort,
    private readonly versionService: CacheVersionService,
  ) {}

  async invalidateProduct(productId: string): Promise<void> {
    const key = CacheKeyBuilder.product(productId);

    await this.cache.delete(key);
  }

  async invalidateProductLists(): Promise<void> {
    await this.versionService.bumpProductsVersion();
  }
}
