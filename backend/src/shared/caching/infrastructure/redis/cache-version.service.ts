import { Inject, Injectable } from '@nestjs/common';
import { CACHE_PORT, CachePort } from '../../application/ports/cache.port';
import { CacheKeyBuilder } from './cache-key.builder';
@Injectable()
export class CacheVersionService {
  constructor(
    @Inject(CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async getProductsVersion(): Promise<number> {
    const key = CacheKeyBuilder.productListVersion();

    const version = await this.cache.get<number>(key);

    return version ?? 1;
  }

  async bumpProductsVersion(): Promise<void> {
    const key = CacheKeyBuilder.productListVersion();

    await this.cache.increment(key);
  }
}
