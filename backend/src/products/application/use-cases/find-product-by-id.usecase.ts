import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { CacheKeyBuilder } from '../../../shared/caching/infrastructure/redis/cache-key.builder';
import { CacheNamespaces } from '../../../shared/caching/infrastructure/redis/cache.namespaces';
import { CachePort, CACHE_PORT } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,

    @Inject(CACHE_PORT)
    private readonly cache: CachePort,

    private readonly versionService: CacheVersionService,
  ) {}

  async execute(id: string): Promise<Product> {
    // ✅ get version from Redis
    const version = await this.versionService.getProductsVersion();

    // ✅ build key
    const cacheKey = CacheKeyBuilder.entity(
      CacheNamespaces.PRODUCT_DETAIL,
      version,
      id,
    );

    // -------- Redis GET --------
    const cached = await this.cache.get<Product>(cacheKey);

    if (cached) {
      return Product.rehydrate(cached);
    }

    // -------- Mongo Query --------
    const product = await this.repo.findById(id);

    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    // -------- Redis SET --------
    await this.cache.set(cacheKey, product, { ttlSeconds: 300 });

    return product;
  }
}
