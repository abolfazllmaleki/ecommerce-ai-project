import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import {
  IProductRepository,
  ProductSortBy,
  PaginatedProducts,
} from '../../domain/product.repository.port';
import { CacheKeyBuilder } from '../../../shared/caching/infrastructure/redis/cache-key.builder';
import { CacheNamespaces } from '../../../shared/caching/infrastructure/redis/cache.namespaces';
import { CachePort, CACHE_PORT } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';

export interface SearchProductsQuery {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[];
  sortBy?: ProductSortBy;
  limit?: number;
  page?: number;
}

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,

    @Inject(CACHE_PORT)
    private readonly cache: CachePort,

    private readonly versionService: CacheVersionService,
  ) {}

  async execute(params: SearchProductsQuery): Promise<PaginatedProducts> {
    if (
      params.minPrice !== undefined &&
      params.maxPrice !== undefined &&
      params.minPrice > params.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const version = await this.versionService.getProductsVersion();

    const cacheKey = CacheKeyBuilder.build(
      CacheNamespaces.PRODUCTS_LIST,
      version,
      params as Record<string, unknown>
    );

    const cached = await this.cache.get<PaginatedProducts>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.productRepository.search(params);

    await this.cache.set(cacheKey, result, {
      ttlSeconds: 120,
    });

    return result;
  }
}

