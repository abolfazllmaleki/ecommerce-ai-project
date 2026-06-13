import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class FindProductByIdUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('محصول مورد نظر یافت نشد');
    return product;
  }
}


// import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { IProductRepository } from '../../domain/product.repository.port';
// import { Product } from '../../domain/product.entity';
// import { CacheKeyBuilder } from '../../../shared/infrastructure/redis/cache-key.builder';
// import { CacheNamespaces } from '../../../shared/infrastructure/redis/cache.namespaces';
// import { CachePort, CACHE_PORT } from '../../../shared/application/ports/cache.port';
// import { performance } from 'node:perf_hooks';

// @Injectable()
// export class FindProductByIdUseCase {
//   constructor(
//     @Inject('IProductRepository')
//     private readonly repo: IProductRepository,

//     @Inject(CACHE_PORT)
//     private readonly cache: CachePort,
//   ) {}

//   async execute(id: string): Promise<Product> {
//     const cacheKey = CacheKeyBuilder.buildEntityKey(
//       CacheNamespaces.PRODUCT_DETAIL,
//       id,
//     );

//     // -------- Redis GET --------
//     const t1 = performance.now();
//     const cached = await this.cache.get<Product>(cacheKey);
//     const t2 = performance.now();

//     console.log('redis get:', (t2 - t1).toFixed(2), 'ms');

//     if (cached) {
//       console.log('CACHE HIT');

//       const size = Buffer.byteLength(JSON.stringify(cached));
//       console.log('response size:', (size / 1024).toFixed(2), 'KB');

//       return cached;
//     }

//     console.log('CACHE MISS');

//     // -------- Mongo Query --------
//     const t3 = performance.now();
//     const product = await this.repo.findById(id);
//     const t4 = performance.now();

//     console.log('mongo query:', (t4 - t3).toFixed(2), 'ms');

//     if (!product) {
//       throw new NotFoundException('محصول مورد نظر یافت نشد');
//     }

//     const size = Buffer.byteLength(JSON.stringify(product));
//     console.log('response size:', (size / 1024).toFixed(2), 'KB');

//     // -------- Redis SET --------
//     const t5 = performance.now();
//     await this.cache.set(cacheKey, product, { ttlSeconds: 300 });
//     const t6 = performance.now();

//     console.log('redis set:', (t6 - t5).toFixed(2), 'ms');

//     return product;
//   }
// }
