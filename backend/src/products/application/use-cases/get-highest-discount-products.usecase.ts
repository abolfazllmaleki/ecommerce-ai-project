import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { CachePort,CACHE_PORT} from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';
import { CacheKeyBuilder } from '../../../shared/caching/infrastructure/redis/cache-key.builder';
import { CacheNamespaces } from '../../../shared/caching/infrastructure/redis/cache.namespaces';
@Injectable()
export class GetHighestDiscountProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,

    @Inject(CACHE_PORT)
    private readonly cache: CachePort,

    private readonly versionService: CacheVersionService,
  ) {}

  async execute(limit = 6): Promise<Product[]> {
    const version = await this.versionService.getProductsVersion();

    const cacheKey = CacheKeyBuilder.build(
      CacheNamespaces.PRODUCT_LIST_DISCOUNT,
      version,
       { limit },
    );

    const cached = await this.cache.get<any[]>(cacheKey);

    if (cached) {
      return cached.map(p => Product.rehydrate(p));
    }

    const products = await this.repo.getHighestDiscount(limit);

    await this.cache.set(
      cacheKey,
      products.map(p => p.toPlainObject()),
      { ttlSeconds: 300 },
    );

    return products;
  }
}